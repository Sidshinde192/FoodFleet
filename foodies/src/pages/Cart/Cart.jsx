import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { calculateCartTotals } from "../../util/cartUtils";
import { fetchFoodDetails } from "../../service/foodService";

const Cart = () => {
  const navigate = useNavigate();
  const { foodList, increaseQty, decreaseQty, quantities, removeFromCart } =
    useContext(StoreContext);
  const [cartItems, setCartItems] = useState([]);

  
  useEffect(() => {
    const loadCartItems = async () => {
      const items = [];
      const foodIds = Object.keys(quantities).filter(id => quantities[id] > 0);
      
      for (const foodId of foodIds) {
        
        let food = foodList.find(f => f.id === foodId);
        
        
        if (!food) {
          try {
            food = await fetchFoodDetails(foodId);
          } catch (error) {
            console.error(`Error fetching food ${foodId}:`, error);
            continue;
          }
        }
        
        if (food) {
          items.push(food);
        }
      }
      
      setCartItems(items);
    };

    loadCartItems();
  }, [quantities, foodList]);

  
  const { subtotal, shipping, tax, total } = calculateCartTotals(
    cartItems,
    quantities
  );

  return (
    <div className="container py-5">
      <h1 className="mb-5">Your Shopping Cart</h1>
      <div className="row">
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="card mb-4">
              <div className="card-body">
                {cartItems.map((food) => (
                  <div key={food.id} className="row cart-item mb-3">
                    <div className="col-md-3">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="img-fluid rounded"
                        width={100}
                      />
                    </div>
                    <div className="col-md-5">
                      <h5 className="card-title">{food.name}</h5>
                      <p className="text-muted">Category: {food.category}</p>
                    </div>
                    <div className="col-md-2">
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => decreaseQty(food.id)}
                        >
                          -
                        </button>
                        <input
                          style={{ maxWidth: "100px" }}
                          type="text"
                          className="form-control  form-control-sm text-center quantity-input"
                          value={quantities[food.id]}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => increaseQty(food.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      {(() => {
                        
                        const hasBiryani = cartItems.some(item => {
                          const name = item.name ? item.name.toLowerCase() : '';
                          const category = item.category || '';
                          return name.includes('biryani') || category.toLowerCase() === 'biryani';
                        });
                        
                        
                        const isCoke = (food.name && food.name.toLowerCase() === 'coke') || 
                                      (food.name && (food.name.toLowerCase() === 'coca cola' || food.name.toLowerCase() === 'cola')) ||
                                      (food.category && food.category.toLowerCase() === 'coke');
                        
                        
                        const price = (hasBiryani && isCoke) ? 0 : food.price;
                        const totalPrice = price * quantities[food.id];
                        
                        return (
                          <div>
                            <p className="fw-bold">
                              {totalPrice === 0 ? (
                                <span>
                                  <span style={{ textDecoration: 'line-through', color: '#999' }}>
                                    ${(food.price * quantities[food.id]).toFixed(2)}
                                  </span>
                                  {' '}
                                  <span style={{ color: 'green', fontWeight: 'bold' }}>FREE</span>
                                </span>
                              ) : (
                                <span>${totalPrice.toFixed(2)}</span>
                              )}
                            </p>
                            {hasBiryani && isCoke && (
                              <small className="text-success">Free with Biryani!</small>
                            )}
                          </div>
                        );
                      })()}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(food.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-start mb-4">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>Continue Shopping
            </Link>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card cart-summary">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span>${subtotal === 0 ? 0.0 : shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>
                  ${subtotal === 0 ? 0.0 : total.toFixed(2)}
                </strong>
              </div>
              <button
                className="btn btn-primary w-100"
                disabled={cartItems.length === 0}
                onClick={() => navigate("/order")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

