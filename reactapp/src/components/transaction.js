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
        <div className="Main-transaction">
            <div className="Main-row">
                {this.props.TX.confirmed &&
                    <div>
                        {moment(this.props.TX.confirmed).format('YYYY-MM-DD @ h:mm:ss a')}
                    </div>
                }
                {this.props.TX.received &&
                    <div>
                        {moment(this.props.TX.received).format('YYYY-MM-DD @ h:mm:ss a')}
                    </div>
                }
                <div>
                    {this.props.TX.tx_hash}
                </div>
            </div>
            {!this.props.TX.spent &&
                <div>
                    Satoshis Received: {this.props.TX.value}
                </div>
            }
            {this.props.TX.spent &&
                <div>
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