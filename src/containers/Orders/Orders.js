import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import Axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {connect} from 'react-redux';


class Orders extends Component {

    state =  {
        orders : [],
        loading: true
    }

    componentWillUnmount = () => {
        this.setState({orders: []});
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
                    {this.state.orders.map(elem => (
                        <Order 
                            key={elem.id}
                            ingredients={elem.ingredients}
                            price={elem.price}
                        />
                    ))}
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
    }
}

export default connect(mapStateToProps)(withErrorHandler(Orders, Axios));