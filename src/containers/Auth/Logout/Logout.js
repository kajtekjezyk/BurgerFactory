import React, {useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {logOut} from '../../../store/actions/index';

const logout = props => {
    const {logout} = props;
    useEffect(() => {
        logout();
    }, [logout])

    return (
        <Redirect to="/"/>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        logout : () => dispatch(logOut())
    }
}

export default connect(null, mapDispatchToProps)(logout);