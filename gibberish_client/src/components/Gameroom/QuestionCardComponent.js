import React from 'react'
import { gamestates } from './gamestates/GameStates'
import RoundLoading from './gamestates/RoundLoading'
import RoundOngoing from './gamestates/RoundOngoing'
import RoundEnded from './gamestates/RoundEnded'
import GameEnded from './gamestates/GameEnded'
import GameWaiting from './gamestates/GameWaiting'
import RoomDetailComponent from './RoomDetailComponent'

function QuestionCardComponent(props) {
  const { roomId, currentRound, maxRounds, gamestate, roundScores, players, startNextRound, transitionToState, updateScores, currentQuestion, currentAnswer  } = props

  let component
  if(gamestate === gamestates.ROUND_LOADING) {
    component = <RoundLoading 
                  transitionToState={transitionToState} 
                  nextState={gamestates.ROUND_ONGOING}/>
  } else if(gamestate === gamestates.ROUND_ONGOING) {
    component = <RoundOngoing 
                  transitionToState={transitionToState} 
                  nextState={gamestates.ROUND_ENDED}
                  updateScores={updateScores}
                  currentQuestion={currentQuestion} 
                  currentAnswer={currentAnswer} />
  } else if(gamestate === gamestates.ROUND_ENDED) {
    component = <RoundEnded 
                  transitionToState={transitionToState} 
                  nextState={gamestates.ROUND_LOADING}
                  startNextRound={startNextRound}
                  roundScores={roundScores}/>
  } else if(gamestate === gamestates.GAME_ENDED) {
    component = <GameEnded players={players}/>
  } else if(gamestate === gamestates.GAME_WAITING) {
    component = <GameWaiting 
                  transitionToState={transitionToState}
                  nextState={gamestates.ROUND_LOADING}/>
  }

  return(
    <div id="QuestionCardComponent">
      <RoomDetailComponent
        currentRound={currentRound}
        maxRounds={maxRounds}
        roomId={roomId}/>
      {component}
    </div>
  )
}

export default QuestionCardComponent