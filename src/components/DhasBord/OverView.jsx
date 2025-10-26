import React, { useEffect, useState } from "react";
import useAxios from "../../hook/useAxios";
import useAuth from "../../hook/UseAuth"; // <-- admin check এর জন্য
import { FaUser, FaBlog, FaCommentDots, FaStar, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from "../../pages/Loading";

const Overview = () => {
  const { sendRequest, loading, error } = useAxios();
  const { user } = useAuth(); // current user info
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalComments: 0,
  });

  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStats = await sendRequest("/stats");
        setStats({
          totalUsers: resStats.totalUsers ?? 0,
          totalBlogs: resStats.totalBlogs ?? 0,
          totalComments: resStats.totalComments ?? 0,
        });

        const resComments = await sendRequest("/reviews");
        const sortedComments = (resComments || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setReviews(sortedComments);
      } catch (err) {
        console.error("Error fetching stats or comments:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  const handleDelete = async (commentId, blogId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await sendRequest(`/reviews/${blogId}/${commentId}`, {
        method: "DELETE",
      });

      setReviews(prev => prev.filter(r => r._id !== commentId));
      setStats(prev => ({ ...prev, totalComments: prev.totalComments - 1 }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <motion.div className="bg-white shadow rounded p-6 flex items-center gap-4">
          <FaUser className="text-3xl text-blue-500" />
          <div>
            <h3 className="font-semibold text-lg">Total Users</h3>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </motion.div>

        <motion.div className="bg-white shadow rounded p-6 flex items-center gap-4">
          <FaBlog className="text-3xl text-green-500" />
          <div>
            <h3 className="font-semibold text-lg">Total Blogs</h3>
            <p className="text-2xl font-bold">{stats.totalBlogs}</p>
          </div>
        </motion.div>

        <motion.div className="bg-white shadow rounded p-6 flex items-center gap-4">
          <FaCommentDots className="text-3xl text-purple-500" />
          <div>
            <h3 className="font-semibold text-lg">Total Comments</h3>
            <p className="text-2xl font-bold">{stats.totalComments}</p>
          </div>
        </motion.div>
      </div>

      {/* Comments Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Latest Comments</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentReviews.map((c, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white p-4 rounded-2xl shadow flex flex-col gap-2 border border-gray-200 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.userImage || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
                      alt={c.userName || "Guest"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div>
                      <h4 className="font-semibold">{c.userName || "Guest"}</h4>
                      <p className="text-xs text-gray-500">{new Date(c.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">Blog: {c.blogTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={c.rating > i ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                    <span className="text-sm ml-1">{c.rating}/5</span>
                  </div>

                  <p>{c.comment}</p>

                  {/* Delete button only for admin */}
                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(c._id, c.blogId)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {reviews.length > reviewsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
