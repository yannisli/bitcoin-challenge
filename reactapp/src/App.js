import React, { Component } from 'react';

import './App.css';

import { connect } from 'react-redux';

import { withRouter, Switch, Route, Redirect } from 'react-router-dom';


import Login from './components/login';
import ErrorModal from './components/errormodal';
import Dashboard from './components/dashboard';
import Wallet from './components/wallet';
import AwaitingModal from './components/awaiting';
import Address from './components/address';

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
          <Route path="/address" component={Address}/>
          <Redirect from="*" to="/"/> {/* Default path should be the home*/}
          
        </Switch>

      </div>
    ));
    toRender.push(<ErrorModal key="error"/>);
    toRender.push(<AwaitingModal key="awaiting"/>);
    return toRender;
  }
  
  componentDidMount()
  {

  }
}

export default withRouter(connect( state => {
  return {};
})(App));
