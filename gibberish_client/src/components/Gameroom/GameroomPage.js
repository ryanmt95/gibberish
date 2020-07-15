import React from 'react'
import PlayerListComponent from './PlayerListComponent'
import PlayerAnswerComponent from './PlayerAnswerComponent'
import QuestionCardComponent from './QuestionCardComponent'
import { gamestates } from './gamestates/GameStates'
import { mockqna } from '../../assets/mockqna'
import API from '../../api/api'

class GameroomPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			roomId: props.match.params.id,
			gamestate: gamestates.GAME_WAITING,
			currentRound: 1,
			players: [],
			roundScores: [],
			qna: [],
			currentQuestion: '',
			currentAnswer: '', 
			userAnswer: '',
			timeRemaining: 0,
			helpText: '',
		}
	}

	componentDidMount() {
		this.getQuestion();
		const {roomId} = this.state
		this.timer = setInterval(() => this.getRoomData(roomId), 1000)
	}

	componentWillUnmount() {
		this.timer = null
	}

	getRoomData(roomId) {
		API.get(`/room/${roomId}`)
			.then(res => {
				this.parseRoomData(res.data)
			})
	}

	parseRoomData(data) {
		const {roomId, gameState, currentRound, players, timer, qna} = data 
		let timeleft
		if(gameState == gamestates.ROUND_LOADING) {
			timeleft = 3-timer
		} else if(gameState == gamestates.ROUND_ONGOING) {
			timeleft = 10 - timer
		} else if(gameState == gamestates.ROUND_ENDED) {
			timeleft = 5 - timer
		}
		const playersSorted = players.sort((a,b) => {
			if(a.totalScore < b.totalScore) {
				return 1
			} else if(a.totalScore > b.totalScore) {
				return -1
			} else {
				return a.playerName < b.playerName ? 1 : -1
			}
		})

		this.setState({
			players: playersSorted,
			gamestate: gameState, 
			currentRound: currentRound,
			timeRemaining: timeleft, 
			qna: qna
		})
	}

	getQuestion = () => {
		// API.get('/question')
		// .then(res => {
		// 	this.setState({ currentQuestion: res.data.question, currentAnswer: res.data.answer })
		// })
		let rand = Math.floor(Math.random() * mockqna.length)
		let qna = mockqna[rand]
		this.setState({currentQuestion: qna['question'], currentAnswer: qna['answer']})
	}

	submitAnswer = e => {
		e.preventDefault()
		const { userAnswer, timeRemaining, currentRound, roomId, qna } = this.state
		const currentAnswer = qna[currentRound-1]['answer']
		if(currentAnswer === userAnswer) {
			this.setState({helpText: 'Correct!', userAnswer: ''}, () => {
				API.post('/submit_answer', {
					roomId: roomId,
					nickname: this.props.nickname,
					score: timeRemaining
				}).then(res => {
					console.log(res.data)
					this.parseRoomData(res.data)
				})
			})
			// API.post('/submit_answer', {
			// 	roomId: roomId, 
			// 	nickname: this.props.nickname
			// }).then(res => console.log(res))
		} else {
			this.setState({helpText: 'Please try again!', userAnswer: ''})
		}
	}

	startNextRound = () => {
		if(this.state.currentRound < this.state.maxRounds) {
			this.setState({currentRound: this.state.currentRound + 1})
		} else {
			this.transitionToState(gamestates.GAME_ENDED)
		}
		this.getQuestion()
	}

	transitionToState = (newState) => {
		if (newState === gamestates.ROUND_LOADING) {
			this.setState({gamestate: newState, timeRemaining: 3, helpText: '', userAnswer: ''})
		} else if(newState === gamestates.ROUND_ONGOING) {
			this.setState({gamestate: newState, timeRemaining: 25, helpText: '', userAnswer: ''})
		} else if(newState === gamestates.ROUND_ENDED) {
			this.setState({gamestate: newState, timeRemaining: 5, helpText: '', userAnswer: ''})
		} else {
			this.setState({gamestate: newState, helpText: '', userAnswer: ''})
		}
	}

	updateScores = (userScore = 0) => {
		let roundScore = []
		let players = this.state.players.map(player => {
			let score = Math.floor(Math.random() * 25)
			if(player['name'] === this.props.nickname) {
				score = userScore
			}
			roundScore.push({name: player.name, points: score})
			player.points += score
			return player
		}).sort((a,b) => (a.points < b.points) ? 1 : -1)
		roundScore = roundScore.sort((a,b) => (a.points < b.points) ? 1 : -1)
		this.setState({players: players, roundScores: roundScore})
	}

	onAnswerFieldChanged = event => {
		this.setState({ userAnswer: event.target.value})
	}

	render() {
		const { roomId, gamestate, currentRound, maxRounds, players, roundScores, qna, userAnswer, timeRemaining, helpText } = this.state
		const { nickname } = this.props
		return (
			<div className="container">
				<div className="grid">
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
								onAnswerFieldChanged={this.onAnswerFieldChanged}
								submitAnswer={this.submitAnswer}/>
						</div>
					</div>
				</div>
				
			</div>
		)
	}
}

export default GameroomPage