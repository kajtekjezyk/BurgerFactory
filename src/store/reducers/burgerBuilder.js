import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    purchasing: false,
    burgerName: "My Burger"
}

const INGREDIENT_PRICES = {
    onion: 0.1,
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
    tomato: 0.3
}
const roundMe = (price) => {
    return +price.toFixed(2);
}

const modifyBurger = (oldState, action, diff) => {
    const updatedIngredient = {[action.ingType]: oldState.ingredients[action.ingType] + diff};
    const updatedState = {
        ingredients: updateObject(oldState.ingredients, updatedIngredient),
        totalPrice: roundMe(oldState.totalPrice + diff * INGREDIENT_PRICES[action.ingType]),
        burgerName: "My Burger"
    }
    return updateObject(oldState, updatedState);
}

const initBurger = (state, action) => {
    const updatedElements = {
        error: false,
        ingredients: action.burger,
        totalPrice: 4
    };
    return updateObject(state, updatedElements);
}

const loadBurger = (state, action) => {
    const updatedElements = {
        error: false, 
        purchasing: false,
        ingredients: action.burger,
        totalPrice: action.price, 
        burgerName: action.burgerName
    };
    return updateObject(state, updatedElements);
}

const burgerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: return modifyBurger(state, action, 1);
        case  actionTypes.REMOVE_INGREDIENT: return modifyBurger(state, action, -1);
        case actionTypes.REPORT_ERROR: return updateObject(state, {error: true});
        case actionTypes.INIT_BURGER: return initBurger(state, action);
        case actionTypes.PURCHASING: return updateObject(state, {purchasing: true});
        case actionTypes.STOP_PURCHASING: return updateObject(state, {purchasing: false});
        case actionTypes.LOAD_BURGER : return loadBurger(state, action)
        default:
            return state;
    }
}

export default burgerReducer;