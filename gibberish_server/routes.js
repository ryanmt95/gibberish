const RoomController = require('./controllers/room_controller')

module.exports = (app) => {
    app.get('/clear', RoomController.clearDB)
    app.get('/ping', (req, res) => {
      res.send('server is running')
    })
    // app.get('/question', QuestionsController.getRandomQuestion);
    // app.get('/room/:roomId/:playerId', RoomController.getRoomData);
    // app.get('/qna/:roomId', RoomController.getRoomQna)
    // app.post('/create_room', RoomController.createNewRoom);
    // app.post('/join_room', RoomController.joinRoom);
    // app.post('/start_game', RoomController.startGame);
    // app.post('/submit_answer', RoomController.submitAnswer);
    // app.post('/restart_game', RoomController.restartGame)
}
