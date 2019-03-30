import React, { Component } from 'react';

import { connect } from 'react-redux';

class ErrorModal extends Component {
    render()
    {
        // If there is no error just return an empty div
        if(!this.props.Display)
            return <div></div>
        // Otherwise display a modal
        return <div></div>
    }
}

export default connect(state => {
    return {
        Display: state.displayingError,
        Data: state.errorData
    }
})(ErrorModal);