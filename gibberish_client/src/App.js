import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import GameroomPage from './components/Gameroom/GameroomPage';
import LandingPage from './components/Joinroom/LandingPage';
import InvalidPage from './components/InvalidPage';

class App extends React.Component {
  state = {
    page: 'join',
    nickname: '',
    roomId: ''
  }

  toGameroomPage = () => {
    this.setState({page: 'game'})
  }

  toJoinroomPage = () => {
    this.setState({page: 'join'})
  }

  updateNickname = (nickname) => {
    this.setState({nickname})
  }

  updateRoomId = (roomId) => {
    this.setState({roomId})
  }


  render() {
    const {page, nickname, roomId} = this.state
    let component = null
    switch(page) {
      case 'join':
        component = <LandingPage 
                      nickname={nickname}
                      roomId={roomId}
                      updateNickname={this.updateNickname}
                      updateRoomId={this.updateRoomId}
                      toGameroomPage={this.toGameroomPage}/>
        break
      case 'game':
        component = <GameroomPage
                      nickname={nickname}
                      roomId={roomId}
                      toJoinroomPage={this.toJoinroomPage}/>
        break
      default:
        component = <InvalidPage/>
    }
    return (
      <div className="App">
        {component}
      </div>
      // <Router>
      //   <div className="App">
      //   <Switch>
      //     <Route exact path="/room/:id"  render={props => <GameroomPage {...props} nickname={this.state.nickname} updateNickname={this.updateNickname}/>} />
      //     <Route exact path="/" render={props => <LandingPage {...props} nickname={this.state.nickname} updateNickname={this.updateNickname} />}/>
      //     <Route exact path='*' component={InvalidPage}/>
      //   </Switch>
      //   </div>
      // </Router>
    );
  }
}

export default App;
