
const initialState = {
    displayConfirms: true,
    displayPendings: true
}
const transactionReducer = (state = initialState, action) =>
{
    let newState = Object.assign({}, state);
    switch (action.type)
    {
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