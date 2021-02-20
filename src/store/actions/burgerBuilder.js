import * as actionTypes from './actionTypes';
import Axios from "../../axios-orders";

export const addIngredient = (ingType) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingType: ingType
    };
};

export const removeIngredient = (ingType) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingType: ingType
    };
};

export const initIngredints = (burger) => {
    return {
        type: actionTypes.INIT_BURGER,
        burger: burger
    }
}

export const reportError = () => {
    return {
        type: actionTypes.REPORT_ERROR,
    }
}

export const purchasing = () => {
    return {
        type: actionTypes.PURCHASING
    }
}

export const stopPurchasing = () => {
    return {
        type: actionTypes.STOP_PURCHASING
    }
}

export const initBurger = () => {
    return {
        type: actionTypes.INIT_BURGER_START
    }
}