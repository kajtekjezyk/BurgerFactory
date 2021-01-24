import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import Axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {connect} from 'react-redux';
import { loadBurger, resetPurchase } from '../../store/actions/index';


class Orders extends Component {

    state =  {
        orders : [],
        loading: true
    }

    componentWillUnmount = () => {
        this.setState({orders: []});
    }

    orderLoad = (price, ingredients, burgerName) => {
        this.props.resetPurchase();
        this.props.loadBurger(price, ingredients, burgerName);
        this.props.history.push("/");
    }

    orderRemove = (id) => {
        this.setState({loading: true});
        Axios.delete(`/orders/${id}.json?auth=${this.props.token}`).then(response=> {
            this.setState((prevState) => {
                return {
                    orders: prevState.orders.filter(elem => elem.id !== id),
                    loading: false
                }
                    
            })
        }).catch(error => {
            this.setState({loading: false});
        });
    }

    componentDidMount = () => {
        this.setState({loading: true});
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
                            load={() => this.orderLoad(elem.price, elem.ingredients, elem.orderData.burgerName)}
                            remove={() => this.orderRemove(elem.id)}
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
        loadBurger: (price, ingredients, burgerName) => dispatch(loadBurger(price, ingredients, burgerName)),
        resetPurchase: () => dispatch(resetPurchase())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, Axios));