const QuestionsController = require('./controllers/questions_controller')
const RoomController = require('./controllers/room_controller')

module.exports = (app) => {
    app.get('/create_questions', QuestionsController.createQuestions);
    app.get('/question', QuestionsController.getRandomQuestion);
    app.get('/room/:roomId', RoomController.getRoomData);
    app.post('/create_room', RoomController.createNewRoom);
    app.post('/join_room', RoomController.joinRoom);
    app.post('/start_game', RoomController.startGame);
    app.post('/submit_answer', RoomController.submitAnswer);
}
