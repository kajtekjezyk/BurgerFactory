import { put } from 'redux-saga/effects';
import * as actions from '../actions/order';
import Axios from "../../axios-orders";

export function* purchaseBurgerStartSaga(action) {
    yield put(actions.purchaseStarted());
    try {
        const response = yield Axios.post('/orders.json?auth=' + action.token, action.orderData);
        yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData));
    } catch(error) {
        yield put(actions.purchaseBurgerFail(error));
    }
}

