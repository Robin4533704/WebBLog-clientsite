import React, { useEffect, useState } from "react";
import useAxios from "../../hook/useAxios";
import { FaUser, FaBlog, FaCommentDots } from "react-icons/fa";
import Loading from "../../pages/Loading";

const Overview = () => {
  const { sendRequest, loading, error } = useAxios();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalComments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await sendRequest("/stats"); // backend থেকে stats
        setStats({
          totalUsers: res.totalUsers ?? 0,
          totalBlogs: res.totalBlogs ?? 0,
          totalComments: res.totalComments ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {/* Total Users */}
      <div className="bg-white shadow rounded p-6 flex items-center gap-4">
        <FaUser className="text-3xl text-blue-500" />
        <div>
          <h3 className="font-semibold text-lg">Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Total Blogs */}
      <div className="bg-white shadow rounded p-6 flex items-center gap-4">
        <FaBlog className="text-3xl text-green-500" />
        <div>
          <h3 className="font-semibold text-lg">Total Blogs</h3>
          <p className="text-2xl font-bold">{stats.totalBlogs}</p>
        </div>
      </div>

      {/* Total Comments */}
      <div className="bg-white shadow rounded p-6 flex items-center gap-4">
        <FaCommentDots className="text-3xl text-purple-500" />
        <div>
          <h3 className="font-semibold text-lg">Total Comments</h3>
          <p className="text-2xl font-bold">{stats.totalComments}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
