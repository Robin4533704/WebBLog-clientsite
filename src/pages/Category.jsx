import { useState } from "react";
import CategoryBlogs from "./CategoryBlogs";

const Category = () => {
  const [category, setCategory] = useState("");

  const categories = ["Tech", "Travel", "Food", "Lifestyle"]; // আপনার categories

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Category</h1>

      <div className="flex gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg font-medium ${
              category === cat ? "bg-amber-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pass selected category to CategoryBlogs */}
      <CategoryBlogs category={category} />
    </div>
  );
};

export default Category;
