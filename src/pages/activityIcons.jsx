import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../provider/AuthContext";
import fakeActivities from "./../components/fakeActivities.json";
import { 
  FiEdit, FiTrash2, FiLogIn, FiLogOut, FiUser, FiPlus, 
  FiRefreshCw, FiClock, FiPause, FiPlay 
} from "react-icons/fi";

// Mapping activity types to icons
const activityIcons = {
  LOGIN: <FiLogIn className="text-green-500" size={18} />,
  LOGOUT: <FiLogOut className="text-gray-500" size={18} />,
  CREATE: <FiPlus className="text-blue-500" size={18} />,
  UPDATE: <FiEdit className="text-yellow-500" size={18} />,
  DELETE: <FiTrash2 className="text-red-500" size={18} />,
};

// Activity card background colors
const activityColors = {
  LOGIN: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  LOGOUT: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  CREATE: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  UPDATE: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  DELETE: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
};

// Individual Activity Card
const ActivityCard = ({ activity, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${activityColors[activity.type]}`}
  >
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm relative overflow-hidden">
          {activity.avatar ? (
            <img
              src={activity.avatar}
              alt={activity.user}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-400">
              <FiUser className="text-white" size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{activity.user}</p>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full border">
            {activity.type}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{activity.message}</p>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FiClock size={12} /> {activity.time}
          </div>
          <div className="flex items-center gap-2">{activityIcons[activity.type]}</div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Main Activity Log Component
const ActivityLog = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial activities
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivities(fakeActivities);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle Google login/logout activity
  useEffect(() => {
    if (user) {
      const loginActivity = {
        id: "google-login",
        user: user.displayName || "Google User",
        avatar: user.photoURL || "",
        type: "LOGIN",
        message: "Successfully logged in via Google authentication",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setActivities(prev => [loginActivity, ...prev.filter(a => !["google-login","google-logout"].includes(a.id))]);
    } else {
      const logoutActivity = {
        id: "google-logout",
        user: "User",
        avatar: "",
        type: "LOGOUT",
        message: "User logged out from the system",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setActivities(prev => [logoutActivity, ...prev.filter(a => !["google-login","google-logout"].includes(a.id))]);
    }
  }, [user]);

  const marqueeItems = [...activities, ...activities];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActivities(fakeActivities);
      setIsLoading(false);
    }, 800);
  };

  // Loading skeleton
  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 lg:mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">Live Activity Feed</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Real-time updates of user activities across the platform
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
        >
          <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-300"
        >
          {isPaused ? <FiPlay /> : <FiPause />}
          {isPaused ? 'Resume' : 'Pause'}
        </motion.button>
      </div>

      {/* Mobile Grid */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {activities.map((activity, index) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
          </AnimatePresence>
        </div>
        {activities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Activities Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">User activities will appear here once they start using the platform.</p>
          </div>
        )}
      </div>

      {/* Desktop Marquee */}
      <div className="hidden lg:block space-y-8">
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiClock className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No Activities Recorded</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Activities will start appearing as users interact with the platform.</p>
          </div>
        ) : (
          <>
            {["ltr", "rtl"].map((dir, idx) => (
              <div key={idx} className="overflow-hidden relative w-full h-48 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 border border-gray-200 dark:border-gray-700">
                <motion.div
                  className="flex gap-6 absolute"
                  animate={{ x: isPaused ? '0%' : (dir === "ltr" ? ['0%', '-50%'] : ['-50%', '0%']) }}
                  transition={{ repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" }}
                >
                  {marqueeItems.map((activity, index) => (
                    <div key={`${dir}-${index}`} className="flex-shrink-0 w-80">
                      <div className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${activityColors[activity.type]}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                            {activity.avatar ? <img src={activity.avatar} alt={activity.user} className="w-full h-full object-cover"/> : <FiUser />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{activity.user}</p>
                            <p className="text-gray-600 dark:text-gray-300 text-xs truncate">{activity.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {activityIcons[activity.type]}
                            <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Activity Stats */}
      {activities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 lg:mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl px-6 py-3 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{activities.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Activities</div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{activities.filter(a => a.type === 'LOGIN').length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Sessions</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityLog;
