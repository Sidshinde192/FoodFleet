package in.Sidshinde.foddiesapi.io;

import java.util.HashMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponse {
    private String id;
    private String userId;
    private Map<String, Integer> items = new HashMap<>();
}
