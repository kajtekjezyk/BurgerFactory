import React, {Component} from 'react';
import {makeInputField, checkValidity, checkIfFormIsValid, generateForm} from '../../../helpers/formHelpers';
import Button from '../../../components/UI/Button/Button';
import classes from './Login.css';
import {connect} from 'react-redux';
import {login} from '../../../store/actions/auth';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import {Redirect} from 'react-router-dom';

class Login extends Component {

    state = {
        controls: {
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
            },
        },
        isFormValid: false,
    };

    inputChangedHandler = (event, type) => {
        const formData = {...this.state.controls};
        const FormElement = {...formData[type]};
        FormElement.value = event.target.value;
        FormElement.valid = checkValidity(event.target.value, FormElement.validation);
        FormElement.touched = true;
        formData[type] = FormElement;

        this.setState({controls: formData, isFormValid: checkIfFormIsValid(formData)})
    }

    authHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,
                          this.state.controls.password.value);
    }

    switchAuthModeHandler = () => {
        this.props.history.push('/register')
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
                            <h2>Login</h2>
                            {formList}
                            <Button btnType="Success" disabled={!this.state.isFormValid}>SUBBMIT</Button>
                        </div>
                    </form>
                    <Button btnType="Danger" 
                        clicked={this.switchAuthModeHandler}>
                            Switch to Register
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
        onAuth: (email, password) => dispatch(login(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);