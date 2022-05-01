const express = require("express");
const cors = require('cors');
const db = require("./js/db");
const endpointCounter = require("./js/endpointCounter");
const app = express();
const endPointRoot = "/4537/termproject/API";
const V1 = '/V1';
const clientServerRoot = "https://tommywork.lovestoblog.com";
const PORT = 8080;
const pageNotFound = 404;
const pageNotFoundMsg = "Page 404. Sorry can't find that!";
const endpoints = {
    post_quiz : "/post/quiz",
    post_question : "/post/question",
    post_answers : "/post/answers",
    // get_quizAndAllQuestionsByQuizID : "/get/quiz&all-questions-by-quizID",
    get_quizzes : "/get/quizzes",
    // get_quiz : "/get/quiz",
    // get_quizIDByName : "/get/quizIDByName",
    // get_questions : "/get/questions",
    // get_answers : "/get/answers",
    get_questionAndAnswers : "/get/questions&answers",
    put_quiz : "/put/quiz",
    // patch_quizName : "/patch/quizName",
    patch_question : "/patch/question",
    // patch_answer : "/patch/answer",
    delete_quiz : "/delete/quiz",
    delete_question : "/delete/question",
    // delete_answer : "/delete/answer",
    counters : '/get/counters',
    admin_user: '/admin/user'
}


// Set up Express
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
// TODO: Change it back to clientServerRoot
// Note: Changed to * because Teg is awesome :)
app.use(cors({
    origin: "*",
}));

// Setting up endpoint counters
endpointCounter.saveEndpoints(endPointRoot + V1, endpoints)
app.use(endPointRoot + V1, endpointCounter.expressMiddleware);

// Version 1
require('./version/version1')(app, db, endPointRoot + V1, endpoints, endpointCounter);

// If nothing is called by express, then send a pageNotFound status.
app.use((req, res) => {res.status(pageNotFound).send(pageNotFoundMsg);});

app.listen(PORT);
console.log("Server started");