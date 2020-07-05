const { loginController, questionAndAnswerController } = require('../controllers')

module.exports = (app) => {

    // login APIs
    app.get('/api/login/sayHello', loginController.sayHello);
    app.get('/api/login/sayGoodbye', loginController.sayGoodbye);

    // question and answer APIs
    // ...
}