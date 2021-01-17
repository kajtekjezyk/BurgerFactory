import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import {purchaseBurgerStart} from "../../../store/actions/index";
import {connect} from 'react-redux';
import {makeInputField, checkValidity, checkIfFormIsValid} from "../../../helpers/formHelpers";

class ContactData extends Component {
    
    state = {
        orderForm: {
            name: {
                ...makeInputField("Your Name"),
                validation: {
                    isNonNumeric: true,
                    required: true
                }
            },
            email: {
                ...makeInputField("Your Email"),
                validation: {
                    required: true,
                    isEmail: true
                }
            },
            street: {
                ...makeInputField("Street"),
            },
            zipCode: {
                ...makeInputField("Postal Code"),
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 6,
                    isZip: true
                }
            },
            country: {
                ...makeInputField("Country"),
            },
            deliveryMethod: {
                inputType: "select",
                validation: {},
                value: "Fastest",
                elementConfig: {
                   options:  [
                    {value: "Fastest", displayValue: "Fastest"},
                    {value: "Cheapest", displayValue: "Chepest"}
                ]}
            }
        },
        isFormValid: false
    }

    inputChangedHandler = (event, type) => {
        const formData = {...this.state.orderForm};
        const FormElement = {...formData[type]};
        FormElement.value = event.target.value;
        FormElement.valid = checkValidity(event.target.value, FormElement.validation);
        FormElement.touched = true;
        formData[type] = FormElement;

        this.setState({orderForm: formData, isFormValid: checkIfFormIsValid(formData)})

    }

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formElement in this.state.orderForm)
        {
            formData[formElement] = this.state.orderForm[formElement]["value"];
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        };
        this.props.purchaseBurgerStart(order, this.props.token);
    }

    render () {
        let form = <Spinner />;
        const formList = [];
        if (!this.props.loading) {
            for (let input in this.state.orderForm) {
                let inputData = this.state.orderForm[input];
                formList.push(
                    <Input
                        key={input}
                        inputType={inputData["inputType"]}
                        elementConfig={inputData["elementConfig"]}
                        value={inputData["value"]}
                        changed={(event) => this.inputChangedHandler(event, input)}
                        invalid={!inputData['valid']}
                        shouldValidate={Object.keys(inputData.validation).length}
                        touched={inputData.touched}
                />)
            }
            form = (
                <form onSubmit={this.orderHandler}>
                    {formList}
                    <Button btnType="Success" disabled={!this.state.isFormValid}>ORDER</Button>
                </form>
            );
        }
        
        return (
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ingredients: state.burger.ingredients,
        price: state.burger.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToPrios = (dispatch) => {
    return {
        purchaseBurgerStart: (orderData, token) => dispatch(purchaseBurgerStart(orderData, token))
    };
};

export default  connect(mapStateToProps, mapDispatchToPrios)(withErrorHandler(ContactData, Axios));