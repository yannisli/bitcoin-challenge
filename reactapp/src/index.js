import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';

import { createStore, combineReducers } from 'redux';

import { BrowserRouter } from 'react-router-dom';

import defaultReducer from './reducers/default';
import transactionReducer from './reducers/transactions';
import loginReducer from './reducers/login';
import dashboardReducer from './reducers/dashboard';
import walletReducer from './reducers/wallet';


// Our combined reducer
const combinedReducer = combineReducers({
    'core': defaultReducer,
    'transactions': transactionReducer,
    'login': loginReducer,
    'dashboard': dashboardReducer,
    'wallet': walletReducer
});
// Our Redux Store
const store = createStore(combinedReducer);
// Render our app, and provide the Redux store to the entire App
ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>),
document.getElementById('root'));

