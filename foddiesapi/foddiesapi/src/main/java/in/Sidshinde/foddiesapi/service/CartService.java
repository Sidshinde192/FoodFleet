package in.Sidshinde.foddiesapi.service;

import in.Sidshinde.foddiesapi.io.CartRequest;
import in.Sidshinde.foddiesapi.io.CartResponse;

public interface CartService {
    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);
    
    CartResponse removeItemCompletely(String foodId);
}
