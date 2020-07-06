import React from 'react'
import PlayerListComponent from './PlayerListComponent'
import PlayerAnswerComponent from './PlayerAnswerComponent'
import QuestionCardComponent from './QuestionCardComponent'

class GameroomPage extends React.Component {
	render() {

		return (
			<div className="container">
				<div className="grid">
					<div className="row header">
						<div id="header" className="col tile">
							<QuestionCardComponent/>
						</div>
					</div>

					<div className="row">
						<div id="left" className="col tile">
							<PlayerListComponent/>
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