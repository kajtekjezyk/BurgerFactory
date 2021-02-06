import React, {Component} from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import {CSSTransition} from 'react-transition-group'

class Modal extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    render() {
        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
                <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={this.props.show}
                    timeout={400}
                    classNames={{
                        enterActive: classes.ShowModal,
                        exitActive: classes.HideModal
                    }}>
                    <div 
                        className={classes.Modal}>
                        {this.props.children}
                    </div>
                </CSSTransition>
            </Aux>
        );
    }
    
};

export default Modal;