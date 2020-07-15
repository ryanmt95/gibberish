import React from 'react'
import api from '../../../api/api'

function startGame(roomId) {
  console.log(roomId)
  api.post('/start_game', { roomId: roomId })
  .then(res => {
    console.log(res)
  })
}

function GameWaiting(props) {
  const {nextState, transitionToState, roomId} = props
  return(
    <div>
      <h5>Waiting for more players to join...</h5>
      <button className="btn btn-success" onClick={() => startGame(roomId)}>Begin</button>
    </div>
  )
}

export default GameWaiting