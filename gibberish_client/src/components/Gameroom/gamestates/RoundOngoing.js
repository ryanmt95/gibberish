import React from 'react'
import Timer from '../Timer'

function RoundOngoing(props) {
  const {transitionToState, nextState, updateScores} = props
  return(
    <div>
      <Timer 
        visible={true}
        transitionToState={transitionToState} 
        seconds={5} 
        nextState={nextState}
        updateScores={updateScores}/>
      <h2>veer off mess sing oat</h2>
    </div>
  )
}

export default RoundOngoing