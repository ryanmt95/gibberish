import React, { useState } from 'react'

function InstructionsModal({handleClose, isShowingInstructions}) {
    const showHideClassName = isShowingInstructions ? "modal display-block" : "modal display-none"
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)
    const onRevealAnswer = () => {
        setIsAnswerRevealed(true)
    }
    return (
        <div className={showHideClassName} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content text-center">
                    <div className="modal-body">
                        <button type="button" className="close" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div id="nicknameTitle">How to play?</div>
                        <br />
                        <div id="instructionsText"><h5>Try reading out the gibberish and decipher it into a proper word or phrase before the time runs out!</h5></div>
                        
                        <br />
                        <div id="exampleContainer">
                        <h5>Example:</h5>
                        <br />
                        <h3 id="exampleQuestion">ma car own knee</h3>
                        {!isAnswerRevealed 
                            ? <button className="btn" id="instructionsButton" onClick={onRevealAnswer}>Reveal Answer</button>
                            : <h4>Answer: macaroni</h4>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructionsModal