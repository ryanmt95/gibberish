const questions = require('./sample_questions')
const RoomController = require('./controllers/room_controller')
const { saveRoom } = require('./models/room')

var rooms = []

const ROUND_LOADING_TIMER = 3
const ROUND_ONGOING_TIMER = 25
const ROUND_ENDED_TIMER = 5
const MAX_ROUNDS = 5

function getRandomQuestions(questionsArr) {
  let qna = new Set()
  while (qna.size < MAX_ROUNDS) {
    const r = Math.floor(Math.random() * questions.length)
    const randomQuestion = questions[r];
    qna.add(randomQuestion);
  }
  const arr = Array.from(qna)
  arr.push(...questionsArr)
  return arr
}

module.exports = (io) => {
  io.on('connection', socket => {
    socket.on('joinRoom', ({ nickname, roomId }) => {
      if (roomId === '') {
        RoomController.createNewRoom()
          .then(room => {
            RoomController.joinRoom(socket.id, nickname, room['id'])
              .then(res => {
                if (res[0] === 'err') {
                  socket.emit(res[0], res[1])
                } else {
                  const room = res[1]
                  socket.join(room['id'])
                  io.to(room['id']).emit(res[0], res[1])
                }
              })
          })
      } else {
        RoomController.joinRoom(socket.id, nickname, roomId)
          .then(res => {
            if (res[0] === 'err') {
              socket.emit(res[0], res[1])
            } else {
              const room = res[1]
              socket.join(room['id'])
              io.to(room['id']).emit(res[0], res[1])
            }
          })
      }
    })

    socket.on('disconnect', () => {
      RoomController.playerLeave(io, socket.id)
    })

    socket.on('startGame', ({ roomId }) => {
      RoomController.startGame(io, roomId)
    })

    socket.on('submitAnswer', ({ roomId }) => {
      RoomController.submitAnswer(io, roomId, socket.id)
    })

    socket.on('playAgain', ({ roomId }) => {
      const index = rooms.findIndex(room => room['id'] === roomId)
      if (index !== -1) {
        rooms[index]['currentRound'] = 1
        rooms[index]['gamestate'] = 'ROUND_LOADING'
        rooms[index]['timer'] = ROUND_LOADING_TIMER
        rooms[index]['qna'] = getRandomQuestions(rooms[index]['qna']) // get new questions
        io.to(roomId).emit('updateRoom', rooms[index])
      }
    })
  })

  setInterval(() => {
    RoomController.timerTick(io)
  }, 1000)
}