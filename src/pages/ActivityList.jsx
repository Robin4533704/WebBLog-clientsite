import React from "react";
import ActivityCard from "./../components/ActivityCard";

const ActivityList = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No recent activity found.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Recent User Activities
      </h2>

      {/* ✅ Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
