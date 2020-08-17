import React from 'react'
import Timer from '../Timer'

function RoundEnded(props) {
  const { players, timeRemaining, currentAnswer } = props
  return (
    <div>
      <Timer
        visible={false}
        timeRemaining={timeRemaining} />
      {/* <div className="player_scores">
        {players.map((item, index) => (
          <h5 key={index}>{item.name} <span className="text-success">+{item.lastScore}</span></h5>
        ))}
      </div> */}
      <h2>{currentAnswer}</h2>
    </div>
  )
}

export default RoundEnded