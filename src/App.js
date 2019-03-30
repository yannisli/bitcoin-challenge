import React, { Component } from 'react';
import logo from './logo.svg';
import blockcypherLogo from './blockcypher_logo_white.svg';
import reduxLogo from './redux.svg';
import './App.css';

import { connect } from 'react-redux';


import Main from './components/main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Coding Challenge Project by Yannis Li
          <div className="App-subheader">
            Utilizing
          </div>
          <div className="App-utilizing">
            <img className="App-logo" src={logo} alt="React.js"></img>
            <img className="App-logo" src={blockcypherLogo} alt="Blockcypher"></img>
            <img className="App-logo" src={reduxLogo} alt="Redux.js"></img>
          </div>
        </header>
        <Main/>
      </div>
    );
  }
  componentDidMount()
  {

  }
}

export default connect( state => {
  return {};
})(App);
