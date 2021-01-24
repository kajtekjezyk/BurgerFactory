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
                    ...makeInputField("Your Name"),
                    validation: {
                        required: true
                    }
                },
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
                },
                password2: {
                    ...makeInputField(null, "password"),
                    elementConfig: {
                        placeholder: "Repeat Password",
                        type: "password"
                    },
                    validation: {
                        required: true,
                        minLength: 6,
                        same: true
                    }
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
        this.props.onAuth(this.state.controls.name.value,
                          this.state.controls.email.value,
                          this.state.controls.password.value);
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
                            <h4>Register new user</h4>
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
        onAuth: (name, email, password) => dispatch(register(name, email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);