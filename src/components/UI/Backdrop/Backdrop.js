import React from 'react';
import classes from './Backdrop.css';
import {CSSTransition} from 'react-transition-group';

const animationTiming = {
    enter: 400,
    exit: 400
}

const backdrop = (props) => {
    return  (
        <CSSTransition
            mountOnEnter
            unmountOnExit
            in={props.show}
            timeout={animationTiming}
            classNames={{
                enter: classes.SliderEnter,
                enterActive: classes.SliderEnterActive,
                exit: classes.SliderExit,
                exitActive: classes.SliderExitActive,
            }}>
                <div className={classes.BackDrop} onClick={props.clicked} />
        </CSSTransition>
    );
};

export default backdrop