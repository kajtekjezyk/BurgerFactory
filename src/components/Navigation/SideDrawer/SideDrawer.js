import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Auxiliary/Auxiliary'

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close]; 
    if (props.showSideDraw) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Aux>
            <Backdrop show={props.showSideDraw} clicked={props.clickSideDraw}/>
            <div className={attachedClasses.join(" ")}>
                <div className={classes.Logo} onClick={props.clickSideDraw}>
                    <Logo/>
                </div>
                <nav>
                    <NavigationItems isAuth={props.isAuth} clicked={props.close}/>
                </nav>
            </div>
        </Aux>
    );
};

export default sideDrawer;