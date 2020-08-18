import React from 'react'
import star_gold from '../../../assets/star_gold.png'
import star_silver from '../../../assets/star_silver.png'
import star_bronze from '../../../assets/star_bronze.png'
import { Socket } from '../../../api/socket'

function GameEnded(props) {
  const {players, roomId} = props

  return(
    <div>
      <button className="btn btn-success" onClick={() => Socket.playAgain(roomId)}>Play Again!</button>
      <div className="d-flex justify-content-around align-items-center">
        {players.length > 1 ? (
          <div>
            <img id="star_silver" src={star_silver} alt="star_silver"/>
            <h5>{players[1].name}</h5>
          </div>
        ) : (null)}
        <div>
          <img id="star_gold" src={star_gold} alt="star_gold"/>
          <h5>{players[0].name}</h5>
        </div>
        {players.length > 2 ? (
          <div>
            <img id="star_bronze" src={star_bronze} alt="star_bronze"/>
            <h5>{players[2].name}</h5>
          </div>
        ) : (null)}
      </div>
    </div>
  )
}

export default GameEnded