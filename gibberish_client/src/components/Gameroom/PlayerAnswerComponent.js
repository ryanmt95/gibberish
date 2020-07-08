import React from 'react'
import { gamestates } from './gamestates/GameStates'

function PlayerAnswerComponent(props) {
	const {gamestate} = props
	if(gamestate === gamestates.GAME_WAITING || gamestate === gamestates.GAME_ENDED) {
		return(
			<div className="text-center">
				<h5>Waiting for game to begin...</h5>
			</div>
		)
	} else {
		return (
			<div className="text-center">
				<h4><strong>Your answer</strong></h4>
				<div className="input-group mb-3">
					<input type="text" className="form-control text-center" placeholder="My Guess!" />
				</div>
				<button className="btn btn-success" hidden={!(gamestate === gamestates.ROUND_ONGOING)}>Guess!</button>
			</div>
		)
	}
}

export default PlayerAnswerComponent