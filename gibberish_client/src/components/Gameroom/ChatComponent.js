import React, { useState, useEffect, useRef } from 'react'
import { Socket } from '../../api/socket'

function sendText(e, roomId, message, senderName, gamestate, qna, currentRound, setmessage) {
  e.preventDefault()
  if(message !== "") {
    if(gamestate === 'ROUND_ONGOING') {
      const answer = qna[currentRound - 1]['answer']
      if(message.toLowerCase() === answer.toLowerCase()) {
        Socket.submitAnswer(roomId)
        setmessage("")
      } else {
        Socket.sendMessage(roomId, message, senderName)
        setmessage("")
      }
    } else {
      Socket.sendMessage(roomId, message, senderName)
      setmessage("")
    }
    
  }
}

function onMessageFieldChanged(e, setmessage) {
  setmessage(e.target.value)
}

function ChatComponent(props) {
  const { roomId, nickname, gamestate, qna, currentRound } = props
  const [message, setmessage] = useState("")
  const [chat, setchat] = useState([])
  const messagesEndRef = useRef(null)
  useEffect(() => {
    Socket.watchChat(message => {
      setchat(prev => [...prev, message])
      messagesEndRef.current.scrollIntoView({ behavior: "smooth"})
    })
    return
  }, [])
  return (
    <div className='tile'>
      <div style={{ height: '240px', overflowY: 'scroll', backgroundColor: 'white', padding: '8px'}}>
        {chat.map((item, index) => {
          if(item.senderName === "") {
            return (
              <div key={index}>
                <strong style={{color: 'green'}}>{item.message}</strong>
              </div>
            )
          } else {
            return (
              <div key={index}>
                <strong>{item.senderName}: </strong>
                <span>{item.message}</span>
              </div>
            )
          }
        })}
        <div ref={messagesEndRef}></div>
      </div>
      <form onSubmit={e => sendText(e, roomId, message, nickname, gamestate, qna, currentRound, setmessage)}>
        <div className="input-group">
          <input type="text" className='form-control' value={message} onChange={e => onMessageFieldChanged(e, setmessage)} />
          <div className="input-group-append">
            <button className="btn btn-success" type='submit'>Send</button>
          </div>
        </div>
      </form>

    </div>
  )
}

export default ChatComponent