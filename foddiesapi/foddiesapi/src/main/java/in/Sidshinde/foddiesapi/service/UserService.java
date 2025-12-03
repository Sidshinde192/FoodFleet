package in.Sidshinde.foddiesapi.service;

import in.Sidshinde.foddiesapi.io.UserRequest;
import in.Sidshinde.foddiesapi.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
