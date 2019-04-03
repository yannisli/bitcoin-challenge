import React, { Component } from 'react';

import { connect } from 'react-redux';

import './styles/navbar.css';

class NavBar extends Component {
    constructor(props)
    {
        super(props);
        this.toggleNav = this.toggleNav.bind(this);
        this.dispatchLogoutRequest = this.dispatchLogoutRequest.bind(this);
    }

    toggleNav()
    {

        this.props.dispatch({type: "TOGGLE_NAV_DROP"});
    }
    dispatchLogoutRequest()
    {
        fetch('/api/logout', {
            method: 'GET'
        }).then(res => {
            this.props.dispatch({type: "LOGIN_LOGOUT"});
        }).catch(err => console.log(err));
    }


    render()
    {
        return <div className="navbar-root">
            <div className="navbar-container">
                <div className="navbar-button" onClick={this.toggleNav}>
                    Logged in as: {this.props.UserName}
                    
                </div>
                {this.props.Display &&
                    <div className="navbar-dropdown">
                        <div className="navbar-drop-button" onClick={this.dispatchLogoutRequest}>
                            Logout
                        </div>
                    </div>
                }
            </div>
            
        </div>
    }

    componentDidMount()
    {
        this.props.dispatch({type: "NAVDROP_HIDE"});
    }
}

export default connect(state => {
    return {
        UserName: state.login.accountData.username,
        Display: state.core.displayNavDrop
    }
})(NavBar);