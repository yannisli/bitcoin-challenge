import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Redirect, Link } from 'react-router-dom';

import './styles/dashboard.css';

import NavBar from './navbar';

class Dashboard extends Component {
    constructor(props)
    {
        super(props);

        this.fetchAddresses = this.fetchAddresses.bind(this);
        this.showCreation = this.showCreation.bind(this);
        this.closeCreation = this.closeCreation.bind(this);
        this.dispatchCreateRequest = this.dispatchCreateRequest.bind(this);
    }
    showCreation() {
        this.props.dispatch({type: "DASHBOARD_SHOW_CREATING"});
    }
    closeCreation() {
        this.props.dispatch({type: "DASHBOARD_CLOSE_CREATING"});
    }
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
    dispatchCreateRequest()
    {
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
                    this.props.dispatch({type: "DASHBOARD_CREATE_FINISHED", data: json});
                }).catch(err => console.log(err));
            }
        }).catch(err => {
            console.log(err);
            this.props.dispatch({type: "DASHBOARD_CREATE_FINISHED"})
        })
    }
    render()
    {
        if(!this.props.UserData)
            return <Redirect to="/"/>
        let addrs = [];

        if(this.props.Addrs) {
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

                addrs.push(<div key="addrlogin" className="login-button" style={{width: '384px'}} onClick={this.showCreation}>
                Add new Address</div>);
                
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