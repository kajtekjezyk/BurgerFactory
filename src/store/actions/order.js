import * as actionTypes from './actionTypes';
import Axios from "../../axios-orders";

const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        id: id,
        orderData: orderData
    };
};

const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

const purchaseStarted = () => {
    return {
        type: actionTypes.PURCHASE_STARTED
    }
}

export const purchaseBurgerStart = (orderData, token) => {
    return (dispatch) => {
        dispatch(purchaseStarted());
        Axios.post('/orders.json?auth=' + token, orderData).then(response => {
            dispatch(purchaseBurgerSuccess(response.data.name, orderData));
        }).catch(error => {
            dispatch(purchaseBurgerFail(error));
        });
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}