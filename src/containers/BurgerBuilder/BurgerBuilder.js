import React, {useEffect} from 'react';
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
import {addIngredient, removeIngredient, initBurger,
        purchaseInit, purchasing, stopPurchasing} from '../../store/actions/index';

const burgerBuilder = props => {
    
    const {ingredients, purchasingStarted, purchased} = props;
    useEffect(() => {
        if (ingredients && (purchasingStarted || !purchased))
            return;
        props.initBurger();
    }, [ingredients, purchasingStarted, purchased])


    const orderClickHandler = () => {
        props.purchasing()
        if (props.isAuthenticated) {
        } else {
            props.history.push('/auth');
        }
        
    }

    const purchaseCancelHandler = () => {
        props.stopPurchasing();
    }

    const purchaseContinueHandler = () => {
        props.purchaseInit();
        props.purchasing();
        props.history.push("/checkout");
    }

    const updatePurchaseState = (ingredients) =>{
        return Object.keys(ingredients).some(elem => {
            return ingredients[elem] > 0;
        });
    }

   
    const disabledInfo = {
        ...props.ingredients
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = props.error ? <p>Ingredients couldn't be loaded</p> : <Spinner/>;
    if (props.ingredients)
    {
        burger = (
            <Aux>
                <Burger ingredients={props.ingredients} clicked={props.removeIngredient}></Burger>
                <IngredientContext.Provider value={{
                    add: props.addIngredient,
                    rem: props.removeIngredient
                }}>
                    <BuildControls
                        ingredients={props.ingredients}
                        disabled={disabledInfo}
                        totalPrice={props.totalPrice}
                        disableDisplay={!updatePurchaseState(props.ingredients)}
                        isAuth={props.isAuthenticated}
                        purchased={orderClickHandler}/>
                </IngredientContext.Provider>
            </Aux>
        )
        orderSummary = (
            <OrderSummary
                calcelOrder={purchaseCancelHandler}
                finOrder={purchaseContinueHandler}
                ingredients={props.ingredients}
                price={props.totalPrice}/>
        );
    }
    return (
        <Aux>
            <Modal show={props.purchasingStarted} modalClosed={purchaseCancelHandler}>
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
       stopPurchasing: () => dispatch(stopPurchasing())
       
    };
}

const mapStatetoProps = (state) => {
    return {
        ingredients: state.burger.ingredients,
        totalPrice: state.burger.totalPrice,
        error: state.burger.error,
        purchasingStarted: state.burger.purchasing,
        isAuthenticated: state.auth.token !== null,
        purchased: state.order.purchased,
    };
}

export default connect(mapStatetoProps, mapDispatchtoProps)(withErrorHandler(burgerBuilder, axiosOrders));