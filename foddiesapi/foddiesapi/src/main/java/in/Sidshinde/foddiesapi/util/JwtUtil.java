package in.Sidshinde.foddiesapi.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    private SecretKey getSigningKey() {
        if (SECRET_KEY == null || SECRET_KEY.isEmpty()) {
            throw new IllegalStateException("JWT secret key is not configured");
        }

        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);

        // HS256 requires a 32-byte key minimum
        if (keyBytes.length < 32) {
            byte[] paddedKey = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
            return Keys.hmacShaKeyFor(paddedKey);
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ---------------- TOKEN CREATION ----------------

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())               // ✅ setSubject (old API)
                .setIssuedAt(new Date())                             // ✅ setIssuedAt
                .setExpiration(new Date(System.currentTimeMillis()
                        + 1000 * 60 * 60 * 10))                      // 10 hours
                .signWith(getSigningKey())                           // HS256 with secret key
                .compact();
    }

    // ---------------- CLAIM EXTRACTION ----------------

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        JwtParser parser = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build();

        return parser
                .parseClaimsJws(token)
                .getBody();
    }

    // ---------------- VALIDATION ----------------

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }
}
