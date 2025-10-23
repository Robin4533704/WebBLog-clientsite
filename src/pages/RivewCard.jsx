import React, { useEffect, useState } from "react";
import ActivityList from "../pages/ActivityList";

const Home = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // example static data — tumi backend theke fetch korbe
    setActivities([
      {
        userName: "Robin Hossen",
        userEmail: "robin@gmail.com",
        userPhoto: "https://i.ibb.co/3W5q9Gk/user1.jpg",
        action: "Liked a blog post",
        date: "Oct 21, 2025",
      },
      {
        userName: "Arif Khan",
        userEmail: "arif@gmail.com",
        userPhoto: "https://i.ibb.co/TbGVRQH/user2.jpg",
        action: "Commented on a recipe",
        date: "Oct 20, 2025",
      },
      {
        userName: "Sumaiya Rahman",
        userEmail: "sumaiya@gmail.com",
        userPhoto: "https://i.ibb.co/bRkLHHF/user3.jpg",
        action: "Shared a travel story",
        date: "Oct 19, 2025",
      },
    ]);
  }, []);

  return (
    <div className="py-10">
      <ActivityList activities={activities} />
    </div>
  );
};

export default Home;
