import React from 'react'
import api from '../../../api/api'

function startGame(roomId) {
  api.post('/start_game', {
    roomId: this.state.roomId
  })
  .then(res => {
    console.log(res)
  })
}

function GameWaiting(props) {
  const {roomId} = props
  return(
    <div>
      <h5>Waiting for more players to join...</h5>
      <button className="btn btn-success" onClick={() => startGame(roomId)}>Begin</button>
    </div>
  )
}

export default GameWaiting