import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Error while fetching orders.");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully.");
      await fetchOrders();
    } catch (error) {
      toast.error("Error updating order status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
        <h2 className="mb-4">All Orders</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id.substring(0, 8)}...</td>
                  <td>{order.email}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.userAddress}</td>
                  <td>${order.amount}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.paymentStatus === "Paid"
                          ? "bg-success"
                          : "bg-warning"
                      }`}
                    >
                      {order.paymentStatus || "Pending"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.orderStatus === "Delivered"
                          ? "bg-success"
                          : order.orderStatus === "Preparing"
                          ? "bg-warning"
                          : "bg-info"
                      }`}
                    >
                      {order.orderStatus || "Preparing"}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.orderStatus || "Preparing"}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                    >
                      <option value="Preparing">Preparing</option>
                      <option value="On the way">On the way</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
