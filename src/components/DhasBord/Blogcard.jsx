import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaRegClock, 
  FaUser, 
  FaTag, 
  FaHeart, 
  FaComment,
  FaEye,
  FaBookmark 
} from "react-icons/fa";

const BlogCard = ({ blog, hideViewDetails = false }) => {
  // Loading Skeleton
  if (!blog) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2"></div>
        </div>
      </div>
    );
  }

  const isActive = blog.author?.last_log_in
    ? (new Date() - new Date(blog.author.last_log_in)) / 60000 < 5
    : false;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return "No content available for this blog.";
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  return (
    <motion.article
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={blog.image || "https://i.ibb.co.com/Wv3PypT4/Whats-App-Image-2025-09-29-at-21-08-53-b8a6f99e.jpg"}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg capitalize">
            {blog.category || "General"}
          </span>
        </div>

        {/* Bookmark Button */}
        <button className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-300">
          <FaBookmark className="text-amber-500 hover:text-amber-600" size={14} />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300 leading-tight">
          {blog.title}
        </h3>

        {/* Author and Date Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={blog.author?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                alt={blog.author?.displayName || "Unknown Author"}
                className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                isActive ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {blog.author?.displayName || "Unknown Author"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(blog.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FaRegClock className="text-amber-500" />
            <span>{blog.readTime || "5"} min read</span>
          </div>
        </div>

        {/* Content Preview */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {truncateContent(blog.content)}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-xs font-medium"
              >
                <FaTag className="text-[10px]" />
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats and Action Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
              <FaHeart className="text-red-400" />
              {blog.likes || 0}
            </span>
            <span className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
              <FaComment className="text-blue-400" />
              {(blog.reviews || []).length}
            </span>
            <span className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer">
              <FaEye className="text-green-400" />
              {blog.views || 0}
            </span>
          </div>

          {/* View Details Button */}
          {!hideViewDetails && (
            <Link
              to={`/blogs/${blog._id}`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-2 lg:px-5 py-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:gap-3 group/btn"
            >
              Read More
              <FaRegClock className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;