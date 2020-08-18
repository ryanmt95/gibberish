const questions = require('./sample_questions')
const uid = require("uid");

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

function getRandomQuestions(questionsArr, theme) {
  let qna = new Set()
  while (qna.size < MAX_ROUNDS) {
    const r = Math.floor(Math.random() * questions[theme]['questionList'].length)
    const randomQuestion = questions[theme]['questionList'][r];
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
        const theme = Math.floor(Math.random() * questions.length)
        room = {
          roomId: roomId,
          gameState: STATE.GAME_WAITING,
          currentRound: 0,
          players: [{
            id: socket.id,
            name: nickname,
            totalScore: 0,
            lastScore: 0
          }],
          theme: questions[theme]['theme'],
          qna: getRandomQuestions([], theme),
          timer: 0
        }
      } else {
        room = rooms.get(roomId)
        if (room) {
          room['players'].push({
            id: socket.id,
            name: nickname,
            totalScore: 0,
            lastScore: 0
          })
        } else {
          socket.emit('err', 'Invalid room')
          return
        }
      }
      players.set(socket.id, roomId)
      rooms.set(roomId, room)
      socket.join(roomId)
      io.to(roomId).emit('updateRoom', room)
      socket.emit('updateChat', {
        message: 'Welcome to Guess The Gibberish!',
        senderId: socket.id,
        senderName: ''
      })
      socket.broadcast.to(roomId).emit('updateChat', {
        message: nickname + ' joined the room',
        senderId: socket.id,
        senderName: ''
      })
      console.log('Rooms:' + Array.from(rooms.keys()))
      console.log('Players:' + Array.from(players.keys()))
    })

    socket.on('disconnect', () => {
      const roomId = players.get(socket.id)
      if (roomId) {
        players.delete(socket.id)
      }
      let room = rooms.get(roomId)
      if (room) {
        room['players'] = room['players'].filter(player => player['id'] !== socket.id)
        if (room['players'].length > 0) {
          rooms.set(roomId, room)
          io.to(roomId).emit('updateRoom', room)
          io.to(roomId).emit('updateChat', {
            message: 'Someone left the room',
            senderId: socket.id,
            senderName: ''
          })
        } else {
          rooms.delete(roomId)
        }
      }
      console.log('Rooms:' + Array.from(rooms.keys()))
      console.log('Players:' + Array.from(players.keys()))
    })

    socket.on('startGame', ({ roomId }) => {
      console.log(roomId)
      let room = rooms.get(roomId)
      if (room['gameState'] == STATE.GAME_WAITING) {
        room['gameState'] = STATE.ROUND_LOADING
        room['timer'] = ROUND_LOADING_TIMER
        room['currentRound']++
        rooms.set(roomId, room)
        io.to(roomId).emit('updateRoom', room)
      }
    })

    socket.on('submitAnswer', ({ roomId }) => {
      let room = rooms.get(roomId)
      const index = room['players'].findIndex(player => player.id === socket.id)
      let player
      let score

      if (index !== -1) {
        player = room['players'][index]
        score = room['timer']
        player['totalScore'] += score
        player['lastScore'] = score
      }
      room['players'].sort((a, b) => {
        return b['totalScore'] - a['totalScore']
      })
      // check if all answered
      var allAnswered = true
      for (let player of room['players']) {
        if (player.lastScore === 0) {
          allAnswered = false
        }
      }
      if (allAnswered) {
        room['gameState'] = STATE.ROUND_ENDED
        room['timer'] = ROUND_ENDED_TIMER
      }
      // if all answered goto next state
      rooms.set(roomId, room)
      io.to(roomId).emit('updateRoom', room)
      io.to(roomId).emit('updateChat', {
        message: player['name'] + " guessed correctly! (+" + score + ")" ,
        senderName: ''
      })
    })

    socket.on('playAgain', ({ roomId }) => {
      let room = rooms.get(roomId)
      room['currentRound'] = 0
      room['gameState'] = STATE.GAME_WAITING
      const theme = Math.floor(Math.random() * questions.length)
      room['theme'] = questions[theme]['theme']
      room['qna'] = getRandomQuestions(room['qna'], theme)
      rooms.set(roomId, room)
      io.to(roomId).emit('updateRoom', room)
    })

    socket.on('sendMessage', ({ roomId, message, senderName }) => {
      let msg = {
        message: message,
        senderId: socket.id,
        senderName: senderName
      }
      io.to(roomId).emit('updateChat', msg)
    })
  })

  setInterval(() => {
    rooms.forEach((room, roomId, rooms) => {
      if (room['timer'] > 0) {
        room['timer']--
      } else {
        const currState = room['gameState']
        switch (currState) {
          case STATE.ROUND_LOADING:
            room['gameState'] = STATE.ROUND_ONGOING
            room['timer'] = ROUND_ONGOING_TIMER
            break
          case STATE.ROUND_ONGOING:
            room['gameState'] = STATE.ROUND_ENDED
            room['timer'] = ROUND_ENDED_TIMER
            break
          case STATE.ROUND_ENDED:
            if (room['currentRound'] < MAX_ROUNDS) {
              for (var i = 0; i < room['players'].length; i++) {
                room['players'][i]['lastScore'] = 0
              }
              room['gameState'] = STATE.ROUND_LOADING
              room['timer'] = ROUND_LOADING_TIMER
              room['currentRound']++
            } else {
              room['gameState'] = STATE.GAME_ENDED
            }
            break
        }
      }
      rooms.set(roomId, room)
      io.to(roomId).emit('updateRoom', room)
    })
  }, 1000)
}