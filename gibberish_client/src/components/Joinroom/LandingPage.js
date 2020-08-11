import React from 'react'
import NicknameModal from "./NicknameModal"
import InstructionsModal from "./InstructionsModal"

const JOIN_ROOM = 'join_room'
const CREATE_ROOM = 'create_room'

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowingModal: false,
            isShowingInstructions: false,
            clickedButton: '',
            isButtonLoading: false
        }
    }

    showModal = (buttonName) => {
        if(buttonName === JOIN_ROOM && this.props.roomId === '') {
            alert('Please enter a valid room code!')
        } else {
            this.setState({isShowingModal: true, clickedButton: buttonName})
        }
    }

    hideModal = () => {
        this.setState({isShowingModal: false})
    }

    roomCodeFieldChanged = event => {
        this.props.updateRoomId(event.target.value)
    }

    nicknameFieldChanged = event => {
        this.props.updateNickname(event.target.value)
    }

    submitModal = () => {
        this.setState({isButtonLoading: true})
        const { clickedButton} = this.state
        const { nickname, roomId } = this.props

        if(clickedButton === JOIN_ROOM) {
            if(nickname && roomId) {
                this.joinRoom()
            } else {
                alert('Please input a valid roomCode and nickname')
            }
           
        } else if (clickedButton === CREATE_ROOM) {
            if(nickname) {
                this.createRoom()
            } else {
                alert('Please input a valid nickname')
            }
        }
    }

    showInstructions = () => {
        this.setState({isShowingInstructions: true})
    }

    hideInstructions = () => {
        this.setState({isShowingInstructions: false})
    }

    createRoom = () => {
        this.props.toGameroomPage()
	}

    joinRoom = () => {
        this.props.toGameroomPage()
    }

	render() {
        const {isShowingModal, isShowingInstructions, isButtonLoading} = this.state
        const {roomId} = this.props
		return (
            <div>
                <div className="container" id="landingPage">
                    <div className="text-center">
                        <h1 id="title">Guess the Gibberish</h1>
                        <h3 style={{color: '#F4D35E'}}>Singapore Food Edition!</h3>
                        <br />
                        <div>
                            <div className="input-group w-50 mx-auto">
                                <input type="text" className="form-control text-center rounded-pill" placeholder="Enter room code" value={roomId} onChange={this.roomCodeFieldChanged}/>
                            </div>
                            <br />
                            <button className="btn btn-warning w-25" id="joinRoomButton" onClick={() => this.showModal('join_room')}>Join room</button>
                        </div>
                        <br />
                        <h6 className="w-25 mx-auto">&nbsp;or&nbsp;</h6>
                        <br />
                        <button className="btn btn-success w-25" id="joinRoomButton" onClick={() => this.showModal('create_room')}>Create new room</button>
                        <br />
                        <br />
                        <br />
                        <button className="btn" id="instructionsButton" onClick={() => this.showInstructions()}>How to play?</button>
                    </div>
                </div>
                {isShowingModal && <NicknameModal isShowingModal={isShowingModal} isButtonLoading={isButtonLoading} handleClose={this.hideModal} handleNicknameChange={this.nicknameFieldChanged} submitModal={this.submitModal}/>}
                {isShowingInstructions && <InstructionsModal isShowingInstructions={isShowingInstructions} handleClose={this.hideInstructions}  />}
            </div>
		)
	}
}

export default LandingPage