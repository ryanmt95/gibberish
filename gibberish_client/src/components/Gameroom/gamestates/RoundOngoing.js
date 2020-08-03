import React from 'react'
import Timer from '../Timer'

function RoundOngoing(props) {
  const {transitionToState, nextState, updateScores, currentQuestion, timeRemaining, setTimeRemaining, hint} = props
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
      {timeRemaining < 15 && hint && <h5>{hint}</h5>}
    </div>
  )
}

export default RoundOngoing