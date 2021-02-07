import React, { useEffect, useState, useCallback, useRef } from 'react';
import Order from '../../components/Order/Order';
import Axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {connect} from 'react-redux';
import { loadBurger, resetPurchase } from '../../store/actions/index';
import classes from './Orders.css';

const Orders = props => {
    const inputRef = useRef();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    
    useEffect(()=> {
        setLoading(true);
        const queryParams = '?auth=' + props.token + '&orderBy="userId"&equalTo="' + props.userId +'"';
        Axios.get('/orders.json' + queryParams).then(response => {
            const fetchedOrders = [];
            for (let key in response.data) {
                fetchedOrders.push({
                   ...response.data[key],
                   id: key,
                   hidden: false
                })
            }
            setOrders(fetchedOrders);
            setLoading(false);  
        }).catch(error => {
            setLoading(false);
        });
        return setOrders([]);
    }, [props.token, props.userId])

    const ShowAll = useCallback((ordersToModify) => {
        ordersToModify = ordersToModify.map(elem => {
            elem.hidden = false;
            return elem;
        });
    }, [])

    const filterOrders = useCallback((ordersToModify) => {
        ordersToModify = ordersToModify.map(elem => {
            if (elem.orderData.burgerName.includes(searchValue)) {
                elem.hidden = false;
            } else {
                elem.hidden = true;
            }
            return elem;
        });
    } , [searchValue])

    useEffect(()=> {
        const timer = setTimeout(() => {
            if (searchValue === inputRef.current.value) {
                let modified = [...orders];
                if (searchValue.length === 0) {
                    ShowAll(modified);
                } else {
                    filterOrders(modified);
                }
                setOrders(modified);
            }
          }, 500);
          return () => {
            clearTimeout(timer);
          }
    }, [searchValue, inputRef, orders])

    const orderLoad = useCallback((price, ingredientsCounter, burger, burgerName) => {
        props.resetPurchase();
        props.loadBurger(price, ingredientsCounter, burger, burgerName);
        props.history.push("/");
    },[])

    const orderRemove = useCallback((id) => {
        setLoading(true);
        Axios.delete(`/orders/${id}.json?auth=${props.token}`).then(response=> {
            setLoading(false);
            setOrders((prevOrders) => {
                return prevOrders.filter(elem => elem.id !== id);
            });
        }).catch(error => {
            setLoading(false);
        });
    }, [props.token, orders])

    let outOrders = <Spinner />;
    if (!loading) {
        outOrders = (
            <Aux>
                {orders.map(elem => {
                    return (
                    <Order
                        key={elem.id}
                        burgerName={elem.orderData.burgerName}
                        burger={elem.burger}
                        price={elem.price}
                        load={() => orderLoad(elem.price, elem.ingredientsCounter, elem.burger, elem.orderData.burgerName)}
                        remove={() => orderRemove(elem.id)}
                        hidden={elem.hidden}
                    />
                )})}
            </Aux>
        )
    }

    return (
        <div style={{marginTop: "120px"}}>
            <div className={classes.BurgerSearch}>
                <h3 className={classes.Label}>Search by name</h3>
                <input
                    ref={inputRef}
                    onChange={(event) => setSearchValue(event.target.value)}
                    className={classes.Input}
                    type="text"
                    value={searchValue}/>
            </div>
            {outOrders}
        </div>
    );
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