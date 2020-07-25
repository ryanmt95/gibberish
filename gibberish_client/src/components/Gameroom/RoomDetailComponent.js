import React from 'react'

function RoomDetailComponent(props) {
  const {roomId, currentRound} = props
  return(
    <div>
      <h5 className="text-left">RoomID: {roomId}</h5>
      <h3><strong>Round {currentRound}/5</strong></h3>
    </div>
  )
}

export default RoomDetailComponent