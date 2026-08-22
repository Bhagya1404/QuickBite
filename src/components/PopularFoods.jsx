import { useEffect, useState } from "react";
import API from "../services/api";
import FoodCard from "./FoodCard";

function PopularFoods() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/foods");
      setFoods(res.data.foods.slice(0, 6));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="featured-section">
      <h2>🔥 Popular Foods</h2>

      <div className="food-grid">
        {foods.map((food) => (
          <FoodCard key={food._id} food={food} />
        ))}
      </div>
    </section>
  );
}

export default PopularFoods;