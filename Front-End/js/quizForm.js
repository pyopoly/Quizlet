const TOP_MARGIN = "mt-5";
const START_MARGIN = "ms-4";


/**
 * Creates a label element
 * @param {String} labelName 
 * @param {String} forName value for the for attribute.
 * @returns a label element.
 */
 let createLabel = (labelName, forName) => {
    let label = document.createElement("label");
    label.className =`${TOP_MARGIN} col-sm-2 col-form-label`;
    label.innerHTML = labelName;
    label.for = forName;

    return label;
}

/**
 * Creates a input element.
 * @param {String} type text, textArea etc.
 * @param {String} id 
 * @param {String} placeholder 
 * @param {String} value 
 * @returns input element.
 */
let createInput = (type ,id, placeholder, value, isReadOnly) => {
    let input = document.createElement(type);
    input.className = `${TOP_MARGIN} col-sm-5 col-form-control needs-validation`;
    input.id = id;
    input.type = "text";
    input.placeholder = placeholder;
    input.required = true;

    if (value != "" || undefined || null) {
        input.value = value;
    }

    if (isReadOnly == true) {
        input.readonly = true;
    }

    return input;
}


/**
 * Represents a text input. 
 * Includes a label and input.
 */
class TextInput {
    /**
     * Creates a text input.
     * @param {String} inputValue Value that would go insdide the input.
     * @param {String} type text, textArea etc.
     * @param {String} id 
     * @param {String} placeholder the hint text inside input.
     * @param {String} labelName the label value that would go in front of input.
     */
    constructor(type, id, placeholder, labelName, inputValue=null, isReadOnly=false) {
        this.id = id;
        this.inputValue = inputValue;
        this.isReadOnly = isReadOnly;

        this.inputContainer = document.createElement("div");
        this.inputContainer.className = "row d-flex justify-content-center";

        this.inputLabel = createLabel(labelName, this.id);
        this.inputContainer.appendChild(this.inputLabel);

        this.input = createInput(type, this.id, placeholder, this.inputValue, this.isReadOnly);
        this.inputContainer.appendChild(this.input);
    }

    /**
     * Appends this node as a child of passed domObject.
     * @param {Node} domObject DOM node or element.
     */
    appendTo = (domObject) => {
        domObject.appendChild(this.inputContainer);
    }

    /**
     * Gets the value of the input node as a String.
     * @returns {String} The value of the input object.
     */
    getValue = () => {
        return this.input.value
    }

    /**
     * This function can be used to change the boostrap style of the textInput.
     * @param {String} newClassName 
     */
    setClassName = (newClassName) => {
        this.inputContainer.className = newClassName;
    }

    /**
     * 
     * @returns Id as string
     */
    getId = () => {
        return this.id;
    }

    setReadOnly = (newBool) => {
        this.input.readOnly = newBool;
    }
}



/**
 * Represents the submit button.
 */
class SubmitButton {
    /**
     * Constructs a submit buttons. 
     */
    constructor() {

        this.buttonContainer = document.createElement("div");
        this.buttonContainer.className = "text-center";

        this.button = document.createElement("button");
        this.button.className = `${TOP_MARGIN} justify-content-center btn btn-primary`;
        this.button.type = "button";
        this.button.innerHTML = "Submit";
        this.buttonContainer.appendChild(this.button);

        }

    /**
     * Appends this node as a child of passed domObject.
     * @param {Node} domObject DOM node or element.
     */
    appendTo = (domObject) => {
        domObject.appendChild(this.buttonContainer);
    }

    
}

/**
 * Represents an Answer input. 
 * This has a label, text input and a radio button that 
 * stores if this answer is the right answer.
 */
class QuizOption extends TextInput{
    /**
     * 
     * @param {String} type text, textArea etc.
     * @param {String} id 
     * @param {String} placeholder the hint text inside input.
     * @param {String} labelName the label value that would go in front of input.
     * @param {String} inputValue Value that would go insdide the input.
     * @param {String} questionId Id of the question this answer belongs to. 
     * @param {boolean} isOptionAnswer if this is the correct answer to the question. 
     */
    constructor(type, id, placeholder, labelName, inputValue, questionId=null, isOptionAnswer=false, isReadOnly=false) {
        super(type, id, placeholder, labelName, inputValue, isReadOnly);
        this.questionId = questionId;
        this.isOptionAnswer = isOptionAnswer;

        this.radioButton = document.createElement("input");
        this.radioButton.type = "radio";
        this.radioButton.className = `${TOP_MARGIN} col-sm-1 col-form-label needs-validation`;
        this.radioButton.name = `question${this.questionId}`;
        this.radioButton.checked = this.isOptionAnswer;
        this.radioButton.required = true; 
        this.inputContainer.appendChild(this.radioButton);
        if (isReadOnly == true) {
            this.radioButton.disabled = true;
        }

    }

    /**
     * Retusns 0 if the option's radio button is not checked, means this is the wrong answer.
     * If the radio button is checked, reutrn 0. This means this answer is right.
     * @returns 0, 1
     */
    getCorrect = () => {
        if (this.radioButton.checked == true) {
            return 1
        }
        else {
            return 0
        }
    }

}

/**
 * Represents a single question in a quiz
 */
class Question extends TextInput {
    /**
     * 
     * @param {String} type textarea, input etc.
     * @param {String} id id of the question 
     * @param {String} placeholder hint
     * @param {String} labelName Name of the label 
     * @param {String} inputValue the value inside of input.
     * @param {String} quizId id of the quiz the question belogs to. 
     */
    constructor(type, id, placeholder, labelName, inputValue, quizId = null, isEditMode=false) {

        super(type, id, placeholder, labelName, inputValue)
        this.quizId = quizId;
        
        // if (isEditMode == true){
        //     this.deleteButton = document.createElement("button");
        //     this.deleteButton.className = `${TOP_MARGIN} col-sm-1 btn btn-sm btn-danger`;
        //     this.deleteButton.innerHTML = "Delete";
        //     this.inputContainer.appendChild(this.deleteButton);
        //     this.deleteButton.onclick = () => {
        //         deleteQuestionUsingId(id);
        //     }
        // }

    }

    getQuestionValue = () => {
        return this.getValue();
    }

}

/**
 * Add button 
 */
let createAddButton = (parentNode, questionOptionList) => {

    let buttonContainer = document.createElement("div");
    buttonContainer.className = "text-center";

    let addButton = document.createElement("button");
    addButton.className = `${TOP_MARGIN} btn btn-success text-center`;
    addButton.id = "addButton";
    addButton.innerHTML = "Add Question"
    buttonContainer.appendChild(addButton)

    addButton.onclick = ()=> {
        let newPair = new QuizOptionPair(questionOptionList.length + 1);
        newPair.appendTo(parentNode);
        questionOptionList.push(newPair);
    } 

    return buttonContainer

}

class QuizOptionPair {
    constructor(questionId, isEditMode=false, questionValue=null, answerList=null, quizID= null) {
        this.questionId = questionId
        this.deleteButtonOnClick = null;
        this.optionList = []
        this.pairContainer = document.createElement("div");
        this.pairContainer.className = `${TOP_MARGIN} container-md questionOptionPairContainer`;
        this.pairContainer.style.borderStyle = "solid";
        
        this.question = new Question("textarea", questionId, `What is...`,  `Question: ${this.questionId}`, questionValue,quizID,isEditMode);
        this.question.appendTo(this.pairContainer);
        let rowOne = document.createElement("div");
        rowOne.className = "row d-flex optionRow";
    
        let rowTwo = document.createElement("div");
        rowTwo.className = "row d-flex optionRow";
    
        this.pairContainer.appendChild(rowOne);
        this. pairContainer.appendChild(rowTwo);
    
        for (let i = 0; i < 4; i++) {
            let optionContainer = document.createElement("div");
            optionContainer.className = "col";
            let answerValue = null;
            let answerCorrectness = null;
            let optionID = i
            if (answerList != null) {
                answerValue = answerList[i].answer;
                answerCorrectness = answerList[i].correct;
                optionID = answerList[i].answerID;
            }
            this.option = new QuizOption("input", optionID, `Option ${i+1}`, `Option ${i+1}`, answerValue, questionId, answerCorrectness);
            this.option.appendTo(optionContainer);
            this.optionList.push(this.option);
    
            if (i < 2) {
                rowOne.appendChild(optionContainer);
            } else {
                rowTwo.appendChild(optionContainer);
            }
        }

    }

    getQuestionValue = () =>{
        return this.question.getValue();
    }

    getOptions = () => {
        return this.optionList;
    }

    appendTo = (parentNode) => {
        parentNode.appendChild(this.pairContainer);
    }

    setDeleteButtonOnClick = (func) => {
        this.deleteButtonOnClick = func;
    }
    getQuestionId = () => {
        return this.questionId
    }

    setQuizOptionReadOnly = (newBool) => {
        for (let i=0; i< this.optionList.length; i++) {
            this.optionList[i].setReadOnly(newBool);
            this.optionList[i].radioButton.disabled = true;
        }

    }
}
