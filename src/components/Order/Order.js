import React from 'react';
import classes from './Order.css';
import Button from '../UI/Button/Button';
import Burger from '../Burger/Burger';

const order = (props) => {

    let IngredientArray = [];
    IngredientArray = props.burger.map(elem => {
        return <span
                style={{
                    padding: "5px",
                    margin: "10px",
                    textTransform: "capitalize",
                    display: "inline-block",
                    border: "1px solid #ccc"
                }}
                key={elem.key}>
                    {elem.ingType}: ({elem.count})
                </span>
    })

    return (
        <div className={classes.Order} hidden={props.hidden} >
            <div className={classes.OrderHeader}>
                <h2>Burger name: {props.burgerName}</h2>
                <Button btnType={"Load"} clicked={props.load}>Load</Button>
                <Button btnType={"Remove"} clicked={props.remove}>Remove</Button>
            </div>
            <div className={classes.OrderDetails}>
                <div className={classes.Burger}>
                    <Burger burger={props.burger} clicked={()=>{return;}}/>
                </div>
                <div className={classes.OrderSummary}>
                    <p className={classes.Price}>Price: <strong>{props.price}$</strong></p>
                    <p className={classes.Ingredients}>Ingredients: {IngredientArray}</p>
                </div>

            </div>

        </div>
    );
}

export default order;