import React, { useEffect, useState } from "react";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, 
  XAxis, YAxis, ResponsiveContainer, AreaChart, Area, 
  CartesianGrid
} from "recharts";
import { motion } from "framer-motion";
import { 
  FaChartBar, 
  FaChartPie, 
  FaUsers, 
  FaBlog, 
  FaEye, 
  FaCalendarAlt,
  FaDownload,
  FaRedoAlt, // FaRefresh এর পরিবর্তে FaRedoAlt
  FaStar
} from "react-icons/fa";
import useUserAxios from "../../hook/useUserAxios";
import { toast } from "react-hot-toast";
import Loading from "../../pages/Loading";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF0", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const Statistics = () => {
  const { axiosIntals } = useUserAxios();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    blogsData: [],
    usersData: [],
    blogsOverTime: [],
    engagementData: [],
    topBlogs: [],
    summary: {
      totalBlogs: 0,
      totalUsers: 0,
      totalCategories: 0,
      featuredBlogs: 0
    }
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [blogsRes, usersRes] = await Promise.all([
        axiosIntals("/blogs"),
        axiosIntals("/users")
      ]);

      const blogs = blogsRes?.data || blogsRes || [];
      const users = usersRes?.data || usersRes || [];

      processStatsData(blogs, users);
    } catch (err) {
      console.error("Error fetching stats:", err);
      toast.error("Failed to fetch statistics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processStatsData = (blogs, users) => {
    // Summary Stats
    const summary = {
      totalBlogs: blogs.length,
      totalUsers: users.length,
      totalCategories: new Set(blogs.map(blog => blog.category).filter(Boolean)).size,
      featuredBlogs: blogs.filter(blog => blog.featured || blog.status === 'featured').length
    };

    // Blogs per Category
    const categoryCount = {};
    blogs.forEach(blog => {
      const cat = blog.category || "Uncategorized";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    const blogsData = Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Users over Time (Last 6 months)
    const usersCountByMonth = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    users.forEach(user => {
      const date = user.createdAt ? new Date(user.createdAt) : new Date();
      if (date >= sixMonthsAgo) {
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        usersCountByMonth[monthName] = (usersCountByMonth[monthName] || 0) + 1;
      }
    });

    const usersData = Object.entries(usersCountByMonth)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // Blogs Over Time (Last 6 months)
    const blogsCountByMonth = {};
    blogs.forEach(blog => {
      const date = blog.createdAt ? new Date(blog.createdAt) : new Date();
      if (date >= sixMonthsAgo) {
        const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        blogsCountByMonth[month] = (blogsCountByMonth[month] || 0) + 1;
      }
    });

    const blogsOverTime = Object.entries(blogsCountByMonth)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // Top Blogs by Views/Comments
    const topBlogs = blogs
      .map(blog => ({
        title: blog.title?.length > 30 ? blog.title.substring(0, 30) + '...' : blog.title,
        views: blog.views || 0,
        comments: blog.comments?.length || 0,
        likes: blog.likes?.length || 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    setStats({
      blogsData,
      usersData,
      blogsOverTime,
      topBlogs,
      summary
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blog-statistics.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Statistics exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 animate-pulse"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
                <div className="h-64 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Comprehensive insights into your blog platform performance
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 lg:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
            >
              <FaRedoAlt className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200"
            >
              <FaDownload />
              Export Data
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaBlog className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.summary.totalBlogs}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.summary.totalUsers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaChartPie className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.summary.totalCategories}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <FaStar className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.summary.featuredBlogs}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Blogs per Category */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaChartPie className="text-amber-500" />
                Blogs by Category
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {stats.blogsData.length} categories
              </span>
            </div>
            
            {stats.blogsData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FaChartPie className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p>No category data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.blogsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {stats.blogsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} blogs`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Users Growth Over Time */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaUsers className="text-green-500" />
                User Growth (Last 6 Months)
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Total: {stats.summary.totalUsers}
              </span>
            </div>
            
            {stats.usersData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p>No user growth data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.usersData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#00C49F" fill="#00C49F" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blogs Over Time */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                Blog Publishing Trend
              </h3>
            </div>
            
            {stats.blogsOverTime.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FaBlog className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p>No blog timeline data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.blogsOverTime} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0088FE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Top Blogs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaEye className="text-purple-500" />
                Top Blogs by Views
              </h3>
            </div>
            
            {stats.topBlogs.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FaChartBar className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p>No blog view data available</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topBlogs.map((blog, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{blog.title}</p>
                        <p className="text-sm text-gray-500">
                          {blog.views} views • {blog.comments} comments
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-600">{blog.views}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;