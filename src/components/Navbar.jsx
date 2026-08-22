import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <h2>🍔 QuickBite</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/menu">Menu</Link>

        <Link to="/cart">
          🛒 Cart ({cartCount})
        </Link>

        <Link to="/orders">Orders</Link>

        {user ? (
          <>
            <span className="welcome">
              👋 Hi, {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;