import React, { Component } from 'react';

import { connect } from 'react-redux';

import Transaction from './transaction';

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
        let pendingTransactions = [];
        let confirmedTransactions = [];
        if(this.props.DisplayPendings)
        {
            if(this.props.AddressData.unconfirmed_txrefs && this.props.AddressData.unconfirmed_txrefs.length > 0)
            {
                for(let i in this.props.AddressData.unconfirmed_txrefs)
                {
                    let tx = this.props.AddressData.unconfirmed_txrefs[i];
                    pendingTransactions.push(<Transaction key={`pending${i}`} TX={tx}/>);
                }
            }
            else
            {
                pendingTransactions = <div className="Main-transaction">
                    There are no pending transactions!
                </div>
            }
        }
        if(this.props.DisplayConfirms)
        {
            if(this.props.AddressData.txrefs && this.props.AddressData.txrefs.length > 0)
            {
                for(let i in this.props.AddressData.txrefs)
                {
                    let tx = this.props.AddressData.txrefs[i];
                    confirmedTransactions.push(<Transaction key={`confirmed${i}`} Confirmed={true} TX={tx}/>);
                }
            }
            else
            {
                confirmedTransactions = <div className="Main-transaction">
                    There are no confirmed transactions!
                </div>
            }
        }
        return (
        <div className="Main-transaction-body">
            <header className="Main-subheader">
                <div>
                    <span style={{display: 'inline-block', width: '20px', padding: '0px'}} className="Main-button" onClick={this.togglePending}>
                        {this.props.DisplayPendings ? "-" : "+"}
                    </span>
                    <span>
                        Pending Transactions
                    </span>
                </div>
            </header>
            {pendingTransactions}
            <header className="Main-subheader">
                <div>
                    <span style={{display: 'inline-block', width: '20px', padding: '0px'}} className="Main-button" onClick={this.toggleConfirm}>
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
        AddressData: state.core.addressObject,
        DisplayPendings: state.transactions.displayPendings,
        DisplayConfirms: state.transactions.displayConfirms,
    }
})(Transactions);