import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../hook/useAxios";
import { 
  FaStar, 
  FaTrash, 
  FaUser, 
  FaCalendar,
  FaBook,
  FaQuoteLeft,
  FaRegSmile,
  FaRegFrown,
  FaRegMeh,
  FaExclamationTriangle
} from "react-icons/fa";
import Loading from "../../pages/Loading";

// Standalone ReviewCard Component
const ReviewCard = ({ 
  userName, 
  userImage, 
  blogTitle, 
  date, 
  rating, 
  comment, 
  isAdmin = false, 
  onDelete, 
  commentId, 
  blogId 
}) => {
  const getRatingColor = (rating) => {
    if (rating >= 4) return "from-green-500 to-emerald-600";
    if (rating >= 3) return "from-yellow-500 to-amber-600";
    return "from-red-500 to-orange-600";
  };

  const getRatingIcon = (rating) => {
    if (rating >= 4) return <FaRegSmile className="text-white" />;
    if (rating >= 3) return <FaRegMeh className="text-white" />;
    return <FaRegFrown className="text-white" />;
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3) return "Average";
    if (rating >= 2) return "Poor";
    return "Very Poor";
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 relative group"
    >
      {/* Rating Badge */}
      <div className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r ${getRatingColor(rating)} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
        <div className="text-center">
          <div className="text-xs font-bold">{rating}</div>
          <div className="text-[8px]">/5</div>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img
            src={userImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"}
            alt={userName || "Guest"}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/20 shadow-md"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face";
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
            {getRatingIcon(rating)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate">
            {userName || "Anonymous User"}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FaCalendar className="text-blue-500" />
            <span>{new Date(date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Blog Title */}
      <div className="flex items-center gap-2 mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <FaBook className="text-blue-500 flex-shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate" title={blogTitle}>
          {blogTitle}
        </p>
      </div>

      {/* Rating Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`text-lg ${rating > i ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {getRatingText(rating)}
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="relative">
        <FaQuoteLeft className="absolute -top-2 -left-1 text-blue-500/20 text-2xl" />
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-4 line-clamp-3">
          {comment}
        </p>
      </div>

      {/* Admin Delete Button */}
      {isAdmin && onDelete && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(commentId, blogId)}
          className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl shadow-lg"
          title="Delete Review"
        >
          <FaTrash className="text-sm" />
        </motion.button>
      )}
    </motion.div>
  );
};

// Main Grid Component
const ReviewMarquee = ({ isAdmin = false, limit = 8 }) => {
  const { sendRequest, loading, error } = useAxios();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await sendRequest("/reviews");
        const sorted = (res || [])
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit);
        setReviews(sorted);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [limit]);

  const handleDelete = async (commentId, blogId) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

    try {
      await sendRequest(`/reviews/${blogId}/${commentId}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== commentId));
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review. Please try again.");
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Failed to Load Reviews
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {error.message || "Please check your connection and try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Community Reviews
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover what our readers are saying about their favorite blogs and experiences
        </p>
      </motion.div>

      {/* Reviews Grid */}
      <AnimatePresence>
        {reviews.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {reviews.map((review, index) => (
              <ReviewCard
                key={review._id}
                userName={review.userName}
                userImage={review.userImage}
                blogTitle={review.blogTitle}
                date={review.date}
                rating={review.rating}
                comment={review.comment}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                commentId={review._id}
                blogId={review.blogId}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be the first to share your thoughts and experiences with the community!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      {reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Community Insights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">{reviews.length}</div>
                <div className="text-blue-100">Total Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                </div>
                <div className="text-blue-100">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {new Set(reviews.map(r => r.userName)).size}
                </div>
                <div className="text-blue-100">Unique Reviewers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {new Set(reviews.map(r => r.blogTitle)).size}
                </div>
                <div className="text-blue-100">Blogs Reviewed</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReviewMarquee;