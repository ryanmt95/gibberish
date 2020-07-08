import React from 'react'
import Timer from '../Timer'

function RoundLoading(props) {
  const {transitionToState, nextState} = props
  return(
    <div>
      <Timer 
        visible={true}
        transitionToState={transitionToState} 
        seconds={3} 
        nextState={nextState}/>
      <h5>Round is starting...</h5>
    </div>
  )
}

export default RoundLoading