import { put } from 'redux-saga/effects';
import * as actions from '../actions/burgerBuilder';
import Axios from "../../axios-orders";


export function* initBurgerSaga(action) {
    try {
        const response = yield Axios.get('https://react-my-burger-2c971-default-rtdb.firebaseio.com/ingredients.json');
        yield put(actions.initIngredints(response.data));
    } catch(error) {
        yield put(actions.reportError);
    }
}