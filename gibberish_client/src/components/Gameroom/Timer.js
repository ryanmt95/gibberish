import React, { useState, useEffect } from 'react'

function Timer() {
  const [counter, setCounter] = useState(25)
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
    return () => clearInterval(timer);
  }, [counter])
  return(
    <div id="timer">
      <h3>{counter}</h3>
    </div>
  )
}

export default Timer