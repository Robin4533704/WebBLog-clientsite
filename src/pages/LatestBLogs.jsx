// LatestBlogs.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogCard from "../components/DhasBord/Blogcard";
import useUserAxios from "../hook/useUserAxios";

const LatestBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axiosIntals("/blogs");

      // Popularity score: views + likes + reviews
      const sortedBlogs = response
        .slice()
        .sort((a, b) => {
          const aScore = (a.views || 0) + (a.likes || 0) + (a.reviews || 0);
          const bScore = (b.views || 0) + (b.likes || 0) + (b.reviews || 0);
          return bScore - aScore;
        })
        .slice(0, 6); // শুধু top 6 blog দেখাবে

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

  return (
    <section className="my-10 ">
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
        Latest Blogs
      </h2>

      {loading && (
        <p className="text-gray-500 animate-pulse text-center">
          Loading latest blogs...
        </p>
      )}

      {!loading && blogs.length === 0 && (
        <p className="text-gray-500 text-center">No blogs found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogCard
                blog={{
                  ...blog,
                  category: Array.isArray(blog.category)
                    ? blog.category[0] || "General"
                    : blog.category || "General",
                }}
                hideViewDetails={true} // View Details hide
              />
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default LatestBlogs;
