import * as actionTypes from '../actions/actionTypes';
import {updateObject} from "../utility";

const initialState = {
    token: null,
    userId:null,
    error: null,
    loading: false,
    userEmail: null,
    userName: null,
    address: null,
    zipCode: null,
    localUserId: null
}

const addUser = (state, action) => {
    const newState = {
        token: action.user.token,
        userId: action.user.userId,
        error: null,
        loading: false,
        userEmail: action.user.email,
        userName: action.user.name,
        address: action.user.address,
        zipCode: action.user.zipCode,
        localUserId: action.user.localUserId
    };
    return updateObject(state, newState);
}

const updateAddress = (state, action) => {
    return updateObject(state, {address: action.address, zipCode: action.zipCode});
}

const mapErrortoErrorMessage = (error) => {
    let resp = null;
    const map = {
        EMAIL_NOT_FOUND: "No such user",
        INVALID_PASSWORD: "Please verify your password",
        USER_DISABLED: "unable to login - user disabled",
        EMAIL_EXISTS: "user with such email is already registered",
        OPERATION_NOT_ALLOWED: "OPERATION_NOT_ALLOWED",
        TOO_MANY_ATTEMPTS_TRY_LATER: "TOO_MANY_ATTEMPTS_TRY_LATER"
    }
    try{
        resp = map[error.message];
    } catch (e) {
        resp = error.message;
    }
    return resp;
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return updateObject(state, {loading: true, error: null});
        case actionTypes.AUTH_SUCCESS: return addUser(state, action);
        case actionTypes.AUTH_FAIL: return updateObject(state, {loading: false, error: mapErrortoErrorMessage(action.error)});
        case actionTypes.LOG_OUT: return updateObject(state, initialState);
        case actionTypes.UPDATE_ADDRESS: return updateAddress(state, action);
        default:
            return state;
    }
}

export default authReducer;