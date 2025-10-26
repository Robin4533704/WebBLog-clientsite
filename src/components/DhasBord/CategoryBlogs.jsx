// CategoryBlogs.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogCard from "../DhasBord/Blogcard";
import useUserAxios from "../../hook/useUserAxios";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const CategoryBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axiosIntals("/blogs");
      const sortedBlogs = response
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBlogs(sortedBlogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = ["All", ...new Set(blogs.map(blog => {
    if (Array.isArray(blog.category)) return blog.category[0];
    return blog.category || "General";
  }))];

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter(blog =>
          Array.isArray(blog.category)
            ? blog.category.includes(selectedCategory)
            : blog.category === selectedCategory
        );

  const handleNext = () => {
    setVisibleCount(prev => prev + 6);
  };

  // Reset visibleCount when category changes
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory]);

  return (
    <section className="my-10">
      <h2 className="text-3xl font-bold mb-6">Category Wise Blogs</h2>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 animate-pulse h-72"
            ></div>
          ))}
        </div>
      )}

      {/* No Blogs */}
      {!loading && filteredBlogs.length === 0 && (
        <p className="text-gray-500">No blogs found in this category</p>
      )}

      {/* Blog Cards */}
      {!loading && filteredBlogs.length > 0 && (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredBlogs.slice(0, visibleCount).map(blog => (
              <motion.div
                key={blog._id}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <BlogCard
                  blog={{
                    ...blog,
                    category: Array.isArray(blog.category)
                      ? blog.category[0] || "General"
                      : blog.category || "General",
                  }}
                  hideViewDetails={true}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Next Button */}
          {visibleCount < filteredBlogs.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleNext}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-full transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CategoryBlogs;
