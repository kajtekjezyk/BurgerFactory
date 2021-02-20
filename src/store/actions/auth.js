import * as actionTypes from './actionTypes';

export const authStart = () => {
    return{
        type: actionTypes.AUTH_START
    };
};

export const logOut = () => {
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    };
};

export const logoutSucceed = () => {
    return {
        type: actionTypes.LOG_OUT
    }
}

export const checkAuthTimeout = (expireTime) => {
    return {
        type: actionTypes.AUTH_CHECK_TIMEOUT,
        expireTime: 100
    }
};

export const authSuccess = (idToken, userId) => {
    return{
        type: actionTypes.AUTH_SUCCESS,
        idToken: idToken,
        userId: userId
    };
};

export const authFail = (error) => {
    return{
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};



export const auth = (email, password, isSignup) => {
    return {
        type: actionTypes.AUTH,
        email: email,
        password: password,
        isSignup: isSignup
    }
};

export const authCheckState = () => {
    return {
        type: actionTypes.AUTH_CHECK_STATE
    }
}