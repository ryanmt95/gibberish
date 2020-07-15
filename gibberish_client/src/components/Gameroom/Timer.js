import React, { useState, useEffect } from 'react'

function Timer(props) {
  // const [counter, setCounter] = useState(props.seconds)
  const {timeRemaining, setTimeRemaining, startNextRound, updateScores, transitionToState} = props
  // useEffect(() => {
  //   var timer
  //   if(timeRemaining > 0) {
  //     timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
  //   } else {
  //     // timer ended
  //     transitionToState(props.nextState)
  //     if(startNextRound) {
  //       startNextRound()
  //     }
  //     if(updateScores) {
  //       updateScores()
  //     }
  //   }
  //   return () => clearTimeout(timer)
  // }, [timeRemaining, setTimeRemaining, startNextRound, updateScores, transitionToState])
  return(
    <div id="timer" style={{display: `${props.visible ? 'block' : 'none'}`}}>
      <h3>{timeRemaining}</h3>
    </div>
  )
}

export default Timer