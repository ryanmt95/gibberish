import React from 'react'
import {Link} from 'react-router-dom'
import PlayerListComponent from './PlayerListComponent'
import PlayerAnswerComponent from './PlayerAnswerComponent'
import QuestionCardComponent from './QuestionCardComponent'
import { gamestates } from './gamestates/GameStates'
import API from '../../api/api'

const ROUND_LOADING_TIME = 3
const ROUND_ONGOING_TIME = 10
const ROUND_ENDED_TIME = 5

class GameroomPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			roomId: props.match.params.id,
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
		const {roomId} = this.state
		this.getRoomQna(roomId)
		this.timer = setInterval(() => this.getRoomData(roomId), 500)
	}

	componentWillUnmount() {
		clearInterval(this.timer)
	}

	getRoomQna(roomId) {
		API.get(`/qna/${roomId}`)
			.then(res => {
				this.setState({qna: res.data.qna})
			})
	}

	getRoomData(roomId) {
		API.get(`/room/${roomId}`)
			.then(res => {
				this.parseRoomData(res.data)
			})
	}

	parseRoomData(data) {
		const { state, round, players, timer } = data 
		let timeleft
		let { helpText, userAnswered } = this.state
		if(state === gamestates.ROUND_LOADING) {
			timeleft = ROUND_LOADING_TIME - timer
			helpText = ''
			userAnswered = false
		} else if(state === gamestates.ROUND_ONGOING) {
			timeleft = ROUND_ONGOING_TIME - timer
		} else if(state === gamestates.ROUND_ENDED) {
			timeleft = ROUND_ENDED_TIME - timer
			helpText = ''
			userAnswered = true
		} else if(state === gamestates.GAME_ENDED) {
			clearInterval(this.timer)
		}
		// sort players by totalScore, then name
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
			gamestate: state, 
			currentRound: round,
			timeRemaining: timeleft,
			helpText: helpText,
			userAnswered: userAnswered
		})
	}

	submitAnswer = e => {
		e.preventDefault()
		const { gamestate, userAnswered } = this.state
		if(gamestate === gamestates.ROUND_ONGOING && !userAnswered) {
			const { userAnswer, timeRemaining, currentRound, roomId, qna } = this.state
			const currentAnswer = qna[currentRound-1]['answer']
			if(currentAnswer.toLowerCase() === userAnswer.toLowerCase()) {
				this.setState({helpText: 'Correct!', userAnswer: ''}, () => {
					API.post('/submit_answer', {
						roomId: roomId,
						nickname: this.props.nickname,
						score: timeRemaining
					}).then(res => {
						this.setState({userAnswered: true}, () => this.parseRoomData(res.data))
					}).catch(err => {
						alert(err)
					})
				})
			} else {
				this.setState({helpText: 'Please try again!', userAnswer: ''})
			}
		}
	}

	onAnswerFieldChanged = event => {
		this.setState({ userAnswer: event.target.value})
	}

	render() {
		const { roomId, gamestate, currentRound, players, qna, userAnswer, timeRemaining, helpText, userAnswered } = this.state
		const { nickname } = this.props
		return (
			<div className="container">
				<div className="grid">
					<Link className='h3 title' to='/'>Guess The Gibberish</Link>
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
								submitAnswer={this.submitAnswer}/>
						</div>
					</div>
				</div>
				
			</div>
		)
	}
}

export default GameroomPage