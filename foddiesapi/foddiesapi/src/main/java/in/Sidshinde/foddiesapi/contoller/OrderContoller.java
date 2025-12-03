package in.Sidshinde.foddiesapi.contoller;

import in.Sidshinde.foddiesapi.io.OrderRequest;
import in.Sidshinde.foddiesapi.io.OrderResponse;
import in.Sidshinde.foddiesapi.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderContoller {
    private final OrderService orderService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId) {
        orderService.removeOrder(orderId);
    }

    //admin panel
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderService.getOrdersOfAllUsers();
    }

    //admin panel
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
    }

}
