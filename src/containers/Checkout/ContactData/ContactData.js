import React, {useEffect, useCallback, useState, useRef} from 'react';
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

const contactData = props => {
    const myRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [hasAddressChanged, setHasAddressChanged] = useState(false);
    const [orderForm, setOrderForm] = useState({
        name: {
            ...makeInputField("Your Name", "Name"),
            value: props.userName,
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
            value: props.userEmail,
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
            value : props.userAddress,
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
            value : props.userZipCode,
            errorMessage: "Invalid postal code: example 01-111",
            touched: true,
            valid: true,
        },
        burgerName: {
            ...makeInputField("Type Burger Name", "Burger Name"),
            validation: {},
            touched: true,
            valid: true,
            value: props.burgerName,
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
    });

    useEffect(() => {
        setIsFormValid(checkIfFormIsValid(orderForm));
        executeScroll();
    }, []);

    const inputChangedHandler = useCallback((event, type) => {
        const formData = {...orderForm};
        const FormElement = {...formData[type]};
        FormElement.value = event.target.value;
        FormElement.valid = checkValidity(event.target.value, FormElement.validation);
        FormElement.touched = true;
        formData[type] = FormElement;
        setIsFormValid(checkIfFormIsValid(formData));
        setOrderForm(formData);
    }, [orderForm, checkValidity, checkIfFormIsValid]);

    const executeScroll = useCallback(() => myRef.current.scrollIntoView(), []);

    const sendOrder = useCallback(() => {
        const formData = {};
        for (let formElement in orderForm)
        {
            formData[formElement] = orderForm[formElement]["value"];
        }
        if (formData['burgerName'] === "") formData['burgerName'] = orderForm.burgerName.defaultValue;
        const order = {
            ingredientsCounter: props.ingredientsCounter,
            burger: props.burger,
            price: props.price,
            orderData: formData,
            userId: props.userId,
        };
        props.purchaseBurgerStart(order, props.token);
    }, [orderForm, props.ingredientsCounter, props.burger, props.price,
        props.userId, props.token, props.purchaseBurgerStart]);

    const checkIfAddressChanged = useCallback(() => {
        let result = true;
        result = orderForm.street.value === props.userAddress && result;
        result = orderForm.zipCode.value === props.userZipCode && result;
        setHasAddressChanged(!result);
        return !result;
    }, [orderForm.street.value, orderForm.zipCode.value, props.userAddress, props.userZipCode]);

    const orderHandler = useCallback((event) => {
        event.preventDefault();
        if (!checkIfAddressChanged()) {
            sendOrder();
        }
    }, [checkIfAddressChanged, sendOrder]);

    const changeAddress = useCallback(() => {
        props.modifyAddressData(orderForm.street.value,
                                orderForm.zipCode.value);
        sendOrder();
    }, [orderForm.street.value, orderForm.zipCode.value, sendOrder]);


    let form = <Spinner />;
    const formList = [];
    if (!props.loading) {
        generateForm(formList, orderForm, inputChangedHandler)
        form = (
            <form onSubmit={orderHandler}>
                {formList}
                <Button btnType="Success" disabled={!isFormValid}>ORDER</Button>
            </form>
        );
    }
    return (
        <Aux>
            <Modal
                show={hasAddressChanged}
                modalClosed={() => setHasAddressChanged(false)}>
                    <AddressChange
                        cancel={() => setHasAddressChanged(false)}
                        decline={sendOrder}
                        proceed={changeAddress}
                    />
            </Modal>
            <div className={classes.ContactData} ref={myRef}>
                <h4>Enter Your Contact Data</h4>
                {form}
            </div>
        </Aux>
    );

}

const mapStateToProps = (state) => {
    return {
        ingredientsCounter: state.burger.ingredientsCounter,
        burger: state.burger.burger,
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

export default  connect(mapStateToProps, mapDispatchToPrios)(withErrorHandler(contactData, Axios));