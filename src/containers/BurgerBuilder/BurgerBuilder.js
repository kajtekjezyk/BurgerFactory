import React, {useCallback, useEffect} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import axiosOrders from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import IngredientContext from '../../context/IngredientsContext';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import {resetPurchase, addIngredient, removeIngredient,
        initBurger, purchaseInit, purchasing, stopPurchasing,
        removeByClicking} from '../../store/actions/index';
import {MAX_INGREDIENT_VAL} from '../../constants/burgerBuilderConstants';
import classes from "./BurgerBuilder.css";

export const burgerBuilder = props => {

    useEffect(() => {
        if (props.ingredientsCounter && (props.purchasingStarted || !props.purchased))
            return;
        props.resetPurchase();
        props.initBurger();
    }, [props.ingredientsCounter, props.purchasingStarted, props.purchased]);

    const orderClickHandler = useCallback(() => {
        if (props.isAuthenticated) {
            props.purchasing()
        } else {
            props.history.push('/login');
        }
    }, [props.isAuthenticated]);

    const purchaseContinueHandler = useCallback(() => {
        props.purchaseInit();
        props.purchasing();
        props.history.push("/checkout");
    }, [props.purchaseInit, props.purchasing]);

    const updatePurchaseState = useCallback((ingredientsCounter) =>{
        return Object.keys(ingredientsCounter).some(elem => {
            return ingredientsCounter[elem] > 0;
        });
    }, []);

    const onClockRemoveHandler = useCallback((ingredient, id) => {
        props.removeByClicking(ingredient, id);
    }, [props.removeByClicking]);

    const disableLessButton = useCallback(() => {
        const disabledInfo = {
            ...props.ingredientsCounter
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        return disabledInfo
    }, [props.ingredientsCounter]);

    const disableMoreButton = useCallback(() => {
        const disabledInfo = {
            ...props.ingredientsCounter
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] >= MAX_INGREDIENT_VAL[key];
        }
        return disabledInfo
    }, [props.ingredientsCounter]);

    let orderSummary = null;
    let burger = props.error ? <p>Ingredients couldn't be loaded</p> : <Spinner/>;
    if (props.ingredientsCounter)
    {
        burger = (
            <div className={classes.mainPanel}>
                <div className={[classes.BurgerBuilder, classes.Item].join(" ")}>
                    <Burger burger={props.burger} clicked={onClockRemoveHandler}></Burger>
                </div>
                <IngredientContext.Provider value={{
                    add: props.addIngredient,
                    rem: props.removeIngredient
                }}>
                <div className={classes.Item}>
                    <BuildControls
                        ingredientsCounter={props.ingredientsCounter}
                        disabledLess={disableLessButton()}
                        disabledMore={disableMoreButton()}
                        totalPrice={props.totalPrice}
                        disableDisplay={!updatePurchaseState(props.ingredientsCounter)}
                        isAuth={props.isAuthenticated}
                        purchased={orderClickHandler}/>
                </div>
                </IngredientContext.Provider>

            </div>
        )
        orderSummary = (
            <OrderSummary
                calcelOrder={() => props.stopPurchasing()}
                finOrder={purchaseContinueHandler}
                ingredientsCounter={props.ingredientsCounter}
                price={props.totalPrice}/>
        );
    }

    return (
        <Aux>
            <Modal show={props.purchasingStarted} modalClosed={() => props.stopPurchasing()}>
                {orderSummary}
            </Modal>
                {burger}
        </Aux>
    );
}

const mapDispatchtoProps = (dispatch) => {
    return {
       addIngredient: (ingType) => dispatch(addIngredient(ingType)),
       removeIngredient: (ingType) => dispatch(removeIngredient(ingType)),
       initBurger: () => dispatch(initBurger()),
       purchaseInit: () => dispatch(purchaseInit()),
       purchasing: () => dispatch(purchasing()),
       stopPurchasing: () => dispatch(stopPurchasing()),
       resetPurchase: ()=>dispatch(resetPurchase()),
       removeByClicking: (ingType, key) => dispatch(removeByClicking(ingType, key))
    };
}

const mapStatetoProps = (state) => {
    return {
        ingredientsCounter: state.burger.ingredientsCounter,
        totalPrice: state.burger.totalPrice,
        error: state.burger.error,
        purchasingStarted: state.burger.purchasing,
        isAuthenticated: state.auth.token !== null,
        purchased: state.order.purchased,
        burger: state.burger.burger
    };
}

export default connect(mapStatetoProps, mapDispatchtoProps)(withErrorHandler(burgerBuilder, axiosOrders));