import React, {useState, useCallback} from 'react';
import Aux from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import classes from './Layout.css';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';


const layout = (props) => {
    const [showSideDraw, setSideDraw] = useState(false);

    const sideDrawerHandler = useCallback(() => {
        setSideDraw(!showSideDraw);
    }, [showSideDraw]);

    
    return (
        <Aux>
            <Toolbar isAuth={props.isAuthenticated} clickSideDraw={sideDrawerHandler}></Toolbar>
            <SideDrawer
                isAuth={props.isAuthenticated}
                showSideDraw={showSideDraw}
                clickSideDraw={sideDrawerHandler}
                close={() => setSideDraw(false)}/>
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    );
    
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(layout);