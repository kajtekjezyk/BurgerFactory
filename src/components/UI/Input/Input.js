import React from 'react';
import classes from './Input.css';

const input = (props) => {
    let inputElem = null;
    const inputClasses = [classes.InputElement];

    if (props.touched &&  props.shouldValidate && props.invalid) {
        inputClasses.push(classes.Invalid);
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
            <label className={classes.Label}>{props.label}</label>
            {inputElem}
        </div>
    );
};

export default input;