import { useEffect, useState } from "react";
import API from "../services/api";
import FoodCard from "../components/FoodCard";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [search, category, foods]);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/foods");

      setFoods(res.data.foods);
      setFilteredFoods(res.data.foods);
    } catch (err) {
      console.log(err);
    }
  };

  const filterFoods = () => {
    let data = [...foods];

    if (category !== "All") {
      data = data.filter(
        (food) =>
          food.category &&
          food.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim() !== "") {
      data = data.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredFoods(data);
  };

  return (
    <div className="menu-page">
      <h1>🍴 Explore Menu</h1>

      <input
        className="search-bar"
        type="text"
        placeholder="Search Food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="categories">
        <button onClick={() => setCategory("All")}>
          All
        </button>

        <button onClick={() => setCategory("Pizza")}>
          Pizza
        </button>

        <button onClick={() => setCategory("Burger")}>
          Burger
        </button>

        <button onClick={() => setCategory("Chinese")}>
          Chinese
        </button>

        <button onClick={() => setCategory("Dessert")}>
          Dessert
        </button>

        <button onClick={() => setCategory("Drinks")}>
          Drinks
        </button>
      </div>

      <div className="food-grid">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
            />
          ))
        ) : (
          <h2
            style={{
              textAlign: "center",
              width: "100%",
              marginTop: "40px",
            }}
          >
            😔 No food found
          </h2>
        )}
      </div>
    </div>
  );
}

export default Menu;