export const makeInputField = (placeholderText, inputType="input") => {
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
        touched: false
    }
}

export const checkValidity = (value, rules) => {
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

    return isValid;
}

export const checkIfFormIsValid = (newFormElemets) => {
    for (let elem in newFormElemets) {
        if (newFormElemets[elem].valid === false) return false;
    }
    return true;
}