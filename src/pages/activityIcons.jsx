import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../provider/AuthContext";
import fakeActivities from "./../components/fakeActivities.json";
import { FiEdit, FiTrash2, FiLogIn, FiLogOut } from "react-icons/fi";

const activityIcons = {
  LOGIN: <FiLogIn className="text-green-500" size={20} />,
  LOGOUT: <FiLogOut className="text-gray-500" size={20} />,
  CREATE: <FiEdit className="text-blue-500" size={20} />,
  UPDATE: <FiEdit className="text-yellow-500" size={20} />,
  DELETE: <FiTrash2 className="text-red-500" size={20} />,
};

const ActivityCard = ({ activity }) => (
  <div className="flex-shrink-0 w-80 bg-white shadow-lg rounded-xl p-4 flex flex-col gap-2 hover:shadow-2xl transition duration-300">
    <div className="flex items-center gap-3">
      <img
        src={activity.avatar}
        alt={activity.user}
        className="w-12 h-12 rounded-full object-cover"
      />
      <p className="font-medium text-gray-800">{activity.user}</p>
    </div>
    <p className="text-gray-600 text-sm">{activity.message}</p>
    <div className="flex items-center justify-between mt-2">
      <div>{activityIcons[activity.type]}</div>
      <span className="text-gray-400 text-xs">{activity.time}</span>
    </div>
  </div>
);

const ActivityLog = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState(fakeActivities);

  useEffect(() => {
    if (user) {
      const googleActivity = {
        id: "google-login",
        user: user.displayName || "Google User",
        avatar: user.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg",
        type: "LOGIN",
        message: "User logged in via Google",
        time: new Date().toLocaleString(),
      };

      const logoutActivity = {
        id: "google-logout",
        user: user.displayName || "Google User",
        avatar: user.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg",
        type: "LOGOUT",
        message: "User logged out",
        time: new Date().toLocaleString(),
      };

      // Add login activity at top
      setActivities((prev) => [
        googleActivity,
        ...prev.filter((a) => a.id !== "google-login" && a.id !== "google-logout"),
      ]);
    } else {
      // User logged out, show logout activity
      setActivities((prev) => {
        const logoutActivity = {
          id: "google-logout",
          user: "Google User",
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
          type: "LOGOUT",
          message: "User logged out",
          time: new Date().toLocaleString(),
        };
        return [logoutActivity, ...prev.filter(a => a.id !== "google-login" && a.id !== "google-logout")];
      });
    }
  }, [user]);

  const marqueeItems = [...activities, ...activities]; // Duplicate for smooth scroll

  return (
    <div className="max-w-7xl mx-auto ">
      <h2 className="text-2xl pb-4 font-semibold  text-gray-800 text-center">
        Activity Log
      </h2>

      {/* Left-to-right marquee */}
      <div className="overflow-hidden relative w-full h-38">
        <motion.div
          className="flex gap-4 absolute"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 60, // slower scroll
            ease: "linear",
          }}
          whileHover={{ pause: true }}
        >
          {marqueeItems.map((activity, index) => (
            <ActivityCard key={`left-${index}`} activity={activity} />
          ))}
        </motion.div>
      </div>

      {/* Right-to-left marquee */}
      <div className="overflow-hidden relative w-full h-38">
        <motion.div
          className="flex gap-4 absolute"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 60, // slower scroll
            ease: "linear",
          }}
          whileHover={{ pause: true }}
        >
          {marqueeItems.map((activity, index) => (
            <ActivityCard key={`right-${index}`} activity={activity} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityLog;
