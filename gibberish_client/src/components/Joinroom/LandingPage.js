import React from 'react'
import NicknameModal from "./NicknameModal"

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowingModal: false,
            clickedButton: ''
        }
    }

    showModal = (buttonName) => {
        this.setState({isShowingModal: true, clickedButton: buttonName})
    }

    hideModal = () => {
        this.setState({isShowingModal: false})
    }

	render() {
        const {isShowingModal, clickedButton} = this.state
		return (
            <div>
                <div className="container" id="landingPage">
                    <div className="text-center">
                        <h1 id="title">Guess the Gibberish</h1>
                        <br />
                        <div>
                            <div className="input-group w-25 mx-auto">
                                <input type="text" className="form-control text-center rounded-pill" placeholder="Enter room code"/>
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
                {isShowingModal && <NicknameModal isShowingModal={isShowingModal} handleClose={this.hideModal} action={clickedButton} />}
            </div>
		)
	}
}

export default LandingPage