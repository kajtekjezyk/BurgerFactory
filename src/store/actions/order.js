import * as actionTypes from './actionTypes';
import Axios from "../../axios-orders";

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        id: id,
        orderData: orderData
    };
};

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

export const purchaseStarted = () => {
    return {
        type: actionTypes.PURCHASE_STARTED
    }
}

export const purchaseBurgerStart = (orderData, token) => {
    return {
        type: actionTypes.PURCHASE_BURGER_START,
        orderData: orderData,
        token: token
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}