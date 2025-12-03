package in.Sidshinde.foddiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String message;
    private LocalDateTime createdAt;
}


