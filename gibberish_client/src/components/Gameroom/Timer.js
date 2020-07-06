import React, { useState, useEffect } from 'react'

function Timer(props) {
  const [counter, setCounter] = useState(props.seconds)
  useEffect(() => {
    if(counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000)
    } else {
      props.transitionToState(props.nextState)
      if(props.startNextRound) {
        props.startNextRound()
      }
      if(props.updateScores) {
        props.updateScores()
      }
      
    }
  }, [counter, props])
  return(
    <div id="timer" style={{display: `${props.visible ? 'block' : 'none'}`}}>
      <h3>{counter}</h3>
    </div>
  )
}

export default Timer