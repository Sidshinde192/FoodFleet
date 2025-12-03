package in.Sidshinde.foddiesapi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.Sidshinde.foddiesapi.entity.OrderEntity;
import in.Sidshinde.foddiesapi.io.OrderRequest;
import in.Sidshinde.foddiesapi.io.OrderResponse;
import in.Sidshinde.foddiesapi.repository.CartRespository;
import in.Sidshinde.foddiesapi.repository.OrderRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService{
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final CartRespository cartRespository;

    @Override
    public OrderResponse createOrder(OrderRequest request) {
        OrderEntity newOrder = convertToEntity(request);
        String loggedInUserId = userService.findByUserId();
        newOrder.setUserId(loggedInUserId);
        newOrder.setPaymentStatus("Paid"); // Mark as paid directly without payment gateway
        newOrder = orderRepository.save(newOrder);
        
        // Clear cart after order is created
        cartRespository.deleteByUserId(loggedInUserId);
        
        return convertToResponse(newOrder);
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list = orderRepository.findAll();
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
        return OrderResponse.builder()
                .id(newOrder.getId())
                .amount(newOrder.getAmount())
                .userAddress(newOrder.getUserAddress())
                .userId(newOrder.getUserId())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .orderedItems(newOrder.getOrderedItems())
                .build();
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderedItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus(request.getOrderStatus())
                .build();
    }

}
