import React from 'react';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
    const ingredientsSummary = Object.keys(props.ingredients).map(ingredinet => {
        return (
            <li key={ingredinet}>
                <span style={{textTransform: "capitalize"}}>{ingredinet}</span>: {props.ingredients[ingredinet]}
            </li>
        )
    });
   
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientsSummary}
            </ul>
            <p>Total price <strong>{props.price.toFixed(2)}$</strong>, Continue to Checkout?</p>
            <Button btnType={"Danger"} clicked={props.calcelOrder} >CANCEL</Button>
            <Button btnType={"Success"} clicked={props.finOrder}>CONTINUE</Button>
        </Aux>
    );
};

export default orderSummary;