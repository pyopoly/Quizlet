// Container that has all the items in the quiz list.
const ulQuizList = document.getElementById("ulQuizList");
const xhttp = new XMLHttpRequest();
// const endPointRoot = "http://localhost:8080/COMP4537/project/teamM1/api/v1/";
const endPointRoot = "https://jacknteg.com/4537/termproject/API/V1/";



/**
 * Create all the quiz from a list of JSON objects
 * @param {array of list Quiz objects.} quizObjectsJSON
 */
convertToQuizObjects = (quizObjectsJSON) => {
    quizObjectsJSON = JSON.parse(quizObjectsJSON);
    let listOfQuizObjects = []
    for (let i = 0; i < quizObjectsJSON.length; i++) {
        let quizJSON = quizObjectsJSON[i];
        let quizId = quizJSON.quizID;
        let quizName = quizJSON.quizName;
        let quizDescription = quizJSON.description;
        let quizAuthor = quizJSON.author;
        let quizObject = new QuizListObjectDOM(quizId, quizName, quizDescription, quizAuthor);
        listOfQuizObjects.push(quizObject);
    }

    return listOfQuizObjects;
}


/**
 * Creats a quiz DOM object that will be in a list of all quizes.
 * 
 * Structure:
 * 
 * <li class="nav-item my-2 list">
 *   <div class="card text-white bg-dark mb-3" style="width: 50rem;">
 *     <div class="card-body">
 *       <h5 class="card-title">Quiz Name</h5>
 *       <p class="card-text">Quiz Description: Lorem ipsum </p>
 *       <p class="card-text">By: Nathan Dong</p>
 *       <a href="quiz.html" class="btn btn-primary">Take Quiz!</a>
 *     </div>
 *   </div>
 * </li>
 *
 */
class QuizListObjectDOM {
    /**
     * 
     * @param {*} quizId id
     * @param {*} quizName String 
     * @param {*} quizDescription String
     * @param {*} quizAuthor String
     */
    constructor(quizId, quizName, quizDescription, quizAuthor) {

        this.quizId = quizId;
        this.quizName = quizName;
        this.quizDescription = quizDescription;
        this.quizAuthor = quizAuthor;

        this.quizListItem = document.createElement("li");
        this.quizListItem.className = "nav-item my-2 list";

        let quizCard  = document.createElement("div");
        quizCard.id = "mainCard";
        quizCard.className = "card text-white bg-dark mb-3";
        this.quizListItem.appendChild(quizCard);

        let quizCardTitle = document.createElement("h5");
        quizCardTitle.className = "card-header d-flex justify-content-between align-items-center bg-secondary";
        quizCardTitle.innerHTML = quizName;
        quizCard.appendChild(quizCardTitle);

        let quizButtonGroup = document.createElement("div");
        quizButtonGroup.className = "btn-group gap-2 bg-secondary";
        quizButtonGroup.role = "group"
        quizCardTitle.appendChild(quizButtonGroup);

        this.quizCancelButton = document.createElement("button");
        this.quizCancelButton.className = "btn btn-sm btn-danger";
        this.quizCancelButton.innerHTML = "Delete"
        quizButtonGroup.appendChild(this.quizCancelButton);
        this.quizCancelButton.onclick = () => {
            deleteQuizUsingId(this.quizId);
            this.quizListItem.remove()
        }
        

        this.quizEditButton = document.createElement("a");
        this.quizEditButton.className = "btn btn-sm btn-primary";
        this.quizEditButton.innerHTML = "Edit"
        this.quizEditButton.href = "./makequiz.html?id=" + this.quizId;
        quizButtonGroup.appendChild(this.quizEditButton);

        let quizCardBody = document.createElement("div");
        quizCardBody.className = "card-body";
        quizCard.appendChild(quizCardBody);

        let quizCardDescription = document.createElement("p");
        quizCardDescription.className = "card-text";
        quizCardDescription.innerHTML = quizDescription;
        quizCardBody.appendChild(quizCardDescription);

        let quizBy = document.createElement("p");
        quizBy.className = "card-text";
        quizBy.innerHTML = `By: ${quizAuthor}`;
        quizCardBody.appendChild(quizBy);

        this.quizTakeQuizButton = document.createElement("a");
        this.quizTakeQuizButton.href = "quiz.html";
        this.quizTakeQuizButton.className = "btn btn-primary";
        this.quizTakeQuizButton.innerHTML = "Take Quiz!";
        this.quizTakeQuizButton.href = "./quiz.html?id=" + this.quizId + "&index=0";
        quizCardBody.appendChild(this.quizTakeQuizButton);
 
    }

    appendTo = (domObject) => {
        domObject.appendChild(this.quizListItem);
    }

    getQuizId = () => {
        return this.quizId;
    }
}

/**
 * Gets the list of all the quizzes with thier id and name. 
 */
let getAll = () => {
    return new Promise((res, rej) => {
        const url = endPointRoot + "get/quizzes";
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
 * @param {String} quizId 
 * @returns Promise
 */
let deleteQuizUsingId = (quizId) => {
    return new Promise((res, rej) => {
        let param = `quizID=${quizId}`;
        const url = endPointRoot + `delete/quiz`;

        xhttp.open("DELETE", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
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
 * Runs when the page is first laoded. 
 * 
 * Grabs All quizes from the server, Creates the DOM quiz objects and
 * appends them to the ulQuizList Node.
 */
runPage = () => {
    let promise = getAll();
    promise.then(
        (response) => {
            console.log("Correct response: " + response);
            let listOfQuizObjects = convertToQuizObjects(response);
            ulQuizList.innerHTML = "";
            console.log("Quizzes:", listOfQuizObjects);
            listOfQuizObjects.map(x=> x.appendTo(ulQuizList));
        },
        (error) => {
            console.log(error);
            ulQuizList.innerHTML(error)}

    )

}

runPage();
