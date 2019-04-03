const initialState = {
    loading: false,
    loaded: false,
    data: null,
    ecpair: null,
    display: false,
    error: null
}

const walletReducer = (state = initialState, action) => {
    let newState = Object.assign({}, state);

    switch(action.type) {
        case "WALLET_NEW_TX": // Received response from /txs/send, push the new TX into the Redux store
            let newData = Object.assign({}, newState.data);

            newData.txs.push(action.data);
            newState.data = newData;
            // We can also assume that the new tx is from the request so hide the dialog now
            newState.display = false;
            newState.error = null;
            return newState;
        case "WALLET_ERROR": // Inline error
            newState.error = action.data;
            return newState;
        case "WALLET_HIDE_SENDING": // Hide the sending payment dialog
            newState.display = false;
            newState.error = null;
            return newState;
        case "WALLET_SHOW_SENDING": // Show it
            newState.display = true;
            newState.error = null;
            return newState;
        case "WALLET_SET_ECPAIR": // Set our ECPair data, called in didMount()
            newState.ecpair = action.data;
            return newState;
        case "WALLET_FETCHING_DATA": // Are we fetching data from server
            newState.loading = true;
            newState.loaded = false;
            newState.data = null;
            return newState;
        case "WALLET_FETCHED_DATA": // Fetched data, add it to Redux store
            newState.loaded = true;
            newState.loading = false;
            newState.data = Object.assign({}, action.data);
            return newState;
        default:
            return newState;
    }
}

export default walletReducer;