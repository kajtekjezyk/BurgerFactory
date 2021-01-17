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
import {addIngredient, removeIngredient, initBurger, purchaseInit, purchasing, stopPurchasing} from '../../store/actions/index';

class BurgerBuilder extends Component {
    
    componentDidMount () {
        if (this.props.ingredients && (this.props.purchasingStarted || !this.props.purchased))
            return;
        this.props.initBurger();
    }

    orderClickHandler = () => {
        this.props.purchasing()
        if (this.props.isAuthenticated) {
        } else {
            this.props.history.push('/auth');
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

    updatePurchaseState = (ingredients) =>{
    return Object.keys(ingredients).some(elem => {
        return ingredients[elem] > 0;
    });
    }

    render() {
        const disabledInfo = {
            ...this.props.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients couldn't be loaded</p> : <Spinner/>;
        if (this.props.ingredients)
        {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ingredients} clicked={this.props.removeIngredient}></Burger>
                    <IngredientContext.Provider value={{
                        add: this.props.addIngredient,
                        rem: this.props.removeIngredient
                    }}>
                        <BuildControls
                            ingredients={this.props.ingredients}
                            disabled={disabledInfo}
                            totalPrice={this.props.totalPrice}
                            disableDisplay={!this.updatePurchaseState(this.props.ingredients)}
                            isAuth={this.props.isAuthenticated}
                            purchased={this.orderClickHandler}/>
                    </IngredientContext.Provider>
                </Aux>
            )
            orderSummary = (
                <OrderSummary
                    calcelOrder={this.purchaseCancelHandler}
                    finOrder={this.purchaseContinueHandler}
                    ingredients={this.props.ingredients}
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

export default connect(mapStatetoProps, mapDispatchtoProps)(withErrorHandler(BurgerBuilder, axiosOrders));