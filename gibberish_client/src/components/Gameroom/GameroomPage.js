import React from 'react'
import PlayerListComponent from './PlayerListComponent'
import PlayerAnswerComponent from './PlayerAnswerComponent'
import QuestionCardComponent from './QuestionCardComponent'
import { gamestates } from './GameStates'

class GameroomPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			gamestate: gamestates.ROUND_LOADING,
			currentRound: 1,
			maxRounds: 3,
			myID: 'gibberish king',
			players: [
				{name: "gibberish king", points: 0},
				{name: "gibberish queen", points: 0},
				{name: "gibberish boy", points: 0},
				{name: "gibberish girl", points: 0},
			],
			timePerRound: 5
		}
	}

	startNextRound = () => (
		this.setState({currentRound: this.state.currentRound + 1})
	)

	transitionToState = (newState) => (
		this.setState({gamestate: newState})
	)

	updateScores = () => {
		let players = this.state.players.map(player => {
			player.points += Math.floor(Math.random() * 25)
			return player
		})
		this.setState({players: players})
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
								timePerRound={this.state.timePerRound}
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