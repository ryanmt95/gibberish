import React from 'react'
import socketIOClient from 'socket.io-client'
const ENDPOINT = process.env.REACT_APP_BASE_URL || 'http://localhost:4000'


function startGame(roomId) {
  console.log(roomId)
  const socket = socketIOClient(ENDPOINT)
  socket.emit('startGame', {roomId})

  // api.post('/start_game', { roomId: roomId })
  //   .catch(err => alert(err))
}

function GameWaiting(props) {
  const {roomId, loaded, theme} = props
  return(
    <div>
      <h3 style={{margin: '30px'}}>Theme: {theme ? theme.toUpperCase() : 'Loading...'}</h3>
      <h5>Waiting for more players to join...</h5>
      <button disabled={!loaded} className="btn btn-success" onClick={() => startGame(roomId)}>Begin</button>
    </div>
  )
}

export default GameWaiting