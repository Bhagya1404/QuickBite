import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import "./AIWidget.css";

function AIWidget() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I'm QuickBite AI.\n\nHow can I help you today?",
    },
  ]);

  const { fetchCartCount } = useCart();

  const suggestions = [
    "🌶️ Spicy Food",
    "🥗 Healthy Meal",
    "💪 High Protein",
    "🍕 Pizza",
    "💸 Under ₹200",
  ];

  const sendMessage = async (userPrompt = prompt) => {
    if (!userPrompt.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        sender: "user",
        text: userPrompt,
      },
    ];

    setMessages(updatedMessages);

    setPrompt("");

    setLoading(true);

    try {
      const history = updatedMessages
        .map((m) => `${m.sender}: ${m.text}`)
        .join("\n");

      const finalPrompt = `
Conversation:

${history}

User:

${userPrompt}

Remember previous recommendations.

If the user asks "something different",
recommend another food.

If the user asks "surprise me",
choose a random menu item.

Return recommendation only.
`;

      const res = await API.post("/ai", {
        prompt: finalPrompt,
      });

      const aiData = res.data;

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          recommendation: aiData.recommendation,
          reason: aiData.reason,
          confidence: aiData.confidence,
        },
      ]);
    } catch (err) {
      console.log(err);

      toast.error("QuickBite AI failed.");

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  const surpriseMe = () => {
    sendMessage("Surprise me");
  };

  const addToCart = async (foodId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first!");
        return;
      }

      await API.post(
        "/cart",
        {
          foodId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCartCount();

      toast.success("Added to cart!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button
        className="ai-floating-btn"
        onClick={() => setOpen(!open)}
      >
        🤖
      </button>

      {open && (
        <div className="ai-chat-window">

          <div className="ai-header">

            <h3>🤖 QuickBite AI</h3>

            <button onClick={() => setOpen(false)}>
              ✖
            </button>

          </div>

          <div className="ai-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-message"
                    : "ai-message"
                }
              >

                {msg.text && <p>{msg.text}</p>}

                {msg.recommendation && (
                  <div className="ai-card">

                    <img
                      src={msg.recommendation.image}
                      alt={msg.recommendation.name}
                    />

                    <h3>{msg.recommendation.name}</h3>

                    <h4>₹{msg.recommendation.price}</h4>

                    <p>
                      🎯 {msg.confidence}% Match
                    </p>

                    <p>{msg.reason}</p>

                    <button
                      onClick={() =>
                        addToCart(
                          msg.recommendation._id
                        )
                      }
                    >
                      🛒 Add To Cart
                    </button>

                  </div>
                )}

              </div>
            ))}

            {loading && (
              <div className="ai-message">
                🤖 Thinking...
              </div>
            )}
          </div>

          <div className="ai-suggestions">

            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => sendMessage(item)}
              >
                {item}
              </button>
            ))}

            <button
              className="surprise-btn"
              onClick={surpriseMe}
            >
              🎲 Surprise Me
            </button>

          </div>

          <div className="ai-input">

            <input
              type="text"
              placeholder="Ask QuickBite AI..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={() => sendMessage()}>
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIWidget;

       