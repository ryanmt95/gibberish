import React from 'react'
import {Link} from 'react-router-dom'

function NicknameModal({handleClose, isShowingModal, action, roomCode}) {
    const showHideClassName = isShowingModal ? "modal display-block" : "modal display-none"
    roomCode = action === 'create_room' ? '1234' : roomCode
    return (
        <div className={showHideClassName} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content text-center">
                    <div className="modal-body">
                        <button type="button" className="close" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div id="nicknameTitle">Please enter a nickname</div>
                        <br />
                        <div className="input-group w-75 mx-auto">
                            <input type="text" className="form-control text-center rounded-pill" placeholder="Nickname"/>
                        </div>
                        <br />
                        <Link className='btn btn-success w-25' to={`/room/${roomCode}`}>OK</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NicknameModal