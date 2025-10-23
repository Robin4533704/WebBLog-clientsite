import React from "react";

const ActivityCard = ({ activity }) => {
  if (!activity) return null;

  const {
    userName = "Unknown User",
    userEmail = "No Email",
    userPhoto = "https://i.ibb.co/MBtjqXQ/default-profile.png",
    action = "No activity",
    date = "Unknown date",
  } = activity || {};

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 border hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <img
          src={userPhoto}
          alt={userName}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{userName}</h3>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
      </div>

      <div className="mt-4 border-t pt-3">
        <p className="text-gray-700">
          <span className="font-medium text-amber-600">Action:</span> {action}
        </p>
        <p className="text-xs text-gray-500 mt-2">{date}</p>
      </div>
    </div>
  );
};

export default ActivityCard;
