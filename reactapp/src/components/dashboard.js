import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Redirect, Link } from 'react-router-dom';

import './styles/dashboard.css';

import NavBar from './navbar';

/**
 * Dashboard page. Gets all registered WIF from the internal API server and displays them in a list. Also gives the user option to register another WIF as well as to just look at a public address without the ability to send a payment
 */
class Dashboard extends Component {
    constructor(props)
    {
        super(props);

        this.fetchAddresses = this.fetchAddresses.bind(this);
        this.showCreation = this.showCreation.bind(this);
        this.closeCreation = this.closeCreation.bind(this);
        this.dispatchCreateRequest = this.dispatchCreateRequest.bind(this);
    }
    /**
     * Show the creation modal
     */
    showCreation() {
        this.props.dispatch({type: "DASHBOARD_SHOW_CREATING"});
    }
    /**
     * Hide it
     */
    closeCreation() {
        this.props.dispatch({type: "DASHBOARD_CLOSE_CREATING"});
    }
    /**
     * Fetch WIFs from internal API
     */
    fetchAddresses()
    {
        // GET request using our UserID (UserData.user_id) to get all addresses
        this.props.dispatch({type: "DASHBOARD_FETCHING_ADDRS"});

        fetch(`/api/address/${this.props.UserData.user_id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => {

            if(!res.ok)
            {  
                this.props.dispatch({type: "DASHBOARD_FETCHED_ADDR"});
                this.props.dispatch({type: "ERROR_RESPONSE", data: `Received status code ${res.status}`});
            }
            else
            {
                res.json().then(json => {
                    console.log(json);
                    this.props.dispatch({type: "DASHBOARD_FETCHED_ADDR", data: json});

                }).catch(err => console.log(err));
            }

        }).catch(err => {
            this.props.dispatch({type: "DASHBOARD_FETCHED_ADDR"});
            this.props.dispatch({type: "ERROR_RESPONSE", data: err});
        });
    }
    /**
     * Dispatch POST request to internal API indicating we want to register a new WIF, alongside with an optional nickname to keep better track
     */
    dispatchCreateRequest()
    {
        // TODO: Set state to awaiting server response so that the global 'awaiting' modal will show up
        // Validate first
        let address = document.getElementById("dashadd").value;
        let nick = document.getElementById("dashnick").value;

        // Only address has to be non-empty
        if(address.length === 0)
        {
            this.props.dispatch({type: "DASHBOARD_CREATE_ERROR", data: 'Address can not be empty'});
            return;
        }
        if(nick.length > 20)
        {
            this.props.dispatch({type: "DASHBOARD_CREATE_ERROR", data: 'Nickname must be within 20 characters'});
            return;
        }
        this.props.dispatch({type: "AWAITING_SERVER_RESPONSE"});
        // Make API request
        fetch(`/api/account/${this.props.UserData.user_id}/wif`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                wif: address,
                nick: nick
            })
        }).then(res => {

            if(!res.ok)
            {
                this.props.dispatch({type: "ERROR_RESPONSE", data: `Server returned a response code of ${res.status}`});
                this.props.dispatch({type: "DASHBOARD_CREATE_FINISHED"});
            }
            else
            {
                res.json().then(json => {
                    console.log(json);
                    this.props.dispatch({type: "SERVER_RESPONSE_RECEIVED"});
                    this.props.dispatch({type: "DASHBOARD_CREATE_FINISHED", data: json});
                }).catch(err => console.log(err));
            }
        }).catch(err => {
            console.log(err);
            this.props.dispatch({type: "DASHBOARD_CREATE_FINISHED"});
            this.props.dispatch({type: "ERROR_RESPONSE", data: `POST request to internal server has failed`});
        })
    }
    render()
    {
        // If not authenticated, go back to login and get that info/prompt user to login
        if(!this.props.UserData)
            return <Redirect to="/"/>
        let addrs = [];
        
        if(this.props.Addrs) {
            // If we don't have any addresses then display accordingly
            if(this.props.Addrs.length === 0)
            {
                addrs.push(
                <div key="no">
                    No addresses have been registered under your account...
                </div>);
                addrs.push(
                <div key="startbutton" className="login-button" style={{width: 'fit-content', padding: '0 10px'}} onClick={this.showCreation}>
                    Let's get started
                </div>);
            }
            else
            {
                // Otherwise display a list of them
                addrs.push(<div key="header" className="dashboard-header">Your Registered Addresses</div>);
                for(let i = 0; i < this.props.Addrs.length; i++)
                {
                    
                    addrs.push(
                    <div key={`addr${i}`}className="dashboard-address">
                            <Link className="dashboard-link" to={`/wallet/${this.props.Addrs[i].wif}`}>
                                <div className="dashboard-address-body">
                                    {(!this.props.Addrs[i].nick || this.props.Addrs[i].nick === "") ? this.props.Addrs[i].wif : this.props.Addrs[i].nick}                               
                                </div>
                            </Link>
                    </div>)
                }

                addrs.push(<div key="addrlogin" className="login-button" style={{width: '100%'}} onClick={this.showCreation}>
                Add new Address</div>);

                addrs.push(<Link key="addrlink" style={{textDecoration: 'none', width: '100%'}} to="/address"><div key="address" className="login-button" style={{width: '100%'}}>Get public address details</div></Link>);
                
            }
        }
        return <div id="dashboardroot" className="dashboard-root">
            <NavBar/>
            
            <div className="dashboard-container">
                {addrs}
            </div>
            {this.props.Creating &&
                <div className="dashboard-creating-modal">
                    <div className="dashboard-creating-body">
                        <header className="dashboard-creating-header" style={this.props.ErrorDat ? {color: '#F04747'} : {}}>
                            {this.props.ErrorDat === null ? "Adding new Address" : `Error: ${this.props.ErrorDat}`}
                        </header>
                        <div className="dashboard-creating-field">
                            ADDRESS (WIF FORMAT)
                        </div>
                        <textarea id="dashadd" className="dashboard-textarea" placeholder="ex. cPzjtrhgD1EeUQ3LbBj6kpwywo7EwXAPFWSH9LKcJ2XkHAHeUWX3"/>
                        <div className="dashboard-creating-field">
                            NICKNAME (OPTIONAL)
                        </div>
                        <textarea id="dashnick" className="dashboard-textarea" placeholder="ex. First TestNet"/>
                        <div className="dashboard-create-button" onClick={this.dispatchCreateRequest}>
                            Add
                        </div>
                        <div className="dashboard-cancel-button" onClick={this.closeCreation}>
                            Cancel
                        </div>
                    </div>
                </div>
            }
        
        </div>
    }

    componentDidMount()
    {
        this.props.dispatch({type: "DASHBOARD_RESET"});
        if(!this.Loading && !this.Loaded && !this.Addrs && this.props.UserData)
            this.fetchAddresses();
    }
}

export default connect(state => {
    return {
        UserData: state.login.accountData,
        Addrs: state.dashboard.addresses,
        Loading: state.dashboard.loading,
        Loaded: state.dashboard.Loaded,
        Creating: state.dashboard.addingNewAddress,
        ErrorDat: state.dashboard.error

    }
})(Dashboard);