import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRegClock, FaUser, FaTag } from "react-icons/fa";

const BlogCard = ({ blog }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl hover:border-amber-400 transition-all duration-300"
    >
      {/* 🖼️ Blog Image */}
      <div className="relative">
        <img
          src={blog.image || "https://i.ibb.co.com/ZT6rJcf/placeholder.jpg"}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          {blog.category || "General"}
        </span>
      </div>

      {/* 📄 Blog Info */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-amber-600 transition-colors">
          {blog.title}
        </h3>

        {/* 👤 Author + Date */}
        <div className="flex items-center text-gray-500 text-sm gap-3 mb-3">
          <span className="flex items-center gap-1">
            <FaUser className="text-amber-500" />
            {blog.author?.fullName || "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <FaRegClock className="text-amber-500" />
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "No date"}
          </span>
        </div>

        {/* 📝 Short Content */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {blog.content || "No content available for this blog."}
        </p>

        {/* 🏷️ Tags */}
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

        {/* 💰 Budget */}
        {blog.price && (
          <p className="text-gray-700 text-sm mb-3">
            Budget:{" "}
            <span className="font-semibold text-green-600">
              ${blog.price}
            </span>
          </p>
        )}

        {/* 🔗 Details Button */}
        <Link
          to={`/blogs/${blog._id}`}
          className="inline-block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-full transition-all"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogCard;
