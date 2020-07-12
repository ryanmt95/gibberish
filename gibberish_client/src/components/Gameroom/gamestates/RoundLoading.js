import React from 'react'
import Timer from '../Timer'

function RoundLoading(props) {
  const {transitionToState, nextState, timeRemaining, setTimeRemaining} = props
  return(
    <div>
      <Timer 
        visible={true}
        transitionToState={transitionToState} 
        seconds={3} 
        nextState={nextState}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}/>
      <h5>Round is starting...</h5>
    </div>
  )
}

export default RoundLoading