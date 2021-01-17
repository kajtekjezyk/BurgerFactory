import React, {Component} from 'react';
import {makeInputField, checkValidity, checkIfFormIsValid} from '../../helpers/formHelpers';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import {connect} from 'react-redux';
import {auth} from '../../store/actions/auth';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {Redirect} from 'react-router-dom';

class Auth extends Component {

    state = {
        controls: {
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
        },
        isFormValid: false,
        isSigneup: true
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
                          this.state.controls.password.value,
                          this.state.isSigneup);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSigneup: !prevState.isSigneup}
        })
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
        if (!this.props.loading)
        {
            for (let input in this.state.controls) {
                let inputData = this.state.controls[input];
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
                <Aux>
                    <form onSubmit={this.authHandler}>
                        {errorMessage}
                        <div>
                            <h4>{this.state.isSigneup ? 'Register' : 'Login'}</h4>
                            {formList}
                            <Button btnType="Success" disabled={!this.state.isFormValid}>SUBBMIT</Button>
                        </div>
                    </form>
                    <Button btnType="Danger" 
                        clicked={this.switchAuthModeHandler}>
                            Switch to {this.state.isSigneup ? 'Login' : 'Register'}
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
        onAuth: (email, password, isSignup) => dispatch(auth(email, password, isSignup))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);