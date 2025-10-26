import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaStar, FaTrash, FaSearch, FaFilter, FaEye, FaClock, FaUser, FaChartBar } from "react-icons/fa";
import useUserAxios from "../../hook/useUserAxios";
import { toast } from "react-hot-toast";
import Loading from "../../pages/Loading";

const ManageBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axiosIntals("/blogs");
      setBlogs(response?.data || response || []);
      setFilteredBlogs(response?.data || response || []);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter and search blogs
  useEffect(() => {
    let result = blogs;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(blog => blog.status === statusFilter);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        case "oldest":
          return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    setFilteredBlogs(result);
  }, [blogs, searchTerm, statusFilter, sortBy]);

  // Approve blog
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await axiosIntals.patch(`/blogs/${id}/approve`);
      toast.success("Blog approved successfully!");
      await fetchBlogs();
    } catch (err) {
      console.error("Approve blog error:", err);
      toast.error(err.response?.data?.message || "Failed to approve blog");
    } finally {
      setActionLoading(null);
    }
  };

  // Feature blog
  const handleFeature = async (id) => {
    try {
      setActionLoading(id);
      await axiosIntals.patch(`/blogs/${id}/feature`);
      toast.success("Blog featured successfully!");
      await fetchBlogs();
    } catch (err) {
      console.error("Feature blog error:", err);
      toast.error(err.response?.data?.message || "Failed to feature blog");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;

    try {
      setActionLoading(id);
      await axiosIntals.delete(`/blogs/${id}`);
      toast.success("Blog deleted successfully!");
      await fetchBlogs();
    } catch (err) {
      console.error("Delete blog error:", err);
      toast.error(err.response?.data?.message || "Failed to delete blog");
    } finally {
      setActionLoading(null);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "featured":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Stats calculation
  const stats = {
    total: blogs.length,
    pending: blogs.filter(blog => blog.status === "pending").length,
    approved: blogs.filter(blog => blog.status === "approved").length,
    featured: blogs.filter(blog => blog.status === "featured").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Blogs Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Manage Blogs
          </h1>
          <p className="text-gray-600 text-lg">
            Review, approve, and manage all blog posts
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaChartBar className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <FaClock className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FaCheck className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaStar className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="featured">Featured</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 appearance-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredBlogs.length} of {blogs.length} blogs
          </p>
        </motion.div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && blogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEye className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Blogs Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no blogs to manage. Blogs will appear here once users start publishing content.
            </p>
          </motion.div>
        )}

        {/* Search Empty State */}
        {filteredBlogs.length === 0 && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Blogs Match Your Search</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </motion.div>
        )}

        {/* Blogs Grid */}
        <AnimatePresence>
          {filteredBlogs.length > 0 && (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Blog Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {blog.title}
                      </h3>
                      
                      {/* Author Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {blog.author?.fullName?.charAt(0) || blog.author?.email?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {blog.author?.fullName || blog.author?.email || "Unknown Author"}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaClock className="text-xs" />
                            {formatDate(blog.createdAt || blog.date)}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex justify-between items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(blog.status)}`}>
                          {blog.status?.toUpperCase() || "PENDING"}
                        </span>
                        {blog.featured && (
                          <FaStar className="text-yellow-500 text-lg" />
                        )}
                      </div>
                    </div>

                    {/* Blog Excerpt */}
                    {blog.content && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {blog.status !== "approved" && blog.status !== "featured" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={actionLoading === blog._id}
                          onClick={() => handleApprove(blog._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === blog._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaCheck className="text-sm" />
                          )}
                          Approve
                        </motion.button>
                      )}

                      {blog.status !== "featured" && blog.status === "approved" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={actionLoading === blog._id}
                          onClick={() => handleFeature(blog._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === blog._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaStar className="text-sm" />
                          )}
                          Feature
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={actionLoading === blog._id}
                        onClick={() => handleDelete(blog._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === blog._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaTrash className="text-sm" />
                        )}
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageBlogs;