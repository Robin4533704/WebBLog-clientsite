// UserProfile.jsx
import { useEffect, useState } from "react";
import useUserAxios from "../../hook/useUserAxios";
import useAuth from "../../hook/useAuth";
import Loading from "../../pages/Loading";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const UserProfile = () => {
  const { user } = useAuth();
  const { axiosIntals } = useUserAxios();

  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      // ✅ Fetch user info from backend
      const userRes = await axiosIntals(
        `/users?email=${encodeURIComponent(user.email)}`
      );

      // Make sure we get data
      const fetchedUser = userRes?.data || userRes || user;
      setUserData(fetchedUser);

      // ✅ Fetch user authored blogs
      const userBlogs = await axiosIntals(
        `/blogs/user/${encodeURIComponent(user.email)}`
      );
      setBlogs(Array.isArray(userBlogs) ? userBlogs : []);
    } catch (err) {
      console.error("Error fetching profile:", err);
      Swal.fire("Error", "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  if (loading || !userData) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-xl shadow-md p-6 mb-8"
      >
        <motion.img
          src={userData.photoURL || "/placeholder.jpg"}
          alt={userData.displayName || userData.name || "User"}
          className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6 border"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            className="text-2xl font-bold text-gray-800"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData.displayName || userData.name || "User"}
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {userData.email}
          </motion.p>
          <motion.p
            className="text-gray-500 mt-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Joined:{" "}
            {userData.created_at
              ? new Date(userData.created_at).toLocaleDateString()
              : "N/A"}
          </motion.p>
        </div>
      </motion.div>

      {/* Authored Blogs */}
      <motion.h3
        className="text-xl font-semibold mb-4 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Authored Blogs ({blogs.length})
      </motion.h3>

      {blogs.length === 0 ? (
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          You haven't authored any blogs yet.
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              }}
              className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300"
            >
              <img
                src={blog.image || "/placeholder.jpg"}
                alt={blog.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-1 line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-sm text-gray-500 mb-2">
                  Category: {blog.category || "Uncategorized"}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {blog.content}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
