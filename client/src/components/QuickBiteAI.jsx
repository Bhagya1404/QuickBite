import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

function QuickBiteAI() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { fetchCartCount } = useCart();

  const askAI = async (userPrompt = prompt) => {
    if (!userPrompt.trim()) {
      toast.error("Please enter what you're craving!");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/ai", {
        prompt: userPrompt,
      });

      setResult(res.data);
    } catch (error) {
      console.log(error);
      toast.error("QuickBite AI is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const addAIToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first!");
        return;
      }

      await API.post(
        "/cart",
        {
          foodId: result.recommendation._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCartCount();

      toast.success("AI Recommendation Added To Cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item.");
    }
  };

  const suggestions = [
    "🌶️ Something spicy under ₹300",
    "🥗 Healthy meal",
    "💪 High protein food",
    "🍕 I want pizza",
    "☕ Coffee and snacks",
  ];

  return (
    <div className="ai-box">
      <h2>🤖 QuickBite AI</h2>

      <p>Describe what you're craving.</p>

      <input
        type="text"
        placeholder="Example: I want something spicy under ₹300"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={() => askAI()}>
        {loading ? "🤖 Thinking..." : "✨ Ask AI"}
      </button>

      <div className="ai-suggestions">
        {suggestions.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setPrompt(item);
              askAI(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {result && (
        <div className="ai-result">
          <img
            src={result.recommendation.image}
            alt={result.recommendation.name}
          />

          <h2>{result.recommendation.name}</h2>

          <h3>₹{result.recommendation.price}</h3>

          <p>
            <strong>🎯 Match Score:</strong> {result.confidence}%
          </p>

          <p>
            <strong>💡 Why?</strong>
            <br />
            {result.reason}
          </p>

          <button
            className="hero-btn"
            onClick={addAIToCart}
          >
            🛒 Add To Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default QuickBiteAI;