import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

export const fetchUserOrders = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        }); 
        return response.data;
    } catch (error) {
        console.error('Error occured while fetching the orders', error);
        throw error;
    }
}

export const createOrder = async (orderData, token) => {
    try {
        const response = await axios.post(
            API_URL+"/create",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Error occured while creating the order', error);
        throw error;
    }
}

export const deleteOrder = async (orderId, token) => {
    try {
        await axios.delete(API_URL+"/"+ orderId, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Error occured while deleting the order', error);
        throw error;
    }
}