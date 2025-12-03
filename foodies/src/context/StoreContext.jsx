import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService";
import axios from "axios";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
  removeItemCompletely,
} from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");
  const [loadingItems, setLoadingItems] = useState(new Set()); // Track items being added

  const increaseQty = async (foodId) => {
    // Validate foodId
    if (!foodId) {
      console.error('Invalid foodId provided to increaseQty');
      return;
    }
    
    // Prevent multiple simultaneous calls for the same item
    if (loadingItems.has(foodId)) {
      return;
    }
    
    // Mark this item as being processed
    setLoadingItems(prev => new Set(prev).add(foodId));
    
    // Immediate state update for better UX
    setQuantities((prev) => {
      const updated = { ...prev };
      updated[foodId] = (prev[foodId] || 0) + 1;
      return updated;
    });
    
    // Get token from state or localStorage
    const currentToken = token || localStorage.getItem("token");
    
    // Make API call if token is available
    if (currentToken) {
      try {
        await addToCart(foodId, currentToken);
        // Reload cart data from server to get any automatically added items (like free coke)
        await loadCartData(currentToken);
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Revert the optimistic update on error
        setQuantities((prev) => {
          const updated = { ...prev };
          const currentQty = prev[foodId] || 0;
          if (currentQty > 0) {
            updated[foodId] = currentQty - 1;
          } else {
            delete updated[foodId];
          }
          return updated;
        });
      } finally {
        // Remove from loading set after operation completes
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(foodId);
          return newSet;
        });
      }
    } else {
      // If no token, remove from loading set but keep the local update
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(foodId);
        return newSet;
      });
    }
  };

  const decreaseQty = async (foodId) => {
    // Prevent multiple simultaneous calls for the same item
    if (loadingItems.has(foodId)) {
      console.log(`Already processing remove from cart for item ${foodId}, skipping...`);
      return;
    }
    
    // Mark this item as being processed
    setLoadingItems(prev => new Set(prev).add(foodId));
    
    // Immediate state update for better UX
    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));
    
    // Get token from state or localStorage
    const currentToken = token || localStorage.getItem("token");
    
    // Only make API call if token is available
    if (currentToken) {
      try {
        await removeQtyFromCart(foodId, currentToken);
        // Reload cart data from server to reflect the updated cart
        await loadCartData(currentToken);
      } catch (error) {
        console.error('Error removing from cart:', error);
        // Revert the optimistic update on error
        setQuantities((prev) => ({
          ...prev,
          [foodId]: (prev[foodId] || 0) + 1,
        }));
      } finally {
        // Remove from loading set after operation completes
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(foodId);
          return newSet;
        });
      }
    } else {
      // If no token, remove from loading set
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(foodId);
        return newSet;
      });
    }
    // If no token, keep the optimistic update (user might log in later)
  };

  const removeFromCart = async (foodId) => {
    if (!foodId) {
      console.error('Invalid foodId provided to removeFromCart');
      return;
    }
    
    // Prevent multiple simultaneous calls
    if (loadingItems.has(foodId)) {
      console.log(`Already processing remove for item ${foodId}, skipping...`);
      return;
    }
    
    // Mark as processing
    setLoadingItems(prev => new Set(prev).add(foodId));
    
    // Remove from local state immediately
    setQuantities((prevQuantities) => {
      const updatedQuantitites = { ...prevQuantities };
      delete updatedQuantitites[foodId];
      return updatedQuantitites;
    });
    
    // Get token and remove from backend permanently
    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      try {
        // Remove item completely from backend
        await removeItemCompletely(foodId, currentToken);
        // Reload cart to ensure it's removed from backend
        await loadCartData(currentToken);
      } catch (error) {
        console.error('Error removing item from cart:', error);
        // Revert on error - add item back
        const previousQty = quantities[foodId] || 1;
        setQuantities((prev) => ({
          ...prev,
          [foodId]: previousQty,
        }));
      } finally {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(foodId);
          return newSet;
        });
      }
    } else {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(foodId);
        return newSet;
      });
    }
  };

  const loadCartData = async (token) => {
    try {
      const items = await getCartData(token);
      if (items && Object.keys(items).length > 0) {
        setQuantities(items);
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
  };

  const contextValue = {
    foodList,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
    loadingItems,
  };

  useEffect(() => {
    async function loadData() {
      const data = await fetchFoodList();
      setFoodList(data);
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

