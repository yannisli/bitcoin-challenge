
const initialState = {
    displayConfirms: true,
    displayPendings: true,
    displayModal: false,
    transHash: null,
}
const transactionReducer = (state = initialState, action) =>
{
    let newState = Object.assign({}, state);
    switch (action.type)
    {
        case "TRANSACTION_SHOW_MODAL": // Show inline, and save which transaction so not all of them display the inline confirmation
            newState.displayModal = true;
            newState.transHash = action.data;
            return newState;
        case "TRANSACTION_HIDE_MODAL": // Hide
            newState.displayModal = false;
            newState.transHash = null;
            return newState;
        case "TRANSACTION_TOGGLE_CONFIRMS": // Toggle dropdown of confirmed
            newState.displayConfirms = !newState.displayConfirms;
            return newState;
        case "TRANSACTION_TOGGLE_PENDINGS": // Toggle dropdown of pendings
            newState.displayPendings = !newState.displayPendings;
            return newState;
        default:
            return newState;
    }
}

export default transactionReducer;