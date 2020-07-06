import React from 'react'
import Timer from '../Timer'

function RoundOngoing(props) {
  return(
    <div>
      <Timer 
        visible={true}
        transitionToState={props.transitionToState} 
        seconds={5} 
        nextState={props.nextState}
        updateScores={props.updateScores}/>
      <h2>veer off mess sing oat</h2>
    </div>
  )
}

export default RoundOngoing