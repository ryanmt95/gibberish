import React from 'react'
import Timer from '../Timer'

function RoundEnded(props) {
  const { players, timeRemaining, currentAnswer} = props
  return(
    <div>
      <Timer
        visible={false}
        timeRemaining={timeRemaining}/>
      {players.map((item, index) => (
        <h5 key={index}>{item.playerName} <span className="text-success">+{item.lastScore}</span></h5>
      ))}
      <h2>{currentAnswer}</h2>
    </div>
  )
}

export default RoundEnded