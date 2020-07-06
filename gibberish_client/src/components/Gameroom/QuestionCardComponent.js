import React from 'react'
import Timer from './Timer'
import { gamestates } from './GameStates'

function QuestionCardComponent(props) {

  let message
  if(props.gamestate === gamestates.ROUND_LOADING) {
    message = <h5 className="mt-4">round is starting...</h5>
  } else if(props.gamestate === gamestates.ROUND_ONGOING) {
    message = <h2 className="mt-4">veer off mess sing oat</h2>
  }

  return(
    <div id="QuestionCardComponent">
      <h3><strong>Round {props.currentRound}/{props.maxRounds}</strong></h3>
      <Timer 
        gamestate={props.gamestate}
        startNextRound={props.startNextRound}
        currentRound={props.currentRound}
        maxRounds={props.maxRounds}
        timePerRound={props.timePerRound}
        transitionToState={props.transitionToState}
        updateScores={props.updateScores}/>
      {message}
    </div>
  )
}

export default QuestionCardComponent