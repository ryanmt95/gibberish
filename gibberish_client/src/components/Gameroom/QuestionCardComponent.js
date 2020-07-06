import React from 'react'
import { gamestates } from './gamestates/GameStates'
import RoundLoading from './gamestates/RoundLoading'
import RoundOngoing from './gamestates/RoundOngoing'
import RoundEnded from './gamestates/RoundEnded'
import GameEnded from './gamestates/GameEnded'
import GameWaiting from './gamestates/GameWaiting'

function QuestionCardComponent(props) {

  let component
  if(props.gamestate === gamestates.ROUND_LOADING) {
    component = <RoundLoading 
                  transitionToState={props.transitionToState} 
                  nextState={gamestates.ROUND_ONGOING}/>
  } else if(props.gamestate === gamestates.ROUND_ONGOING) {
    component = <RoundOngoing 
                  transitionToState={props.transitionToState} 
                  nextState={gamestates.ROUND_ENDED}
                  updateScores={props.updateScores}/>
  } else if(props.gamestate === gamestates.ROUND_ENDED) {
    component = <RoundEnded 
                  transitionToState={props.transitionToState} 
                  nextState={gamestates.ROUND_LOADING}
                  startNextRound={props.startNextRound}
                  roundScores={props.roundScores}
                  />
  } else if(props.gamestate === gamestates.GAME_ENDED) {
    component = <GameEnded/>
  } else if(props.gamestate === gamestates.GAME_WAITING) {
    component = <GameWaiting 
                  transitionToState={props.transitionToState}
                  nextState={gamestates.ROUND_LOADING}/>
  }

  return(
    <div id="QuestionCardComponent">
      <h3><strong>Round {props.currentRound}/{props.maxRounds}</strong></h3>

      {/* <Timer 
        gamestate={props.gamestate}
        startNextRound={props.startNextRound}
        currentRound={props.currentRound}
        maxRounds={props.maxRounds}
        timePerRound={props.timePerRound}
        transitionToState={props.transitionToState}
        updateScores={props.updateScores}/> */}
      {component}
    </div>
  )
}

export default QuestionCardComponent