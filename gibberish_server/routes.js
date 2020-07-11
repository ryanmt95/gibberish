const QuestionsController = require('./controllers/questions_controller')

module.exports = (app) => {

    // login APIs


    // question and answer APIs
    app.get('/create_questions', QuestionsController.createQuestions);
    app.get('/question', QuestionsController.getRandomQuestion);
}
