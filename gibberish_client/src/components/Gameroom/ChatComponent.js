import React, {useState, useEffect} from 'react'
import { Socket } from '../../api/socket'

function sendText(e, roomId, message, senderName, setmessage) {
  e.preventDefault()
  Socket.sendMessage(roomId, message, senderName)
  setmessage("")
}

function onMessageFieldChanged(e, setmessage) {
  setmessage(e.target.value)
}

function ChatComponent(props) {
  const {roomId, nickname} = props
  const [message, setmessage] = useState("")
  const [chat, setchat] = useState([])
  useEffect(() => {
    Socket.watchChat(message => {
      setchat(old => [...old, message])
    })
    return 
  }, [chat])
  return(
    <div className='tile'>
      <form onSubmit={e => sendText(e, roomId, message, nickname, setmessage)}>
        <div className="input-group">
          <input type="text" class='form-control' value={message} onChange={e => onMessageFieldChanged(e, setmessage)}/>
          <div className="input-group-append">
            <button className="btn btn-success" type='submit'>Send</button>
          </div>
        </div>
      </form>
      {chat.map((item, index) => (
        <div>
          <strong>{item.senderName}: </strong>
          <span>{item.message}</span>
        </div>
      ))}
    </div>
  )
}

export default ChatComponent