import React from 'react'
import NicknameModal from "./NicknameModal"
import API from '../../api/api'

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowingModal: false,
            clickedButton: '',
            roomCode: '',
        }
    }

    showModal = (buttonName) => {
        if(buttonName === 'join_room' && this.state.roomCode === '') {
            alert('Please enter a valid room code!')
        } else {
            this.setState({isShowingModal: true, clickedButton: buttonName})
        }
    }

    hideModal = () => {
        this.setState({isShowingModal: false})
    }

    roomCodeFieldChanged = event => {
        this.setState({roomCode: event.target.value})
    }

    nicknameFieldChanged = event => {
        const { updateNickname } = this.props
        updateNickname(event.target.value)
    }

    submitModal = () => {
        this.setState({isShowingModal: false})
        const { roomCode, clickedButton} = this.state
        const { nickname } = this.props

        if(clickedButton === 'join_room') {
            if(nickname && roomCode) {
                this.joinRoom(nickname, roomCode)
            } else {
                alert('Please input a valid roomCode and nickname')
            }
           
        } else if (clickedButton === 'create_room') {
            if(nickname) {
                this.createRoom(nickname)
            } else {
                alert('Please input a valid nickname')
            }
        }
    }
    
    createRoom = nickname => {
        API.post('/create_room', {nickname: nickname})
            .then(res => {
                const roomId = res.data.roomId
                this.props.history.push(`room/${roomId}`)
            })
	}


    joinRoom = nickname => {
        const { roomCode } = this.state;
        API.post('/join_room', {nickname: nickname, roomId: roomCode})
            .then(res => {
            this.props.history.push(`room/${roomCode}`);
        })
    }

	render() {
        const {isShowingModal, roomCode} = this.state
		return (
            <div>
                <div className="container" id="landingPage">
                    <div className="text-center">
                        <h1 id="title">Guess the Gibberish</h1>
                        <br />
                        <div>
                            <div className="input-group w-25 mx-auto">
                                <input type="text" className="form-control text-center rounded-pill" placeholder="Enter room code" value={roomCode} onChange={this.roomCodeFieldChanged}/>
                            </div>
                            <br />
                            <button className="btn btn-warning w-25" id="joinRoomButton" onClick={() => this.showModal('join_room')}>Join room</button>
                        </div>
                        <br />
                        <h6 className="w-25 mx-auto">&nbsp;or&nbsp;</h6>
                        <br />
                        <button className="btn btn-success w-25" id="joinRoomButton" onClick={() => this.showModal('create_room')}>Create new room</button>
                    </div>
                </div>
                {isShowingModal && <NicknameModal isShowingModal={isShowingModal} handleClose={this.hideModal} handleNicknameChange={this.nicknameFieldChanged} submitModal={this.submitModal}/>}
            </div>
		)
	}
}

export default LandingPage