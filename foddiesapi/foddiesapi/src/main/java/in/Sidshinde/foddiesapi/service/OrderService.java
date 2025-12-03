package in.Sidshinde.foddiesapi.service;

import java.util.List;
import in.Sidshinde.foddiesapi.io.OrderRequest;
import in.Sidshinde.foddiesapi.io.OrderResponse;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(String orderId, String status);
}
