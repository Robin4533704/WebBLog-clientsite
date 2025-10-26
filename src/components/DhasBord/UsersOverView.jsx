import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../provider/AuthContext";
import { 
  FaRegClock, 
  FaHeart, 
  FaComment, 
  FaBlog, 
  FaUser,
  FaCalendarAlt,
  FaChartLine,
  FaEye,
  FaShare,
  FaEdit,
  FaTrash,
  FaPlus
} from "react-icons/fa";
import useAxios from "../../hook/useAxios";
import Loading from "../../pages/Loading";

const UserOverview = () => {
  const { user } = useContext(AuthContext);
  const { sendRequest, loading, error } = useAxios();
  const [stats, setStats] = useState({
    blogs: 0,
    likes: 0,
    comments: 0,
    views: 0,
    shares: 0,
    recentActivities: [],
  });
  const [timeRange, setTimeRange] = useState("all"); // all, week, month, year

  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      try {
        const res = await sendRequest(`/users/${user.uid}/overview?timeRange=${timeRange}`);
        setStats({
          blogs: res.blogs || 0,
          likes: res.likes || 0,
          comments: res.comments || 0,
          views: res.views || 0,
          shares: res.shares || 0,
          recentActivities: res.recentActivities || [],
        });
      } catch (err) {
        console.error("Error fetching user overview:", err);
      }
    };

    fetchUserStats();
  }, [user, sendRequest, timeRange]);

  // Enhanced date formatting with relative time
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Relative time for recent activities
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  };

  // Detailed date for tooltips
  const getDetailedDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });
  };

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'blog_created':
        return <FaPlus className="text-green-500" />;
      case 'blog_updated':
        return <FaEdit className="text-blue-500" />;
      case 'blog_deleted':
        return <FaTrash className="text-red-500" />;
      case 'comment_added':
        return <FaComment className="text-purple-500" />;
      case 'like_received':
        return <FaHeart className="text-red-500" />;
      case 'view_received':
        return <FaEye className="text-amber-500" />;
      default:
        return <FaRegClock className="text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-amber-500 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to view your personal dashboard and statistics.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Welcome back! Here's your activity summary.
            </p>
          </div>
          
          {/* Time Range Filter */}
          <div className="flex gap-2 mt-4 lg:mt-0">
            {[
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "year", label: "This Year" },
              { value: "all", label: "All Time" }
            ].map((range) => (
              <motion.button
                key={range.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  timeRange === range.value
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                }`}
              >
                {range.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user.photoURL || "https://i.pravatar.cc/150?img=12"}
                alt={user.displayName || "User"}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-500 shadow-lg"
                onError={(e) => {
                  e.target.src = "https://i.pravatar.cc/150?img=12";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.displayName || "Anonymous User"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FaRegClock className="text-amber-500" />
                  <span title={getDetailedDate(user.metadata?.lastSignInTime)}>
                    Last active: {formatDate(user.metadata?.lastSignInTime)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-amber-500" />
                  <span>Joined {formatDate(user.metadata?.creationTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaChartLine className="text-green-500" />
                  <span>{stats.blogs} blogs published</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {/* Total Blogs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <FaBlog className="text-white text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.blogs}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Blogs</p>
          </div>

          {/* Total Likes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <FaHeart className="text-white text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.likes}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Likes</p>
          </div>

          {/* Total Comments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <FaComment className="text-white text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.comments}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Comments</p>
          </div>

          {/* Total Views */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <FaEye className="text-white text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.views}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Views</p>
          </div>

          {/* Total Shares */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <FaShare className="text-white text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.shares}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Shares</p>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaRegClock className="text-amber-500" />
              Recent Activities
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {stats.recentActivities.length} activities
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl animate-pulse">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : stats.recentActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRegClock className="text-gray-400 text-2xl" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Activities Yet</h4>
              <p className="text-gray-500 dark:text-gray-400">
                Your activities will appear here once you start engaging with the platform.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {stats.recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                        {activity.message}
                      </p>
                      {activity.details && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                          {activity.details}
                        </p>
                      )}
                    </div>
                    
                    <div 
                      className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 group-hover:text-amber-500 transition-colors duration-300"
                      title={getDetailedDate(activity.time)}
                    >
                      {formatDate(activity.time)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserOverview;