import React, { useState, useEffect } from 'react';
import Order from '../../components/Order/Order';
import Axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {connect} from 'react-redux';


const orders = (props) => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const {token, userId} = props;

    useEffect(()=> {
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId +'"';
        Axios.get('/orders.json' + queryParams).then(response => {

            const fetchedOrders = [];
            for (let key in response.data) {
                fetchedOrders.push({
                   ...response.data[key],
                   id: key
                })
            }
            setOrders(fetchedOrders);
            setLoading(false);
            
        }).catch(error => {
            setLoading(false);    
        });

        return () => {
            setOrders([]);
        }
    }, [token, userId]);

    let ordersToShow = <Spinner />;
        if (!loading){
            ordersToShow = (
                <Aux>
                    {orders.map(elem => (
                        <Order 
                            key={elem.id}
                            ingredients={elem.ingredients}
                            price={elem.price}
                        />
                    ))}
                </Aux>
            )
        }

    return  (
        <div style={{marginTop: "120px"}}>
            {ordersToShow}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        userId: state.auth.userId
    }
}

export default connect(mapStateToProps)(withErrorHandler(orders, Axios));