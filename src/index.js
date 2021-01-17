import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {Provider} from 'react-redux'
import BurgerReducer from './store/reducers/burgerBuilder';
import OrderReducer from './store/reducers/order';
import AuthReducer from './store/reducers/auth';
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  || compose;

const combinedReducers = {
    burger: BurgerReducer,
    order: OrderReducer,
    auth: AuthReducer
}

const store = createStore(combineReducers(combinedReducers), composeEnhancers(applyMiddleware(thunk)));

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();

