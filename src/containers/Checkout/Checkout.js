import React, {useCallback} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import ContactData from './ContactData/ContactData';
import {connect} from 'react-redux';
import {stopPurchasing} from "../../store/actions/index";

const Checkout = props => {

    const cancelClickHandler = useCallback(() => {
        props.stopPurchasing();
        props.history.push("/");
    }, [props.stopPurchasing, props.history]);

    const continueClickHandler = useCallback(() => {
        props.stopPurchasing();
        props.history.replace('/checkout/contact-data');
    }, [props.stopPurchasing, props.history]);

    const generateSiteContent = useCallback(() => {
        let siteContent = <Redirect to={"/"}/>;
        if (props.ingredientsCounter) {
            const purhchasedRedirect = props.purchased ? <Redirect to="/"/> : null;
            siteContent = (
                <Aux>
                    {purhchasedRedirect}
                    <CheckoutSummary
                        ingredientsCounter={props.ingredientsCounter}
                        burger={props.burger}
                        goBack={cancelClickHandler}
                        proceed={continueClickHandler}/>
                    <Route path='/checkout/contact-data' component={ContactData}/>
                </Aux>
            );
        }
        return siteContent;
    }, [props.ingredientsCounter, props.purchased, [props.burger]])

    return (
        <div>
            {generateSiteContent()}
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
        ingredientsCounter: state.burger.ingredientsCounter,
        burger: state.burger.burger,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);