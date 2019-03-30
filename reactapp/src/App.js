import React, { Component } from 'react';
import logo from './logo.svg';
import blockcypherLogo from './blockcypher_logo_white.svg';
import reduxLogo from './redux.svg';
import './App.css';

import { connect } from 'react-redux';


import Main from './components/main';
import ErrorModal from './components/errormodal';

class App extends Component {
  render() {
    let toRender = [];
    toRender.push(<ErrorModal/>);

    toRender.push(
    (
      <div className="App" id="approot">
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
    ));
    return toRender;
  }
  
  componentDidMount()
  {

  }
}

export default connect( state => {
  return {};
})(App);
