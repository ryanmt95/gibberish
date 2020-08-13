const questions = require('./sample_questions')
const uid = require("uid");
// const RoomController = require('./controllers/room_controller')
// const { saveRoom } = require('./models/room')

var rooms = new Map()
var players = new Map()

const ROUND_LOADING_TIMER = 3
const ROUND_ONGOING_TIMER = 25
const ROUND_ENDED_TIMER = 5
const MAX_ROUNDS = 5
const STATE = {
  "GAME_WAITING": "GAME_WAITING",
  "ROUND_LOADING": "ROUND_LOADING",
  "ROUND_ONGOING": "ROUND_ONGOING",
  "ROUND_ENDED": "ROUND_ENDED",
  "GAME_ENDED": "GAME_ENDED"
}

function getRandomQuestions(questionsArr) {
  let qna = new Set()
  while (qna.size < MAX_ROUNDS) {
    const r = Math.floor(Math.random() * questions[0]['questionList'].length)
    const randomQuestion = questions[0]['questionList'][r];
    qna.add(randomQuestion);
  }
  const arr = Array.from(qna)
  arr.push(...questionsArr)
  return arr
}

module.exports = (io) => {
  io.on('connection', socket => {
    socket.on('joinRoom', ({ nickname, roomId }) => {
      let room 
      if (roomId === '') {
        roomId = uid(6)
        room = {
          roomId: roomId,
          state: STATE.GAME_WAITING,
          currentRound: 0,
          players: [{
            id: socket.id,
            name: nickname,
            totalScore: 0,
            lastScore: 0
          }],
          theme: questions[0]['theme'],
          qna: getRandomQuestions([]),
          timer: 0
        }
      } else {
        room = rooms.get(roomId)
        room['players'].push({
          id: socket.id,
          name: nickname,
          totalScore: 0,
          lastScore: 0
        })
      }
      players.set(socket.id, roomId)
      rooms.set(roomId, room)
      socket.join(roomId)
      io.to(roomId).emit('updateRoom', room)
      console.log('Rooms:' + rooms.size)
      console.log('Players:' + players.size)
    })

    socket.on('disconnect', () => {
      const roomId = players.get(socket.id)
      if(roomId) {
        players.delete(socket.id)
      }
      let room = rooms.get(roomId)
      console.log(room)
      if(room) {
        room['players'] = room['players'].filter(player => player['id'] !== socket.id)
        if (room['players'].length > 0) {
          rooms.set(roomId, room)
          io.to(roomId).emit('updateRoom', room)
        } else {
          rooms.delete(roomId)
        }
      }
      console.log('Rooms:' + rooms.size)
      console.log('Players:' + players.size)
      // RoomController.playerLeave(io, socket.id)
    })

    socket.on('startGame', ({ roomId }) => {
      let room = rooms.get(roomId)
      if (room['state'] == STATE.GAME_WAITING) {
        room['state'] = STATE.ROUND_LOADING
        room['timer'] = ROUND_LOADING_TIMER
        room['currentRound']++
        room.set(roomId, room)
        io.to(roomId).emit('updateRoom', room)
      }

      // RoomController.startGame(io, roomId)
    })

    socket.on('submitAnswer', ({ roomId }) => {
      let room = rooms.get(roomId)
      const index = room['players'].findIndex(player => player.id === socket.id)
      if (index !== -1) {
        let player = room['players'][index]
        let score = room['timer']
        player['totalScore'] += score
        player['lastScore'] = score
      }
      // check if all answered
      var allAnswered = true
      for (let player of room['players']) {
        if (player.lastScore === 0) {
          allAnswered = false
        }
      }
      // if all answered goto next state
      rooms.set(roomId, room)
      io.to(roomId).emit('updateRoom', room)

      // RoomController.submitAnswer(io, roomId, socket.id)
    })

    socket.on('playAgain', ({ roomId }) => {
      // RoomController.restartGame(io, roomId)
    })
  })

  setInterval(() => {
    rooms.forEach((roomId, room) => {
      if (room['timer'] > 0) {
        room['timer']--
      } else {
        const currState = room['state']
        switch (currState) {
          case STATE.ROUND_LOADING:
            room['state'] = STATE.ROUND_ONGOING
            room['timer'] = ROUND_ONGOING_TIMER
            break
          case STATE.ROUND_ONGOING:
            room['state'] = STATE.ROUND_ENDED
            room['timer'] = ROUND_ENDED_TIMER
            break
          case STATE.ROUND_ENDED:
            if(room['currentRound'] < MAX_ROUNDS) {
              for(var i = 0; i < room['players'].length; i++) {
                room['players'][i]['lastScore'] = 0
              }
              room['state'] = STATE.ROUND_LOADING
              room['timer'] = ROUND_LOADING_TIMER
              room['currentRound']++
            } else {
              room['state'] = STATE.GAME_ENDED
            }
            break
        }
      }
      rooms.set(roomId, room)
    })
    // RoomController.timerTick(io)
  }, 1000)
}