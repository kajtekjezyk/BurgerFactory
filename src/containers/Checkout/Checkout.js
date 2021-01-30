import React, {Component} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import ContactData from './ContactData/ContactData';
import {connect} from 'react-redux';
import {stopPurchasing} from "../../store/actions/index";

class Checkout extends Component {

    cancelClickHandler = () => {
        this.props.stopPurchasing();
        this.props.history.push("/");
    }

    continueClickHandler = () => {
        this.props.stopPurchasing();
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        let siteContent = <Redirect to={"/"}/>;
        if (this.props.ingredientsCounter) {
            const purhchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
            siteContent = (
                <Aux>
                    {purhchasedRedirect}
                    <CheckoutSummary
                        ingredientsCounter={this.props.ingredientsCounter}
                        burger={this.props.burger}
                        goBack={this.cancelClickHandler}
                        proceed={this.continueClickHandler}/>
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