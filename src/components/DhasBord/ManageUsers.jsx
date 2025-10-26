import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUser,
  FaSort,
  FaCalendar,
  FaEnvelope,
} from "react-icons/fa";
import useAxios from "../../hook/useAxios";
import Loading from "../../pages/Loading";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const { sendRequest, loading } = useAxios();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ✅ Fetch Users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await sendRequest("/users");
      const usersData = response.data || response;
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  // ✅ Handle Role Change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await sendRequest(`/users/${userId}/role`, {
        method: "PATCH",
        data: { role: newRole },
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    }
  };

  // ✅ Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await sendRequest(`/admin/users/${userId}`, {
        method: "DELETE",
      });

      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // ✅ Filtering + Sorting Logic
  useEffect(() => {
    let result = users;

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || b.created_at) -
            new Date(a.createdAt || a.created_at)
          );
        case "oldest":
          return (
            new Date(a.createdAt || a.created_at) -
            new Date(b.createdAt || b.created_at)
          );
        case "name":
          return (a.displayName || a.name || "").localeCompare(
            b.displayName || b.name || ""
          );
        default:
          return 0;
      }
    });

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, sortBy]);

  // ✅ Utility Functions
  const getUserDisplayName = (user) =>
    user.displayName || user.name || "No Name";
  const getUserEmail = (user) => user.email || "No Email";
  const getUserImage = (user) =>
    user.photoURL ||
    user.photoUrl ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face";

  const getRoleBadge = (role) => {
    const roles = {
      admin: {
        color: "from-red-500 to-pink-600",
        icon: FaUserShield,
        label: "Admin",
      },
      author: {
        color: "from-green-500 to-emerald-600",
        icon: FaEdit,
        label: "Author",
      },
      user: {
        color: "from-blue-500 to-cyan-600",
        icon: FaUser,
        label: "User",
      },
    };

    const { color, icon: Icon, label } = roles[role] || roles.user;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${color}`}
      >
        <Icon size={10} /> {label}
      </span>
    );
  };

  const getStatusBadge = (user) => {
    const lastActive =
      user.lastLogin || user.last_log_in || user.createdAt || user.created_at;
    const isActive =
      lastActive &&
      new Date() - new Date(lastActive) < 7 * 24 * 60 * 60 * 1000;

    return (
      <span
        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
          isActive
            ? "bg-green-500 border-white"
            : "bg-gray-400 border-white"
        }`}
      ></span>
    );
  };

  // ✅ Show Loading
  if (loading) {
    return <Loading />;
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <FaUsers className="text-white text-xl" />
                </div>
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage all users and their permissions
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {users.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Users
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {users.filter((u) => u.role === "user").length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Regular Users
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="author">Author</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 relative">
                  <div className="relative">
                    <img
                      src={getUserImage(user)}
                      alt={getUserDisplayName(user)}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500/20 group-hover:border-blue-500 transition-colors duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face";
                      }}
                    />
                    {getStatusBadge(user)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {getUserDisplayName(user)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {getUserEmail(user)}
                    </p>
                  </div>
                </div>
                {getRoleBadge(user.role || "user")}
              </div>

              {/* Joined Info */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Joined</span>
                <span className="text-gray-900 dark:text-white flex items-center gap-1">
                  <FaCalendar className="text-green-500" size={12} />
                  {new Date(
                    user.createdAt || user.created_at
                  ).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <select
                  value={user.role || "user"}
                  onChange={(e) =>
                    handleRoleChange(user._id, e.target.value)
                  }
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                >
                  <option value="user">User</option>
                  <option value="author">Author</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                  title="Delete User"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
