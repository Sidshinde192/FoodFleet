package in.Sidshinde.foddiesapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "contacts")
public class ContactEntity {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String message;
    private LocalDateTime createdAt;
}


