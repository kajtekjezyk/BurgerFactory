import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.css';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact clicked={props.clicked}>
            BurgerBuilder
        </NavigationItem>
        {props.isAuth ? <NavigationItem link="/orders" clicked={props.clicked}>Orders</NavigationItem>: null}
        {props.isAuth ?
            <NavigationItem link="/logout" exact clicked={props.clicked}>Logout</NavigationItem>:
            <NavigationItem link="/login" exact clicked={props.clicked}>Authentication</NavigationItem>}
        
    </ul>
);

export default navigationItems;