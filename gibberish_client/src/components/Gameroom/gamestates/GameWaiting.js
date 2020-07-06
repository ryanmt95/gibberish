import React from 'react'

function GameWaiting(props) {
  return(
    <div>
      <h5>Waiting for more players to join...</h5>
      <button className="btn btn-success" onClick={() => props.transitionToState(props.nextState)}>Begin</button>
    </div>
  )
}

export default GameWaiting