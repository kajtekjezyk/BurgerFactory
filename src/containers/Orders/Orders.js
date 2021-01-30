import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import Axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {connect} from 'react-redux';
import { loadBurger, resetPurchase } from '../../store/actions/index';
import classes from './Orders.css';

class Orders extends Component {

    state =  {
        orders : [],
        loading: true,
        searchValue: ""
    }

    componentWillUnmount = () => {
        this.setState({orders: []});
    }

    orderLoad = (price, ingredientsCounter, burger, burgerName) => {
        this.props.resetPurchase();
        this.props.loadBurger(price, ingredientsCounter, burger, burgerName);
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

    onSearch = (event) => {
        event.preventDefault();
        if (this.state.searchValue.trim().length === 0) return;
        let modified = [...this.state.orders];
        modified = modified.map(elem => {
            if (elem.orderData.burgerName.includes(this.state.searchValue)) {
                elem.hidden = false;
            } else {
                elem.hidden = true;
            }
            return elem;
        });
        this.setState({orders: modified});
    }

    onSearchChange = (event) => {
        this.setState({searchValue: event.target.value});
        if (event.target.value.trim().length === 0) {
            let modified = [...this.state.orders];
            modified = modified.map(elem => {
                elem.hidden = false;
                return elem;
            });
            this.setState({orders: modified});
        }
    }

    componentDidMount = () => {
        this.setState({loading: true});
        const queryParams = '?auth=' + this.props.token + '&orderBy="userId"&equalTo="' + this.props.userId +'"';
        Axios.get('/orders.json' + queryParams).then(response => {
            const fetchedOrders = [];
            for (let key in response.data) {
                fetchedOrders.push({
                   ...response.data[key],
                   id: key,
                   hidden: false
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
                            burger={elem.burger}
                            price={elem.price}
                            load={() => this.orderLoad(elem.price, elem.ingredientsCounter, elem.burger, elem.orderData.burgerName)}
                            remove={() => this.orderRemove(elem.id)}
                            hidden={elem.hidden}
                        />
                    )})}
                </Aux>
            )
        }
        return (
            <div style={{marginTop: "120px"}}>
                <form className={classes.BurgerSearch} onSubmit={this.onSearch}>
                    <h3>Search by name</h3>
                    <input
                        onChange={this.onSearchChange}
                        className={classes.Input}
                        type="text"
                        value={this.state.seaerchValue}/>
                    <input className={classes.Button} type="submit" value="Search"/>
                </form>
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
        loadBurger: (price, ingredientsCounter, burger, burgerName) => dispatch(loadBurger(price, ingredientsCounter, burger, burgerName)),
        resetPurchase: () => dispatch(resetPurchase())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, Axios));