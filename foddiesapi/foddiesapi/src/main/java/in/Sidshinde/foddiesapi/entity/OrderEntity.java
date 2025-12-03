package in.Sidshinde.foddiesapi.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import in.Sidshinde.foddiesapi.io.OrderItem;


@Document(collection = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {
     @Id
    private String id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private List<OrderItem> orderedItems;
    private double amount;
    private String paymentStatus;
    private String orderStatus;

}
