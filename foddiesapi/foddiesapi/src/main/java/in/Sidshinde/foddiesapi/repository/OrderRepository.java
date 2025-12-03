package in.Sidshinde.foddiesapi.repository;

import java.util.List;
import java.util.Optional;
import in.Sidshinde.foddiesapi.entity.OrderEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByUserId(String userId);
}
