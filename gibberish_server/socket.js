const questions = require('./sample_questions')

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
      var index = rooms.findIndex(room => room['id'] === roomId)
      if (index === -1) {
        // if room not found, create new room
        index = rooms.length
        rooms.push({
          id: roomId,
          players: [
            { id: socket.id, name: nickname, lastScore: 0, totalScore: 0 }
          ],
          gamestate: 'GAME_WAITING',
          currentRound: 0,
          timer: 0,
          qna: getRandomQuestions([])
        })
      } else {
        // room exists
        rooms[index]['players'].push({ id: socket.id, name: nickname, lastScore: 0, totalScore: 0 })
      }
      socket.join(roomId)
      io.to(roomId).emit('updateRoom', rooms[index])
    })

    socket.on('disconnect', () => {
      // search through all rooms
      for (var i = 0; i < rooms.length; i++) {
        const index = rooms[i]['players'].findIndex(player => player.id === socket.id)
        if (index !== -1) {
          // if room contains player, remove
          rooms[i]['players'].splice(index, 1)
        }
        // update room with updated player list
        io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
      }
    })

    socket.on('startGame', ({ roomId }) => {
      const index = rooms.findIndex(room => room['id'] === roomId)
      if (index !== -1) {
        rooms[index]['currentRound'] += 1
        rooms[index]['gamestate'] = 'ROUND_LOADING'
        rooms[index]['timer'] = ROUND_LOADING_TIMER
        io.to(roomId).emit('updateRoom', rooms[index])
      }
    })

    socket.on('submitAnswer', ({ roomId }) => {
      const index = rooms.findIndex(room => room['id'] === roomId)
      if (index !== -1) {
        const i = rooms[index]['players'].findIndex(player => player['id'] === socket.id)
        if (i !== -1) {
          const score = rooms[index]['timer']
          rooms[index]['players'][i]['totalScore'] += score
          rooms[index]['players'][i]['lastScore'] = score
        }
      }
    })

    socket.on('playAgain', ({ roomId }) => {
      const index = rooms.findIndex(room => room['id'] === roomId)
      if(index !== -1) {
        rooms[index]['currentRound'] = 1
        rooms[index]['gamestate'] = 'ROUND_LOADING'
        rooms[index]['timer'] = ROUND_LOADING_TIMER
        rooms[index]['qna'] = getRandomQuestions(rooms[index]['qna']) // get new questions
        io.to(roomId).emit('updateRoom', rooms[index])
      }
    })
  })

  setInterval(() => {
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i]['timer'] > 0) {
        // decrement timer for all rooms with ongoing timers
        rooms[i]['timer']--
        io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
      } else {
        if (rooms[i]['gamestate'] === 'ROUND_LOADING') {
          // if ROUND_LOADING ended
          for (var j = 0; j < rooms[i]['players'].length; j++) {
            // reset lastScore values for all players
            rooms[i]['players'][j]['lastScore'] = 0
          }
          // transition to ROUND_ONGOING
          rooms[i]['gamestate'] = 'ROUND_ONGOING'
          rooms[i]['timer'] = ROUND_ONGOING_TIMER
          io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
        } else if (rooms[i]['gamestate'] === 'ROUND_ONGOING') {
          // if ROUND_ONGOING ended
          // transition to ROUND_ENDED
          rooms[i]['gamestate'] = 'ROUND_ENDED'
          rooms[i]['timer'] = ROUND_ENDED_TIMER
          io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
        } else if (rooms[i]['gamestate'] === 'ROUND_ENDED') {
          // if ROUND_ENDED ended
          if (rooms[i]['currentRound'] < MAX_ROUNDS) {
            // transition to next round if MAX_ROUNDS not reached
            rooms[i]['currentRound'] += 1
            rooms[i]['gamestate'] = 'ROUND_LOADING'
            rooms[i]['timer'] = ROUND_LOADING_TIMER
            io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
          } else {
            // transition to GAME_ENDED if MAX_ROUNDS reached
            rooms[i]['gamestate'] = 'GAME_ENDED'
            io.to(rooms[i]['id']).emit('updateRoom', rooms[i])
          }
        }
      }
    }
  }, 1000)
}