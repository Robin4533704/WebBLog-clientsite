// ActivityFeed.jsx
import React from "react";
import ActivityCard from "./../components/ActivityCard";

const ActivityFeed = ({ activities }) => {
  return (
    <div className="flex flex-col gap-2">
      {activities?.length > 0 ? (
        activities.map((activity, idx) => (
          <ActivityCard key={idx} activity={activity} />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No activity yet.</p>
      )}
    </div>
  );
};

export default ActivityFeed;
