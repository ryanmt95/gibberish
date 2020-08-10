import React from 'react'

function NicknameModal({handleClose, isShowingModal, isButtonLoading, handleNicknameChange, submitModal}) {
    const showHideClassName = isShowingModal ? "modal display-block" : "modal display-none"
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
                            <input type="text" className="form-control text-center rounded-pill" placeholder="Nickname" onChange={handleNicknameChange}/>
                        </div>
                        <br />
                        <button type="button" className='btn btn-success w-25' id="joinRoomButton" onClick={submitModal} disabled={isButtonLoading}>{isButtonLoading? 'Loading' : 'OK'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NicknameModal