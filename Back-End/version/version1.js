// ====================================================================================================
// Root: "/COMP4537/project/teamM1/api/v1"
// ====================================================================================================
const OK = 200;
const CREATED = 201;
const SERVER_ERROR = 500;


/**
 * Version 1
 * @param {express} app Express App
 * @param {db} db Database
 * @param {endpointCounter} endpointCounter Counter to count endpoints
 */
module.exports = (app, db, endPointRoot, endpoints, endpointCounter) => {
    // ====================================================================================================
    // POST
    // ====================================================================================================

    /**
     * To use this endpoint, use req.body for quiz info (name, description, author).
     * Name cannot be null.
     */
    app.post(endPointRoot + endpoints.post_quiz, (req, res) => {
        let b = req.body
        db.writeQuizToDB(b.quizName, b.description, b.author).then(
            result => resolving(CREATED, result, res),
            rejected => rejecting(SERVER_ERROR, rejected, res));
    });

    // Post one question. 
    // To use this endpoint: key=quizID, question
    // ex. {quizID: 1, question: "hello?"}
    app.post(endPointRoot + endpoints.post_question, (req, res) => {
        let b = req.body
        db.writeQuestionToDB(b.question, b.quizID).then(
            result => resolving(CREATED, result, res),
            rejected => rejecting(SERVER_ERROR, rejected, res));
    });

    // Post an array of answers.
    // To use this endpoint: key=questionID, answers[], correct[], quizID[]
    // answers and correct are arrays. In Postman, arrays can be added with: answers[0]="hi", answers[1]="hey"
    // ex. {questionID:1, answers[0]:"2 legs", answers[1]:"4 legs", correct[0]:0, correct[1]:1}
    app.post(endPointRoot + endpoints.post_answers, (req, res) => {
        let b = req.body
        db.writeAnswersToDB(b.answers, b.correct, b.questionID, b.quizID).then(
            result => resolving(CREATED, result, res),
            rejected => rejecting(SERVER_ERROR, rejected, res));
    });

    app.post(endPointRoot + endpoints.admin_user, (req, res) =>{
        let b = req.body;
        db.adminUser(b.username, b.password).then(
            result => resolving(CREATED, result, res),
            rejected => rejecting(SERVER_ERROR, rejected, res));
    });


    // ====================================================================================================
    // GET 
    // ====================================================================================================

    // This GET Request returns everything in a quiz, including quizName, all Questions, and all their
    // answers, by searching quizID.
    // app.get(endPointRoot + endpoints.get_quizAndAllQuestionsByQuizID, (req, res) => {
    //     db.getEntireQuizByQuizID(req.query.id).then(result => {
    //             resolving(OK, result, res)
    //         },
    //         rejected => rejecting(SERVER_ERROR, rejected, res))
    // });

    // Get all the information of all quizzes
    app.get(endPointRoot + endpoints.get_quizzes, (req, res) => {
        db.getAllQuizInfo().then(
            result => resolving(OK, result, res),
            rejected => rejecting(SERVER_ERROR, rejected, res));

    });

    // Get one quiz by id by query ?id=1
    // app.get(endPointRoot + endpoints.get_quiz, (req, res) => {
    //     // let p = req.path
    //     // p = p.replace(endPointRoot, "")
    //     // endpointCounter.addCount("/get/quiz")
    //     db.getQuizByID(req.query.id).then(
    //         result => {
    //             resolving(OK, result[0], res)
    //         },
    //         rejected => rejecting(SERVER_ERROR, rejected, res));
    // });

    // Returns the quizID by the name of the quiz
    // app.get(endPointRoot + endpoints.get_quizIDByName, (req, res) => {
    //     db.getQuizIDByName(req.query.quizName).then(
    //         result => resolving(OK, result[0], res),
    //         rejected => rejecting(SERVER_ERROR, rejected, res));
    // });

    // Get all questions by quizID by param ?id=1
    // app.get(endPointRoot + endpoints.get_questions, (req, res) => {
    //     db.getQuestionsByQuizID(req.query.id).then(
    //         result => resolving(OK, result, res),
    //         rejected => rejecting(SERVER_ERROR, rejected, res));
    // });

    // Get all answers by questionID by param ?id=1
    // app.get(endPointRoot + endpoints.get_answers, (req, res) => {
    //     db.getAnswersByQuestionID(req.query.id).then(
    //         result => resolving(OK, result, res),
    //         rejected => rejecting(SERVER_ERROR, rejected, res));
    // });

    // Combines question and its answers 
    app.get(endPointRoot + endpoints.get_questionAndAnswers, (req, res) => {
        Promise.all(db.getQuestionsAnswersByQuestionID(req.query.id)).then(values => {
            if (values[0] != 0) {
                values = {
                    'question': values[0][0].question,
                    'answers': values[1]
                }
            }
            res.status(OK).end(JSON.stringify(values))
        }).catch(
            rejected => {
                console.log(rejected)
                rejecting(SERVER_ERROR, rejected, res)
            }
        )
    });

    // // Returns the user info by the username.
    // app.get(endPointRoot + get_user, (req, res) => {
    //     db.getUserByUsername(req.query.username).then(
    //         result => resolving(OK, result[0], res),
    //         rejected => rejecting(SERVER_ERROR, rejected, res));
    // });

    // Get the Endpoint Counters.
    app.get(endPointRoot + endpoints.counters, (req, res) => {
        let counters = endpointCounter.getEndpointCounts()
        res.end(JSON.stringify(counters))
    });

    // ====================================================================================================
    // PUT
    // ====================================================================================================

    // Update one quiz by quizID. If description and author are undefined, then null will be inserted into DB. 
    app.put(endPointRoot + endpoints.put_quiz, (req, res) => {
        let b = req.body;
        db.updateQuizByID(b.quizID, b.quizName, b.description, b.author).then(result => {
                resolving(OK, result, res)
            },
            rejected => rejecting(SERVER_ERROR, rejected, res))
    });

    // Update one quiz's name by their searching old name
    // app.patch(endPointRoot + endpoints.patch_quizName, (req, res) => {
    //     db.updateQuizNameByName(req.body.quizName, req.body.newName).then(result => {
    //             resolving(OK, result, res)
    //         },
    //         rejected => rejecting(SERVER_ERROR, rejected, res))
    // });

    // Update one question by its ID.
    app.patch(endPointRoot + endpoints.patch_question, (req, res) => {
        db.updateQuestionByQuestionID(req.body.questionID, req.body.newQuestion).then(result => {
                resolving(OK, result, res)
            },
            rejected => rejecting(SERVER_ERROR, rejected, res))
    });

    // Update one answer by its ID
    // app.patch(endPointRoot + endpoints.patch_answer, (req, res) => {
    //     db.updateAnswerByAnswerID(req.body.answerID, req.body.newAnswer, req.body.newCorrect).then(result => {
    //             resolving(OK, result, res)
    //         },
    //         rejected => rejecting(SERVER_ERROR, rejected, res))
    // });


    // ====================================================================================================
    // DELETE
    // ====================================================================================================

    // Delete one answer by its ID
    // app.delete(endPointRoot + endpoints.delete_answer, (req, res) => {
    //     db.deleteAnswerByID(req.body.answerID).then(result => {
    //             resolving(OK, result, res)
    //         },
    //         rejected => rejecting(SERVER_ERROR, rejected, res))
    // });

    // Delete one question by its ID. all children answers will be deleted.
    app.delete(endPointRoot + endpoints.delete_question, (req, res) => {
        db.deleteQuestionByID(req.body.questionID).then(result => {
                resolving(OK, result, res)
            },
            rejected => rejecting(SERVER_ERROR, rejected, res))
    });

    // Delete one quiz by its ID, all of its children questions and answers will be deleted.
    app.delete(endPointRoot + endpoints.delete_quiz, (req, res) => {
        db.deleteQuizByID(req.body.quizID).then(result => {
                resolving(OK, result, res)
            },
            rejected => rejecting(SERVER_ERROR, rejected, res))
    });
}



// ====================================================================================================
// Assistance Methods
// ====================================================================================================
let resolving = (code, result, res) => {
    res.status(code).end(JSON.stringify(result));
}

let rejecting = (code, rejected, res) => {
    console.log("rejected: ", rejected)
    res.status(code).end(`Rejected, ${rejected.sqlMessage}`);
}