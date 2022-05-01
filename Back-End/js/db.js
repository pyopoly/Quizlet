const mysql = require('mysql')
const dbUser = {
    host: 'localhost',
    user: 'jacknteg_team_m1',
    password: 'go_brrr',
    database: 'jacknteg_isa_project'
};

function dbConnection(db_query) {
    return new Promise((resolve, reject) => {
        let db = mysql.createConnection(dbUser);
        db.connect((err) => {
            if (err) throw err;
            db.query(db_query, (err, result) => {
                if (err) reject(err)
                if (result) {
                    resolve(result);
                }
            });
        });
    })
}

// ======================================
// POST - Write to DB
// ======================================
exports.writeQuizNameToDB = name => {
    let insert = `INSERT INTO Quizzes (quizName) VALUES ("${name}");`;
    return dbConnection(insert);
}

exports.writeQuizToDB = (name, description, author) => {
    description = (description)? '"' + description + '"' : null;
    author = (author)? '"' + author + '"' : null;
    let insert = `INSERT INTO Quizzes (quizName, description, author) VALUES ("${name}", ${description}, ${author});`;
    return dbConnection(insert);
}

exports.writeQuestionToDB = (question, quizID) => {
    let insert = `INSERT INTO Questions (question, quizID) VALUES ("${question}", ${quizID});`;
    return dbConnection(insert);
}

exports.writeAnswersToDB = (answersList, correctList, questionID, quizID) => {
    if (answersList.length != correctList.length)
        throw EvalError
    let insert = "INSERT INTO Answers (answer, correct, questionID, quizID) VALUES ";
    let p = ","
    for (i = 0; i < answersList.length; i++) {
        if (i == answersList.length - 1) p = ";"
        insert += `("${answersList[i]}", ${correctList[i]}, ${questionID}, ${quizID})` + p
    }
    return dbConnection(insert);
}

// ======================================
// GET - Read DB
// ======================================
// ****Quizzes****
exports.getAllQuizInfo = () => {
    let selectAll = `SELECT * FROM Quizzes;`;
    return dbConnection(selectAll);
}

exports.getQuizByID = quizID => {
    let selectName = `SELECT * FROM Quizzes WHERE quizID = ${quizID}`;
    return dbConnection(selectName);
}

exports.getQuizNameByID = quizID => {
    let selectName = `SELECT quizName FROM Quizzes WHERE quizID = ${quizID}`;
    return dbConnection(selectName);
}

exports.getQuizIDByName = quizName => {
    let selectID = `SELECT quizID FROM Quizzes WHERE quizName = "${quizName}"`;
    return dbConnection(selectID);
}

// ****Questions****
exports.getQuestionsByQuizID = quizID => {
    let selectAll = `SELECT * FROM Questions WHERE quizID = ${quizID};`;
    return dbConnection(selectAll);
}

exports.getQustionIDByNameAndQuizID = (question, quizID) => {
    let selectAll = `SELECT questionID FROM Questions WHERE quizID = ${quizID} AND question ="${question}";`;
    return dbConnection(selectAll);
}

// ****Answers****
exports.getAnswersByQuestionID = questionID => {
    let selectAll = `SELECT * FROM Answers WHERE questionID = ${questionID};`;
    return dbConnection(selectAll);
}

exports.getQuestionsAnswersByQuestionID = questionID => {
    let q = `SELECT question FROM Questions WHERE questionID = ${questionID};`;
    let a = `SELECT answer, correct FROM Answers WHERE questionID = ${questionID};`;
    return [dbConnection(q), dbConnection(a)];
}

/**
 * This GET Request returns everything in a quiz, including quizName, all Questions, and all their answers.
 * @param {int} quizID an number for the id of the quiz
 * @returns Object, for the quiz.
 */
exports.getEntireQuizByQuizID = quizID => {
    return new Promise((all_resolved, all_rejected) => {
        new Promise(resolve => {
                Promise.all([this.getQuizByID(quizID), this.getQuestionsByQuizID(quizID)]).then(results => {
                    let quiz = {
                        "quizID": quizID,
                        "quizName": results[0][0].quizName,
                        "description": results[0][0].description,
                        "author": results[0][0].author,
                        "questions": results[1],
                    }
                    resolve(quiz)
                }).catch(error => all_rejected(error))
            })
            .then(quiz => {
                let questions = quiz.questions;
                let answerPromises = []
                questions.forEach(question => {
                    answerPromises.push(this.getAnswersByQuestionID(question.questionID))
                });
                Promise.all(answerPromises).then(final_answers => {
                    quiz['answers'] = final_answers
                    all_resolved(quiz)
                }).catch(error => all_rejected(error))
            }).catch(error => all_rejected(error))
    })
}

// ****Users****
exports.getUserByUsername = username => {
    let selectUser = `SELECT * FROM Users WHERE username = ${username};`;
    return dbConnection(selectUser);
}

// ======================================
// PUT - Update DB
// ======================================
exports.updateQuizNameByName = (quizName, newName) => {
    let patch = `UPDATE quizzes SET quizName = "${newName}" WHERE quizName = "${quizName}";`;
    return dbConnection(patch);
}

exports.updateQuestionByQuestionID = (questionID, newQuestion) => {
    let patch = `UPDATE Questions SET question = "${newQuestion}" WHERE questionID = ${questionID};`;
    return dbConnection(patch);
}

exports.updateAnswerByAnswerID = (answerID, newAnswer, newCorrect) => {
    let patch = `UPDATE Answers SET answer = "${newAnswer}", correct = ${newCorrect} WHERE answerID = ${answerID};`;
    return dbConnection(patch);
}

exports.updateQuizByID = (quizID, quizName, description, author) => {
    description = (description)? '"' + description + '"' : null;
    author = (author)? '"' + author + '"' : null;
    let patch = `UPDATE Quizzes SET quizName = "${quizName}", description = ${description}, author = ${author} WHERE quizID = ${quizID};`;
    return dbConnection(patch);
}

// ======================================
// Delete - delete rows in DB
// ======================================
exports.deleteAnswerByID = answerID => {
    let deleteRow = `DELETE FROM Answers WHERE answerID = ${answerID};`;
    return dbConnection(deleteRow);
}

exports.deleteQuestionByID = questionID => {
    let deleteAnswers = `DELETE FROM Answers WHERE questionID = ${questionID};`;
    let deleteQuestion = `DELETE FROM Questions WHERE questionID = ${questionID};`;
    return new Promise((resolve, reject) => {
        dbConnection(deleteAnswers).then(answerResult => {
            console.log(answerResult)
            dbConnection(deleteQuestion).then(questionResult => {
                console.log(answerResult)
                resolve([questionResult, answerResult])
            }, questionRejected => reject(questionRejected))
        }, answerRejected => reject(answerRejected))
    })
}

exports.deleteQuizByID = quizID => {
    let deleteQuiz = `DELETE FROM Quizzes WHERE quizID = ${quizID};`;
    return dbConnection(deleteQuiz);
}


exports.adminUser = (username, password) => {
    let selectName = `SELECT * FROM accounts WHERE username = "${username}" AND password = "${password}"`;
    return dbConnection(selectName);
}

// SELECT Questions.questionID, questions.question, Answers.answer, Answers.correct
// FROM Questions
// INNER JOIN answers ON Questions.questionID=Answers.questionID;