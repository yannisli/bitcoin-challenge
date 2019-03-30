import { connect } from 'react-redux';
import React, { Component } from 'react';

class Transaction extends Component {
    constructor(props)
    {
        super(props);
    }

    render()
    {

    }

    componentDidMount()
    {

    }
}

export default connect( (state, ownProps) => {
    return {Transaction: state.Transactions[ownProps.TransactionKey]};
})(Transaction);