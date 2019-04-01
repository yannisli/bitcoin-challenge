import React, { Component } from 'react';

import { connect } from 'react-redux';

import './styles/error.css';

class ErrorModal extends Component {
    constructor(props)
    {
        super(props);
        this.closeError = this.closeError.bind(this);
    }
    closeError()
    {
        this.props.dispatch({type: "ERROR_OK"});
    }
    render()
    {
        // If there is no error just return an empty div
        if(!this.props.Display) {
            if(document.getElementById("approot"))
            document.getElementById("approot").style.filter = "none";
            return <div></div>
        }
        document.getElementById("approot").style.filter = "blur(5px)";
        // Otherwise display a modal
        return <div className="error-modal">
            <div className="error-header">
                We've encountered an error!
                <div className="error-body">
                    "{this.props.Data}"
                </div>
            </div>
           
            <div className="error-button" onClick={this.closeError}>
                Confirm
            </div>
        </div>
    }
}

export default connect(state => {
    return {
        Display: state.core.displayingError,
        Data: state.core.errorData
    }
})(ErrorModal);