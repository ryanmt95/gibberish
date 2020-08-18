import React from 'react'
import { Socket } from '../../../api/socket'

function startGame(roomId) {
  Socket.startGame(roomId)
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