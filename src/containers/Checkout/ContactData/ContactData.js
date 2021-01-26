import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import {purchaseBurgerStart, modifyAddressData} from "../../../store/actions/index";
import {connect} from 'react-redux';
import Modal from '../../../components/UI/Modal/Modal';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import AddressChange from '../../../components/AddressChange/AddressChange';
import {makeInputField, checkValidity, checkIfFormIsValid, generateForm} from "../../../helpers/formHelpers";

class ContactData extends Component {
    
    state = {
        orderForm: {
            name: {
                ...makeInputField("Your Name", "Name"),
                value: this.props.userName,
                validation: {
                    isNonNumeric: true,
                    required: true
                },
                touched: true,
                valid: true,
                errorMessage: "Name is required"
            },
            email: {
                ...makeInputField("Your Email", "Email", "email"),
                value: this.props.userEmail,
                validation: {
                    required: true,
                    isEmail: true
                },
                touched: true,
                valid: true,
                errorMessage: "Invalid Email"
            },
            street: {
                ...makeInputField("Street", "Address"),
                value : this.props.userAddress,
                errorMessage: "Address is required",
                touched: true,
                valid: true
            },
            zipCode: {
                ...makeInputField("Postal Code", "Zip-Code"),
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 6,
                    isZip: true
                },
                value : this.props.userZipCode,
                errorMessage: "Invalid postal code: example 01-111",
                touched: true,
                valid: true,
            },
            burgerName: {
                ...makeInputField("Type Burger Name", "Burger Name"),
                validation: {},
                touched: true,
                valid: true,
                value: this.props.burgerName,
                defaultValue: "My Burger"
            },
            deliveryMethod: {
                inputType: "select",
                validation: {},
                value: "Fastest",
                label: "Delivery Method",
                elementConfig: {
                   options:  [
                    {value: "Fastest", displayValue: "Fastest"},
                    {value: "Cheapest", displayValue: "Chepest"}
                ]}
            }
        },
        isFormValid: false,
        hasAddressChanged: false
    }
    componentDidMount = () => {
        this.setState({isFormValid: checkIfFormIsValid(this.state.orderForm)})
        this.executeScroll();
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
    executeScroll = () => this.myRef.scrollIntoView()
    
    sendOrder = () => {
        const formData = {};
        for (let formElement in this.state.orderForm)
        {
            formData[formElement] = this.state.orderForm[formElement]["value"];
        }
        if (formData['burgerName'] === "") formData['burgerName'] = this.state.orderForm.burgerName.defaultValue;
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId,
        };
        this.props.purchaseBurgerStart(order, this.props.token);
    } 
    
    hasAddressChanged = () => {
        let result = true;
        result = this.state.orderForm.street.value === this.props.userAddress && result;
        result = this.state.orderForm.zipCode.value === this.props.userZipCode && result;
        console.log()
        this.setState({hasAddressChanged: !result})
        return !result;
    }

    orderHandler = (event) => {
        event.preventDefault();
        if (!this.hasAddressChanged()) {
            this.sendOrder();
        }
    }

    onCancelHandler = () => {
        this.setState({hasAddressChanged: false})
    }

    changeAddress = () => {
        this.props.modifyAddressData(this.state.orderForm.street.value,
                                     this.state.orderForm.zipCode.value);
        this.sendOrder();
    }

    render () {
        let form = <Spinner />;
        const formList = [];
        if (!this.props.loading) {
            generateForm(formList, this.state.orderForm, this.inputChangedHandler)
            form = (
                <form onSubmit={this.orderHandler}>
                    {formList}
                    <Button btnType="Success" disabled={!this.state.isFormValid}>ORDER</Button>
                </form>
            );
        }
        return (
            <Aux>
                <Modal
                    show={this.state.hasAddressChanged}
                    modalClosed={this.onCancelHandler}>
                        <AddressChange
                            cancel={this.onCancelHandler}
                            decline={this.sendOrder}
                            proceed={this.changeAddress}
                        />
                </Modal>
                <div className={classes.ContactData} ref={ (ref) => this.myRef=ref}>
                    <h4>Enter Your Contact Data</h4>
                    {form}
                </div>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ingredients: state.burger.ingredients,
        price: state.burger.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId,
        userEmail: state.auth.userEmail,
        userName: state.auth.userName,
        userAddress: state.auth.address,
        userZipCode: state.auth.zipCode,
        burgerName: state.burger.burgerName
    };
};

const mapDispatchToPrios = (dispatch) => {
    return {
        purchaseBurgerStart: (orderData, token) => dispatch(purchaseBurgerStart(orderData, token)),
        modifyAddressData: (address, zipCode) => dispatch(modifyAddressData(address, zipCode))
    };
};

export default  connect(mapStateToProps, mapDispatchToPrios)(withErrorHandler(ContactData, Axios));