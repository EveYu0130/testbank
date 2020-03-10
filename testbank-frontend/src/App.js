import React from 'react';
import './App.css';
import Routes from './routes';
import { HashRouter as Router } from "react-router-dom";
// import routerStore from './stores/router-store';

class App extends React.Component{
  render() {
    return (
      <Router>
        <div>
          <Routes />
        </div>
      </Router>
    );
  }
}

export default App;
