import React, {Component} from 'react';
import Aux from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import classes from './Layout.css';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';


class Layout extends Component {

    state = {
        showSideDraw: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDraw: false})
    }

    sideDrawerHandler = () => {
        this.setState( (prevState) => {
            return {showSideDraw: !prevState.showSideDraw };
        });
    }

    render() {
        return (
            <Aux>
                <Toolbar isAuth={this.props.isAuthenticated} clickSideDraw={this.sideDrawerHandler}></Toolbar>
                <SideDrawer
                    isAuth={this.props.isAuthenticated}
                    showSideDraw={this.state.showSideDraw}
                    clickSideDraw={this.sideDrawerHandler}
                    close={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    };
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);