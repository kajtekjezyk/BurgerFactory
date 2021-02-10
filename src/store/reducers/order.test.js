import orderReducer from './order';
import * as actionTypes from '../actions/actionTypes';

describe('order reducer', () => {
    let initialState = null;
    beforeEach(()=> {
        initialState = {
            order: null,
            loading: false,
            purchased: false
        }
    });

    it('should return initial state', () => {
        expect(orderReducer(undefined, {})).toEqual({
            order: null,
            loading: false,
            purchased: false
        });
    });

    it('should return previous state when unknown action type', () => {
        expect(orderReducer(initialState, {})).toEqual(initialState);
    });

    it('should set loading to true when PURCHASE_STARTED action type', () => {
        expect(orderReducer(initialState, {
            type: actionTypes.PURCHASE_STARTED
        })).toEqual({
            ...initialState,
            loading: true,
        });
    });

    it('should reset purchase state when PURCHASE_INIT action type', () => {
        initialState.purchased = true;
        expect(initialState.purchased).toEqual(true);
        expect(orderReducer(initialState, {
            type: actionTypes.PURCHASE_INIT
        })).toEqual({
            ...initialState,
            purchased: false,
        });
    });

    it('should reset loading state when PURCHASE_BURGER_FAIL action type', () => {
        initialState.loading = true;
        expect(initialState.loading).toEqual(true);
        expect(orderReducer(initialState, {
            type: actionTypes.PURCHASE_BURGER_FAIL
        })).toEqual({
            ...initialState,
            loading: false,
        });
    });

    it('should set to initial state when RESET_PURCHASE action type', () => {
        const modState = {
            order: "My burger",
            loading: true,
            purchased: true
        }
        expect(orderReducer(modState, {
            type: actionTypes.RESET_PURCHASE})).toEqual(initialState);
    });

    it('should store whole order data when PURCHASE_BURGER_SUCCESS action type', () => {

        expect(orderReducer(initialState, {
            type: actionTypes.PURCHASE_BURGER_SUCCESS,
            id: 'Burger Id',
            orderData: {
                ing1: 'aa',
                ing2: 'bb'
            }
        })).toEqual({
            ...initialState,
            order: {
                ing1: 'aa',
                ing2: 'bb',
                id: 'Burger Id'
            },
            loading: false,
            purchased: true
        });
    });
});