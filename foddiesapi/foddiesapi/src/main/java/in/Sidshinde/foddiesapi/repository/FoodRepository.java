package in.Sidshinde.foddiesapi.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import in.Sidshinde.foddiesapi.entity.FoodEntity;

@Repository
public interface FoodRepository extends MongoRepository<FoodEntity, String> {
    Optional<FoodEntity> findByNameIgnoreCase(String name);
    List<FoodEntity> findByCategoryIgnoreCase(String category);
}
