const initialState = {
    creatingAccount: false,
    fetchingAccount: false,
    loadedAccount: false,
    accountData: null,
    inlineError: null
}

const loginReducer = (state = initialState, action) => {
    let newState = Object.assign({}, state);
    switch(action.type)
    {
        case "LOGIN_ERROR":
            newState.inlineError = action.data;
            return newState;
        case "LOGIN_LOGOUT":
            newState = initialState;
            return newState;
        case "LOGIN_FETCHING_ACCOUNT":
            newState.loadedAccount = false;
            newState.fetchingAccount = true;
            newState.inlineError = null;
            return newState;
        case "LOGIN_ACCOUNT_FETCHED":
            newState.loadedAccount = true;
            newState.fetchingAccount = false;
            newState.accountData = action.data;
            newState.inlineError = null;
            return newState;
        case "LOGIN_TOGGLE_CREATING":
            newState.creatingAccount = !newState.creatingAccount;
            newState.inlineError = null;
            return newState;
        default:
            return newState;
    }
}

export default loginReducer;