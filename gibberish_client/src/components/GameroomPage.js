import React from 'react'
import PlayerListComponent from './PlayerListComponent'

class GameroomPage extends React.Component {
	render() {

		return (
			<div className="container">
				<div className="grid">
					<div className="row header">
						<div id="header" className="col tile">
							<h3><strong>Round 1/10</strong></h3>
						</div>
					</div>

					<div className="row">
						<div id="left" className="col tile">
							
							<PlayerListComponent/>
						</div>
						
						<div id="right" className="col tile">
							<h4><strong>Your answer</strong></h4>
						</div>
					</div>
				</div>
				
			</div>
		)
	}
}

export default GameroomPage