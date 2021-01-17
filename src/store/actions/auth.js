import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return{
        type: actionTypes.AUTH_START
    };
};

export const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.LOG_OUT
    };
};

export const checkAuthTimeout = (expireTime) => {
    return dispatch => {
        setTimeout(()=> {
            dispatch(logOut());
        }, parseInt(expireTime * 1000, 10))
    };
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
    return dispatch => {
        dispatch(authStart());
        
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        const Key = 'AIzaSyDQR2ywypi_0IVXkafNlBMiowUj4N_ARRw';
        let URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${Key}`;
        if (!isSignup) {
            URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${Key}`
        }

        axios.post(URL, authData).then(response => {
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(error => {
                console.log(error)
                dispatch(authFail(error.response.data.error));
            })
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logOut());
        } else {

            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date())
            {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            } else {
                dispatch(logOut());
            }
        }
    }
}