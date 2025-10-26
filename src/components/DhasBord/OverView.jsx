import React, { useEffect, useState } from "react";
import useAxios from "../../hook/useAxios";
import useAuth from "../../hook/UseAuth";
import {
  FaUser,
  FaBlog,
  FaCommentDots,
  FaStar,
  FaTrash,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Overview = () => {
  const { sendRequest, loading, error } = useAxios();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    
    totalReviews: 0,
    featuredBlogs: 0,
    pendingBlogs: 0,
  });

  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const reviewsPerPage = 8;

  // ✅ Fetch stats and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStats = await sendRequest("/stats");
        setStats({
          totalUsers: resStats?.totalUsers ?? 0,
          totalBlogs: resStats?.totalBlogs ?? 0,
          totalComments: resStats?.totalComments ?? 0,
          featuredBlogs: resStats?.featuredBlogs ?? 0,
          pendingBlogs: resStats?.pendingBlogs ?? 0,
          totalReviews: 0,
        });

        const resComments = await sendRequest("/reviews");
        const sortedComments = (resComments || []).sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );

        setReviews(sortedComments);
        setFilteredReviews(sortedComments);
        setStats((prev) => ({
          ...prev,
          totalReviews: sortedComments.length,
        }));
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Filter reviews by search/rating
  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.blogTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      const ratingValue = parseInt(ratingFilter);
      filtered = filtered.filter((review) => review.rating === ratingValue);
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [searchTerm, ratingFilter, reviews]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  // ✅ Delete Review
  const handleDelete = async (commentId, blogId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    )
      return;

    try {
      setDeleteLoading(commentId);
      await sendRequest(`/reviews/${blogId}/${commentId}`, {
        method: "DELETE",
      });

      setReviews((prev) => prev.filter((r) => r._id !== commentId));
      setStats((prev) => ({
        ...prev,
        totalReviews: prev.totalReviews - 1,
      }));
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // ✅ Utility functions
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600 bg-green-50 border-green-200";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Data
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // ✅ Main UI
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
            Dashboard Overview
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back! Here’s what’s happening on your blog platform.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
          {/* Total Users */}
          <StatCard
            icon={<FaUser className="text-white text-xl" />}
            title="Users"
            value={stats.totalUsers}
            colors="from-blue-500 to-blue-600"
            delay={0.1}
          />

          {/* Total Blogs */}
          <StatCard
            icon={<FaBlog className="text-white text-xl" />}
            title="Blogs"
            value={stats.totalBlogs}
            colors="from-green-500 to-green-600"
            delay={0.2}
          />

        

          {/* Total Reviews */}
          <StatCard
            icon={<FaStar className="text-white text-xl" />}
            title="Reviews"
            value={stats.totalReviews}
            colors="from-pink-500 to-pink-600"
            delay={0.35}
          />

          {/* Featured */}
          <StatCard
            icon={<FaStar className="text-white text-xl" />}
            title="Featured"
            value={stats.featuredBlogs}
            colors="from-yellow-500 to-yellow-600"
            delay={0.4}
          />

          {/* Pending */}
          <StatCard
            icon={<FaChartLine className="text-white text-xl" />}
            title="Pending"
            value={stats.pendingBlogs}
            colors="from-orange-500 to-orange-600"
            delay={0.5}
          />
        </div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Latest Comments & Reviews
              </h2>
              <p className="text-gray-600">
                Manage and monitor user feedback below
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>

              {/* Rating Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
                >
                  <option value="all">All Ratings</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 && "s"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="p-6">
            {filteredReviews.length === 0 ? (
              <EmptyState
                icon={searchTerm ? FaSearch : FaCommentDots}
                title={
                  searchTerm ? "No Reviews Found" : "No Comments or Reviews Yet"
                }
                subtitle={
                  searchTerm
                    ? "Try adjusting your search terms or filters."
                    : "User feedback will appear here once users start engaging."
                }
              />
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Showing {filteredReviews.length} of {reviews.length} reviews
                </p>

                <AnimatePresence>
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {currentReviews.map((review, index) => (
                      <ReviewCard
                        key={review._id}
                        review={review}
                        index={index}
                        user={user}
                        deleteLoading={deleteLoading}
                        handleDelete={handleDelete}
                        formatDate={formatDate}
                        getRatingColor={getRatingColor}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ✅ Reusable Components
const StatCard = ({ icon, title, value, colors, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
  >
    <div className="flex items-center space-x-4">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${colors} rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="text-center py-16">
    <Icon className="mx-auto text-5xl text-gray-300 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 max-w-md mx-auto">{subtitle}</p>
  </div>
);

const ReviewCard = ({
  review,
  index,
  user,
  deleteLoading,
  handleDelete,
  formatDate,
  getRatingColor,
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-start space-x-3 mb-3">
      <img
        src={review.userImage || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
        alt={review.userName || "Guest"}
        className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">
          {review.userName || "Guest User"}
        </h4>
        <p className="text-xs text-gray-500">
          {formatDate(review.date || review.createdAt)}
        </p>
      </div>
    </div>

    <p
      className="text-sm font-medium text-gray-700 truncate mb-2"
      title={review.blogTitle}
    >
      {review.blogTitle}
    </p>

    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${
              review.rating > i ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full border ${getRatingColor(
          review.rating
        )}`}
      >
        {review.rating}/5
      </span>
    </div>

    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
      {review.comment}
    </p>

    {user?.role === "admin" && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleDelete(review._id, review.blogId)}
        disabled={deleteLoading === review._id}
        className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
      >
        {deleteLoading === review._id ? (
          <>
            <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            Deleting...
          </>
        ) : (
          <>
            <FaTrash className="text-xs" />
            Delete
          </>
        )}
      </motion.button>
    )}
  </motion.div>
);

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => (
  <div className="flex justify-center items-center gap-4 mt-8">
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
    >
      <FaChevronLeft className="text-sm" />
      Prev
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index + 1}
        onClick={() => setCurrentPage(index + 1)}
        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
          currentPage === index + 1
            ? "bg-amber-500 text-white shadow-lg"
            : "bg-white border border-gray-300 hover:bg-gray-50"
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
    >
      Next
      <FaChevronRight className="text-sm" />
    </button>
  </div>
);

export default Overview;
