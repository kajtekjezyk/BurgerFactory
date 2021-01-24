import * as actionTypes from './actionTypes';
import axios from 'axios';
import axiosOrders from '../../axios-orders';

const Key = 'AIzaSyDQR2ywypi_0IVXkafNlBMiowUj4N_ARRw';

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

export const authSuccess = (idToken, userId, userEmail, name) => {
    return{
        type: actionTypes.AUTH_SUCCESS,
        idToken: idToken,
        userId: userId,
        userEmail: userEmail,
        userName: name
    };
};

export const authFail = (error) => {
    return{
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

const generateQueryUserData = (email, password) => {
    return {
        email: email,
        password: password,
        returnSecureToken: true
    };
}

const setLocalStorage = (userData) => {
    const expirationDate = new Date(new Date().getTime() + userData.expiresIn * 1000);
    localStorage.setItem('token', userData.idToken);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('userId', userData.localId);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name);
}

export const login = (email, password) => {
    return dispatch => {
        let registerData = null;
        dispatch(authStart());
        const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${Key}`;
        axios.post(URL, generateQueryUserData(email, password)).then(response => {
            
            dispatch(checkAuthTimeout(response.data.expiresIn));
            registerData = response.data;
            const queryParams = '?auth=' + response.data.idToken + '&orderBy="id"&equalTo="' + response.data.localId +'"';
            return axiosOrders.get('/users.json' + queryParams);
        }).then(response => {
            let name = null;
            for (let key in response.data) {
                name = response.data[key].name;
            }
                setLocalStorage({...registerData, name: name});
                dispatch(authSuccess(registerData.idToken, registerData.localId, registerData.email, name));
            })
            .catch(error => {
                console.log(error)
                dispatch(authFail(error.response.data.error));
            })
    };
}

export const register = (name, email, password) => {
    return dispatch => {
        let registerData = null;
        dispatch(authStart());
        const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${Key}`
        axios.post(URL, generateQueryUserData(email, password)).then(response => {
            
            dispatch(checkAuthTimeout(response.data.expiresIn));
            registerData = response.data;
            const userData = {
                name: name,
                id: response.data.localId,
                email: response.data.email
            }
            return axiosOrders.post('/users.json?auth=' + registerData.idToken, userData)}).then(response => {
                setLocalStorage({...registerData, name: name});
                dispatch(authSuccess(registerData.idToken, registerData.localId, registerData.email, name));
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
                const userEmail = localStorage.getItem('userEmail');
                const userName = localStorage.getItem('userName');
                dispatch(authSuccess(token, userId, userEmail, userName));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            } else {
                dispatch(logOut());
            }
        }
    }
}