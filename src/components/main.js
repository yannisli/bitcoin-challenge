
import { connect } from 'react-redux';
import React, { Component } from 'react';

import './styles/main.css';

class Main extends Component
{
    constructor(props)
    {
        super(props);
    }
    render()
    {
        let hasTransactions = this.props.Transactions && Object.keys(this.props.Transactions).length > 0 ? true : false;
        let toRender;
        if(!hasTransactions)
        {
            return (
            <header className="Main-header">
                Looks like you haven't fetched transactions & balance information... You can do that by filling out the text field below and clicking 'Fetch''
                <div className="Main-body">
                    Please enter the Public Address you would like to see the balance and transaction history of
                    <textarea id="fetchtextarea" className="Main-textarea" placeholder="ex. moXuzZgy2R7jG6yZeDv8P7ajUZu4wN2Fkn"/>
                    <div className="Main-button">Fetch</div>
                </div>
            </header>);
        }
        else
        {
            return (
                <div className="Main-body">
                    Hello there
                </div>
            )
        }
    }
    componentDidMount()
    {

    }
}

export default connect(state => {
    return {
        Transactions: state.transactions,
        LoadingTransactions: state.fetchingTransactions
    };
})(Main);