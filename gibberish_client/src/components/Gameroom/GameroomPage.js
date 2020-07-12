import React from 'react'
import PlayerListComponent from './PlayerListComponent'
import PlayerAnswerComponent from './PlayerAnswerComponent'
import QuestionCardComponent from './QuestionCardComponent'
import { gamestates } from './gamestates/GameStates'

import API from '../../api/api'

class GameroomPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			roomId: props.match.params.id,
			gamestate: gamestates.GAME_WAITING,
			currentRound: 1,
			maxRounds: 3,
			players: [
				{name: this.props.nickname, points: 0},
				{name: "gibberish queen", points: 0},
				{name: "gibberish boy", points: 0},
				{name: "gibberish girl", points: 0},
			],
			roundScores: [],
			currentQuestion: '',
			currentAnswer:''
		}
	}

	componentDidMount() {
		this.getQuestion();
	}

	getQuestion = () => {
		API.get('/question')
		.then(res => {
			this.setState({ currentQuestion: res.data.question, currentAnswer: res.data.answer })
		})
	}

	startNextRound = () => {
		if(this.state.currentRound < this.state.maxRounds) {
			this.setState({currentRound: this.state.currentRound + 1})
		} else {
			this.transitionToState(gamestates.GAME_ENDED)
		}
		this.getQuestion()
	}

	transitionToState = (newState) => (
		this.setState({gamestate: newState})
	)

	updateScores = () => {
		let roundScore = []
		let players = this.state.players.map(player => {
			let score = Math.floor(Math.random() * 25)
			roundScore.push({name: player.name, points: score})
			player.points += score
			return player
		}).sort((a,b) => (a.points < b.points) ? 1 : -1)
		this.setState(prevState => ({players: players, roundScores: [...prevState.roundScores, roundScore]}))
	}

	render() {
		const { roomId, gamestate, currentRound, maxRounds, players, roundScores, currentQuestion, currentAnswer } = this.state
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
								roundScores={roundScores[roundScores.length - 1]}
								players={players}
								startNextRound={this.startNextRound}
								transitionToState={this.transitionToState}
								updateScores={this.updateScores}
								currentQuestion={currentQuestion}
								currentAnswer={currentAnswer}/>
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
								gamestate={gamestate}/>
						</div>
					</div>
				</div>
				
			</div>
		)
	}
}

export default GameroomPage