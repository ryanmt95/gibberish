import React from 'react'

class LandingPage extends React.Component {
	render() {
		return (
			<div className="container" id="landingPage">
                <div className="text-center">
                    <h1 id="title">Guess the Gibberish</h1>
                    <br />
                    <div>
                        <div className="input-group w-25 mx-auto">
                            <input type="text" className="form-control text-center rounded-pill" placeholder="Enter room code"/>
                        </div>
                        <br />
                        <button className="btn btn-warning w-25">Join room</button>
                    </div>
                    <br />
                    <h6 className="w-25 mx-auto">&nbsp;or&nbsp;</h6>
                    <br />
                    <button className="btn btn-success w-25">Create new room</button>
                </div>
		
            </div>
		)
	}
}

export default LandingPage