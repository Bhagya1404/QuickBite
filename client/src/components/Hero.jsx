import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <span className="tag">
          🍔 India's Favourite Food Delivery
        </span>

        <h1>
          Delicious Food
          <br />
          Delivered <span>Fast.</span>
        </h1>

        <p>
          Order fresh meals from your favourite restaurants.
          Fast delivery, amazing taste, and secure ordering.
        </p>

        <Link to="/menu">
          <button className="hero-btn">
            🍽 Explore Menu
          </button>
        </Link>
      </div>

      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900"
          alt="Food"
        />
      </div>
    </section>
  );
}

export default Hero;