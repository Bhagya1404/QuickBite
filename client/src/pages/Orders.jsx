import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="cart-page">
      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (
        <h2>No Orders Yet</h2>
      ) : (
        orders.map((order) => (
          <div className="cart-card" key={order._id}>
            <div className="cart-info">
              <h2>Order ID</h2>

              <p>{order._id}</p>

              <h3>Total : ₹{order.totalAmount}</h3>

              <p>Status : {order.status}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;