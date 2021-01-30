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

export const authSuccess = (user) => {
    return{
        type: actionTypes.AUTH_SUCCESS,
        user: user
    };
};

const updateAddress = (address, zipCode) => {
    return {
        type: actionTypes.UPDATE_ADDRESS,
        address: address,
        zipCode: zipCode
    }
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
}

const getQueryParams = (token, userId) => {
    return '?auth=' + token + '&orderBy="id"&equalTo="' + userId +'"'
}

export const login = (email, password) => {
    return dispatch => {
        let registerData = null;
        dispatch(authStart());
        const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${Key}`;
        axios.post(URL, generateQueryUserData(email, password)).then(response => {
            dispatch(checkAuthTimeout(response.data.expiresIn));
            registerData = response.data;
            setLocalStorage(registerData);
            return axiosOrders.get('/users.json' + getQueryParams(response.data.idToken, response.data.localId));
        }).then(response => {
            let userData = null;
            let localUserId = null;
            for (let key in response.data) {
                userData = response.data[key];
                localUserId = key;
            }
                dispatch(authSuccess({
                    localUserId: localUserId,
                    token: registerData.idToken,
                    userId: registerData.localId,
                    address: userData.address,
                    zipCode: userData.zipCode,
                    name: userData.name,
                    email: userData.email
                }));
            })
            .catch(error => {
                console.log(error)
                dispatch(authFail(error.response.data.error));
            })
    };
}

export const register = (user) => {
    return dispatch => {
        let registerData = null;
        dispatch(authStart());
        const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${Key}`
        axios.post(URL, generateQueryUserData(user.email, user.password)).then(response => {
            dispatch(checkAuthTimeout(response.data.expiresIn));
            registerData = response.data;
            const userData = {
                ...user,
                id: response.data.localId,
                email: response.data.email
            }
            delete(userData.password);
            return axiosOrders.post('/users.json?auth=' + registerData.idToken, userData)}).then(response => {
                setLocalStorage(registerData);
                dispatch(authSuccess({
                    ...user,
                    localUserId: response.data.name,
                    token: registerData.idToken,
                    userId: registerData.localId
                }
                ));
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
                return axiosOrders.get('/users.json' + getQueryParams(token, userId)).then(response => {
                    let userData = null;
                    let localUserId = null;
                    for (let key in response.data) {
                        userData = response.data[key];
                        localUserId = key;
                    }
                    dispatch(authSuccess({
                        localUserId: localUserId,
                        token: token,
                        userId: userId,
                        address: userData.address,
                        zipCode: userData.zipCode,
                        name: userData.name,
                        email: userData.email 
                    }));
                    dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
                })    
            } else {
                dispatch(logOut());
            }
        }
    }
}

export const modifyAddressData = (address, zipCode) => {
    return (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.localUserId;
        axiosOrders.patch(`/users/${userId}.json?auth=${token}`, {
            address: address,
            zipCode: zipCode
        }).then(response => {
            dispatch(updateAddress(address, zipCode))
        }).catch(error => {
            console.log(error)
            dispatch(authFail(error.response.data.error));
        })
    };
};