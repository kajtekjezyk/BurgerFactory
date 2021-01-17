import React from 'react';
import classses from './BuildControls.css';
import BuildControl from "./BuildControl/BuildControl";
import PropTypes from "prop-types";

const buildConntrols = (props) => {
    const makeLabel = (label) => {
        label = label.split("");
        label[0] = label[0].toUpperCase();
        label = label.join("");
        return label;
    }
    const controls = Object.keys(props.ingredients).map(elem =>{
        return (
            <BuildControl
                label={makeLabel(elem)}
                key={elem}
                type={elem}
                shouldDisable={props.disabled[elem]}></BuildControl>
        );
    });
    return (
    <div className={classses.BuildControls}>
        <p>Burger price: <strong>{props.totalPrice.toFixed(2)}$</strong></p>
        <div className={classses.Container}>
            {controls}
        </div>
        <button
            className={classses.OrderButton}
            disabled={props.disableDisplay}
            onClick={props.purchased}>{props.isAuth ? "ORDER NOW" : "Sign up to order"}</button>
    </div>
    );
};

buildConntrols.propTypes = {
    disabled: PropTypes.object,
    ingredients: PropTypes.object,
    totalPrice: PropTypes.number,
    disableDisplay: PropTypes.bool,
    purchased: PropTypes.func
}

export default buildConntrols;