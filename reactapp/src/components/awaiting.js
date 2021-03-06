import React, {Component} from 'react';

import {connect} from 'react-redux';

import loading from '../loading.svg';

import './styles/awaiting.css';

/**
 * A modal dialog to inform the user that we are awaiting a server response, blurs everything else out and displays ontop of everything else
 */
class AwaitingModal extends Component {
    render()
    {
        if(!this.props.Display) {
            if(document.getElementById("approot"))
                document.getElementById("approot").style.filter = "none";
            return <div></div>;
        }
        document.getElementById("approot").style.filter = 'blur(5px)';
        // Modal!
        return <div className="awaiting-modal">
            <div className="awaiting-header">
                Waiting for server...
            </div>
            <img src={loading} className="login-loading" alt="Loading..."/>
        </div>
    }
}

export default connect(state => {
    return {
        Display: state.core.awaitingServerResponse
    }
})(AwaitingModal);