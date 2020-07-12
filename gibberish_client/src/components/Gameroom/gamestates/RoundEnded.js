import React from 'react'
import Timer from '../Timer'

function RoundEnded(props) {
  const {transitionToState, nextState, startNextRound, roundScores, timeRemaining, setTimeRemaining, currentAnswer} = props
  return(
    <div>
      <Timer
        visible={false}
        transitionToState={transitionToState} 
        seconds={5} 
        nextState={nextState} 
        startNextRound={startNextRound}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}/>
      {roundScores.map((item, index) => (
        <h5 key={index}>{item.name} <span className="text-success">+{item.points}</span></h5>
      ))}
      <h2>{currentAnswer}</h2>
    </div>
  )
}

export default RoundEnded