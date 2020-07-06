import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import GameroomPage from './components/Gameroom/GameroomPage';
import LandingPage from './components/Joinroom/LandingPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
      <Switch>
        <Route path="/room">
          <GameroomPage/>
        </Route>
        <Route path="/">
          <LandingPage/>
        </Route>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
