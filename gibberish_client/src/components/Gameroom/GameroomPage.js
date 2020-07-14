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
			maxRounds: 5,
			players: [
				{name: this.props.nickname, points: 0},
				{name: "gibberish gary", points: 0},
				{name: "nonsensical nick", points: 0},
				{name: "blah blah brenda ", points: 0},
			],
			roundScores: [],
			currentQuestion: '',
			currentAnswer: '', 
			userAnswer: '',
			timeRemaining: 0,
			helpText: ''
		}
	}

	componentDidMount() {
		this.getQuestion();
	}

	setTimeRemaining = (time) => {
		this.setState({timeRemaining: time})
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

	getRoomDetails = () => {
		API.get('/room/' + this.state.roomId)
		.then(res => {
			this.setState({ 
				gamestate: res.data.gameState, 
				currentRound: res.data.currentRound, 
				players: res.data.players
			})
		})
	}

	submitAnswer = e => {
		e.preventDefault()
		const {currentAnswer, userAnswer, timeRemaining} = this.state
		if(currentAnswer === userAnswer) {
			this.setState({helpText: 'Correct!', userAnswer: ''}, () => {
				this.transitionToState(gamestates.ROUND_ENDED)
				this.updateScores(timeRemaining)
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
		const { roomId, gamestate, currentRound, maxRounds, players, roundScores, currentQuestion, currentAnswer, userAnswer, timeRemaining, helpText } = this.state
		const { nickname } = this.props
		return (
			<div className="container">
				<div className="grid">
					<div className="row header">
						<div id="header" className="col tile">
							<QuestionCardComponent 
								roomId={roomId}
								currentRound={currentRound}
								maxRounds={maxRounds}
								gamestate={gamestate}
								roundScores={roundScores}
								players={players}
								startNextRound={this.startNextRound}
								transitionToState={this.transitionToState}
								updateScores={this.updateScores}
								currentQuestion={currentQuestion}
								currentAnswer={currentAnswer}
								timeRemaining={timeRemaining}
								setTimeRemaining={this.setTimeRemaining}/>
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