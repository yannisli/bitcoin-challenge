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
        case "LOGIN_ERROR": // Inline error
            newState.inlineError = action.data;
            return newState;
        case "LOGIN_LOGOUT": // User logged out, reset to initial state
            newState = initialState;
            return newState;
        case "LOGIN_FETCHING_ACCOUNT": // Fetching
            newState.loadedAccount = false;
            newState.fetchingAccount = true;
            newState.inlineError = null;
            return newState;
        case "LOGIN_ACCOUNT_FETCHED": // Fetched data from internal API
            newState.loadedAccount = true;
            newState.fetchingAccount = false;
            newState.accountData = action.data;
            newState.inlineError = null;
            return newState;
        case "LOGIN_TOGGLE_CREATING": // Creating a new account
            newState.creatingAccount = !newState.creatingAccount;
            newState.inlineError = null;
            return newState;
        default:
            return newState;
    }
}

export default loginReducer;