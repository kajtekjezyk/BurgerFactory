import React from 'react';
import classes from './Input.css';

const input = (props) => {
    let inputElem = null;
    let isError = false;
    const inputClasses = [classes.InputElement];
    const labelClasses = [classes.Label];

    if (props.touched &&  props.shouldValidate && props.invalid) {
        inputClasses.push(classes.Invalid);
        labelClasses.push(classes.Error);
        isError = true;
    }

    switch (props.inputType) {
        case ('input'):
            inputElem = <input
                className={inputClasses.join(" ")}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
            />;
            break;
        case ('textarea'):
            inputElem = <textarea
                className={inputClasses.join(" ")}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
            />;
            break;
        case ('select'):
            inputElem = (
                <select
                    className={inputClasses.join(" ")}
                    onChange={props.changed}
                    value={props.value}>
                        {props.elementConfig.options.map(elem => (
                            <option key={elem.value} value={elem.value}>{elem.displayValue}</option>
                        ))}
                </select>
            );
            break;
        default:
            inputElem = <input
                onChange={props.changed}
                className={inputClasses.join(" ")}
                {...props.elementConfig}
                value={props.value}
            />;
    }
    return (
        <div className={classes.Input}>
            <label className={labelClasses.join(" ")}>{isError ? props.errorMessage : `${props.label}:`}</label>
            {inputElem}
        </div>
    );
};

export default input;