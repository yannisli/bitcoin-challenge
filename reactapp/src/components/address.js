
import { connect } from 'react-redux';
import React, { Component } from 'react';

import './styles/main.css';

import fetch from 'node-fetch';

import Transactions from './transactions';

class Address extends Component
{
    constructor(props)
    {
        super(props);
        // Bind functions so that `this` is properly defined and `this.props` is accessible
        this.dispatchFetchRequest = this.dispatchFetchRequest.bind(this);
    }
    dispatchFetchRequest()
    {
        let address = document.getElementById("fetchtextarea").value;

        this.props.dispatch({type: "ADDRESS_FETCH_SENT"});
        // Make a node-fetch request to the Blockcypher Address API, the value is the value of the text-area with the ID 'fetchtextarea'
        fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then( response => { 
            // Then get JSON
            if(response.ok) {
                response.json()
                .then ( json => {
                    console.log(json);
                    // Dispatch that we received the response and set the data
                    this.props.dispatch({type: "ADDRESS_RESPONSE_RECEIVED", data: json});
                })
                .catch ( err => {
                    // On errors, still dispatch an event, but put that there is also an error to display as a modal
                    this.props.dispatch({type: "ADDRESS_RESPONSE_RECEIVED"});
                    this.props.dispatch({type: "ERROR_RESPONSE", data: err});
                });
            }
            else
            {
                // If response is not okay then it's an error still
                this.props.dispatch({type: "ADDRESS_RESPONSE_RECEIVED"});
                this.props.dispatch({type: "ERROR_RESPONSE", data: `Blockcypher API returned a ${response.status} status code`})
            }

        })
        .catch( err => {
            this.props.dispatch({type: "ADDRESS_RESPONSE_RECEIVED"});
            this.props.dispatch({type: "ERROR_RESPONSE", data: err});
        });
    }
    render()
    {
        // If we have data already loaded
        console.log(this.props.LoadedTransactions);
        if(!this.props.LoadedTransactions || !this.props.AddressData)
        {
            if(!this.props.LoadingTransactions)
                return (
                <div>
                    <header className="Main-header">
                        Welcome!
                    </header>
                    <div className="Main-body" style={{alignItems: 'center'}}>
                        Please enter the Public Address you would like to see the balance and transaction history of
                        <textarea id="fetchtextarea" className="Main-textarea" placeholder="ex. moXuzZgy2R7jG6yZeDv8P7ajUZu4wN2Fkn"/>
                        <div className="Main-button" onClick={this.dispatchFetchRequest}>Fetch</div>
                    </div>
                </div>);
            else
                return (
                    <div>
                        <header className="Main-header">
                            Fetching Data from Blockcypher...
                        </header>
                    </div>
                );
        }
        else
        {
            return (
                <div>
                    <header className="Main-header">
                        Displaying `{this.props.AddressData.address}`<br/>
                        <hr className="Main-hr"/>
                    </header>
                    
                    <div className="Main-body" style={{flexDirection: 'row'}}>
                        <div style={{width: '100%'}} className="Main-row">
                            <div className="Disc-button">Send Payment</div>
                            <div className="Disc-button-cancel" onClick={() => this.props.dispatch({type: "BACK_HOME"})}>Go Back</div>
                        </div>
                        <header className="Main-subheader">
                            Balance (sat)
                            <div className="Main-sub-body">
                                <div>
                                    Current: {this.props.AddressData.balance}
                                </div>
                                <div>
                                    Pending: {this.props.AddressData.unconfirmed_balance}
                                </div>
                                <div>
                                    Total: {this.props.AddressData.final_balance}
                                </div>
                            </div>
                        </header>

                        <header className="Main-subheader">
                            Transactions
                            <div className="Main-sub-body">
                                <div>
                                    Confirmed: {this.props.AddressData.n_tx}
                                </div>
                                <div>
                                    Pending: {this.props.AddressData.unconfirmed_n_tx}
                                </div>
                                <div>
                                    Total: {this.props.AddressData.final_n_tx}
                                </div>
                            </div>
                        </header>

                        <header className="Main-subheader">
                            In/Out Flow (sat)
                            <div className="Main-sub-body">
                                <div>
                                    Received: {this.props.AddressData.total_received}
                                </div>
                                <div>
                                    Sent: {this.props.AddressData.total_sent}
                                </div>
                            </div>
                        </header>
                        <header className="Main-header" style={{width: '100%'}}>
                            Transaction History
                        </header>
                        <Transactions/>
                    </div>
                </div>
                
            )
        }
    }
    componentDidMount()
    {
        console.log("Did Mount");
        console.log(this.props);
    }
}

export default connect( state => {
    return {
        Transactions: state.core.transactions,
        LoadingTransactions: state.core.fetchingTransactions,
        LoadedTransactions: state.core.loadedTransactions,
        AddressData: state.core.addressObject
    };
})(Address);