const questionsController = require('./controllers/questions_controller')

module.exports = (app) => {

    // login APIs


    // question and answer APIs
    app.get('/create_questions', questionsController.createQuestions);
    app.get('/question', questionsController.getRandomQuestion);
}
