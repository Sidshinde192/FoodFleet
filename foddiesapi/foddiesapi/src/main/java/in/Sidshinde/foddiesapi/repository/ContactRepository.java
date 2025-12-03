package in.Sidshinde.foddiesapi.repository;

import in.Sidshinde.foddiesapi.entity.ContactEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends MongoRepository<ContactEntity, String> {
}


