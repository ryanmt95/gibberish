import React from 'react'
import PlayerListComponent from './PlayerListComponent'
import PlayerAnswerComponent from './PlayerAnswerComponent'
import QuestionCardComponent from './QuestionCardComponent'
import { gamestates } from './gamestates/GameStates'

class GameroomPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			gamestate: gamestates.GAME_WAITING,
			currentRound: 1,
			maxRounds: 3,
			myID: 'gibberish king',
			players: [
				{name: "gibberish king", points: 0},
				{name: "gibberish queen", points: 0},
				{name: "gibberish boy", points: 0},
				{name: "gibberish girl", points: 0},
			],
			roundScores: []
		}
	}

	startNextRound = () => {
		if(this.state.currentRound < this.state.maxRounds) {
			this.setState({currentRound: this.state.currentRound + 1})
		} else {
			this.transitionToState(gamestates.GAME_ENDED)
		}
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
		})
		this.setState(prevState => ({players: players, roundScores: [...prevState.roundScores, roundScore]}))
	}

	render() {
		return (
			<div className="container">
				<div className="grid">
					<div className="row header">
						<div id="header" className="col tile">
							<QuestionCardComponent 
								currentRound={this.state.currentRound}
								maxRounds={this.state.maxRounds}
								gamestate={this.state.gamestate}
								roundScores={this.state.roundScores[this.state.roundScores.length - 1]}
								startNextRound={this.startNextRound}
								transitionToState={this.transitionToState}
								updateScores={this.updateScores}/>
						</div>
					</div>

					<div className="row">
						<div id="left" className="col tile">
							<PlayerListComponent 
								players={this.state.players} 
								myID={this.state.myID}/>
						</div>
						
						<div id="right" className="col tile">
							<PlayerAnswerComponent/>
						</div>
					</div>
				</div>
				
			</div>
		)
	}
}

export default GameroomPage