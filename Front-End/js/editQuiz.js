let oldQuestionList = [];
let questionArrayInitialLength;
let oldQuestionIds;
class QuizObject {
    /**
     * 
     * @param {*} quizId id
     * @param {*} quizName String 
     * @param {*} questions json Array
     * @param {*} answers json Array
     */
    constructor(quizID, quizName, description, author, questions, answers) {
        this.quizID = quizID;
        this.quizName = quizName;
        this.description = description;
        this.author = author;
        this.questions = questions
        this.answers = answers;
    }
}

/**
 * Requests the server to update the quiz.
 * @param {String} newName new name of the quiz.
 * @param {String} newDescription new description of the quiz.
 * @param {String} newAuthor new author of the quiz.
 * @param {String} quizID new id of the quiz.
 * @returns a promise.
 */
let putQuizUsingId = (newName, newDescription, newAuthor, quizID) => {

    return new Promise((res, rej) => {
        let param = `quizID=${quizID}&quizName=${newName}&description=${newDescription}&author=${newAuthor}`;
        const url = endPointRoot + "put/quiz";

        xhttp.open("PUT", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
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
let putOneOptionToDB = (optionObject) => {
    return new Promise((res, rej) => {
        let param = `answerID=${optionObject.answers}&newAnswer=${optionObject.questionID}&newCorrect=${optionObject.quizID}`;
        const url = endPointRoot + "put/answers";

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

let putOneQuestion  = (questionObj) => {
    let questionID = questionObj.getId();
    let value = questionObj.getValue();
    let promise = new Promise((res, rej) => {
        let param = `questionID=${questionID}&newQuestion=${value}`;
        const url = endPointRoot + "patch/question";

        xhttp.open("PATCH", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    res(xhttp.responseText)
                } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                    rej(quizAlreadyExists);
                }
            }
        }
    });
    return promise;
}

/**
 * Sends a request to post all the optoions in the database all at once.
 * @param {Array of question objects} array 
 * @returns the results the post as an arary. Each element represents result of one 
 * options's post.
 */
let putAllQuestion = async (array) => {
    const allAsyncResults = [];
        for (const question of array) {
            let questionInfo = await putOneQuestion(question);
            allAsyncResults.push(questionInfo);
        }
        return allAsyncResults;
}

/**
 * 
 * @param {Array} questionArray an array of question objects.
 */
let getAllQuestionIdInQuiz = (questionArray) => {
    let questionIdArray = [];
    for (let i = 0; i < questionArray.length; i++) {
        questionIdArray.push(questionArray[i].questionID);
    }
    return questionIdArray;
}
/**
 * 
 * @param {String} optionID 
 * @param {String} optionArray 
 * @returns 
 */
let getOptionsValueByID = (optionID, quizObj) => {
    let answers = quizObj.answers;
    for (let i = 0; i < answers.length; i++) {
        let optionArray = answers[i];
        for (let j = 0; j < optionArray.length; j++) {
            if (optionArray[j].answerID == optionID) {
                return optionArray[j].answer;
            }
        }

    }
}

let submitEditonclick = (quizName, description, author, quizObj) => {
    let isNameChanged = checkIfInputChanged(quizObj.quizName, quizName);
    let isDescriptionChanged = checkIfInputChanged(quizObj.description, description);
    let isAuthorChanged = checkIfInputChanged(quizObj.author, author);
    let changedQuestions = []
    let changedOptions = []
    let promsieList = []
    let quizPromise;
    let questionEditPromise;



    /**
     * Check if any questions were changed and add the ones that were to the changedQuestionsList.
     * 
     * Also checks, if any of the options realted to a questions were changed and add them to the
     * changed options list.
     */
    for (let i = 0; i < oldQuestionList.length; i++) {
        let questionValue = oldQuestionList[i].getQuestionValue();
        let questionID = oldQuestionList[i].getQuestionId();
        let options = oldQuestionList[i].getOptions();
        let oldQuestionValue = getQuestionValueByQuestionID(questionID, quizObj.questions)
        let isQuestionChanged = checkIfInputChanged(oldQuestionValue, questionValue);
        if (isQuestionChanged) {
            changedQuestions.push(oldQuestionList[i].question);
        }
        for (let i = 0; i < options.length; i++) {
            let optionValue = options[i].getValue();
            let optionID = options[i].getId();
            let oldOptionValue = getOptionsValueByID(optionID, quizObj)
            let isOptionChanged = checkIfInputChanged(oldOptionValue, optionValue);
            if (isOptionChanged) {
                changedOptions.push(options[i]);
            }
        }

    }

    let promise = new Promise((res, rej) => {
        if (isNameChanged || isDescriptionChanged || isAuthorChanged) {
            res(quizPromise = putQuizUsingId(quizName, description, author, quizObj.quizID));
            promsieList.push(quizPromise);
            quizPromise.then(
                
                (res) => {
                    feedback.innerHTML = "Quiz Updated!";
                    quizObj.quizName = quizName;
                    quizObj.description = description;
                    quizObj.author = author;
                    
                },
                (rej) => {
                    feedback.innerHTML = rej.messageText;
                }  
                
            )
        }
        else {
            rej(1);
        }
    });
    promise.finally(
        () => { 
            questionEditPromise = new Promise((res, rej)=> {
                if (changedQuestions.length != 0) {
                    res(questionEditPromise = putAllQuestion(changedQuestions));
                    promsieList.push(questionEditPromise);
                }
                else {
                    rej(1);
                }
            })

        }
    )

}

/**
 * Get the value of the specified question using its id from a list of questions. 
 * @param {String} questionID id of the question you want to look for.
 * @param {Array} questionArray Array of old question objects
 * @returns {String} Value of the question.
 */
let getQuestionValueByQuestionID = (questionID, questionArray) => {
    for (let i = 0; i < questionArray.length; i++) {
        if (questionArray[i].questionID == questionID) {
            return questionArray[i].question;
        }
    }
}

/**
 * Get the option related to a question.
 * @param {String} questionID id of the question whose options you want. 
 * @param {Array} optionsArray Array of all the options in the quiz.
 * @returns {Array} Array of specified questions list.
 */
let getOptionsWithQuestionID = (questionID, optionsArray) => {
    for (let i = 0; i < optionsArray.length; i++) {
        let option = optionsArray[i];
        if (option[0].questionID == questionID) {
            return option;
        }

    }

}

let createEditForm = (quizObj) => {

    let quizName = new TextInput("input", "name", "Super", "Name", quizObj.quizName);
    quizName.appendTo(quizForm);

    let quizDescription = new TextInput("textarea", "description", "This is an example description of the quiz", "Description", quizObj.description);
    quizDescription.appendTo(quizForm);
    quizDescription.input.maxlength = 300;
    quizDescription.input.rows = 6;

    let quizAuthor = new TextInput("input", "author", "Jack", "Author", quizObj.author);
    quizAuthor.appendTo(quizForm);

    let quizOptionContainer = document.createElement("div");
    quizForm.append(quizOptionContainer);
    quizOptionContainer.id = "questionQuizContainter";

    for (let i = 0; i < quizObj.questions.length; i++) {
        let question = quizObj.questions[i];
        let options = getOptionsWithQuestionID(question.questionID, quizObj.answers);
        let questionOptionPairOne = new QuizOptionPair(question.questionID, isEditMode, question.question, options);
        questionOptionPairOne.setQuizOptionReadOnly(true);
        questionOptionPairOne.appendTo(quizOptionContainer);
        oldQuestionList.push(questionOptionPairOne);
    }

    // let addButton = createAddButton(quizOptionContainer, questionOptionList);
    // quizForm.appendChild(addButton);

    let submitButton = new SubmitButton();
    submitButton.appendTo(quizForm);
    submitButton.button.onclick = () => {
        submitEditonclick(quizName.getValue(), quizDescription.getValue(), quizAuthor.getValue(), quizObj);
    }


}
/**
 * Requests to get the quiz with specified id. 
 * @param {String} quizId Id of the quiz that you want to get.
 * @returns a promise
 */
let getQuizById = (quizId) => {
    return new Promise((res, rej) => {
        param = `?id=${quizId}`
        const url = endPointRoot + "get/quiz&all-questions-by-quizID/" + param;
        xhttp.open("GET", url, true);
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    console.log(xhttp.responseText);
                    res(xhttp.responseText)
                } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                    rej(`Something went wrong, status: ${xhttp.status}`);
                }
            }
        }
    });

}


/**
 * Deletes the quiz with a specific id from the database.
 * @param {String} questionIdId 
 * @returns Promise
 */
let deleteQuestionUsingId = (questionId) => {
    return new Promise((res, rej) => {
        let param = `questionID=${questionId}`;
        const url = endPointRoot + `delete/question`;

        xhttp.open("DELETE", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    console.log(xhttp.responseText);
                    res(xhttp.responseText);
                    window.location.reload();
                } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                    rej(`Something went wrong, status: ${xhttp.status}`);
                }
            }
        }
    });

}

/**
 * Checks if any edits have been made to the inpputs.
 * @param {String} oldInput The initial Input value
 * @param {*} currentInput The currenct Input value
 */
let checkIfInputChanged = (oldInput, currentInput) => {
    if (oldInput.localeCompare(currentInput) != 0) {
        return true;
    }
    return false;
}

let runEditQuizPage = (quizId) => {
    feedback.innerHTML = "Loading Quiz...";
    let getQuizPromise = getQuizById(quizId);
    getQuizPromise.then(
        (res) => {
            feedback.innerHTML = "";
            res = JSON.parse(res);
            let quizObj = new QuizObject(res.quizID, res.quizName, res.description, res.author, res.questions, res.answers);
            questionArrayInitialLength = quizObj.questions.length;
            oldQuestionIds = getAllQuestionIdInQuiz(quizObj.questions);
            createEditForm(quizObj);

        });

    (rej) => {
        feedback.innerHTML = rej
    }

    return quizId
}