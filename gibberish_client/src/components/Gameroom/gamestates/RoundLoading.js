import React from 'react'
import Timer from '../Timer'

function RoundLoading(props) {
  return(
    <div>
      <Timer 
        visible={true}
        transitionToState={props.transitionToState} 
        seconds={3} 
        nextState={props.nextState}/>
      <h5>Round is starting...</h5>
    </div>
  )
}

export default RoundLoading