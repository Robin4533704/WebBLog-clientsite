import React, { useEffect, useState } from "react";
import useAxios from "../../hook/useAxios";
import { FaStar, FaTrash } from "react-icons/fa";
import Loading from "../../pages/Loading";

// Standalone ReviewCard
const ReviewCard = ({ userName, userImage, blogTitle, date, rating, comment, isAdmin = false, onDelete, commentId, blogId }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md border border-gray-200 relative flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={userImage || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
          alt={userName || "Guest"}
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h4 className="font-semibold text-sm">{userName || "Guest"}</h4>
          <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
          <p className="text-xs text-gray-400 truncate">Blog: {blogTitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={rating > i ? "text-yellow-400" : "text-gray-300"} />
        ))}
        <span className="text-xs ml-1">{rating}/5</span>
      </div>

      <p className="text-gray-700 dark:text-gray-200 text-sm">{comment}</p>

      {isAdmin && onDelete && (
        <button
          onClick={() => onDelete(commentId, blogId)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};

// Main Grid Component
const ReviewGrid = ({ isAdmin = false }) => {
  const { sendRequest, loading, error } = useAxios();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await sendRequest("/reviews"); // fetch all reviews
        const sorted = (res || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setReviews(sorted);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (commentId, blogId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await sendRequest(`/reviews/${blogId}/${commentId}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {reviews.map((r) => (
        <ReviewCard
          key={r._id}
          userName={r.userName}
          userImage={r.userImage}
          blogTitle={r.blogTitle}
          date={r.date}
          rating={r.rating}
          comment={r.comment}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          commentId={r._id}
          blogId={r.blogId}
        />
      ))}
    </div>
  );
};

export default ReviewGrid;
