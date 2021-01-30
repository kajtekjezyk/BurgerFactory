import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";

const initialState = {
    ingredientsCounter: null,
    totalPrice: 4,
    error: false,
    purchasing: false,
    burgerName: "My Burger",
    burger: [],
    operationCounter: 0
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

const createIngredientObject = (oldState, action) => {
    const updatedBurger = [...oldState.burger];
    updatedBurger.push({
        key: `${action.ingType}_${oldState.operationCounter}`,
        ingType: action.ingType,
        count: 1});
    return updatedBurger
} 

const modifyMeat = (burger, index, diff) => {
    const updatedBurger = [...burger];
    const updatedBurgerElem = {...updatedBurger[index]};
    updatedBurgerElem.count = updatedBurgerElem.count + diff;
    updatedBurger[index] = updatedBurgerElem;
    return updatedBurger;
}

const isMeatChangeNeedded = (currentIngredient, lastIngredient) => {
    return currentIngredient === "meat" && lastIngredient === "meat";
}

const cleanAfterRemoval = (burger) => {
    for (let i = 0; i < burger.length - 1; ++i) {
        console.log(burger[i])
        if (burger[i].ingType === "meat" && burger[i + 1].ingType === "meat") {
            burger[i].count += burger[i + 1].count;
            burger.splice(i+1, 1);
            i -= 1;
        }
    }
    return burger;
}

const addElementToBurger = (oldState, action) => {
    const lastBurgerElem = oldState.burger.length - 1;
    if (oldState.burger.length > 0 && 
        isMeatChangeNeedded(action.ingType, oldState.burger[lastBurgerElem].ingType)) {
        return modifyMeat(oldState.burger, lastBurgerElem ,1);
    } else {
        return createIngredientObject(oldState, action);
    }
}

const addIngredient = (oldState, action) => {
    const updatedIngredientCounter = {[action.ingType]: oldState.ingredientsCounter[action.ingType] + 1};
    const updatedState = {
        ingredientsCounter: updateObject(oldState.ingredientsCounter, updatedIngredientCounter),
        totalPrice: roundMe(oldState.totalPrice + INGREDIENT_PRICES[action.ingType]),
        burgerName: "My Burger",
        burger : addElementToBurger(oldState, action),
        operationCounter: oldState.operationCounter + 1
    }
    return updateObject(oldState, updatedState);
}

const getIndexOfLastElem = (burger, ingredient) => {
    return burger.length - 1 - burger.slice().reverse().findIndex(ing => ing.ingType === ingredient);
}

const removeByClickingFromBurger = (burger, key, ingType) => {
    const index = burger.findIndex(elem => elem.key === key);
    if (ingType === 'meat' && burger[index].count > 1) {
        return modifyMeat(burger, index, -1);
    } else {
        return cleanAfterRemoval(burger.filter(elem => elem.key !== key));
    }
}

const removeByClicking = (oldState, action) => {
    const updatedIngredientCounter = {[action.ingType]: oldState.ingredientsCounter[action.ingType] - 1}
    const updatedState = {
        ...oldState,
        ingredientsCounter: updateObject(oldState.ingredientsCounter, updatedIngredientCounter),
        totalPrice: roundMe(oldState.totalPrice - INGREDIENT_PRICES[action.ingType]),
        burger: removeByClickingFromBurger(oldState.burger, action.key, action.ingType),
        operationCounter: oldState.operationCounter + 1
    }
    return updateObject(oldState, updatedState);
}

const removeIngredientFromBurger = (burger, ingType) => {
    const modifiedBurger = [...burger];
    modifiedBurger.splice(getIndexOfLastElem(modifiedBurger, ingType), 1);
    return modifiedBurger;
}

const remElementFromBurger = (burger, ingType) => {
    const lastIndex = getIndexOfLastElem(burger, ingType);
    if (ingType === "meat" && burger[lastIndex].count > 1) {
        return modifyMeat(burger, lastIndex, -1);
    } else {
        return cleanAfterRemoval(removeIngredientFromBurger(burger, ingType));
    }
}

const removeIngredient = (oldState, action) => {
    const updatedIngredientCounter = {[action.ingType]: oldState.ingredientsCounter[action.ingType] - 1};
    const updatedState = {
        ingredientsCounter: updateObject(oldState.ingredientsCounter, updatedIngredientCounter),
        totalPrice: roundMe(oldState.totalPrice - INGREDIENT_PRICES[action.ingType]),
        burgerName: "My Burger",
        burger: remElementFromBurger(oldState.burger, action.ingType),
        operationCounter: oldState.operationCounter + 1
    }
    return updateObject(oldState, updatedState);
}

const initBurger = (state, action) => {
    const updatedElements = {
        error: false,
        ingredientsCounter: action.ingredientsCounter,
        totalPrice: 4
    };
    return updateObject(state, updatedElements);
}

const loadBurger = (state, action) => {
    const updatedElements = {
        error: false, 
        purchasing: false,
        ingredientsCounter: action.ingredientsCounter,
        totalPrice: action.price, 
        burgerName: action.burgerName,
        burger: action.burger
    };
    return updateObject(state, updatedElements);
}

const burgerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredient(state, action, 1);
        case  actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action, -1);
        case actionTypes.REPORT_ERROR: return updateObject(state, {error: true});
        case actionTypes.INIT_BURGER: return initBurger(state, action);
        case actionTypes.PURCHASING: return updateObject(state, {purchasing: true});
        case actionTypes.STOP_PURCHASING: return updateObject(state, {purchasing: false});
        case actionTypes.LOAD_BURGER : return loadBurger(state, action);
        case actionTypes.REMOVE_BY_CLICKING: return removeByClicking(state, action);
        default:
            return state;
    }
}

export default burgerReducer;