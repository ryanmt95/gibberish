import React from 'react'

function PlayerListComponent() {
	const mockplayers = [
		{name: "gibberishking", points: 240},
		{name: "gibberishqueen", points: 187},
		{name: "gibberishboy", points: 148},
		{name: "gibberishgirl", points: 134},
	]
	return(
		<div className="grid">
			<h4 className="pb-4"><strong>Players</strong></h4>
			{mockplayers.sort((a,b) => (a.points < b.points) ? 1 : -1).map((item, index) => (
				<div className="d-flex mb-2 align-items-center">
					<div className="pr-4">
						<img className="avatar" />
					</div>
					<div className="flex-grow-1">
						<h5>{item.name}</h5></div>
					<div className="pr-4">
						<h4>{item.points}</h4></div>
					
				</div>
			))}
		</div>
	)
}

export default PlayerListComponent