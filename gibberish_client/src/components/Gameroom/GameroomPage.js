import React from 'react'
import PlayerListComponent from './PlayerListComponent'
import PlayerAnswerComponent from './PlayerAnswerComponent'
import QuestionCardComponent from './QuestionCardComponent'
import { gamestates } from './gamestates/GameStates'
import ChatComponent from './ChatComponent'
import { Socket } from '../../api/socket'

class GameroomPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			gamestate: gamestates.GAME_WAITING,
			currentRound: 0,
			players: [],
			qna: [],
			theme: '',
			userAnswer: '',
			timeRemaining: 0,
			helpText: '',
			userAnswered: false,
			loaded: false,
			chat: []
		}
	}

	componentDidMount() {
		const { nickname, roomId } = this.props
		Socket.joinRoom(nickname, roomId)
		Socket.watchErrors(message => {
			alert(message)
			this.props.toJoinroomPage()
		})
		Socket.watchUpdates(message => {
			const { currentRound, gameState, players, qna, theme, roomId, timer, chat } = message
			var { userAnswered, userAnswer, helpText } = this.state
			if (gameState === gamestates.ROUND_LOADING) {
				userAnswered = false
				userAnswer = ''
			} else if (gameState === gamestates.ROUND_ENDED) {
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
				theme,
				chat,
				timeRemaining: timer,
				userAnswer,
				userAnswered,
				helpText,
				loaded: true
			})
		})
	}

	submitAnswer = e => {
		e.preventDefault()
		const { gamestate, userAnswered } = this.state
		if (gamestate === gamestates.ROUND_ONGOING && !userAnswered) {
			const { userAnswer, currentRound, qna } = this.state
			const { roomId } = this.props
			const currentAnswer = qna[currentRound - 1]['answer']
			if (currentAnswer.toLowerCase() === userAnswer.toLowerCase()) {
				this.setState({ helpText: 'Correct!', userAnswer: '', userAnswered: true }, () => {
					Socket.submitAnswer(roomId)
				})
			} else {
				this.setState({ helpText: 'Please try again!', userAnswer: '' })
			}
		}
	}

	onAnswerFieldChanged = event => {
		this.setState({ userAnswer: event.target.value })
	}

	handlePlayAgain = e => {
		e.preventDefault()
		const { roomId } = this.props
		Socket.playAgain(roomId)
	}

	render() {
		const { loaded, gamestate, currentRound, players, qna, theme, chat, userAnswer, timeRemaining, helpText, userAnswered } = this.state
		const { nickname, roomId } = this.props
		return (
			<div className="container">
				<div className="grid">
					<a href='/' className='h3 title'>Guess The Gibberish</a>
					<div className="row">
						<div className="col">
							<QuestionCardComponent
								roomId={roomId}
								currentRound={currentRound}
								gamestate={gamestate}
								players={players}
								qna={qna}
								theme={theme}
								timeRemaining={timeRemaining}
								loaded={loaded} />
						</div>
					</div>

					<div className="row">
						<div className="col-12 col-md-6 order-12 order-md-1">
							<PlayerListComponent
								players={players}
								myID={nickname} />
						</div>
						<div className="col-12 col-md-6 order-1 order-md-12">
							<ChatComponent 
								roomId={roomId} 
								chat={chat} 
								nickname={nickname} 
								currentRound={currentRound}
								qna={qna}
								gamestate={gamestate}/>
						</div>
					</div>
				</div>

			</div>
		)
	}
}

export default GameroomPage