import React from 'react'

function GameWaiting(props) {
  const {transitionToState, nextState} = props
  return(
    <div>
      <h5>Waiting for more players to join...</h5>
      <button className="btn btn-success" onClick={() => transitionToState(nextState)}>Begin</button>
    </div>
  )
}

export default GameWaiting