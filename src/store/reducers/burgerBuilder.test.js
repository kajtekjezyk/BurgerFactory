import burgerBuilderReducer from './burgerBuilder';
import * as burgerBuilder from './burgerBuilder';
import * as actionTypes from '../actions/actionTypes';

describe('burgerBuilder reducer', () => {
    let initialState = null;
    beforeEach(()=> {
        initialState = {
            ingredientsCounter: null,
            totalPrice: 4,
            error: false,
            purchasing: false,
            burgerName: "My Burger",
            burger: [],
            operationCounter: 0
        }
    });

    it('should return initial state', () => {
        expect(burgerBuilderReducer(undefined, {})).toEqual({
            ingredientsCounter: null,
            totalPrice: 4,
            error: false,
            purchasing: false,
            burgerName: "My Burger",
            burger: [],
            operationCounter: 0
        });
    });

    it('should return previous state when unknown action type', () => {
        expect(burgerBuilderReducer(initialState, {})).toEqual(initialState);
    });
});

describe('roundMe', () => {
    it('should round float values to two decimals', () => {
        expect(burgerBuilder.roundMe(1)).toEqual(1.00);
        expect(burgerBuilder.roundMe(2.4444)).toEqual(2.44);
        expect(burgerBuilder.roundMe(-2)).toEqual(-2.00);
    });
});

describe('isMeatChangeNeedded', () => {
    it('should return true if current and previous ingredient is meat', () => {
        expect(burgerBuilder.isMeatChangeNeedded("meat", "meat")).toEqual(true);
    });

    it('should return false if current ingredient is not meat', () => {
        expect(burgerBuilder.isMeatChangeNeedded("pepper", "meat")).toEqual(false);
    });

    it('should return false if current ingredient meat and previous is not meat', () => {
        expect(burgerBuilder.isMeatChangeNeedded("meat", "pepper")).toEqual(false);
    });

});