function FeaturedCategories() {
  const categories = [
    "🍕 Pizza",
    "🍔 Burger",
    "🍟 Snacks",
    "🥤 Drinks",
    "🍰 Desserts",
    "🍜 Chinese",
  ];

  return (
    <section className="featured-section">
      <h2>🍽 Popular Categories</h2>

      <div className="category-grid">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>
            {category}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCategories;