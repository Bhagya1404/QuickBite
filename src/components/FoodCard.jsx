import API from "../services/api";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

function FoodCard({ food }) {
  const { fetchCartCount } = useCart();

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      await API.post(
        "/cart",
        {
          foodId: food._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update navbar cart count
      fetchCartCount();

      toast.success("Added to Cart!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="food-card">
      <div className="food-image">
        <img src={food.image} alt={food.name} />

        <span className="rating">⭐ 4.8</span>

        <span className="badge">🔥 Bestseller</span>
      </div>

      <div className="food-info">
        <h3>{food.name}</h3>

        <p>{food.description}</p>

        <div className="food-bottom">
          <h2>₹{food.price}</h2>

          <button onClick={addToCart}>
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;