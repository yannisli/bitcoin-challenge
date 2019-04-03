import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Redirect, Link } from 'react-router-dom';

import loading from '../loading.svg';

import NavBar from './navbar';

import Transactions from './transactions';

import './styles/address.css';
/**
 * /address page. Used to fetch public address info, but does not have the ability to send payments
 */
class Address extends Component {
    constructor(props)
    {
        super(props);
        this.dispatchFetchRequest = this.dispatchFetchRequest.bind(this);
    }
    /**
     * Fetch from textarea
     */
    dispatchFetchRequest()
    {
        this.props.dispatch({type: "ADDRESS_FETCH_SENT"});
        let address = document.getElementById("fetchtextarea").value;
        fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full`,
        {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        }).then( res => {
            if(!res.ok)
            {
                res.json().then(json => {console.log(json);this.props.dispatch({type: "ERROR_RESPONSE", data: `Received response code ${res.status} from server\n${json.error}`})}).catch(err => console.log(err));
                this.props.dispatch({type: "ADDRESS_RESET"});
            }
            else
            {
                res.json().then(json => {
                    this.props.dispatch({type: "ADDRESS_RESPONSE_RECEIVED", data: json});
                }).catch(err => console.log(err));
            }
        }).catch(err => {
            console.log(err);
            this.props.dispatch({type: "ERROR_RESPONSE", data: `GET request to Blockcypher API failed`});
            this.props.dispatch({type: "ADDRESS_RESET"});
        });
    }
    render()
    {
        if(!this.props.UserData)
            return <Redirect to="/"/>
        let toRender;
        if(!this.props.Loaded)
        {
            if(this.props.Loading)
            {
                toRender = <div className="address-content"><header className="login-header">
                    Fetching address data...
                    <img src={loading} alt="Loading..." className="login-loading"/>
                </header>
                </div>
            }
            else
            {
                toRender = <div className="address-form">
                    Please enter the address you would like to see the balance and transaction history of
                    <textarea id="fetchtextarea" className="address-textarea" placeholder="ex. mxG1GPC5Ro3ha6ijugkQJ4oUkMANj7LxY2"/>
                    <div className="address-button" onClick={this.dispatchFetchRequest}>Fetch</div>
                    <Link to="/dashboard" style={{width: '100%', textDecoration: 'none'}}><div className="address-cancel">Back to Dashboard</div></Link>
                    {this.props.Error &&
                        <div className="address-error">
                            {this.props.Error}
                        </div>
                    }
                </div>
            }
        }
        else
        {
            toRender = <div className="address-content">
                <Link to="/dashboard" style={{width: '100%', textDecoration: 'none'}}><div className="address-cancel" style={{marginTop: '0'}}>Back to Dashboard</div></Link>
                <header className="address-header">
                    Public Key
                    <div className="address-subheader">
                        {this.props.Data.address}
                    </div>
                </header>
                <div className="wallet-row">
                    <div className="wallet-row-body">
                        <div className="wallet-row-header">
                            Balance (sat)
                        </div>
                        <div className="wallet-row-content">
                            Current: {this.props.Data.balance}
                        </div>
                        <div className="wallet-row-content">
                            Unconfirmed: {this.props.Data.unconfirmed_balance}
                        </div>
                        <div className="wallet-row-content">
                            Total: {this.props.Data.final_balance}
                        </div>
                    </div>
                    <div className="wallet-row-body">
                        <div className="wallet-row-header">
                            Transactions
                        </div>
                        <div className="wallet-row-content">
                            Confirmed: {this.props.Data.n_tx}
                        </div>
                        <div className="wallet-row-content">
                            Pending: {this.props.Data.unconfirmed_n_tx}
                        </div>
                        <div className="wallet-row-content">
                            Total: {this.props.Data.final_n_tx}
                        </div>
                    </div>
                </div>
                <Transactions Address={this.props.Data.address} AddressData={this.props.Data}/>
            </div>
        }
        return <div className="address-body">
            <NavBar/>
            {toRender}
        </div>
    }
    componentDidMount()
    {
        this.props.dispatch({type: "ADDRESS_RESET"});
    }
}

export default connect(state => {
    return {
        UserData: state.login.accountData,
        Loading: state.core.fetchingAddress,
        Loaded: state.core.fetchedAddress,
        Data: state.core.publicAddressData,
        Error: state.core.fetchError
    }

})(Address);