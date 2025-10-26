import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaFilter, 
  FaArrowRight, 
  FaArrowLeft, 
  FaSearch,
  FaTimes,
  FaLayerGroup,
  FaEye,
  FaCalendarAlt
} from "react-icons/fa";
import BlogCard from "../DhasBord/Blogcard";
import useUserAxios from "../../hook/useUserAxios";

const CategoryBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  };

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

  // Extract unique categories
  const categories = ["All", ...new Set(blogs.map(blog => {
    if (Array.isArray(blog.category)) return blog.category[0];
    return blog.category || "General";
  }))].filter(Boolean);

  // Filter and sort blogs
  const filteredBlogs = blogs
    .filter(blog => {
      const matchesCategory = selectedCategory === "All" || 
        (Array.isArray(blog.category) 
          ? blog.category.includes(selectedCategory)
          : blog.category === selectedCategory);
      
      const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.author?.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "most-liked":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

  const handleNext = () => {
    setVisibleCount(prev => prev + 9);
  };

  const handlePrevious = () => {
    setVisibleCount(prev => Math.max(9, prev - 9));
  };

  // Reset visibleCount when category or search changes
  useEffect(() => {
    setVisibleCount(9);
  }, [selectedCategory, searchTerm, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSortBy("newest");
  };

  const hasActiveFilters = selectedCategory !== "All" || searchTerm || sortBy !== "newest";

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <FaLayerGroup />
            <span>CATEGORY WISE BLOGS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
            Explore by Category
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover amazing content organized by categories. Filter, search, and find exactly what you're looking for.
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 min-w-[160px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="most-liked">Most Liked</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
              >
                <FaTimes />
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")} className="hover:text-blue-600">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")} className="hover:text-green-600">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
              {sortBy !== "newest" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  Sort: {sortBy}
                  <button onClick={() => setSortBy("newest")} className="hover:text-purple-600">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-8 justify-center"
        >
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg"
              }`}
            >
              <FaFilter className="text-sm" />
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-amber-600">{Math.min(visibleCount, filteredBlogs.length)}</span> of{" "}
            <span className="font-semibold text-amber-600">{filteredBlogs.length}</span> blogs
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <FaEye />
            <span>Total Views: {filteredBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0).toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse h-80"
              >
                <div className="w-full h-40 bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* No Blogs State */}
        {!loading && filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Blogs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {hasActiveFilters 
                  ? "Try adjusting your filters to see more results." 
                  : "No blogs available in this category yet."
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Blog Cards Grid */}
        {!loading && filteredBlogs.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs.slice(0, visibleCount).map(blog => (
                <motion.div
                  key={blog._id}
                  variants={cardVariants}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <BlogCard
                    blog={{
                      ...blog,
                      category: Array.isArray(blog.category)
                        ? blog.category[0] || "General"
                        : blog.category || "General",
                    }}
                    hideViewDetails={false}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {filteredBlogs.length > 9 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center items-center gap-4 mt-12"
              >
                <button
                  onClick={handlePrevious}
                  disabled={visibleCount <= 9}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                >
                  <FaArrowLeft />
                  Previous
                </button>

                <span className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold">
                  {Math.ceil(visibleCount / 9)} / {Math.ceil(filteredBlogs.length / 9)}
                </span>

                <button
                  onClick={handleNext}
                  disabled={visibleCount >= filteredBlogs.length}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                >
                  Next
                  <FaArrowRight />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryBlogs;