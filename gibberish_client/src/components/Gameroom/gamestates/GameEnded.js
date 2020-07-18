import React from 'react'
import star_gold from '../../../assets/star_gold.png'
import star_silver from '../../../assets/star_silver.png'
import star_bronze from '../../../assets/star_bronze.png'

function GameEnded(props) {
  const {players} = props

  return(
    <div>
      <h3>Game Over</h3>
      <div className="d-flex justify-content-around align-items-center">
        {players.length > 1 ? (
          <div>
            <img id="star_silver" src={star_silver} alt="star_silver"/>
            <h5>{players[1].playerName}</h5>
          </div>
        ) : (null)}
        <div>
          <img id="star_gold" src={star_gold} alt="star_gold"/>
          <h5>{players[0].playerName}</h5>
        </div>
        {players.length > 2 ? (
          <div>
            <img id="star_bronze" src={star_bronze} alt="star_bronze"/>
            <h5>{players[2].playerName}</h5>
          </div>
        ) : (null)}
      </div>
    </div>
  )
}

export default GameEnded