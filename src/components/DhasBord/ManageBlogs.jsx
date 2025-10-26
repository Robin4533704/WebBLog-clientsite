import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaStar, FaTrash } from "react-icons/fa";
import useUserAxios from "../../hook/useUserAxios";
import { toast } from "react-hot-toast";
import Loading from "../../pages/Loading";

const ManageBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await axiosIntals("/blogs");
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Approve blog
  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await axiosIntals(`/blogs/${id}/approve`, { method: "PATCH" });
      toast.success("Blog approved!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve blog");
    } finally {
      setActionLoading(false);
    }
  };

  // Feature blog
  const handleFeature = async (id) => {
    try {
      setActionLoading(true);
      await axiosIntals(`/blogs/${id}/feature`, { method: "PATCH" });
      toast.success("Blog featured!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to feature blog");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      setActionLoading(true);
      await axiosIntals(`/blogs/${id}`, { method: "DELETE" });
      toast.success("Blog deleted!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Manage Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between gap-4"
            >
              {/* Blog Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Author: {blog.author?.fullName || blog.author?.email || "Unknown"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      blog.status === "approved"
                        ? "text-green-500"
                        : blog.status === "featured"
                        ? "text-yellow-500"
                        : "text-gray-500"
                    }`}
                  >
                    {blog.status || "pending"}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                {blog.status !== "approved" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={actionLoading}
                    onClick={() => handleApprove(blog._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition"
                  >
                    <FaCheck /> Approve
                  </motion.button>
                )}
                {blog.status !== "featured" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={actionLoading}
                    onClick={() => handleFeature(blog._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white transition"
                  >
                    <FaStar /> Feature
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={actionLoading}
                  onClick={() => handleDelete(blog._id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
                >
                  <FaTrash /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
