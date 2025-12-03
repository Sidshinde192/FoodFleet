package in.Sidshinde.foddiesapi.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import in.Sidshinde.foddiesapi.entity.CartEntity;
import in.Sidshinde.foddiesapi.entity.FoodEntity;
import in.Sidshinde.foddiesapi.io.CartRequest;
import in.Sidshinde.foddiesapi.io.CartResponse;
import in.Sidshinde.foddiesapi.repository.CartRespository;
import in.Sidshinde.foddiesapi.repository.FoodRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {
    private static final Logger logger = LoggerFactory.getLogger(CartServiceImpl.class);
    private final CartRespository cartRespository;
    private final UserService userService;
    private final FoodRepository foodRepository;
    
    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = userService.findByUserId();
        Optional<CartEntity> cartOptional = cartRespository.findByUserId(loggedInUserId);
        CartEntity cart = cartOptional.orElseGet(() -> new CartEntity(loggedInUserId, new HashMap<>()));
        Map<String, Integer> cartItems = cart.getItems();
        
        String addedFoodId = request.getFoodId();
        cartItems.put(addedFoodId, cartItems.getOrDefault(addedFoodId, 0) + 1);
        logger.info("=== ADD TO CART REQUEST ===");
        logger.info("Added item to cart - Food ID: {}", addedFoodId);
        logger.info("Current cart items BEFORE biryani check: {}", cartItems.keySet());
        
    
        try {
            Optional<FoodEntity> addedFood = foodRepository.findById(addedFoodId);
            if (addedFood.isPresent()) {
                FoodEntity food = addedFood.get();
                String foodName = food.getName() != null ? food.getName().toLowerCase().trim() : "";
                String foodCategory = food.getCategory() != null ? food.getCategory().trim() : "";
                
                logger.info("Food details - Name: '{}', Category: '{}'", food.getName(), foodCategory);
                
                
                boolean nameContainsBiryani = foodName.contains("biryani");
                boolean categoryIsBiryani = "Biryani".equalsIgnoreCase(foodCategory);
                boolean isBiryani = nameContainsBiryani || categoryIsBiryani;
                
                logger.info("Biryani check - Name contains 'biryani': {}, Category is 'Biryani': {}, Is Biryani: {}", 
                           nameContainsBiryani, categoryIsBiryani, isBiryani);
                
          
                if (isBiryani) {
                    logger.info(">>> Biryani detected! Will ONLY add coke, nothing else! <<<");
                    
                    
                    Optional<FoodEntity> cokeOptional = Optional.empty();
                    
                    
                    cokeOptional = foodRepository.findByNameIgnoreCase("coke");
                    if (cokeOptional.isPresent()) {
                        logger.info("Found coke by name: {}", cokeOptional.get().getName());
                    }
                    
                    
                    if (cokeOptional.isEmpty()) {
                        List<FoodEntity> cokeList = foodRepository.findByCategoryIgnoreCase("Coke");
                        if (!cokeList.isEmpty()) {
                            cokeOptional = Optional.of(cokeList.get(0));
                            logger.info("Found coke by category: {}", cokeOptional.get().getName());
                        }
                    }
                    
                    
                    if (cokeOptional.isEmpty()) {
                        cokeOptional = foodRepository.findByNameIgnoreCase("coca cola");
                        if (cokeOptional.isPresent()) {
                            logger.info("Found coke by name variation (coca cola)");
                        }
                    }
                    
                    if (cokeOptional.isEmpty()) {
                        cokeOptional = foodRepository.findByNameIgnoreCase("cola");
                        if (cokeOptional.isPresent()) {
                            logger.info("Found coke by name variation (cola)");
                        }
                    }
                    
                   
                    if (cokeOptional.isPresent()) {
                        FoodEntity coke = cokeOptional.get();
                        String cokeId = coke.getId();
                        int currentCokeQty = cartItems.getOrDefault(cokeId, 0);
                        cartItems.put(cokeId, currentCokeQty + 1);
                        logger.info(">>> Added ONLY coke to cart. Coke ID: {}, New Quantity: {} <<<", cokeId, currentCokeQty + 1);
                        logger.info("Cart items AFTER adding coke: {}", cartItems.keySet());
                    } else {
                        logger.warn("Coke not found in database! Please ensure a food item named 'Coke' exists.");
                    }
                } else {
                    logger.info("Not biryani - NO items will be added automatically. Only the requested item was added.");
                }
            } else {
                logger.warn("Food item not found for ID: {}", request.getFoodId());
            }
        } catch (Exception e) {
            logger.error("Error while adding free coke: ", e);
            
        }
        
        logger.info("Final cart items: {}", cartItems.keySet());
        logger.info("=== END ADD TO CART ===");
        
        cart.setItems(cartItems);
        cart = cartRespository.save(cart);
        return convertToResponse(cart);
    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = cartRespository.findByUserId(loggedInUserId)
                .orElse(new CartEntity(loggedInUserId, new HashMap<>()));
        return convertToResponse(entity);
    }

    @Override
    public void clearCart() {
        String loggedInUserId = userService.findByUserId();
        cartRespository.deleteByUserId(loggedInUserId);
    }

    @Override
    public CartResponse removeFromCart(CartRequest cartRequest) {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = cartRespository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Cart is not found"));
        Map<String, Integer> cartItems = entity.getItems();
        if (cartItems.containsKey(cartRequest.getFoodId())) {
            int currentQty = cartItems.get(cartRequest.getFoodId());
            if (currentQty > 0) {
                cartItems.put(cartRequest.getFoodId(), currentQty - 1);
            } else {
                cartItems.remove(cartRequest.getFoodId());
            }
            entity = cartRespository.save(entity);
        }
        return convertToResponse(entity);
    }
    
    public CartResponse removeItemCompletely(String foodId) {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = cartRespository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Cart is not found"));
        Map<String, Integer> cartItems = entity.getItems();
        cartItems.remove(foodId); 
        entity.setItems(cartItems);
        entity = cartRespository.save(entity);
        logger.info("Completely removed item {} from cart", foodId);
        return convertToResponse(entity);
    }

    private CartResponse convertToResponse(CartEntity cartEntity) {
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();
    }

}
