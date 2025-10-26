import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaBlog,
  FaUserEdit,
  FaChartBar,
  FaChevronDown,
  FaCog,
  FaEnvelope,
  FaFileAlt,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useUserRole from "./useUserRole";
import Loading from "../../pages/Loading";
import { getAuth, signOut } from "firebase/auth";

const MotionLink = motion(Link);
const MotionNavLink = motion(NavLink);

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);
   
    const navigate = useNavigate();
  const auth = getAuth();
  if (roleLoading) return <Loading />;

  const linkClass = (isActive) =>
    `px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 font-medium ${
      isActive
        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
        : "text-gray-700 hover:bg-amber-400 hover:text-white hover:shadow-md"
    }`;

  const subLinkClass = (isActive) =>
    `px-6 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-300 text-sm font-medium ml-2 border-l-2 ${
      isActive
        ? "bg-amber-400/20 text-amber-700 border-amber-500 shadow-inner"
        : "text-gray-600 hover:bg-amber-400/10 hover:text-amber-600 border-transparent hover:border-amber-400"
    }`;

  const adminLinks = [
    { to: "/dashboard", icon: FaHome, label: "Overview", adminOnly: true },
    { to: "/dashboard/manage-blogs", icon: FaClipboardList, label: "Manage Blogs" },
    { to: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
    { to: "/dashboard/stats", icon: FaChartBar, label: "Analytics" },
    { to: "/dashboard/contents", icon: FaFileAlt, label: "Contents" },
    { to: "/dashboard/subscribe", icon: FaEnvelope, label: "Subscribers" },
    { to: "/dashboard/settings", icon: FaCog, label: "Settings" },
  ];

  const userLinks = [
    { to: "/dashboard/myblogs", icon: FaBlog, label: "My Blogs" },
    { to: "/dashboard/addblog", icon: FaBlog, label: "Add New Blog" },
    { to: "/dashboard/userprofile", icon: FaUserEdit, label: "My Profile" },
  ];

  const commonLinks = [
    { to: "/dashboard/profile", icon: FaUserEdit, label: "Update Profile" },
  ];

   const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
      console.log("User signed out successfully");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen bg-gray-50">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={() => setDrawerOpen(!drawerOpen)}
      />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile Navbar */}
        <div className="w-full navbar bg-gradient-to-r from-amber-500 to-orange-500 lg:hidden shadow-lg">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-square text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-white">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
              <FaBlog className="text-yellow-300 text-xl" />
              <span className="text-lg font-bold">BlogHub Dashboard</span></Link>
            </div>
          </div>
          <div className="badge badge-warning text-white font-semibold">
            {role === "admin" ? "Admin" : "User"}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-80 min-h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-700">
            <MotionLink
              to="/"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <FaBlog className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Blog<span className="text-amber-400">Hub</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium">
                  {role === "admin" ? "Admin Panel" : "User Dashboard"}
                </p>
              </div>
            </MotionLink>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2 overflow-y-auto">
            {/* Common Links */}
            <div className="space-y-1">
              {commonLinks.map((link) => (
                <MotionNavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => linkClass(isActive)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </MotionNavLink>
              ))}
            </div>

            {/* User Section */}
            {role === "user" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                {/* User Section Header */}
                <div
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 cursor-pointer hover:bg-slate-700 transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="flex items-center gap-2">
                    <FaUserEdit className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-amber-100">My Account</span>
                  </div>
                  <FaChevronDown
                    className={`w-3 h-3 text-amber-400 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* User Links */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 ml-2 border-l-2 border-amber-400/20 pl-2"
                    >
                      {userLinks.map((link) => (
                        <MotionNavLink
                          key={link.to}
                          to={link.to}
                          className={({ isActive }) => subLinkClass(isActive)}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <link.icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </MotionNavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Admin Section */}
            {role === "admin" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                {/* Admin Section Header */}
                <div
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-500/20 cursor-pointer hover:bg-amber-500/30 transition-colors border border-amber-500/30"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                >
                  <div className="flex items-center gap-2">
                    <FaUserShield className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-amber-100">Admin Panel</span>
                  </div>
                  <FaChevronDown
                    className={`w-3 h-3 text-amber-400 transition-transform ${
                      adminMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Admin Links */}
                <AnimatePresence>
                  {adminMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 ml-2 border-l-2 border-amber-400 pl-2"
                    >
                      {adminLinks.map((link) => (
                        <MotionNavLink
                          key={link.to}
                          to={link.to}
                          className={({ isActive }) => subLinkClass(isActive)}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <link.icon className="w-4 h-4" />
                          <span>{link.label}</span>
                          {link.adminOnly && (
                            <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                              Admin
                            </span>
                          )}
                        </MotionNavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Logout Button */}
          <motion.div
      className="pt-4 mt-4 border-t border-slate-700"
      whileHover={{ x: 5 }}
    >
      <button
        className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 font-medium"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </motion.div>
          </nav>

          {/* User Info Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800/50 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {role === "admin" ? "A" : "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {role === "admin" ? "Administrator" : "User Account"}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  {role === "admin" ? "Full Access" : "Limited Access"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;