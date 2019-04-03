
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
        case "TRANSACTION_SHOW_MODAL":
            newState.displayModal = true;
            newState.transHash = action.data;
            return newState;
        case "TRANSACTION_HIDE_MODAL":
            newState.displayModal = false;
            return newState;
        case "TRANSACTION_TOGGLE_CONFIRMS":
            newState.displayConfirms = !newState.displayConfirms;
            return newState;
        case "TRANSACTION_TOGGLE_PENDINGS":
            newState.displayPendings = !newState.displayPendings;
            return newState;
        default:
            return newState;
    }
}

export default transactionReducer;