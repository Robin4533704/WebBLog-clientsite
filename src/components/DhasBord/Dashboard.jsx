import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaBlog,
  FaUserEdit,
  FaChartBar,
  FaChevronDown,
  FaUserShield,
  FaEnvelope,
  FaFileAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaBell,
  FaSearch,
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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  // Close mobile drawer when route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (isActive) =>
    `px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 font-medium group ${
      isActive
        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
        : "text-gray-300 hover:bg-amber-500/20 hover:text-white hover:shadow-md border border-transparent hover:border-amber-500/30"
    }`;

  const subLinkClass = (isActive) =>
    `px-6 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-300 text-sm font-medium ml-2 border-l-2 ${
      isActive
        ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-inner"
        : "text-gray-400 hover:bg-amber-500/10 hover:text-amber-300 border-transparent hover:border-amber-400"
    }`;

  const adminLinks = [
    { to: "/dashboard/overview", icon: FaHome, label: "Overview", adminOnly: true },
    { to: "/dashboard/manage-blogs", icon: FaClipboardList, label: "Manage Blogs" },
    { to: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
    { to: "/dashboard/stats", icon: FaChartBar, label: "Analytics" },
    { to: "/dashboard/contents", icon: FaFileAlt, label: "Contents" },
    { to: "/dashboard/subscribe", icon: FaEnvelope, label: "Subscribers" },
    { to: "/dashboard/settings", icon: FaCog, label: "Settings" },
  ];

  const userLinks = [
    { to: "/dashboard/useroverview", icon: FaHome, label: "Overview" },
    { to: "/dashboard/myblogs", icon: FaBlog, label: "My Blogs" },
    { to: "/dashboard/addblog", icon: FaBlog, label: "Add New Blog" },
    { to: "/dashboard/Bookmarks", icon: FaFileAlt, label: "Bookmarks" },
  ];

  const commonLinks = [
    { to: "/dashboard/profile", icon: FaUserEdit, label: "My Profile" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 30 }}
        className="hidden lg:flex lg:w-80 xl:w-96 flex-col bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 shadow-2xl border-r border-gray-700 relative z-40"
      >
        {/* Sidebar Header */}
        <MotionLink
          to="/"
          className="flex items-center gap-4 p-6 border-b border-gray-700 hover:bg-gray-800/50 transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg">
            <FaBlog className="text-white text-2xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              Blog<span className="text-amber-400">Hub</span>
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              {role === "admin" ? "Admin Panel" : "User Dashboard"}
            </p>
          </div>
        </MotionLink>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
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
                <link.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
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
              <div
                className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 cursor-pointer hover:bg-gray-700/50 transition-colors duration-300 border border-gray-700"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="flex items-center gap-3">
                  <FaUserEdit className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold text-amber-100 text-sm">My Account</span>
                </div>
                <FaChevronDown
                  className={`w-3 h-3 text-amber-400 transition-transform duration-300 flex-shrink-0 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1 ml-3 border-l-2 border-amber-500/30 pl-3"
                  >
                    {userLinks.map((link) => (
                      <MotionNavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => subLinkClass(isActive)}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <link.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{link.label}</span>
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
              <div
                className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 cursor-pointer hover:bg-amber-500/20 transition-colors duration-300 border border-amber-500/30"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              >
                <div className="flex items-center gap-3">
                  <FaUserShield className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold text-amber-100 text-sm">Admin Panel</span>
                </div>
                <FaChevronDown
                  className={`w-3 h-3 text-amber-400 transition-transform duration-300 flex-shrink-0 ${
                    adminMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              <AnimatePresence>
                {adminMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1 ml-3 border-l-2 border-amber-500 pl-3"
                  >
                    {adminLinks.map((link) => (
                      <MotionNavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => subLinkClass(isActive)}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <link.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{link.label}</span>
                        {link.adminOnly && (
                          <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
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
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 space-y-4">
          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 5, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 transition-all duration-300 font-medium border border-red-500/20 hover:border-red-500/40"
          >
            <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
            <span>Sign Out</span>
          </motion.button>

          {/* User Info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {role === "admin" ? "A" : "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {role === "admin" ? "Administrator" : "User Account"}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {role === "admin" ? "Full System Access" : "Limited Access"}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`lg:hidden sticky top-0 z-30 transition-all duration-300 ${
            scrolled
              ? "bg-gray-900/95 backdrop-blur-lg border-b border-gray-700 shadow-lg"
              : "bg-gray-900 border-b border-gray-800"
          }`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="p-2 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors duration-300"
              >
                {drawerOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </motion.button>
              
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                  <FaBlog className="text-white text-lg" />
                </div>
                <span className="text-lg font-bold text-white">
                  Blog<span className="text-amber-400">Hub</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="badge badge-warning text-white font-semibold text-xs">
                {role === "admin" ? "Admin" : "User"}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 30 }}
                className="lg:hidden fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl border-r border-gray-700 z-50 overflow-y-auto"
              >
                {/* Mobile Sidebar Content */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <Link to="/" className="flex items-center gap-3" onClick={() => setDrawerOpen(false)}>
                      <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                        <FaBlog className="text-white text-xl" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-white">
                          Blog<span className="text-amber-400">Hub</span>
                        </h1>
                        <p className="text-gray-400 text-xs">
                          {role === "admin" ? "Admin Panel" : "User Dashboard"}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="p-2 rounded-xl text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <FaTimes className="text-lg" />
                    </button>
                  </div>
                </div>

                <nav className="p-4 space-y-2">
                  {/* Mobile navigation content would go here */}
                  {/* You can reuse the same navigation structure as desktop */}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;