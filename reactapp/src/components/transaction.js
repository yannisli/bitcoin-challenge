import { connect } from 'react-redux';
import React, { Component } from 'react';

import moment from 'moment';

/**
 * Represents one single Transaction element. Its data is obtained by passing it via props as well as some Redux store for the logic to display a confirmation modal and which specific element it should display
 * TSP - trySendPayment function from wallet.js If this is not passed, then the send again button will not be present
 * TX - This data is needed. It is not exactly the same TX object from the API endpoint, but rather modified in transactions.js
 */
class Transaction extends Component {
    constructor(props)
    {
        super(props);
        this.displayConfirmModal = this.displayConfirmModal.bind(this);
        this.hideConfirmModal = this.hideConfirmModal.bind(this);
    }
    /**
     * Display the inline confirmation
     * @param {string} hash The hash of the transaction of which it's button was clicked. Used to make sure not all of them will suddenly have the inline confirm
     */
    displayConfirmModal(hash)
    {
        this.props.dispatch({type: "TRANSACTION_SHOW_MODAL", data: hash});
    }
    /**
     * Hide the confirmation
     */
    hideConfirmModal()
    {
        this.props.dispatch({type: "TRANSACTION_HIDE_MODAL"});
    }
    render()
    {
        return (
        <div className="transaction-main">
            <div className="transaction-row">

                <div className="transaction-content">
                    {moment(this.props.TX.time).format('YYYY-MM-DD @ h:mm:ss a')}
                </div>

                <div className="transaction-content">
                    {this.props.TX.hash}
                </div>
            </div>
            <div className="transaction-content">
                Satoshis {this.props.TX.outgoing ? "Sent: " : "Received: "}{this.props.TX.value}
            </div>
            <div className="transaction-content">
                Fees: {this.props.TX.fees}
            </div>
            <div className="transaction-content">
                {this.props.TX.outgoing ? `To: ${this.props.TX.to}` : `From: ${this.props.TX.from}`}
            </div>
            {(!this.props.Display || (this.props.Display && this.props.Hash !== this.props.TX.hash)) && this.props.TX.outgoing && this.props.TSP &&
                <div className="transaction-block-button" onClick={() => {
                    this.displayConfirmModal(this.props.TX.hash);
                }}>
                    Send Again
                </div>
            }
            {this.props.Display && this.props.TX.outgoing && this.props.Hash === this.props.TX.hash &&
                <div className="transaction-row" style={{marginTop: '10px', marginBottom: '0'}}>
                    <div className="transaction-confirm-button" onClick={() => this.props.TSP(this.props.TX.value, this.props.TX.to)}>
                        Confirm
                    </div>
                    <div className="transaction-cancel-button" onClick={this.hideConfirmModal}>
                        Cancel
                    </div>
                </div>
            }

        </div>);
    }

    componentDidMount()
    {

    }
}

export default connect( (state, ownProps) => {
    return {
        Display: state.transactions.displayModal,
        Hash: state.transactions.transHash
    };
})(Transaction);