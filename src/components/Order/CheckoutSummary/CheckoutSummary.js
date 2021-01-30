import React from 'react';
import classes from './CheckoutSummary.css';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button'

const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>We hope it tastes well!</h1>
            <div className={classes.Burger}>
                <Burger burger={props.burger} clicked={()=>{return;}}/>
            </div>
                <Button btnType={"Danger"} clicked={props.goBack}>CANCEL</Button>
                <Button btnType={"Success"} clicked={props.proceed} >CONTINUE</Button>
        </div>
    );
}

export default checkoutSummary;