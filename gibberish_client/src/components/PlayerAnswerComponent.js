import React from 'react'

function PlayerAnswerComponent() {
	return (
		<div className="text-center">
			<div className="input-group mb-3">
				<input type="text" className="form-control text-center" placeholder="My Guess!" />
			</div>
			<button className="btn btn-success">Guess!</button>
		</div>
	)
}

export default PlayerAnswerComponent