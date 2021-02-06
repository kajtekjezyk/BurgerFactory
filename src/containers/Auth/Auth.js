import React, {useState} from 'react';
import {makeInputField, checkValidity, checkIfFormIsValid} from '../../helpers/formHelpers';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import {connect} from 'react-redux';
import {auth} from '../../store/actions/auth';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {Redirect} from 'react-router-dom';

const authentication = (props) => {
    const [valid, setValid] = useState(false);
    const [isSigneup, setIsSignedup] = useState(true);
    const [controls, setControls] = useState({
        email: {
            ...makeInputField("Your Email", "email"),
            validation: {
                required: true,
                isEmail: true
            }
        },
        password: {
            ...makeInputField(null, "password"),
            elementConfig: {
                placeholder: "Password",
                type: "password"
            },
            validation: {
                required: true,
                minLength: 6
            }
        }
    });

    const inputChangedHandler = (event, type) => {
        const formData = {...controls};
        const FormElement = {...formData[type]};
        FormElement.value = event.target.value;
        FormElement.valid = checkValidity(event.target.value, FormElement.validation);
        FormElement.touched = true;
        formData[type] = FormElement;

        setControls(formData);
        setValid(checkIfFormIsValid(formData));
    }

    const authHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value,
                     controls.password.value,
                     isSigneup);
    }

    const switchAuthModeHandler = () => {
        setIsSignedup(!isSigneup)
    }

    

    let errorMessage =  null;
    if (props.error) {
        errorMessage = (
            <p>{props.error}</p>
        )
    }


    let form = <Spinner />;
    const formList = [];
    if (!props.loading)
    {
        for (let input in controls) {
            let inputData = controls[input];
            formList.push(
            <Input
                key={input}
                inputType={inputData["inputType"]}
                elementConfig={inputData["elementConfig"]}
                value={inputData["value"]}
                changed={(event) => inputChangedHandler(event, input)}
                invalid={!inputData['valid']}
                shouldValidate={Object.keys(inputData.validation).length}
                touched={inputData.touched}
            />)
        }
        form = (
            <Aux>
                <form onSubmit={authHandler}>
                    {errorMessage}
                    <div>
                        <h4>{isSigneup ? 'Register' : 'Login'}</h4>
                        {formList}
                        <Button btnType="Success" disabled={!valid}>SUBBMIT</Button>
                    </div>
                </form>
                <Button btnType="Danger" 
                    clicked={switchAuthModeHandler}>
                        Switch to {isSigneup ? 'Login' : 'Register'}
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
        onAuth: (email, password, isSignup) => dispatch(auth(email, password, isSignup))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(authentication);