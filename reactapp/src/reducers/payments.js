const initialState = {
    sendingPayment: false,
    displayPaymentModal: false,
    paymentResponse: null
}

const paymentReducer = (state = initialState, action) => {
    let newState = Object.assign({}, state);
    switch (action.type)
    {
        case "PAYMENT_RESPONSE_RECEIVED":
            newState.sendingPayment = false;
            newState.paymentResponse = action.data;
            return newState;
        case "PAYMENT_SENT":
            newState.displayPaymentModal = false;
            newState.sendingPayment = true;
            return newState;
        case "PAYMENT_DISPLAY_TOGGLE":
            newState.displayPaymentModal = !newState.displayPaymentModal;
            return newState;
        default:
            return newState;
    }
}

export default paymentReducer;