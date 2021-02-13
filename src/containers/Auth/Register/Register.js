import React, {useState, useCallback} from 'react';
import {makeInputField, checkValidity, checkIfFormIsValid, generateForm} from '../../../helpers/formHelpers';
import Button from '../../../components/UI/Button/Button';
import classes from './Register.css';
import {connect} from 'react-redux';
import {onRegister} from '../../../store/actions/auth';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import {Redirect} from 'react-router-dom';

const register = props => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [controls, setControls] = useState({
        name: {
            ...makeInputField("Your Name", "Name"),
            validation: {
                required: true
            },
            errorMessage: "Name is required"
        },
        email: {
            ...makeInputField("Your Email", "Email", "email"),
            validation: {
                required: true,
                isEmail: true
            },
            errorMessage: "Invalid Email"
        },
        password: {
            ...makeInputField(null, "Passord", "password"),
            elementConfig: {
                placeholder: "Password",
                type: "password"
            },
            validation: {
                required: true,
                minLength: 6
            },
            errorMessage: "Minimal password length: 6 chars"
        },
        password2: {
            ...makeInputField(null, "Confirm Passord", "password"),
            elementConfig: {
                placeholder: "Repeat Password",
                type: "password"
            },
            validation: {
                required: true,
                minLength: 6,
                same: true
            },
            errorMessage: "Not matching passwords"
        },
        street: {
            ...makeInputField("Street", "Address"),
            errorMessage: "Address is required"
        },
        zipCode: {
            ...makeInputField("Postal Code", "Zip-Code"),
            validation: {
                required: true,
                minLength: 5,
                maxLength: 6,
                isZip: true
            },
            errorMessage: "Invalid postal code: example 01-111"
        }
    });

    const inputChangedHandler = useCallback((event, type) => {
        const formData = {...controls};
        const FormElement = {...formData[type]};
        FormElement.value = event.target.value;
        FormElement.valid = checkValidity(event.target.value, FormElement.validation, controls.password.value);
        FormElement.touched = true;
        formData[type] = FormElement;
        setControls(formData);
        setIsFormValid(checkIfFormIsValid(formData));
    }, [controls, checkValidity, checkIfFormIsValid]);

    const authHandler = useCallback((event) => {
        event.preventDefault();
        props.onAuth({
            name: controls.name.value,
            email: controls.email.value,
            password: controls.password.value,
            address: controls.street.value,
            zipCode: controls.zipCode.value
        });
    }, [controls]);

    const switchAuthModeHandler = useCallback(() => {
        props.history.push("/login");
    }, []);


    let errorMessage =  null;
    if (props.error) {
        errorMessage = (
            <p>{props.error}</p>
        )
    }

    let form = <Spinner />;
    const formList = [];
    generateForm(formList, controls, inputChangedHandler);
    if (!props.loading)
    {
        form = (
            <Aux>
                <form onSubmit={authHandler}>
                    {errorMessage}
                    <div>
                        <h2>Register new user</h2>
                        {formList}
                        <Button btnType="Success" disabled={!isFormValid}>SUBBMIT</Button>
                    </div>
                </form>
                <Button btnType="Danger"
                    clicked={switchAuthModeHandler}>
                        Switch to Login
                </Button>
            </Aux>
        );
    }
    let redirect = null;
    if (props.isAuthenticated) redirect = <Redirect to="/"/>
    return (
        <div className={classes.AuthData}>
            {redirect}
            {form}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (person) => dispatch(onRegister(person))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(register);