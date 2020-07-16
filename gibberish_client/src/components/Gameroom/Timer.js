import React from 'react'

function Timer(props) {
  const {timeRemaining } = props
  return(
    <div id="timer" style={{display: `${props.visible ? 'block' : 'none'}`}}>
      <h3>{timeRemaining}</h3>
    </div>
  )
}

export default Timer