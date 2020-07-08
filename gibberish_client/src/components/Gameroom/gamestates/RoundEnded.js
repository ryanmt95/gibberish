import React from 'react'
import Timer from '../Timer'

function RoundEnded(props) {
  const {transitionToState, nextState, startNextRound, roundScores} = props
  return(
    <div>
      <Timer
        visible={false}
        transitionToState={transitionToState} 
        seconds={5} 
        nextState={nextState} 
        startNextRound={startNextRound}/>
      {roundScores.sort((a,b) => (a.points < b.points) ? 1 : -1).map((item, index) => (
        <h5 key={index}>{item.name} <span className="text-success">+{item.points}</span></h5>
      ))}
    </div>
  )
}

export default RoundEnded