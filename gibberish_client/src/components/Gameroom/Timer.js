import React, { useState, useEffect } from 'react'
import { gamestates } from './GameStates'

function Timer(props) {
  const [counter, setCounter] = useState(3)
  useEffect(() => {
    if(counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000)
    } else {
      if(props.gamestate === gamestates.ROUND_LOADING) {
        props.transitionToState(gamestates.ROUND_ONGOING)
        setCounter(props.timePerRound)
      } else if(props.gamestate === gamestates.ROUND_ONGOING) {
        if(props.currentRound < props.maxRounds) {
          props.transitionToState(gamestates.ROUND_LOADING)
          props.startNextRound()
          props.updateScores()
          setCounter(3)
        }
      }
    }
  }, [counter, props])
  return(
    <div id="timer">
      <h3>{counter}</h3>
    </div>
  )
}

export default Timer