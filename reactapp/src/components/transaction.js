import { connect } from 'react-redux';
import React, { Component } from 'react';

import moment from 'moment';

class Transaction extends Component {
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
        <div className="transaction-main">
            <div className="transaction-row">
                {this.props.TX.confirmed &&
                    <div className="transaction-content">
                        {moment(this.props.TX.confirmed).format('YYYY-MM-DD @ h:mm:ss a')}
                    </div>
                }
                {this.props.TX.received &&
                     <div className="transaction-content">
                        {moment(this.props.TX.received).format('YYYY-MM-DD @ h:mm:ss a')}
                    </div>
                }
                <div className="transaction-content">
                    {this.props.TX.tx_hash}
                </div>
            </div>
            {!this.props.TX.spent &&
                 <div className="transaction-content">
                    Satoshis Received: {this.props.TX.value}
                </div>
            }
            {this.props.TX.spent &&
                 <div className="transaction-content">
                    Satoshis Sent: {this.props.TX.value}
                </div>
            }

        </div>);
    }

    componentDidMount()
    {

    }
}

export default connect( (state, ownProps) => {
    return {};
})(Transaction);