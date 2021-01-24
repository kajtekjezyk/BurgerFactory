import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";

const initialState = {
    order: null,
    loading: false,
    purchased: false
};

const purchaseSucceed = (state, action) => {
    const newOrder = {...action.orderData, id: action.id};
    return updateObject(state, {loading: false, order: newOrder, purchased: true});
}

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseSucceed(state, action);
        case actionTypes.PURCHASE_BURGER_FAIL: return updateObject(state, {loading: false});
        case actionTypes.PURCHASE_STARTED: return updateObject(state, {loading: true});
        case actionTypes.PURCHASE_INIT: return updateObject(state, {purchased: false});
        case actionTypes.RESET_PURCHASE: return updateObject(state, initialState); 
        default:
            return state;
    }
}

export default orderReducer;