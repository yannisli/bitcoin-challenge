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
        case "WALLET_NEW_TX":
            let newData = Object.assign({}, newState.data);

            newData.txs.push(action.data);
            newState.data = newData;
            // We can also assume that the new tx is from the request so hide that
            newState.display = false;
            newState.error = null;
            return newState;
        case "WALLET_ERROR":
            newState.error = action.data;
            return newState;
        case "WALLET_HIDE_SENDING":
            newState.display = false;
            newState.error = null;
            return newState;
        case "WALLET_SHOW_SENDING":
            newState.display = true;
            newState.error = null;
            return newState;
        case "WALLET_SET_ECPAIR":
            console.log("wallet-set-ecpair");
            newState.ecpair = action.data;
            return newState;
        case "WALLET_FETCHING_DATA":
            newState.loading = true;
            newState.loaded = false;
            newState.data = null;
            return newState;
        case "WALLET_FETCHED_DATA":
            newState.loaded = true;
            newState.loading = false;
            newState.data = Object.assign({}, action.data);
            return newState;
        default:
            return newState;
    }
}

export default walletReducer;