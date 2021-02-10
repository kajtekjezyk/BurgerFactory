import authReducer from './auth';
import * as actionTypes from "../actions/actionTypes";


describe('auth reducer', () => {
    let initialState = null;
    beforeEach(()=> {
        initialState = {
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
    });

    it('should return initial state', () => {
        expect(authReducer(undefined, {})).toEqual({
            token: null,
            userId:null,
            error: null,
            loading: false,
            userEmail: null,
            userName: null,
            address: null,
            zipCode: null,
            localUserId: null
        });
    });

    it('should return previous state when unknown action type', () => {
        expect(authReducer(initialState, {})).toEqual(initialState);
    });

    it('should store all user data upon login', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_SUCCESS,
            user: {
                localUserId: 'localUserId',
                token: 'idToken',
                userId: 'localId',
                address: 'address',
                zipCode: 'zipCode',
                name: 'name',
                email: 'email'
            }
        })).toEqual({
            ...initialState,
            token: 'idToken',
            userId: 'localId',
            userEmail: 'email',
            userName: 'name',
            address: 'address',
            zipCode: 'zipCode',
            localUserId: 'localUserId'
        })
    })

    it('should update address and zipCode', () => {
        const initialAddress = 'Before';
        const initialZipCode = '12-123';
        const changedAddress = 'After';
        const changedZipCode = '32-321';
        initialState.address = initialAddress;
        initialState.zipCode = initialZipCode;

        expect(initialState.address).toEqual(initialAddress);
        expect(initialState.zipCode).toEqual(initialZipCode);

        expect(authReducer(initialState, {
            type: actionTypes.UPDATE_ADDRESS,
            address: changedAddress,
            zipCode: changedZipCode,
        })).toEqual({
            ...initialState,
            address: changedAddress,
            zipCode: changedZipCode
        });
    })

    it('should set loading to true and reset error when adding user starts', () => {
        initialState.error = true;
        expect(initialState.error).not.toEqual(null);
        expect(initialState.loading).toEqual(false)
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_START
        })).toEqual({
            ...initialState,
            loading: true,
            error: null
        })
    });

    it('should reset authentiaction data when user is logged out', () => {
        const loggedUserState = {
            token: "1",
            userId: "2",
            error: "3",
            loading: true,
            userEmail: "4",
            userName: "No Name",
            address: "Narnia",
            zipCode: "Next to Ice Queen",
            localUserId: "42"
        }
        expect(authReducer(loggedUserState, {
            type: actionTypes.LOG_OUT
        })).toEqual(initialState);
    });
});

describe('auth error reducer should reset loading state and', () => {
    let initialState = null;
    beforeEach(()=> {
        initialState = {
            token: null,
            userId:null,
            error: null,
            loading: true,
            userEmail: null,
            userName: null,
            address: null,
            zipCode: null,
            localUserId: null
        }
    });
    it('should return proper message EMAIL_NOT_FOUND error', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_FAIL,
            error: {message: "EMAIL_NOT_FOUND"}
        })).toEqual({
            ...initialState,
            loading: false,
            error: "No such user"

        })
    });

    it('should return proper message on INVALID_PASSWORD error', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_FAIL,
            error: {message: "INVALID_PASSWORD"}
        })).toEqual({
            ...initialState,
            loading: false,
            error: "Please verify your password"
        })
    });

    it('should return proper message on USER_DISABLED error', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_FAIL,
            error: {message: "USER_DISABLED"}
        })).toEqual({
            ...initialState,
            loading: false,
            error: "Unable to login - user disabled"
        })
    });

    it('should return proper message on EMAIL_EXISTS error', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_FAIL,
            error: {message: "EMAIL_EXISTS"}
        })).toEqual({
            ...initialState,
            loading: false,
            error: "User with such email is already registered"
        })
    });

    it('should return proper message on OPERATION_NOT_ALLOWED error', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_FAIL,
            error: {message: "OPERATION_NOT_ALLOWED"}
        })).toEqual({
            ...initialState,
            loading: false,
            error: "Operation not allowed"
        })
    });

    it('should return proper message on TOO_MANY_ATTEMPTS_TRY_LATER error', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_FAIL,
            error: {message: "TOO_MANY_ATTEMPTS_TRY_LATER"}
        })).toEqual({
            ...initialState,
            loading: false,
            error: "Too many attempts try later"
        })
    });

    it('should should not crash and return not predefined error', () => {
        expect(authReducer(initialState, {
            type: actionTypes.AUTH_FAIL,
            error: {message: "UNKNOWN ERROR"}
        })).toEqual({
            ...initialState,
            loading: false,
            error: "UNKNOWN ERROR"
        })
    });
});