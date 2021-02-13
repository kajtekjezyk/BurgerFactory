import React, {useState, useCallback} from 'react';
import {makeInputField, checkValidity, checkIfFormIsValid, generateForm} from '../../../helpers/formHelpers';
import Button from '../../../components/UI/Button/Button';
import classes from './Login.css';
import {connect} from 'react-redux';
import {onLogin} from '../../../store/actions/auth';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import {Redirect} from 'react-router-dom';

const login = props => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [controls, setControls] = useState({
        email: {
            ...makeInputField("Your Email","Email", "email"),
            validation: {
                required: true,
                isEmail: true
            },
            errorMessage: "Wrong Email"
        },
        password: {
            ...makeInputField(null, "Password", "password"),
            elementConfig: {
                placeholder: "Password",
                type: "password"
            },
            validation: {
                required: true,
                minLength: 6
            },
            errorMessage: "Minimal password length: 6 chars"
        }
    });

    const inputChangedHandler = useCallback((event, type) => {
        const formData = {...controls};
        const FormElement = {...formData[type]};
        FormElement.value = event.target.value;
        FormElement.valid = checkValidity(event.target.value, FormElement.validation);
        FormElement.touched = true;
        formData[type] = FormElement;
        setControls(formData);
        setIsFormValid(checkIfFormIsValid(formData));
    }, [controls, checkValidity, checkIfFormIsValid]);

    const authHandler = useCallback((event) => {
        event.preventDefault();
        props.onAuth(controls.email.value,
                     controls.password.value);
    }, [controls.email.value, controls.password.value]);

    const switchAuthModeHandler = useCallback(() => {
        props.history.push('/register')
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
                        <h2>Login</h2>
                        {formList}
                        <Button btnType="Success" disabled={!isFormValid}>SUBBMIT</Button>
                    </div>
                </form>
                <Button btnType="Danger"
                    clicked={switchAuthModeHandler}>
                        Switch to Register
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
        onAuth: (email, password) => dispatch(onLogin(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(login);