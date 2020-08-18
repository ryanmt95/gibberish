import React from 'react'
import PlayerListComponent from './PlayerListComponent'
import QuestionCardComponent from './QuestionCardComponent'
import { gamestates } from './gamestates/GameStates'
import ChatComponent from './ChatComponent'
import { Socket } from '../../api/socket'

class GameroomPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			gamestate: gamestates.GAME_WAITING,
			currentRound: 0,
			players: [],
			qna: [],
			theme: '',
			timeRemaining: 0,
			loaded: false
		}
	}

	componentDidMount() {
		const { nickname, roomId } = this.props
		Socket.joinRoom(nickname, roomId)
		Socket.watchErrors(message => {
			alert(message)
			this.props.toJoinroomPage()
		})
		Socket.watchUpdates(message => {
			const { currentRound, gameState, players, qna, theme, roomId, timer } = message
			this.props.updateRoomId(roomId)
			this.setState({
				currentRound,
				gamestate: gameState,
				players,
				qna,
				theme,
				timeRemaining: timer,
				loaded: true
			})
		})
	}

	render() {
		const { loaded, gamestate, currentRound, players, qna, theme, chat, timeRemaining } = this.state
		const { nickname, roomId } = this.props
		return (
			<div className="container">
				<div className="grid">
					<a href='/' className='h3 title'>Guess The Gibberish</a>
					<div className="row">
						<div className="col">
							<QuestionCardComponent
								roomId={roomId}
								currentRound={currentRound}
								gamestate={gamestate}
								players={players}
								qna={qna}
								theme={theme}
								timeRemaining={timeRemaining}
								loaded={loaded} />
						</div>
					</div>

					<div className="row">
						<div className="col-12 col-md-6 order-12 order-md-1">
							<PlayerListComponent
								players={players}
								myID={nickname} />
						</div>
						<div className="col-12 col-md-6 order-1 order-md-12">
							<ChatComponent 
								roomId={roomId} 
								chat={chat} 
								nickname={nickname} 
								currentRound={currentRound}
								qna={qna}
								gamestate={gamestate}/>
						</div>
					</div>
				</div>

			</div>
		)
	}
}

export default GameroomPage