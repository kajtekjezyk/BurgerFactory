import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import Axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {connect} from 'react-redux';
import { loadBurger } from '../../store/actions/index';


class Orders extends Component {

    state =  {
        orders : [],
        loading: true
    }

    componentWillUnmount = () => {
        this.setState({orders: []});
    }

    onOrderClick = (price, ingredients) => {
        this.props.loadBurger(price, ingredients);
        this.props.history.push("/");
    }

    componentDidMount = () => {
        const queryParams = '?auth=' + this.props.token + '&orderBy="userId"&equalTo="' + this.props.userId +'"';
        Axios.get('/orders.json' + queryParams).then(response => {
            // &equalTo=${this.props.userId}

            const fetchedOrders = [];
            for (let key in response.data) {
                fetchedOrders.push({
                   ...response.data[key],
                   id: key
                })
            }
            this.setState({orders: fetchedOrders, loading: false});
            
        }).catch(error => {
            this.setState({loading: false});
            
        });
    }
    render() {
        let orders = <Spinner />;
        if (!this.state.loading){
            orders = (
                <Aux>
                    {this.state.orders.map(elem => {
                        return (
                        <Order
                            key={elem.id}
                            burgerName={elem.orderData.burgerName}
                            ingredients={elem.ingredients}
                            price={elem.price}
                            clicked={() => this.onOrderClick(elem.price, elem.ingredients)}
                        />
                    )})}
                </Aux>
            )
        }
        return (
            <div style={{marginTop: "120px"}}>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadBurger: (price, ingredients) => dispatch(loadBurger(price, ingredients))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, Axios));