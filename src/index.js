import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';

import { createStore, combineReducers } from 'redux';

import defaultReducer from './reducers/default';

// Our combined reducer
const combinedReducer = combineReducers({
    defaultReducer
});
// Our Redux Store
const store = createStore(combinedReducer);
// Render our app, and provide the Redux store to the entire App
ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>),
document.getElementById('root'));

