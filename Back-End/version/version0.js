// const endPointRoot = "/COMP4537/project/teamM1/api";
// const OK = 200;
// const CREATED = 201;
// const SERVER_ERROR = 500;


// // ====================================================================================================
// // 
// // Version 0 is Deprecated and is not supported nor has documentation
// // 
// // ====================================================================================================



// module.exports = (app, db) => {
//     // ====================================================================================================
//     // POST
//     // ====================================================================================================
//     // To use this endpoint: key=name
//     // ex. {name: "Pets"}
//     app.post(endPointRoot + "/post/quizname", (req, res) => {
//         db.writeQuizNameToDB(req.body.quizName).then(
//             result => resolving(CREATED, result, res),
//             rejected => rejecting(SERVER_ERROR, rejected, res));
//     });

//     // To use this endpoint: key=quizID, question
//     // ex. {quizID: 1, question: "hello?"}
//     app.post(endPointRoot + "/post/question", (req, res) => {
//         let b = req.body
//         db.writeQuestionToDB(b.question, b.quizID).then(
//             result => resolving(CREATED, result, res),
//             rejected => rejecting(SERVER_ERROR, rejected, res));
//     });

//     // To use this endpoint: key=questionID, answers[], correct[]
//     // answers and correct are arrays. In Postman, arrays can be added with: answers[0]="hi", answers[1]="hey"
//     // ex. {questionID:1, answers[0]:"2 legs", answers[1]:"4 legs", correct[0]:0, correct[1]:1}
//     app.post(endPointRoot + "/post/answers", (req, res) => {
//         let b = req.body
//         db.writeAnswersToDB(b.answers, b.correct, b.questionID).then(
//             result => resolving(CREATED, result, res),
//             rejected => rejecting(SERVER_ERROR, rejected, res));
//     });


//     // ====================================================================================================
//     // GET 
//     // ====================================================================================================

//     // This GET Request returns everything in a quiz, including quizName, all Questions, and all their
//     // answers, by searching quizID.
//     app.get(endPointRoot + "/get/quiz&all-questions-by-quizID", (req, res) => {
//         db.getEntireQuizByQuizID(req.query.id).then(result => {
//                 resolving(OK, result, res)
//             },
//             rejected => rejecting(SERVER_ERROR, rejected, res))
//     });

//     // Get all the information of quizzes
//     app.get(endPointRoot + "/get/quizzes", (req, res) => {
//         db.getAllQuizInfo().then(
//             result => resolving(OK, result, res),
//             rejected => rejecting(SERVER_ERROR, rejected, res));
//     });

//     // Returns the quizID by the name of the quiz
//     app.get(endPointRoot + "/get/quizIDByName", (req, res) => {
//         db.getQuizIDByName(req.query.quizName).then(
//             result => resolving(OK, result[0], res),
//             rejected => rejecting(SERVER_ERROR, rejected, res));
//     });

//     app.get(endPointRoot + "/get/questions", (req, res) => {
//         db.getQuestionsByQuizID(req.query.id).then(
//             result => resolving(OK, result, res),
//             rejected => rejecting(SERVER_ERROR, rejected, res));
//     });

//     app.get(endPointRoot + "/get/answers", (req, res) => {
//         db.getAnswersByQuestionID(req.query.id).then(
//             result => resolving(OK, result, res),
//             rejected => rejecting(SERVER_ERROR, rejected, res));
//     });

//     // Combines question and its answers 
//     app.get(endPointRoot + "/get/questions&answers", (req, res) => {
//         Promise.all(db.getQuestionsAnswersByQuestionID(req.query.id)).then(values => {
//                 let result = {
//                     'question': JSON.parse(values[0])[0].question,
//                     'answers': JSON.parse(values[1])
//                 }
//                 res.status(OK).end(JSON.stringify(result))
//             },
//             rejected => rejecting(SERVER_ERROR, rejected, res))
//     });


//     // ====================================================================================================
//     // PATCH
//     // ====================================================================================================
//     app.patch(endPointRoot + "/patch/quizName", (req, res) => {
//         db.patchQuizNameByName(req.body.quizName, req.body.newName).then(result => {
//                 resolving(OK, result, res)
//             },
//             rejected => rejecting(SERVER_ERROR, rejected, res))
//     });

//     app.patch(endPointRoot + "/patch/question", (req, res) => {
//         db.patchQuestionByQuestionID(req.body.questionID, req.body.newQuestion).then(result => {
//                 resolving(OK, result, res)
//             },
//             rejected => rejecting(SERVER_ERROR, rejected, res))
//     });

//     app.patch(endPointRoot + "/patch/answer", (req, res) => {
//         db.patchAnswerByAnswerID(req.body.answerID, req.body.newAnswer, req.body.newCorrect).then(result => {
//                 resolving(OK, result, res)
//             },
//             rejected => rejecting(SERVER_ERROR, rejected, res))
//     });


//     // ====================================================================================================
//     // DELETE
//     // ====================================================================================================
//     app.delete(endPointRoot + "/delete/answer", (req, res) => {
//         db.deleteAnswerByID(req.body.answerID).then(result => {
//                 resolving(OK, result, res)
//             },
//             rejected => rejecting(SERVER_ERROR, rejected, res))
//     });

//     app.delete(endPointRoot + "/delete/question", (req, res) => {
//         db.deleteQuestionByID(req.body.questionID).then(result => {
//                 resolving(OK, result, res)
//             },
//             rejected => rejecting(SERVER_ERROR, rejected, res))
//     });

//     app.delete(endPointRoot + "/delete/quiz", (req, res) => {
//         db.deleteQuizByID(req.body.quizID).then(result => {
//                 resolving(OK, result, res)
//             },
//             rejected => rejecting(SERVER_ERROR, rejected, res))
//     });
// }




// // ====================================================================================================
// // Assistance Methods
// // ====================================================================================================
// let resolving = (code, result, res) => {
//     res.status(code).end(JSON.stringify(result));
// }

// let rejecting = (code, rejected, res) => {
//     console.log("rejected: ", rejected)
//     res.status(code).end(`Rejected, ${rejected.sqlMessage}`);
// }