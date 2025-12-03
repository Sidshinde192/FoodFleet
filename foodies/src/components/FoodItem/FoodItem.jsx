import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ name, description, id, imageUrl, price }) => {
  const { increaseQty, decreaseQty, quantities, loadingItems } = useContext(StoreContext);
  const isLoading = loadingItems ? loadingItems.has(id) : false;
  const quantity = quantities && id ? (quantities[id] || 0) : 0;

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div className="card" style={{ maxWidth: "320px" }}>
        <Link to={`/food/${id}`}>
          <img
            src={imageUrl}
            className="card-img-top"
            alt="Product Image"
            height={300}
            width={60}
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">${price}</span>
            <div>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-half text-warning"></i>
              <small className="text-muted">(4.5)</small>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between bg-light">
          <Link className="btn btn-success btn-sm" to={`/food/${id}`}>
            View Food
          </Link>
          {quantity > 0 ? (
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-danger btn-sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isLoading && id) {
                    decreaseQty(id);
                  }
                }}
                disabled={isLoading || !id}
              >
                <i className="bi bi-dash-circle"></i>
              </button>
              <span className="fw-bold">{quantity}</span>
              <button
                className="btn btn-success btn-sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (id && !isLoading) {
                    increaseQty(id);
                  }
                }}
                disabled={isLoading || !id}
              >
                <i className="bi bi-plus-circle"></i>
              </button>
            </div>
          ) : (
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (id && !isLoading) {
                    increaseQty(id);
                  }
                }}
                disabled={isLoading || !id}
              >
                <i className="bi bi-plus-circle"></i>
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;

