import React from 'react';
import authReducer from './auth';
import * as actionTypes from "../actions/actionTypes";


describe('auth reducer', () => {
    let initialState = null;
    beforeEach(()=> {
        initialState = {
            token: null,
            userId:null,
            error: null,
            loading: false}
    });

    it('should return initial state', () => {
        expect(authReducer(undefined, {})).toEqual({
            token: null,
            userId:null,
            error: null,
            loading: false
        });
    });

    it('should store the token and userId upon login', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: "idToken",
            userId: "userId"
        })).toEqual({
            ...initialState,
            token: "idToken",
            userId: "userId"
        })
    })
});