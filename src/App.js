import React, { Component } from 'react';
import Layout from './hoc/Layout/Lauout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import {connect} from 'react-redux';
import {authCheckState} from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/AsyncComponent';


const asyncCheckout = asyncComponent(()=>{
  return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(()=>{
  return import('./containers/Orders/Orders');
});

const asyncLogin = asyncComponent(()=>{
  return import('./containers/Auth/Login/Login');
});

const asyncRegister = asyncComponent(()=>{
  return import('./containers/Auth/Register/Register');
});


class App extends Component {

  componentDidMount = () => {
    this.props.onTryAutoSignup();
  }

  render() {

    let routes = (
      <Switch>
        <Route path='/login' component={asyncLogin} />
        <Route path='/register' component={asyncRegister} />
        <Route path='/' exact component={BurgerBuilder}/>
        <Redirect to='/' />
      </Switch>
    )
    if (this.props.isAuthenticated) {
      routes = (
          <Switch>
            <Route path='/checkout' component={asyncCheckout}/>
            <Route path='/orders' component={asyncOrders} />
            <Route path='/logout' component={Logout} />
            <Route path='/' exact component={BurgerBuilder}/>
            <Redirect to="/" />

        </Switch>
        );
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
