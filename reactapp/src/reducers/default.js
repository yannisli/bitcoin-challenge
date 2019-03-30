/**
 * Default or 'Core' Reducer, will handle the core functionality such as current address and the related information to that such as transactions history
 * Doing combineReducers for the future when things get larger and things will get split for code readability
 */

const initialState = {
    transactions: [], // Array of Transaction objects
    addressObject: null, // Data of current address
    loadedTransactions: false, // Have we loaded transactions?
    fetchingTransactions: false, // Are we fetching new transactions/balance
    displayingError: false, // Are we displaying an error
    errorData: null, // Error data

};

// Reducer function
const defaultReducer = (state = initialState, action) => {
    console.log("Reduce", state, action);
    // Assign to new object as Redux is immutable
    // If not assigned and we modify/mutate, the === will still be true from old to new after the reducer action, not triggering a re-render
    let newState = Object.assign({}, state);
    // Switch based on action type
    switch (action.type)
    {
        case "BACK_HOME":
            newState = initialState;
            return newState;
        case "ERROR_OK": // When users press OK in the error modal
            newState.displayingError = false;
            newState.errorData = null;
            return newState;
        case "ADDRESS_FETCH_SENT": // When users press fetch
            newState.fetchingTransactions = true;
            return newState;
        case "ADDRESS_RESPONSE_RECEIVED": // When we receive a response, either ok or error
            // Empty action.data when there's an error
            if(action.data !== undefined)
                newState.addressObject = action.data;
            newState.fetchingTransactions = false;
            newState.loadedTransactions = true;
            return newState;
        case "ERROR_RESPONSE": // When we receive a response and there was an error, to make it so error modal will display
            newState.displayingError = true;
            newState.errorData = action.data;
            return newState;
        default: // Default, just return the old state
            return newState;
    }
};

export default defaultReducer;