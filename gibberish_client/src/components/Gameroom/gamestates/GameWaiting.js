import React from 'react'
import api from '../../../api/api'
import socketIOClient from 'socket.io-client'
const ENDPOINT = 'http://localhost:4000'


function startGame(roomId) {
  console.log(roomId)
  const socket = socketIOClient(ENDPOINT)
  socket.emit('startGame', {roomId})

  // api.post('/start_game', { roomId: roomId })
  //   .catch(err => alert(err))
}

function GameWaiting(props) {
  const {roomId, theme} = props
  return(
    <div>
      <h3 style={{margin: '30px'}}>Theme: {theme ? theme.toUpperCase() : 'Loading...'}</h3>
      <h5>Waiting for more players to join...</h5>
      <button className="btn btn-success" onClick={() => startGame(roomId)}>Begin</button>
    </div>
  )
}

export default GameWaiting