import React from 'react';
import classes from './Order.css';
import Button from '../UI/Button/Button';

const order = (props) => {
    
    let IngredientArray = [];
    for (let ingredient in props.ingredients) {
        if(props.ingredients[ingredient] > 0) {
            IngredientArray.push({name: ingredient, amount: props.ingredients[ingredient]});
        }
    }
    IngredientArray = IngredientArray.map(elem => {
        return <span 
                style={{
                    padding: "5px",
                    margin: "10px",
                    textTransform: "capitalize",
                    display: "inline-block",
                    border: "1px solid #ccc"
                }}
                key={elem.name}>
                    {elem.name}: ({elem.amount})   
                </span>
    })

    return (
        <div className={classes.Order} hidden={props.hidden} >
            <div className={classes.OrderHeader}>
                <h2>Burger name: {props.burgerName}</h2>
                <Button btnType={"Load"} clicked={props.load}>Load</Button>
                <Button btnType={"Remove"} clicked={props.remove}>Remove</Button>
            </div>
            <p>Ingredients: {IngredientArray}</p>
            <p>Price: <strong>{props.price}$</strong></p>
        </div>
    );
}

export default order;