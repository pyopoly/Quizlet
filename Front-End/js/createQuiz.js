const xhttp = new XMLHttpRequest();
// const endPointRoot = "http://localhost:8080/4537/termproject/API/V1/";
const endPointRoot = "https://jacknteg.com/4537/termproject/API/V1/";

const quizForm = document.getElementById("quizForm");
const feedback = document.getElementById("feedback")
let questionNumber
let questionOptionList = []
const quizAlreadyExists = "Sorry, The quiz name already exists. Please try another name.";
const params = new URLSearchParams(window.location.search)
let isEditMode = false;


/**
 * Add a quiz to the database.
 * @param {String} quizName
 * @returns 
 */
let postQuizToDB = (quizObj) => {
    return new Promise((res, rej) => {
        let param = `quizName=${quizObj.quizName}&description=${quizObj.description}&author=${quizObj.author}`;
        const url = endPointRoot + "post/quiz";

        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 201) {
                    console.log(xhttp.responseText);
                    res(xhttp.responseText)
                } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                    rej(quizAlreadyExists);
                }
            }
        }
    });
}

/**
 * 
 * @param {QuestionObj} questionObj 
 * @returns 
 */
let postQuestionToDB = (questionObj) => {
    return new Promise((res, rej) => {
        let param = `question=${questionObj.question}&quizID=${questionObj.quizID}`;
        const url = endPointRoot + "post/question";

        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 201) {
                    console.log(xhttp.responseText);
                    res(xhttp.responseText)
                } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                    rej({
                        "message": xhttp.responseText,
                        "status": xhttp.status
                    });
                }
            }
        }
    })
}

/**
 * 
 * @param {QuestionObj} questionObj 
 * @returns 
 */
let postOptionsToDB = (optionObject) => {
    return new Promise((res, rej) => {
        let param = `answers=${optionObject.answers}&questionID=${optionObject.questionID}&quizID=${optionObject.quizID}&correct=${optionObject.correct}`;
        const url = endPointRoot + "post/answers";

        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 201) {
                    console.log(xhttp.responseText);
                    res(xhttp.responseText)
                } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                    rej({
                        "message": xhttp.responseText,
                        "status": xhttp.status
                    });
                }
            }
        }
    })


}

/**
 * Converts all the questions in the form to the following object format. 
 *      {question: questionVvalue, quizID: idOfTheQuiz}
 * 
 * @param {String} quizId the id of the quiz the questions belong to. 
 * @returns a list of the quesiton objects.
 */
let convertQuestionToObject = (quizId, list) => {
    let questionOptionObjectList = [];
    for (let i = 0; i < list.length; i++) {
        let question = list[i].getQuestionValue();
        let questionObj = {
            question: question,
            quizID: quizId
        };
        questionOptionObjectList.push(questionObj);

    }
    return questionOptionObjectList;
}

/**
 * 
 * @param {String} quizName Name of the quiz.
 * @param {String} description The description of the quiz.
 * @param {String} author the name of person that made quiz. 
 */
let submitonclick = (quizName, description, author) => {
    let isValid = checkIfAllFormsFilled();
    if (isValid) {
        document.body.innerHTML = "Creating quiz...please do not refresh.";
        let quizObj = {
            quizName: quizName,
            description: description,
            author: author
        }
    
        let postQuiz = postQuizToDB(quizObj);
        postQuiz.then(
            (quizInfo) => {
                quizInfo = JSON.parse(quizInfo);
                let quizId = quizInfo.insertId;
                let questionObjectList = convertQuestionToObject(quizId, questionOptionList);
                let questionResults = postQuestionArray(questionObjectList);
                questionResults.then(
                    (questionInfo) => {
                        let optionObjects = getOptionObjects(questionInfo, quizId, questionOptionList);
                        postOptionsArray(optionObjects).then(
                            (res) => {
                                window.location.replace("https://tommywork.lovestoblog.com/COMP4537/clientSide/quizlist.html");
                            }
                        )
                        
                    }
    
                )
            },
            (rej) => {
                if (rej != quizAlreadyExists) {
                    feedback.innerHTML = rej.message;
                } else {
                    feedback.innerHTML = rej;
                }
    
            });
    }
    else {
        feedback.innerHTML = "Please fill in everything!"
    }


}


/**
 * Creates a list of options Objects. {answers: listOfAnswers, correct: listOfOptionCorrectness, questionID: idOfQuestion, }
 * @param {Dictionary} questionInfo what is returned when a question is posted.
 * @returns a array of options objects. 
 */
let getOptionObjects = (questionInfo, quizID,list) => {
    let questionIdList = []

    for (let i = 0; i < questionInfo.length; i++) {
        let question = JSON.parse(questionInfo[i]);
        let questionId = question.insertId;
        questionIdList.push(questionId);


    }
    let optionsObjectList = []

    for (let i = 0; i < questionIdList.length; i++) {
        let questionOption = list[i]
        let options = questionOption.getOptions();
        let questionId = questionIdList[i]
        let optionValueList = [];
        let correctList = [];
        for (let j = 0; j < options.length; j++) {
            let option = options[j];
            let optionValue = option.getValue()
            let optionCorrect = option.getCorrect();
            optionValueList.push(optionValue);
            correctList.push(optionCorrect);
        }
        // let optionsObject = {"answers[0]": optionValueList[0], "answers[1]": optionValueList[1], "answers[2]": optionValueList[2], "answers[3]": optionValueList[3], 
        // "correct[0]":correctList[0], "correct[1]":correctList[1], "correct[2]":correctList[2], "correct[3]":correctList[3],
        // "questionID":questionId, "quizID":quizID};
        let optionsObject = {
            "answers": optionValueList,
            "correct": correctList,
            "questionID": questionId,
            "quizID": quizID
        };
        optionsObjectList.push(optionsObject);

    }

    return optionsObjectList

}

/**
 * Posts all the objects in the questioObject array one by one.
 * @param {QuestionObjectArray} array array of question objects. 
 * @returns the results the post as an arary. Each element represents result of one 
 * options's post.
 */
 let postOptionsArray = async (array) => {
    const allAsyncResults = [];
    for (const option of array) {
        let questionInfo = await postOptionsToDB(option);
        allAsyncResults.push(questionInfo);
    }
    return allAsyncResults;

}

/**
 * Posts all the objects in the questioObject array one by one.
 * @param {QuestionObjectArray} array array of question objects. 
 * @returns the results the post as an arary. Each element represents result of one 
 * options's post.
 */
let postQuestionArray = async (array) => {
    const allAsyncResults = [];
    for (const question of array) {
        let questionInfo = await postQuestionToDB(question);
        allAsyncResults.push(questionInfo);
    }
    return allAsyncResults;

}

/**
 * Checks if all the forms that need validation are filled out. 
 * If they are not, return false. If they are, return true.
 */
let checkIfAllFormsFilled = () => {
    let forms = quizForm.querySelectorAll(".needs-validation");
    let isValid = true


    Array.prototype.slice.call(forms).forEach((form) => {
        let validity = form.checkValidity();
        if (!validity) {
            isValid = false;
        }

    })
    return isValid;
}

let runCreateQuizPage = () => {
    let quizName = new TextInput("input", "name", "Super", "Name");
    quizName.id = "quizName";
    quizName.appendTo(quizForm);

    let quizDescription = new TextInput("textarea", "description", "This is an example description of the quiz", "Description");
    quizDescription.appendTo(quizForm);
    quizDescription.input.maxlength = 300;
    quizDescription.input.rows = 6;

    let quizAuthor = new TextInput("input", "author", "Jack", "Author");
    quizAuthor.appendTo(quizForm);

    let quizOptionContainer = document.createElement("div");
    quizOptionContainer.id = "questionQuizContainter";
    quizForm.append(quizOptionContainer);

    let questionOptionPairOne = new QuizOptionPair(questionOptionList.length + 1, isEditMode);
    questionOptionPairOne.appendTo(quizOptionContainer);
    questionOptionList.push(questionOptionPairOne);

    let addButton = createAddButton(quizOptionContainer, questionOptionList);
    quizForm.appendChild(addButton);

    let submitButton = new SubmitButton();
    submitButton.appendTo(quizForm);
    submitButton.button.onclick = () => {
        submitonclick(quizName.getValue(), quizDescription.getValue(), quizAuthor.getValue());
    }
}

let runPage =() => {
    let quizId = params.get("id");
    if (quizId != null) {
        runEditQuizPage(quizId);
        isEditMode = true;
    } else runCreateQuizPage();
}


runPage();