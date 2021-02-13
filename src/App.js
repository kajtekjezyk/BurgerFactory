import React, { Suspense, useCallback, useEffect} from 'react';
import Layout from './hoc/Layout/Lauout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import {connect} from 'react-redux';
import {authCheckState} from './store/actions/index';

const Checkout = React.lazy(()=>{
    return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(()=>{
    return import('./containers/Orders/Orders');
});

const Login = React.lazy(()=>{
    return import('./containers/Auth/Login/Login');
});

const Register = React.lazy(()=>{
    return import('./containers/Auth/Register/Register');
});


const app = props => {

    useEffect(() => {
        props.onTryAutoSignup();
    }, []);

    const generateAppContent = useCallback(() => {
        let routes = null;
        if (props.isAuthenticated) {
            routes = (
                <Switch>
                <Route path='/checkout' render={(props) => <Checkout {...props} />}/>
                <Route path='/orders' render={(props) => <Orders {...props} />}/>
                <Route path='/logout' component={Logout} />
                <Route path='/' exact component={BurgerBuilder}/>
                <Redirect to='/' />

                </Switch>
            );
        } else {
            routes = (
                <Switch>
                    <Route path='/login' render={(props) => <Login {...props} />}/>
                    <Route path='/register' render={(props) => <Register {...props} />}/>
                    <Route path='/' exact component={BurgerBuilder}/>
                    <Redirect to='/' />
                </Switch>
            );
        }
        return routes;
    }, [props]);

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>
            {generateAppContent()}
        </Suspense>
      </Layout>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
