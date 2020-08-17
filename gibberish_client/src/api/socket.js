import socketIOClient from 'socket.io-client'
const ENDPOINT = process.env.REACT_APP_BASE_URL || 'http://localhost:4000'
const socket = socketIOClient(ENDPOINT)

export class Socket {
  static joinRoom(nickname, roomId) {
    return socket.emit('joinRoom', {nickname, roomId})
  }
  static startGame(roomId) {
    return socket.emit('startGame', {roomId})
  }
  static watchErrors(callback) {
    return socket.on('err', callback)
  }
  static watchUpdates(callback) {
    return socket.on('updateRoom', callback)
  }
  static watchChat(callback) {
    return socket.on('updateChat', callback)
  }
  static playAgain(roomId) {
    return socket.emit('playAgain', {roomId})
  }
  static submitAnswer(roomId) {
    return socket.emit('submitAnswer', {roomId})
  }
  static sendMessage(roomId, message, senderName) {
    return socket.emit('sendMessage', {roomId, message, senderName})
  }
}