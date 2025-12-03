package in.Sidshinde.foddiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String message;
}


