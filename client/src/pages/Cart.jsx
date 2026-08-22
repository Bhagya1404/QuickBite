import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch Cart
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data.cart);
    } catch (error) {
      console.log(error);
    }
  };

  // Remove Item
  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCart();
      fetchCartCount();

      toast.success("Item Removed");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Remove Item");
    }
  };

  // Update Quantity
  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/cart/${id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
      fetchCartCount();
    } catch (error) {
      console.log(error);
      toast.error("Failed to Update Quantity");
    }
  };

  // Total
  const total = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  // Checkout
  const checkout = async () => {
    try {
      const token = localStorage.getItem("token");

      const items = cartItems.map((item) => ({
        food: item.food._id,
        quantity: item.quantity,
      }));

      await API.post(
        "/orders",
        {
          items,
          totalAmount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCartCount();

      toast.success("🎉 Order Placed Successfully!");

      navigate("/orders");
    } catch (error) {
      console.log(error);
      toast.error("Checkout Failed");
    }
  };

  return (
    <div className="cart-page">
      <h1>🛒 My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
        <h1>🛒</h1>

        <h2>Your Cart is Empty</h2>

        <p>Let's find something delicious!</p>

        <button
            className="checkout-btn"
            onClick={() => navigate("/menu")}
        >
            Browse Menu
        </button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-card" key={item._id}>
              <img src={item.food.image} alt={item.food.name} />

              <div className="cart-info">
                <h2>{item.food.name}</h2>

                <p>{item.food.description}</p>

                <h3>₹ {item.food.price}</h3>

                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.quantity - 1)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="bill">
            <h2>Total : ₹{total}</h2>

            <button
              className="checkout-btn"
              onClick={checkout}
            >
              Proceed To Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;