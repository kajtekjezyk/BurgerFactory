import Input from "../components/UI/Input/Input";
import React from 'react';


export const makeInputField = (placeholderText, label="", inputType="input") => {
    return {
        inputType: inputType,
            elementConfig: {
                placeholder: placeholderText,
            },
        value: "",
        validation: {
            required: true
        },
        valid : false,
        touched: false,
        label: label
    }
}

export const checkValidity = (value, rules, pass=null) => {
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isZip) {
        const pattern = /^\d{2}-\d{3}$/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNonNumeric) {
        const pattern = /^\D+$/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.same) {
        isValid = pass === value && isValid
    }

    return isValid;
}

export const checkIfFormIsValid = (newFormElemets) => {
    for (let elem in newFormElemets) {
        if (newFormElemets[elem].valid === false) return false;
    }
    return true;
}

export const generateForm = (formList, controls, inputChangedHandler) => {
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
            label={inputData.label}
            errorMessage={inputData.errorMessage}
        />)
    }
}