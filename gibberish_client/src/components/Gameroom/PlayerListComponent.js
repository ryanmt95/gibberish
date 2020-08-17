import React from 'react'

function PlayerListComponent(props) {
	return (
		<div className="grid tile">
			<h4 className="pb-4"><strong>Players</strong></h4>
			{props.players.map((item, index) => (
				<div className="d-flex mb-2 align-items-center" key={index}>
					<div className="pr-4">
						<img src={`https://ui-avatars.com/api/?name=${item.name}&background=c4c4c4&color=fff&size=64`} className="avatar" alt="avatar" />
					</div>
					<div className="flex-grow-1">
						<h5>{item.name} {item.name === props.myID ? "(you)" : null}</h5></div>
					<div className="pr-4">
						<h4>{item.totalScore}</h4></div>
				</div>
			))}
		</div>
	)
}

export default PlayerListComponent