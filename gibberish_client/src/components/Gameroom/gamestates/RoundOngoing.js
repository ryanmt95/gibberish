import React from 'react'
import Timer from '../Timer'

function RoundOngoing(props) {
  const {transitionToState, nextState, updateScores, currentQuestion, currentAnswer } = props
  return(
    <div>
      <Timer 
        visible={true}
        transitionToState={transitionToState} 
        seconds={5} 
        nextState={nextState}
        updateScores={updateScores}/>
      <h2>{currentQuestion}</h2>
    </div>
  )
}

export default RoundOngoing