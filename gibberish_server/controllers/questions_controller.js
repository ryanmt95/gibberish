const QuestionBank = require('../mongo_models/question_bank');
const questions = require('../sample_questions')

class questionsController {

    // populate question bank collection in mongodb 
    static createQuestions(req, res) {
        for (let question of questions) {
            QuestionBank.create(question, (err) => {
                console.log(err)
            })
        }
        res.send("Create Question Successfull")
    }

    static getRandomQuestion(req, res) {
        QuestionBank.countDocuments().exec(function (err, count) {

            var random = Math.floor(Math.random() * count);

            QuestionBank.findOne().skip(random).exec(
                function (err, result) {
                    // result is random 
                    res.send(result)
                });

        });
    }
}

module.exports = questionsController;
