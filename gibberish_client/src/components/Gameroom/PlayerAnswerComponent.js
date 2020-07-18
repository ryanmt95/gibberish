import React from 'react'
import { gamestates } from './gamestates/GameStates'

function PlayerAnswerComponent(props) {
	const { gamestate, userAnswer, onAnswerFieldChanged, submitAnswer, helpText, userAnswered } = props
	if (gamestate === gamestates.GAME_WAITING || gamestate === gamestates.GAME_ENDED) {
		return (
			<div className="text-center">
				<h5>Waiting for game to begin...</h5>
			</div>
		)
	} else {
		return (
			<div className="text-center">
				<h4><strong>Your answer</strong></h4>
				<form onSubmit={submitAnswer}>
					<div className="input-group mb-3">
						<input type="text" className="form-control text-center" placeholder="My Guess!" value={userAnswer} onChange={onAnswerFieldChanged} />
					</div>
					<h5>{helpText}</h5>
					<input type="submit" className="btn btn-success" hidden={userAnswered} value="Guess!"/>
				</form>
			</div>
		)
	}
}

export default PlayerAnswerComponent