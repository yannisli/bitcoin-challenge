import React, { Component } from 'react';

import './App.css';

import { connect } from 'react-redux';

import { withRouter, Switch, Route, Redirect } from 'react-router-dom';


import Login from './components/login';
import ErrorModal from './components/errormodal';
import Dashboard from './components/dashboard';
import Wallet from './components/wallet';

class App extends Component {
  render() {
    let toRender = [];
    

    toRender.push(
    (
      <div key="app" className="App" id="approot">
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/wallet/:walletId" component={Wallet}/>
          <Redirect from="*" to="/"/> {/* Default path should be the home*/}
          
        </Switch>

      </div>
    ));
    toRender.push(<ErrorModal key="error"/>);
    return toRender;
  }
  
  componentDidMount()
  {

  }
}

export default withRouter(connect( state => {
  return {};
})(App));
