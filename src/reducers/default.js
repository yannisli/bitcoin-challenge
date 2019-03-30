/**
 * Default Reducer, will handle the core functionality such as current address and the related information to that such as transactions history
 * Doing combineReducers for the future when things get larger and things will get split for code readability
 */

const initialState = {
    transactions: {},
    currentAddress: null
};
const defaultReducer = (state = initialState, action) => {
    // Assign to new object as Redux is immutable and we don't want mutations
    let newState = Object.assign({}, state);
    // Switch based on action type
    switch (action.type)
    {
        default: // Default, just return the old state
            return newState;
    }
};

export default defaultReducer;