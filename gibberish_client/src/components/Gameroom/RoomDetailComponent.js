import React from 'react'
import { gamestates } from './gamestates/GameStates'

function RoomDetailComponent(props) {
  const {loaded, roomId, currentRound, gamestate, theme} = props
  return(
    <div>
      <h5 className="text-left">RoomID: {loaded ? roomId : 'Loading...'}</h5>
      {gamestate !== gamestates.GAME_WAITING && <h5 className="text-left">Theme: {loaded ? theme.toUpperCase() : 'Loading...'}</h5>}
      <h3><strong>Round {currentRound}/5</strong></h3>
    </div>
  )
}

export default RoomDetailComponent