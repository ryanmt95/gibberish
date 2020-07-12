import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import GameroomPage from './components/Gameroom/GameroomPage';
import LandingPage from './components/Joinroom/LandingPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import InvalidPage from './components/InvalidPage';

class App extends React.Component {
  state = {
    nickname: '',
  }

  updateNickname = (nickname) => {
    this.setState({nickname})
  }

  render() {
    return (
      <Router>
        <div className="App">
        <Switch>
          <Route exact path="/room/:id"  render={props => <GameroomPage {...props} nickname={this.state.nickname} updateNickname={this.updateNickname}/>} />
          <Route exact path="/" render={props => <LandingPage {...props} nickname={this.state.nickname} updateNickname={this.updateNickname} />}/>
          <Route exact path='*' component={InvalidPage}/>
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
