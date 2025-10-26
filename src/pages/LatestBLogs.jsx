import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaFire, 
  FaClock, 
  FaEye, 
  FaHeart, 
  FaComment,
  FaArrowRight,
  FaSpinner
} from "react-icons/fa";
import BlogCard from "../components/DhasBord/Blogcard";
import useUserAxios from "../hook/useUserAxios";
import { Link } from "react-router-dom";

const LatestBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosIntals("/blogs");

      // Enhanced popularity score algorithm
      const sortedBlogs = response
        .slice()
        .sort((a, b) => {
          const aScore = 
            (a.views || 0) * 1 + 
            (a.likes || 0) * 2 + 
            (a.reviews?.length || 0) * 3 +
            (new Date(a.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 ? 50 : 0); // Boost recent blogs
          
          const bScore = 
            (b.views || 0) * 1 + 
            (b.likes || 0) * 2 + 
            (b.reviews?.length || 0) * 3 +
            (new Date(b.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 ? 50 : 0);
          
          return bScore - aScore;
        })
        .slice(0, 6);

      setBlogs(sortedBlogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load latest blogs. Please try again.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Calculate popularity score for display
  const calculatePopularityScore = (blog) => {
    return (blog.views || 0) + (blog.likes || 0) * 2 + (blog.reviews?.length || 0) * 3;
  };

  // Format number with K/M
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
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

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <FaFire className="animate-pulse" />
            <span>TRENDING NOW</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
            Most Popular Blogs
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the most engaging and talked-about content from our community of writers
          </p>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                Loading trending content...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Unable to Load Blogs
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm mb-4">
                  {error}
                </p>
                <button
                  onClick={fetchBlogs}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blogs Grid */}
        <AnimatePresence>
          {!loading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  className="relative group"
                >
                  {/* Popularity Badge */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <FaFire className="text-xs" />
                      #{index + 1}
                    </div>
                  </div>

                  {/* Popularity Score */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {formatNumber(calculatePopularityScore(blog))} pts
                    </div>
                  </div>

                  <BlogCard
                    blog={{
                      ...blog,
                      category: Array.isArray(blog.category)
                        ? blog.category[0] || "General"
                        : blog.category || "General",
                    }}
                    hideViewDetails={false}
                  />

                  {/* Engagement Stats Overlay */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl flex items-end p-4 opacity-0 transition-opacity duration-300"
                  >
                    <div className="flex items-center gap-4 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <FaEye />
                        <span>{formatNumber(blog.views || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaHeart />
                        <span>{formatNumber(blog.likes || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaComment />
                        <span>{formatNumber(blog.reviews?.length || 0)}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!loading && !error && blogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Blogs Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to create amazing content and get featured here!
                </p>
                <Link
                  to="/create-blog"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Start Writing
                  <FaArrowRight />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All CTA */}
        {!loading && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              to="/blogs"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Explore All Blogs
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogs;