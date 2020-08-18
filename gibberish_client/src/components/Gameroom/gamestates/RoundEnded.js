import React from 'react'
import Timer from '../Timer'

function RoundEnded(props) {
  const { timeRemaining, currentAnswer } = props
  return (
    <div>
      <Timer
        visible={false}
        timeRemaining={timeRemaining} />
      <h2>{currentAnswer}</h2>
    </div>
  )
}

export default RoundEnded