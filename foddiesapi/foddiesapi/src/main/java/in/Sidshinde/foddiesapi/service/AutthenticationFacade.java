package in.Sidshinde.foddiesapi.service;
import org.springframework.security.core.Authentication;

public interface AutthenticationFacade {
    Authentication getAuthentication();
}
