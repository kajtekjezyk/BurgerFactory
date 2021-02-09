import React, {Component} from 'react';
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

export class BurgerBuilder extends Component {

    componentDidMount () {
        if (this.props.ingredientsCounter && (this.props.purchasingStarted || !this.props.purchased))
            return;
        this.props.resetPurchase();
        this.props.initBurger();
    }

    orderClickHandler = () => {
        if (this.props.isAuthenticated) {
            this.props.purchasing()
        } else {
            this.props.history.push('/login');
        }
    }

    purchaseCancelHandler = () => {
        this.props.stopPurchasing();
    }

    purchaseContinueHandler = () => {
        this.props.purchaseInit();
        this.props.purchasing();
        this.props.history.push("/checkout");
    }

    updatePurchaseState = (ingredientsCounter) =>{
        return Object.keys(ingredientsCounter).some(elem => {
            return ingredientsCounter[elem] > 0;
        });
    }

    onClockRemoveHandler = (ingredient, id) => {
        this.props.removeByClicking(ingredient, id);
    }

    disableLessButton = () => {
        const disabledInfo = {
            ...this.props.ingredientsCounter
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        return disabledInfo
    }

    disableMoreButton = () => {
        const disabledInfo = {
            ...this.props.ingredientsCounter
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] >= MAX_INGREDIENT_VAL[key];
        }
        return disabledInfo
    }

    render() {
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients couldn't be loaded</p> : <Spinner/>;
        if (this.props.ingredientsCounter)
        {
            burger = (
                <div className={classes.mainPanel}>
                    <div className={[classes.BurgerBuilder, classes.Item].join(" ")}>
                        <Burger burger={this.props.burger} clicked={this.onClockRemoveHandler}></Burger>
                    </div>
                    <IngredientContext.Provider value={{
                        add: this.props.addIngredient,
                        rem: this.props.removeIngredient
                    }}>
                    <div className={classes.Item}>
                        <BuildControls
                            ingredientsCounter={this.props.ingredientsCounter}
                            disabledLess={this.disableLessButton()}
                            disabledMore={this.disableMoreButton()}
                            totalPrice={this.props.totalPrice}
                            disableDisplay={!this.updatePurchaseState(this.props.ingredientsCounter)}
                            isAuth={this.props.isAuthenticated}
                            purchased={this.orderClickHandler}/>
                    </div>
                    </IngredientContext.Provider>

                </div>
            )
            orderSummary = (
                <OrderSummary
                    calcelOrder={this.purchaseCancelHandler}
                    finOrder={this.purchaseContinueHandler}
                    ingredientsCounter={this.props.ingredientsCounter}
                    price={this.props.totalPrice}/>
            );
        }
        return (
            <Aux>
                <Modal show={this.props.purchasingStarted} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                    {burger}
            </Aux>
        );
    }
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

export default connect(mapStatetoProps, mapDispatchtoProps)(withErrorHandler(BurgerBuilder, axiosOrders));