import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import './styles/login.css';

import logo from '../logo.svg';
import blockcypherLogo from '../blockcypher_logo_white.svg';
import reduxLogo from '../redux.svg';
import loading from '../loading.svg';

import fetch from 'node-fetch';

/**
 * Home page of the application. Initially will try to GET the user credentials at first, but if the internal API returns 401 unauthorized then the login/create form will be presented.
 * If the user is authenticated, it will redirect to /dashboard
 */
class Login extends Component {
    constructor(props)
    {
        super(props);
        this.fetchAccountData = this.fetchAccountData.bind(this);
        this.dispatchAccountCreation = this.dispatchAccountCreation.bind(this);
        this.dispatchLoginRequest = this.dispatchLoginRequest.bind(this);
        this.toggleCreatingAccount = this.toggleCreatingAccount.bind(this);

    }
    /**
     * Toggle between login or creating a new account
     */
    toggleCreatingAccount()
    {
        document.getElementById("loginuser").value = "";
        document.getElementById("loginpass").value = "";
        this.props.dispatch({type: "LOGIN_TOGGLE_CREATING"});
        
    }
    /**
     * Fetch our account data from internal API
     */
    fetchAccountData()
    {
        // If we're already fetching, don't send another request
        if(this.props.fetchingAccount)
            return;
        // GET Request to api/login
        this.props.dispatch({type: "LOGIN_FETCHING_ACCOUNT"});
        // request
        fetch('/api/login', {
            method: 'GET'
        })
        .then( res => {
            if(!res.ok)
            {
                if(res.status !== 401)
                    res.text().then(body => this.props.dispatch({type: "ERROR_RESPONSE", data: body})).catch(err => console.log(err));
                this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
            }
            else
            {
                res.json().then( json => {
                    console.log(json);
                    this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED", data: json});
                    
                }).catch( err => {
                    // Exceptions here should show the error dialog
                    this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
                    this.props.dispatch({type: "ERROR_RESPONSE", data: err});
                    console.log(err);
                })
            }
        })
        .catch( err => {
            this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
            this.props.dispatch({type: "ERROR_RESPONSE", data: err});
            console.log(err);
        });
    }
    /**
     * Dispatch a POST request to the internal API server to create a new account
     */
    dispatchAccountCreation()
    {
        // POST request to api/login/create
        // Validate!
        let password = document.getElementById("loginpass").value;
        let username = document.getElementById("loginuser").value;

        if(password.length > 20)
            this.props.dispatch({type: "LOGIN_ERROR", data: "Password must be within 20 characters!"});
        else if(username.length > 20)
            this.props.dispatch({type: "LOGIN_ERROR", data: "Username must be within 20 characters!"});
        else if(password.length === 0)
            this.props.dispatch({type: "LOGIN_ERROR", data: "Password can not be empty!"});
        else if(username.length === 0)
            this.props.dispatch({type: "LOGIN_ERROR", data: "Username can not be empty!"});
        else
        {
            this.props.dispatch({type: "LOGIN_FETCHING_ACCOUNT"});
            // POST request
            fetch('api/login/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then(res => {
                if(!res.ok)
                {
                    console.log("Invalid Response from server", res.status);
                    if(res.status !== 401)
                        res.text().then(body => this.props.dispatch({type: "ERROR_RESPONSE", data: body})).catch(err => console.log(err));
                    this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
                }
                else
                {
                    res.json().then(json => {
                        this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED", data: json});
                    }).catch(err => {
                        console.log(err);
                        this.props.dispatch({type: "ERROR_RESPONSE", data: err});
                        this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
                    })
                }
            }).catch(err => {
                console.log(err);
                this.props.dispatch({type: "ERROR_RESPONSE", data: err});
                this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
            })
        }
    }
    /**
     * Dispatch a POST request to the internal API indicating that we want to attempt to login with the credentials
     */
    dispatchLoginRequest()
    {
        // POST request to api/login
        // Validate!
        let password = document.getElementById("loginpass").value;
        let username = document.getElementById("loginuser").value;

        if(password.length > 20)
            this.props.dispatch({type: "LOGIN_ERROR", data: "Password must be within 20 characters!"});
        else if(username.length > 20)
            this.props.dispatch({type: "LOGIN_ERROR", data: "Username must be within 20 characters!"});
        else if(password.length === 0)
            this.props.dispatch({type: "LOGIN_ERROR", data: "Password can not be empty!"});
        else if(username.length === 0)
            this.props.dispatch({type: "LOGIN_ERROR", data: "Username can not be empty!"});
        else
        {
            this.props.dispatch({type: "LOGIN_FETCHING_ACCOUNT"});
            // reuqest
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then( res => {
                // If failed then its invalid user/pass
                if(!res.ok)
                {
                    this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
                    this.props.dispatch({type: "LOGIN_ERROR", data: "Invalid Username or Password"});
                }
                else
                {
                    res.json().then(json => {
                        console.log(json);
                        this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED", data: json});
                    }).catch(err => {
                        console.log(err);
                        this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
                        this.props.dispatch({type: "ERROR_RESPONSE", data: err});
                    });
                }
            }).catch(err => {
                console.log(err);
                this.props.dispatch({type: "LOGIN_ACCOUNT_FETCHED"});
                this.props.dispatch({type: "ERROR_RESPONSE", data: err});
            });
        }
    }
    render()
    {
        let utilizing = <header className="login-header">
            Coding Challenge Project by Yannis Li
            <div className="login-subheader">
                Utilizing
            </div>
            
            <div className="login-utilizing">
                <img className="login-logo" src={logo} alt="React.js"></img>
                <img className="login-logo" src={blockcypherLogo} alt="Blockcypher"></img>
                <img className="login-logo" src={reduxLogo} alt="Redux.js"></img>
            </div>
        
        </header>
        // If we do not have account data
        if(!this.props.AccountData)
        {
            if(this.props.Fetching)
            {
                return <div className="login-container">
                    
                    <header className="login-header">
                        Retrieving account information...
                        <img className="login-loading" src={loading} alt=""/>
                    </header>
                    {utilizing}
                </div>
            }
            else
            {
                return (
                <div className="login-container">
                    <div className="login-body">
                        <div className="login-body-head">
                            {this.props.Creating ? "Create a new account" : "Welcome!"}
                        </div>
                        <div className="login-field">
                            USERNAME
                        </div>
                        <textarea id="loginuser" className="login-textarea" placeholder=""/>

                        <div className="login-field">
                            PASSWORD
                        </div>
                        <input type="password" id="loginpass" className="login-textarea" placeholder=""/>
                        
                        <div className="login-button" onClick={this.props.Creating ? this.dispatchAccountCreation : this.dispatchLoginRequest}>{this.props.Creating ? "Register" : "Login"}</div>
                        <div className="login-text-button" onClick={this.toggleCreatingAccount}>{this.props.Creating ? "Have an account? Login" : "Register new account"}</div>
                        {this.props.Error &&
                            <div className="login-error">Error: {this.props.Error}</div>
                        }
                    </div>
                    
                    {utilizing}
                    
                </div>);
                
            }
        }
        else
        {
            // Redirect to /dashboard
            return <Redirect to="/dashboard"/>
        }
    }
    componentDidMount()
    {
        
        if(!this.props.Loaded && !this.props.Fetching && !this.props.AccountData)
            this.fetchAccountData();
    }
}

export default connect(state => {
    return {
        Creating: state.login.creatingAccount,
        AccountData: state.login.accountData,
        Loaded: state.login.loadedAccount,
        Fetching: state.login.fetchingAccount,
        Secret: state.login.password,
        Error: state.login.inlineError
    }
})(Login);
