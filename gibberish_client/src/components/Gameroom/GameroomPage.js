import React from 'react'
import socketIOClient from 'socket.io-client'
import PlayerListComponent from './PlayerListComponent'
import PlayerAnswerComponent from './PlayerAnswerComponent'
import QuestionCardComponent from './QuestionCardComponent'
import { gamestates } from './gamestates/GameStates'
import API from '../../api/api'
const ENDPOINT = 'http://localhost:4000'

class GameroomPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			gamestate: gamestates.GAME_WAITING,
			currentRound: 0,
			players: [],
			qna: [],
			userAnswer: '',
			timeRemaining: 0,
			helpText: '',
			userAnswered: false
		}
	}

	componentDidMount() {
		const {nickname, roomId} = this.props
		this.socket = socketIOClient(ENDPOINT)
		this.socket.emit('joinRoom', {nickname, roomId})
		this.socket.on('err', message => {
			alert(message)
			this.props.toJoinroomPage()
		})
		this.socket.on('updateRoom', message => {
			const {currentRound, gameState, players, qna, roomId, timer} = message
			var {userAnswered, userAnswer, helpText} = this.state
			if(gameState === gamestates.ROUND_LOADING) {
				userAnswered = false
				userAnswer = ''
			} else if(gameState === gamestates.ROUND_ENDED) {
				userAnswered = true
				userAnswer = ''
				helpText = ''
			}
			this.props.updateRoomId(roomId)
			this.setState({
				currentRound,
				gamestate: gameState, 
				players, 
				qna,
				timeRemaining: timer,
				userAnswer,
				userAnswered,
				helpText
			})
		})
	}

	submitAnswer = e => {
		e.preventDefault()
		const { gamestate, userAnswered } = this.state
		if(gamestate === gamestates.ROUND_ONGOING && !userAnswered) {
			const { userAnswer, currentRound, qna } = this.state
			const { roomId } = this.props
			const currentAnswer = qna[currentRound-1]['answer']
			if(currentAnswer.toLowerCase() === userAnswer.toLowerCase()) {
				this.setState({helpText: 'Correct!', userAnswer: '', userAnswered: true}, () => {
					this.socket.emit('submitAnswer', {roomId})
				})
			} else {
				this.setState({helpText: 'Please try again!', userAnswer: ''})
			}
		}
	}

	onAnswerFieldChanged = event => {
		this.setState({ userAnswer: event.target.value})
	}

	handlePlayAgain = e => {
		e.preventDefault()
		const {roomId} = this.props
		this.socket.emit('playAgain', {roomId})
	}

	render() {
		const { gamestate, currentRound, players, qna, userAnswer, timeRemaining, helpText, userAnswered } = this.state
		const { nickname, roomId } = this.props
		return (
			<div className="container">
				<div className="grid">
					<a href='/' className='h3 title'>Guess The Gibberish</a>
					<div className="row header">
						<div id="header" className="col tile">
							<QuestionCardComponent 
								roomId={roomId}
								currentRound={currentRound}
								gamestate={gamestate}
								players={players}
								startNextRound={this.startNextRound}
								transitionToState={this.transitionToState}
								updateScores={this.updateScores}
								qna={qna}
								timeRemaining={timeRemaining}/>
						</div>
					</div>

					<div className="row">
						<div id="left" className="col tile">
							<PlayerListComponent 
								players={players} 
								myID={nickname}/>
						</div>
						
						<div id="right" className="col tile">
							<PlayerAnswerComponent
								gamestate={gamestate}
								userAnswer={userAnswer}
								helpText={helpText}
								userAnswered={userAnswered}
								onAnswerFieldChanged={this.onAnswerFieldChanged}
								submitAnswer={this.submitAnswer}
								handlePlayAgain={this.handlePlayAgain}/>
						</div>
					</div>
				</div>
				
			</div>
		)
	}
}

export default GameroomPage