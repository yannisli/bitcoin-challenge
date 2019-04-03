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
    
    // Depending on the route, render a different component
    // Home is Login, Login will redirect to dashboard if logged in successfully
    // All else will redirect to / if credentials invalid
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
    // Error modal, so it doesn't get blurred
    toRender.push(<ErrorModal key="error"/>);
    // Awaiting modal, so it doesn't get blurred
    toRender.push(<AwaitingModal key="awaiting"/>);
    // We use approot to apply the blur filter. Children will get the filter too, so these modals can't be a child of approot
    return toRender;
  }
  
  componentDidMount()
  {

  }
}

export default withRouter(connect( state => {
  return {};
})(App));
