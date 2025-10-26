import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxios from "../hook/useAxios";
import { getAuth } from "firebase/auth";
import { FaStar, FaTrash } from "react-icons/fa";

const ReviewForm = ({ blogId, reviews = [], setReviews, isAdmin = false }) => {
  const { sendRequest } = useAxios();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return toast.error("Review cannot be empty");
    if (!user) return toast.error("You must be logged in to review");

    const reviewData = {
      userId: user.uid,
      userName: user.displayName || "Guest",
      userImage: user.photoURL || "",
      comment: reviewText,
      date: new Date().toISOString(),
      rating,
      blogId,
    };

    try {
      setLoading(true);
      const res = await sendRequest(`/blogs/${blogId}/reviews`, {
        method: "POST",
        body: reviewData,
      });

      toast.success(res.message || "Review submitted!");
      setReviewText("");
      setRating(5);

      if (setReviews) setReviews([reviewData, ...reviews]);
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await sendRequest(`/reviews/${blogId}/${commentId}`, { method: "DELETE" });
      setReviews(prev => prev.filter(r => r._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h3 className="text-2xl font-bold mb-4 text-blue-600">Add a Review</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <motion.textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          whileFocus={{ scale: 1.02 }}
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 transition"
        />

        <div className="flex items-center gap-2">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">Rating:</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.3, color: "#facc15" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`text-2xl transition-colors ${
                  (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-500"
                }`}
              >
                <FaStar />
              </motion.button>
            ))}
          </div>
          <span className="text-gray-600 dark:text-gray-400 ml-2">{rating}/5</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </motion.button>
      </form>

      {/* Marquee Style Review Cards */}
      {reviews.length > 0 && (
        <div className="overflow-x-auto py-6">
          <div className="flex gap-4 animate-marquee">
            {reviews.map((r, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md border border-gray-200 w-72 flex-shrink-0 relative"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={r.userImage || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
                    alt={r.userName || "Guest"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">{r.userName || "Guest"}</h4>
                    <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400 truncate">Blog: {r.blogTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={r.rating > i ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                  <span className="text-xs ml-1">{r.rating}/5</span>
                </div>

                <p className="text-gray-700 text-sm truncate">{r.comment}</p>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>

          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                gap: 1rem;
                animation: marquee 30s linear infinite;
              }
            `}
          </style>
        </div>
      )}
    </motion.div>
  );
};

export default ReviewForm;
