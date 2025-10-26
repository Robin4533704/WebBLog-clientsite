import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRegClock, FaUser, FaTag, FaHeart, FaComment } from "react-icons/fa";

const BlogCard = ({ blog, hideViewDetails = false }) => {
  // Loading Skeleton
  if (!blog) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-5 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
        </div>
      </div>
    );
  }

  const isActive = blog.author?.last_log_in
    ? (new Date() - new Date(blog.author.last_log_in)) / 60000 < 5
    : false;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl hover:border-amber-400 transition-all duration-300"
    >
      <div className="relative">
        <img
          src={blog.image || "https://i.ibb.co/ZT6rJcf/placeholder.jpg"}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          {blog.category || "General"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-amber-600 transition-colors">
          {blog.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <img
              src={blog.author?.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
              alt={blog.author?.displayName || "Unknown"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span>{blog.author?.displayName || "Unknown"}</span>
              <span className={`text-xs ${isActive ? "text-green-500" : "text-gray-400"}`}>
                {isActive ? "Active" : "Offline"} •{" "}
                {blog.author?.last_log_in
                  ? new Date(blog.author.last_log_in).toLocaleTimeString()
                  : "No login"}
              </span>
            </div>
          </div>

          <span className="flex items-center gap-1 text-gray-500 text-sm">
            <FaRegClock className="text-amber-500" />
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "No date"}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {blog.content || "No content available for this blog."}
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <FaTag className="text-[10px]" /> {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-3 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <FaHeart className="text-red-500" /> {blog.likes || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment className="text-blue-500" /> {(blog.reviews || []).length}
          </span>
        </div>

        {!hideViewDetails && (
          <Link
            to={`/blogs/${blog._id}`}
            className="inline-block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-full transition-all"
          >
            View Details
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default BlogCard;
