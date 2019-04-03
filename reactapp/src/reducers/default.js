/**
 * Default or 'Core' Reducer, will handle the core functionality such as current address and the related information to that such as transactions history
 * Doing combineReducers for the future when things get larger and things will get split for code readability
 */

const initialState = {
    displayingError: false, // Are we displaying an error
    errorData: null, // Error data
    displayNavDrop: false, // Display the navbar dropdown
    awaitingServerResponse: false, // Are we awaiting a server response. Typically used after actions that had a modal beforehand
    fetchingAddress: false, // Are we fetching public address data
    fetchedAddress: false, // Did we finish
    publicAddressData: null, // The data
    fetchError: null, // Error for /Address
};

// Reducer function
const defaultReducer = (state = initialState, action) => {
    // Assign to new object as Redux is immutable
    // If not assigned and we modify/mutate, the === will still be true from old to new after the reducer action, not triggering a re-render
    let newState = Object.assign({}, state);
    // Switch based on action type
    switch (action.type)
    {
        case "NAVDROP_HIDE": // Hide the navdrop, used in componentDidMount()
            newState.displayNavDrop = false;
            return newState;
        case "SERVER_RESPONSE_RECEIVED": // Received a server response so stop displaying
            newState.awaitingServerResponse = false;
            return newState;
        case "AWAITING_SERVER_RESPONSE": // Awaiting a server response so display
            newState.awaitingServerResponse = true;
            return newState;
        case "TOGGLE_NAV_DROP": // User clicks on the 'logged in as' button, toggle between display or hide
            newState.displayNavDrop = !newState.displayNavDrop;
            return newState;
        case "BACK_HOME": // Went back home, reset everything to initial state
            newState = initialState;
            return newState;
        case "ERROR_OK": // When users press OK in the error modal
            newState.displayingError = false;
            newState.errorData = null;
            return newState;
        case "ADDRESS_RESET": // Address didMount, reset everything to initial
            newState.fetchingAddress = false;
            newState.fetchedAddress = false;
            newState.publicAddressData = null;
            newState.fetchError = null;
            return newState;
        case "ADDRESS_ERROR": // An error happened, display an inline error
            newState.fetchError = action.data;
            return newState;
        case "ADDRESS_FETCH_SENT": // When users press fetch
            newState.fetchingAddress = true;
            return newState;
        case "ADDRESS_RESPONSE_RECEIVED": // When we receive a response, either ok or error
            // Empty action.data when there's an error
            if(action.data !== undefined)
                newState.publicAddressData = action.data;
            newState.fetchingAddress = false;
            newState.fetchedAddress = true;
            return newState;
        case "ERROR_RESPONSE": // When we receive a response and there was an error, to make it so error modal will display
            newState.displayingError = true;
            newState.errorData = action.data;
            newState.awaitingServerResponse = false;
            return newState;
        default: // Default, just return the old state
            return newState;
    }
};

export default defaultReducer;