import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.log("Error fetching orders", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    await axios.patch(`${API_URL}/status/${orderId}`, null, {
      params: { status },
    });
  } catch (error) {
    console.log("Error updating order status", error);
    throw error;
  }
};





