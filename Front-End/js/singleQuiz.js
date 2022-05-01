// Container that has all the items in the quiz list.
const ulQuiz = document.getElementById("ulQuiz");
const params = new URLSearchParams(window.location.search)

/**
 * Create all the quiz from a list of JSON objects
 * @param {array of list Question objects.} quizObjectsJSON
 */
 convertToQuestionsObject = (questionObjectsJSON) => {
    questionObjectsJSON = JSON.parse(questionObjectsJSON);
    let questionObject;
    let quizId = questionObjectsJSON.quizID;
    let quizName = questionObjectsJSON.quizName;
    let questions = questionObjectsJSON.questions;
    let answers = questionObjectsJSON.answers;
    questionObject = new QuestionLsitObject(quizId, quizName, questions, answers);
    return questionObject;
}


// get questions and answers by quizId
const xhttp = new XMLHttpRequest();
const endPointRoot = "https://jacknteg.com/4537/termproject/API/V1/get/";
const query = "questions/?id=";

/**
 * Gets the list of all the quizzes with thier id and name. 
 */
let getQuestionsByQuizID = () => {
    return new Promise((res, rej) => {
        const url = endPointRoot + query + params.get("id");
        xhttp.open("GET", url, true);
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    res(xhttp.responseText);
                } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                    rej(`Something went wrong, status: ${xhttp.status}`);
                }
            } 
            // else {
            //     ulQuiz.innerHTML = "Loading Questions...."
            // }
            }
    });
}


const queryQuestion = "questions&answers?id=";
/**
 * Gets the list of all the quizzes with thier id and name. 
 */
 let getQuestionByQuestionId = (questionId) => {
    return new Promise((res, rej) => {
        const url = endPointRoot + queryQuestion + questionId;
        xhttp.open("GET", url, true);
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                // ulQuiz.innerHTML = "";
                // ulQuiz.innerHTML = xhttp.responseText;
                if (xhttp.status == 200) {
                    console.log(xhttp.responseText);
                    res(xhttp.responseText)
                } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                    rej(`Something went wrong, status: ${xhttp.status}`);
                }
            } 
            // else {
            //     ulQuiz.innerHTML = "Loading Questions...."
            // }
            }
    });
}

// Store the score as a localstorage (not the best)
let answer;
let store_score = localStorage.getItem("score");
if (store_score == null || store_score == "null"){
    score = 0;
} else {
    score = parseInt(store_score);
}

// Create the Question receving question and answers from api and showing the layout.
class QuestionObject {
    constructor(question, answers, id, index, questionsLength) {
        // this.questions = questions;
        this.id = id; 
        this.question = question;
        this.answers = answers;
        this.index = parseInt(index);
        this.questionsLength = questionsLength;
        console.log("counter: " + this.counter);
        console.log("answers: " + this.answers);
        console.log("score" ,score);

        for (let i = 0;i < answers.length;i++) {
            if (answers[i].correct == 1) {
                answer = i + 1;
            }
        }
        console.log("answer: " , answer);

        this.div_main_1 = document.createElement("div");
        this.div_main_1.className = "container mt-5";
        let div_main_2 = document.createElement("div");
        div_main_2.className = "d-flex justify-content-center row";
        this.div_main_1.appendChild(div_main_2);

        let div_main_3 = document.createElement("div");
        div_main_3.className = "col-md-10 col-lg-10";
        div_main_2.appendChild(div_main_3);

        let div_main_4 = document.createElement("div");
        div_main_4.className = "border";
        div_main_3.appendChild(div_main_4);

        
        let div_sub_5 = document.createElement("div");
        div_sub_5.className = "question bg-white p-3 border-bottom"; 
        div_main_4.appendChild(div_sub_5);

        let div_sub_6 = document.createElement("div");
        div_sub_6.className = "d-flex flex-row justify-content-between align-items-center mcq";
        div_sub_6.innerHTML = "<h4>Quiz</h4><span>(" + (this.index + 1)+ " of " + questionsLength + ")</span>";
        div_sub_5.appendChild(div_sub_6);

        let div_question = document.createElement("div");
        div_question.className = "question bg-white p-3 border-bottom";
        div_main_4.appendChild(div_question);

        let div_question_1 = document.createElement("div");
        div_question_1.className = "d-flex flex-row align-items-center question-title";
        div_question_1.innerHTML = '<h3 class="text-danger">Q.</h3> <h5 class="mt-1 ml-2">'+ this.question + '</h5>';
        div_question.appendChild(div_question_1);

        for (let i=0; i < this.answers.length;i++) {
            console.log("single answer " + this.answers[i].answer);
            let div_answer = document.createElement("div");
            div_answer.className = "ans ml-2";
            div_answer.innerHTML = '<label class="radio"> <input id="r+' + (i + 1) + '" type="radio" name="option" value="' + (i + 1) + '"> <span>' + this.answers[i].answer + '</span></label>';
            div_question.appendChild(div_answer);
        };
        let previous_next = document.createElement("div");
        previous_next.className = "d-flex flex-row justify-content-between align-items-center p-3 bg-white";

        let link = "quiz.html?id=" + this.id + "&index=" + (this.index + 1);
        // previous_next.innerHTML = '<button class="btn btn-primary d-flex align-items-center btn-danger"><i class="fa fa-angle-left mt-1 mr-1"></i>&nbsp;previous</button> <form>  <button class="btn btn-primary border-success align-items-center btn-success" type="button"  formaction=' + link + '>Next<i class="fa fa-angle-right ml-2"></i></button> </form> ';
        // this.quizTakeQuizButton.href = "./quiz.html?id=" + this.id + "&index=" + (this.index + 1);
        if ((this.index + 1) == this.questionsLength) {
            previous_next.innerHTML = '<button  class="btn btn-primary d-flex align-items-center btn-danger" onclick="giveScore()">Show Score</button>';
        } else {
            previous_next.innerHTML = '<a href="'+ link +'" target="_parent"><button  class="btn btn-primary border-success align-items-center btn-success" onclick="checkScore()">Next</button></a>';
        }
        

        div_main_4.appendChild(previous_next);
    }
    appendTo = (domObject) => {
        domObject.appendChild(this.div_main_1);
    };
}

runPage = () => {
    let id = params.get("id");
    let index = params.get("index");
    console.log("ID:", id, "index = ", index);
    let promise = getQuestionsByQuizID();
    let listOfQuestionObjects = []
    promise.then(
        (response) => {
            let questions = JSON.parse(response);
            if(questions.length == 0) {
                ulQuiz.innerHTML = "The data is empty right now";
            } else {
                ulQuiz.innerHTML = "";
                let promiseQuestion = getQuestionByQuestionId(questions[index].questionID);
                // update once at a time
                promiseQuestion.then((res) =>{
                    questionObjects = JSON.parse(res);
                    console.log(questions[index].questionID +  " "+ questionObjects)
    
                    listOfQuestionObjects.push(new QuestionObject(questionObjects.question, questionObjects.answers, id, index, questions.length));
                    listOfQuestionObjects.map(x=> x.appendTo(ulQuiz));
                })
            }
        },
        (error) => {ulQuiz.innerHTML= error}

    )
}

// Give score by localstorage and reset to zero
function giveScore(){
    guess = getRadioValue("option");
    if (guess == answer) {
        score++;
    }
    alert("Your total score is " + score);
    score = 0;
    localStorage.setItem("score", score);
}
// Check score by each time 
function checkScore(){
    guess = getRadioValue("option");
    if (guess == answer) {
        score++;
        console.log(score);
        localStorage.setItem("score", score);
    }
}
// get the choen value
function getRadioValue(theRadioGroup)
{
    let elements = document.getElementsByName(theRadioGroup);
    for (let i = 0, l = elements.length; i < l; i++)
    {
        if (elements[i].checked)
        {
            return elements[i].value;
        }
    }
}



runPage();