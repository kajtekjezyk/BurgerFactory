import {takeEvery} from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import { logoutSaga, authAuthTimeoutSaga, authUserSaga, authCheckStateSaga } from './auth';
import { initBurgerSaga } from './burgerBuilder';
import { purchaseBurgerStartSaga } from './order';

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, authAuthTimeoutSaga);
    yield takeEvery(actionTypes.AUTH, authUserSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);

}

export function* watchBurger() {
    yield takeEvery(actionTypes.INIT_BURGER_START, initBurgerSaga);
}

export function* watchOrder() {
    yield takeEvery(actionTypes.PURCHASE_BURGER_START, purchaseBurgerStartSaga);
}