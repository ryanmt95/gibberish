import React from 'react'
import Timer from '../Timer'
import mockqna from '../../../assets/mockqna'


function RoundOngoing(props) {
  const {transitionToState, nextState, updateScores} = props
  return(
    <div>
      <Timer 
        visible={true}
        transitionToState={transitionToState} 
        seconds={5} 
        nextState={nextState}
        updateScores={updateScores}/>
      <h2>{mockqna[Math.floor(Math.random() * mockqna.length)].question}</h2>
    </div>
  )
}

export default RoundOngoing