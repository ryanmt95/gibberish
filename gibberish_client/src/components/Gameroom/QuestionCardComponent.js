import React from 'react'
import { gamestates } from './gamestates/GameStates'
import RoundLoading from './gamestates/RoundLoading'
import RoundOngoing from './gamestates/RoundOngoing'
import RoundEnded from './gamestates/RoundEnded'
import GameEnded from './gamestates/GameEnded'
import GameWaiting from './gamestates/GameWaiting'
import RoomDetailComponent from './RoomDetailComponent'

function QuestionCardComponent(props) {
  const { loaded, roomId, currentRound, gamestate, players, updateScores, qna, theme, timeRemaining  } = props

  let component
  if(gamestate === gamestates.ROUND_LOADING) {
    component = <RoundLoading 
                  timeRemaining={timeRemaining}/>
  } else if(gamestate === gamestates.ROUND_ONGOING) {
    component = <RoundOngoing 
                  updateScores={updateScores}
                  currentQuestion={qna[currentRound-1]['question']} 
                  timeRemaining={timeRemaining}
                  hint={qna[currentRound-1]['hint']}/>
  } else if(gamestate === gamestates.ROUND_ENDED) {
    component = <RoundEnded 
                  timeRemaining={timeRemaining}
                  currentAnswer={qna[currentRound-1]['answer']}/>
  } else if(gamestate === gamestates.GAME_ENDED) {
    component = <GameEnded players={players} roomId={roomId}/>
  } else if(gamestate === gamestates.GAME_WAITING) {
    component = <GameWaiting 
                  roomId={roomId}
                  theme={theme}
                  loaded={loaded}/>
  }

  return(
    <div id="QuestionCardComponent" className='tile'>
      <RoomDetailComponent
        currentRound={currentRound}
        roomId={roomId}
        loaded={loaded}
        gamestate={gamestate}
        theme={theme}/>
      {component}
    </div>
  )
}

export default QuestionCardComponent