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

export const removeByClicking = (ingType, key) => {
    return {
        type: actionTypes.REMOVE_BY_CLICKING,
        ingType: ingType,
        key: key
    }
}

const initIngredints = (burger) => {
    return {
        type: actionTypes.INIT_BURGER,
        ingredientsCounter: burger
    }
}

const reportError = () => {
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
    return dispatch => {
        Axios.get('https://react-my-burger-2c971-default-rtdb.firebaseio.com/ingredients.json').then(response => {
            dispatch(initIngredints(response.data));
        }).catch(error => {
            dispatch(reportError)
        })
    }
}

export const loadBurger = (price, ingredientsCounter, burger, burgerName) => {
    return {
        type: actionTypes.LOAD_BURGER,
        ingredientsCounter: ingredientsCounter,
        price: price,
        burger: burger,
        burgerName: burgerName
    }
} 