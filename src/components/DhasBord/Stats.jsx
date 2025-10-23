import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import useUserAxios from "../../hook/useUserAxios";
import { toast } from "react-hot-toast";
import Loading from "../../pages/Loading";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF0", "#FF6B6B"];

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Statistics = () => {
  const { axiosIntals } = useUserAxios();
  const [loading, setLoading] = useState(false);
  const [blogsData, setBlogsData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const blogs = await axiosIntals("/blogs"); // get all blogs
      const users = await axiosIntals("/users"); // get all users

      // --- Blogs per category ---
      const categoryCount = {};
      blogs.forEach(blog => {
        const cat = blog.category || "Uncategorized";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      const blogsChartData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
      setBlogsData(blogsChartData);

      // --- Users over time (by createdAt) ---
      const usersCountByMonth = {};
      users.forEach(user => {
        const date = user.createdAt ? new Date(user.createdAt) : new Date();
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        usersCountByMonth[month] = (usersCountByMonth[month] || 0) + 1;
      });
      const usersChartData = Object.entries(usersCountByMonth)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => new Date(a.month) - new Date(b.month));
      setUsersData(usersChartData);

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading/>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Blogs per Category Pie Chart */}
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Blogs per Category</h3>
        {blogsData.length === 0 ? (
          <p className="text-center">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={blogsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {blogsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Users over Time Bar Chart */}
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Users Over Time</h3>
        {usersData.length === 0 ? (
          <p className="text-center">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
};

export default Statistics;
