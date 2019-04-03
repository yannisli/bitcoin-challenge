import React, { Component } from 'react';

import { connect } from 'react-redux';

import Transaction from './transaction';

import './styles/transaction.css';

/**
 * Component that displays the entire transaction history of a specific address.
 * Data is passed via props and has Redux store for logic in minimizing/expanding the list of pending/confirmeds
 * TSP - Passed down from wallet.js so that it can be passed into each individual Transaction element.
 * AddressData - The address data that the element is responsible for. Should be the raw TX object returned from the addrs/:address/full endpoint
 */
class Transactions extends Component {

    constructor(props)
    {
        super(props);

        this.toggleConfirm = this.toggleConfirm.bind(this);
        this.togglePending = this.togglePending.bind(this);
    }
    toggleConfirm()
    {
        this.props.dispatch({type: "TRANSACTION_TOGGLE_CONFIRMS"});
    }
    togglePending()
    {
        this.props.dispatch({type: "TRANSACTION_TOGGLE_PENDINGS"});
    }
    render()
    {
        if(!this.props.AddressData)
            return <div></div>
        let pendings = [];
        let confirmeds = [];
        // Loop through TXs
        if(this.props.AddressData) {
            for(let i in this.props.AddressData.txs)
            {
                let tx = this.props.AddressData.txs[i];
                // Check TX outputs and inputs
                let isOutgoing = false;
                let isPending = tx.confirmed ? false : true;
                // Pending will have no 'confirmed' field
                // If input and output has this address, it was an outgoing transaction
                // If only output exists, it was incoming
                // Loop through both inputs and outputs and determine if this transaction is outbound
                // Does our input exist?
                let inputExists = false, outputExists = false;
                // Loop through inputs
                // From what I've seen inputs are typically length 1, however loop through just to be sure..
                for(let j in tx.inputs)
                {
                    let input = tx.inputs[j];
                    // Addresses is an array.. despite it only containing one element everytime..
                    let addr = input.addresses[0];
                    // Does this address match our address?
                    if(addr === this.props.Address)
                    {
                        // Then input exists and break out of the loop early
                        inputExists = true;
                        break;
                    }
                
                 
                }
                // Loop through outputs
                for(let j in tx.outputs)
                {
                    let output = tx.outputs[j];
                    let addr = output.addresses[0];
                    
                    if(addr === this.props.Address)
                    {
                        // Output exists
                        outputExists = true;
                        break;
                    }
                   
                }
                // Outgoing must have both input and outputs existing
                isOutgoing = inputExists && outputExists;
                //console.log("this transaction: ", i, "isOutgoing: ", isOutgoing);

                // Value is the amount in Output that we receive if this is NOT outgoing
                // Otherwise value is the amount in Output for the other address if this is outgoing
                let value = 0;
                // Loop through outputs again
                for(let j in tx.outputs)
                {
                    let output = tx.outputs[j];
                    let addr = output.addresses[0];
                    //console.log("j", j, "addr:", addr);
                    // If not outgoing, then the value will be the value for our address
                    if(!isOutgoing)
                    {
                        if(addr === this.props.Address)
                        {
                            value = output.value;
                            break;
                        }
                    }
                    else // If outgoing, then the value will be the value for the other address(es)
                    {
                        if(addr !== this.props.Address)
                        {
                            value += output.value;
                        }
                    }
                    
                }
                
                // Construct our object that we will pass to the child Transaction component
                let txObject = {
                    time: tx.received, // What time did this transaction get started
                    value: value, // How many satoshis were in it
                    hash: tx.hash, // What's the transaction hash
                    fees: tx.fees, // Fees
                    outgoing: isOutgoing, // Was this an outgoing or incoming transaction,
                }
                // The address that we received this payment from. From what I've seen inputs is always length 1..
                if(!isOutgoing) {
                    txObject.from = tx.inputs[0].addresses[0];
                }
                else
                {
                    // Loop through outputs to find the address that does not match ours
                    for(let j in tx.outputs)
                    {
                        let addr = tx.outputs[j].addresses[0];
                        if(addr !== this.props.Address)
                        {
                            txObject.to = addr;
                            break;
                        }
                    }
                }
                // Push to the proper array
                if(isPending)
                    pendings.push(txObject);
                else
                    confirmeds.push(txObject);
            }
        }
        console.log(pendings);
        console.log(confirmeds);
        // Array of JSX elements
        let pendingTransactions = [];
        let confirmedTransactions = [];
        // If we can display pendings
        if(this.props.DisplayPendings)
        {
            
            if(pendings.length > 0)
            {
                // Loop through pendings and push new Transaction components
                for(let i in pendings)
                {
                    pendingTransactions.push(<Transaction TSP={this.props.TSP} key={`pending${i}`} TX={pendings[i]}/>);
                }
            }
            else
            {
                // Display that there are no transactions that are pending
                pendingTransactions = <div className="transaction-main">
                    There are no pending transactions!
                </div>
            }
        }
        if(this.props.DisplayConfirms)
        {
            if(confirmeds.length > 0)
            {
                // Loop through confirmeds and push new Transaction components
                for(let i in confirmeds)
                {
                    confirmedTransactions.push(<Transaction TSP={this.props.TSP} key={`confirmed${i}`} TX={confirmeds[i]}/>);
                }
            }
            else
            {
                // Display that there are no transactions that have been confirmed
                confirmedTransactions = <div className="transaction-main">
                    There are no confirmed transactions!
                </div>
            }
        }
        return (
        <div className="transaction-body">
            <header className="transaction-subheader">
                <div>
                    <span style={{display: 'inline-block', width: '20px', padding: '0px'}} className="transaction-button" onClick={this.togglePending}>
                        {this.props.DisplayPendings ? "-" : "+"}
                    </span>
                    <span>
                        Pending Transactions
                    </span>
                </div>
            </header>
            {pendingTransactions}
            <header className="transaction-subheader">
                <div>
                    <span style={{display: 'inline-block', width: '20px', padding: '0px'}} className="transaction-button" onClick={this.toggleConfirm}>
                        {this.props.DisplayConfirms ? "-" : "+"}
                    </span>
                    <span>
                        Confirmed Transactions
                    </span>
                </div>
                
            </header>
            {confirmedTransactions}
        </div>);
    }
}

export default connect(state => {
    return {
        DisplayPendings: state.transactions.displayPendings,
        DisplayConfirms: state.transactions.displayConfirms,
    }
})(Transactions);