import React, {Component} from 'react';
import {makeInputField, checkValidity, checkIfFormIsValid, generateForm} from '../../../helpers/formHelpers';
import Button from '../../../components/UI/Button/Button';
import classes from './Register.css';
import {connect} from 'react-redux';
import {register} from '../../../store/actions/auth';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import {Redirect} from 'react-router-dom';

class Login extends Component {

    state = {
        controls: {
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
                },
            },
        isFormValid: false,
    };

    inputChangedHandler = (event, type) => {
        const formData = {...this.state.controls};
        const FormElement = {...formData[type]};
        FormElement.value = event.target.value;
        FormElement.valid = checkValidity(event.target.value, FormElement.validation, this.state.controls.password.value);
        FormElement.touched = true;
        formData[type] = FormElement;

        this.setState({controls: formData, isFormValid: checkIfFormIsValid(formData)})
    }

    authHandler = (event) => {
        event.preventDefault();
        this.props.onAuth({
            name: this.state.controls.name.value,
            email: this.state.controls.email.value,
            password: this.state.controls.password.value,
            address: this.state.controls.street.value,
            zipCode: this.state.controls.zipCode.value
        });
    }

    switchAuthModeHandler = () => {
        this.props.history.push("/login");
        
    }

    render() {

        let errorMessage =  null;
        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error}</p>
            )
        }

        let form = <Spinner />;
        const formList = [];
        generateForm(formList, this.state.controls, this.inputChangedHandler);
        if (!this.props.loading)
        {
            form = (
                <Aux>
                    <form onSubmit={this.authHandler}>
                        {errorMessage}
                        <div>
                            <h2>Register new user</h2>
                            {formList}
                            <Button btnType="Success" disabled={!this.state.isFormValid}>SUBBMIT</Button>
                        </div>
                    </form>
                    <Button btnType="Danger" 
                        clicked={this.switchAuthModeHandler}>
                            Switch to Login
                    </Button>
                </Aux>
            );
        }
        let redirect = null;
        if (this.props.isAuthenticated) redirect = <Redirect to="/"/>
        return (
            <div className={classes.AuthData}>
                {redirect}
                {form}
            </div>
        );
    }
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
        onAuth: (person) => dispatch(register(person))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);