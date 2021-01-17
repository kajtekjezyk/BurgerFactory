import axios from 'axios';


const axiosOrders = axios.create({
    baseURL: 'https://react-my-burger-2c971-default-rtdb.firebaseio.com/'
});

export default axiosOrders;