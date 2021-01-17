import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../utility";

const initialState = {
    token: null,
    userId:null,
    error: null,
    loading: false
}

const addUser = (state, action) => {
    const newState = {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
    };
    return updateObject(state, newState);
}

const mapErrortoErrorMessage = (error) => {
    const map = {
        EMAIL_NOT_FOUND: "No such user",
        INVALID_PASSWORD: "Please verify your password",
        USER_DISABLED: "unable to login - user disabled",
        EMAIL_EXISTS: "user with such email is already registered",
        OPERATION_NOT_ALLOWED: "OPERATION_NOT_ALLOWED",
        TOO_MANY_ATTEMPTS_TRY_LATER: "TOO_MANY_ATTEMPTS_TRY_LATER"
    }
    return map[error.message];
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return updateObject(state, {loading: true, error: null});
        case actionTypes.AUTH_SUCCESS: return addUser(state, action);
        case actionTypes.AUTH_FAIL: return updateObject(state, {loading: false, error: mapErrortoErrorMessage(action.error)});
        case actionTypes.LOG_OUT: return updateObject(state, initialState);
        default:
            return state;
    }
}

export default authReducer;