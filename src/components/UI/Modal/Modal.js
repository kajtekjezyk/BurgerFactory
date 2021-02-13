import React from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import {CSSTransition} from 'react-transition-group'

const modal = props => {

    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={props.show}
                timeout={400}
                classNames={{
                    enterActive: classes.ShowModal,
                    exitActive: classes.HideModal
                }}>
                <div
                    className={classes.Modal}>
                    {props.children}
                </div>
            </CSSTransition>
        </Aux>
    );

};
export default React.memo(modal, (prevProps, nextProps) => {
    return nextProps.show === prevProps.show && nextProps.children === prevProps.children;
});