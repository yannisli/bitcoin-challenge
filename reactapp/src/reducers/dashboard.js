const initialState = {
    loading: false,
    loaded: false,
    addresses: [],
    addingNewAddress: false,
    error: null
}

const dashboardReducer = (state = initialState, action) => {

    let newState = Object.assign({}, state);

    switch(action.type)
    {
        case "DASHBOARD_CREATE_FINISHED":
            newState.error = null;
            newState.addingNewAddress = false;
            // Add new to addresses
            let newArr = [...newState.addresses];
            if(action.data !== undefined)
                newArr.push(action.data);

            newState.addresses = newArr;
            return newState;
        case "DASHBOARD_CREATE_ERROR":
            newState.error = action.data;
            return newState;
        case "DASHBOARD_RESET":
            newState = initialState;
            return newState;
        case "DASHBOARD_SHOW_CREATING":
            newState.addingNewAddress = true;
            return newState;
        case "DASHBOARD_CLOSE_CREATING":
            newState.addingNewAddress = false;
            return newState;
        case "DASHBOARD_FETCHED_ADDR":
            newState.loading = false;
            newState.loaded = true;
            newState.addresses = action.data;
            return newState;
        case "DASHBOARD_FETCHING_ADDRS":
            newState.loading = true;
            newState.loaded = false;
            newState.addresses = null;
            return newState;
        default:
            return newState;
    }

}

export default dashboardReducer;