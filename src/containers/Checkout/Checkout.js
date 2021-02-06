import React from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import ContactData from './ContactData/ContactData';
import {connect} from 'react-redux';
import {stopPurchasing} from "../../store/actions/index";

const checkout = props => {

    const cancelClickHandler = () => {
        props.stopPurchasing();
        props.history.push("/");
    }

    const continueClickHandler = () => {
        props.stopPurchasing();
        props.history.replace('/checkout/contact-data');
    }

    
    let siteContent = <Redirect to={"/"}/>;
    if (props.ingredients) {
        const purhchasedRedirect = props.purchased ? <Redirect to="/"/> : null;
        siteContent = (
            <Aux>
                {purhchasedRedirect}
                <CheckoutSummary
                    ingredients={props.ingredients}
                    goBack={cancelClickHandler}
                    proceed={continueClickHandler}/>
                <Route path='/checkout/contact-data' component={ContactData}/> 
            </Aux>
        );
    }

    return (
        <div>
            {siteContent}
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        stopPurchasing: () => dispatch(stopPurchasing())
    }
}

const mapStateToProps = (state) => {
    return {
        ingredients: state.burger.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(checkout);