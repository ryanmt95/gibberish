import React from 'react'
import NicknameModal from "./NicknameModal"
import InstructionsModal from "./InstructionsModal"

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
        if (buttonName === 'join_room' && this.props.roomId === '') {
            alert('Please enter a valid room code!')
        } else {
            this.setState({ isShowingModal: true, clickedButton: buttonName })
        }
    }

    hideModal = () => {
        this.setState({ isShowingModal: false })
    }

    roomCodeFieldChanged = event => {
        this.props.updateRoomId(event.target.value)
    }

    nicknameFieldChanged = event => {
        this.props.updateNickname(event.target.value)
    }

    submitModal = () => {
        this.setState({ isButtonLoading: true })
        const { clickedButton } = this.state
        const { nickname, roomId } = this.props

        if (clickedButton === 'join_room') {
            if (nickname && roomId) {
                this.joinRoom(nickname, roomId)
            } else {
                alert('Please input a valid roomCode and nickname')
            }

        } else if (clickedButton === 'create_room') {
            if (nickname) {
                this.createRoom(nickname)
            } else {
                alert('Please input a valid nickname')
            }
        }
    }

    showInstructions = () => {
        this.setState({ isShowingInstructions: true })
    }

    hideInstructions = () => {
        this.setState({ isShowingInstructions: false })
    }


    createRoom = nickname => {
        this.props.toGameroomPage()
    }


    joinRoom = (nickname, roomId) => {
        this.props.toGameroomPage()
    }

    render() {
        const { isShowingModal, isShowingInstructions, isButtonLoading } = this.state
        const { roomId } = this.props
        return (
            <div>
                <div className="container" id="landingPage">
                    <div className="text-center">
                        <div className="grid">
                            <div className="row">
                                <div className="col">
                                    <h1 id="title">Guess the Gibberish</h1>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <h3 style={{ color: '#F4D35E' }}>Singapore Edition!</h3>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <div className="input-group mx-auto" style={{maxWidth: '360px'}}>
                                        <input type="text" className="form-control text-center rounded-pill" placeholder="Enter room code" value={roomId} onChange={this.roomCodeFieldChanged} />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <button className="btn btn-warning" id="joinRoomButton" onClick={() => this.showModal('join_room')}>Join room</button>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <h6 className="mx-auto" style={{maxWidth: '360px'}}>&nbsp;or&nbsp;</h6>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <button className="btn btn-success" id="joinRoomButton" onClick={() => this.showModal('create_room')}>Create new room</button>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <button className="btn" id="instructionsButton" onClick={() => this.showInstructions()}>How to play?</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isShowingModal && <NicknameModal isShowingModal={isShowingModal} isButtonLoading={isButtonLoading} handleClose={this.hideModal} handleNicknameChange={this.nicknameFieldChanged} submitModal={this.submitModal} />}
                {isShowingInstructions && <InstructionsModal isShowingInstructions={isShowingInstructions} handleClose={this.hideInstructions} />}
            </div>
        )
    }
}

export default LandingPage