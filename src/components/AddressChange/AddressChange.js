import React from 'react';
import classes from './AddressChange.css';
import Button from '../UI/Button/Button';

const addressChange = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h2>Typed address has changed</h2>
            <p>Do you want to modify your base address?</p>
                <Button btnType={'Danger'} clicked={props.cancel}>CANCEL</Button>
                <Button btnType={'No'} clicked={props.decline}>NO</Button>
                <Button btnType={'Success'} clicked={props.proceed} >YES</Button>
        </div>
    );
};

export default addressChange