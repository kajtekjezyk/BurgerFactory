import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import {CSSTransition} from 'react-transition-group'

const sideDrawer = (props) => {
    return (
        <Aux>
            <Backdrop show={props.showSideDraw} clicked={props.clickSideDraw}/>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={props.showSideDraw}
                timeout={300}
                classNames={{
                    enterActive: classes.Open,
                    exitActive: classes.Close
                }}>
                <div className={classes.SideDrawer}>
                    <div className={classes.Logo} onClick={props.clickSideDraw}>
                        <Logo/>
                    </div>
                    <nav>
                        <NavigationItems isAuth={props.isAuth} clicked={props.close}/>
                    </nav>
                </div>
            </CSSTransition>
        </Aux>
    );
};

export default sideDrawer;