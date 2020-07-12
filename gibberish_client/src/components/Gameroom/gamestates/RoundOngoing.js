import React from 'react'
import Timer from '../Timer'

function RoundOngoing(props) {
  const {transitionToState, nextState, updateScores, currentQuestion, timeRemaining, setTimeRemaining } = props
  return(
    <div>
      <Timer 
        visible={true}
        transitionToState={transitionToState} 
        seconds={25} 
        nextState={nextState}
        updateScores={updateScores}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}/>
      <h2>{currentQuestion}</h2>
    </div>
  )
}

export default RoundOngoing