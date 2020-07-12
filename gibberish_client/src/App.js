import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import GameroomPage from './components/Gameroom/GameroomPage';
import LandingPage from './components/Joinroom/LandingPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import InvalidPage from './components/InvalidPage';

function App() {
  return (
    <Router>
      <div className="App">
      <Switch>
        <Route exact path="/room/:id" component={GameroomPage}/>
        <Route exact path="/" component={LandingPage}/>
        <Route exact path='*' component={InvalidPage}/>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
