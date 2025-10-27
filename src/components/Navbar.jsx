import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {
  FaBlog, FaBars, FaTimes, FaUserCircle, FaHome, FaFileAlt, FaThLarge, FaEnvelope, FaInfoCircle, FaCog, FaSignOutAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../provider/AuthContext";
import defaultImage from "../assets/image/pngtree-bearded-man-logo-icon-png-image_4046452.png";
// import ThemeToggle from "./ThemeToggle"; // যদি তুমি theme toggle ব্যবহার করো

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // Profile dropdown state
  const [scrollY, setScrollY] = useState(0);
  const { user: currentUser, logOut } = useContext(AuthContext);

  const navItems = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "Blogs", path: "/blogs", icon: FaFileAlt },
    { name: "Dashboard", path: "/dashboard", icon: FaThLarge },
    { name: "Contact", path: "/contactpagepage", icon: FaEnvelope },
    { name: "About", path: "/about", icon: FaInfoCircle },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      setProfileOpen(false);
      setMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#profile-menu")) {
        setProfileOpen(false);
      }
      if (!e.target.closest("nav")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}
      className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 backdrop-blur-lg ${
        scrollY > 50
          ? "bg-white/95 dark:bg-gray-900/95 shadow-2xl"
          : "bg-white/80 dark:bg-gray-900/80 shadow-lg"
      }`}
    >
      {/* Animated border */}
      <motion.div
        className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        style={{ originX: 0 }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <FaBlog className="text-2xl sm:text-3xl text-amber-500 drop-shadow-lg" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-amber-600 dark:from-white dark:to-amber-400 bg-clip-text text-transparent">
              Blog<span className="text-amber-500 drop-shadow-sm">Hub</span>
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-2">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                        : "text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </ul>

            {/* Right Side */}
            <div className="flex items-center gap-6 pl-6 border-l border-gray-200 dark:border-gray-700">
              {currentUser ? (
                <div className="relative" id="profile-menu">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-500 overflow-hidden">
                      <img
                        src={currentUser.photoURL || defaultImage}
                        alt={currentUser.displayName || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-24 truncate">
                      {currentUser.displayName || "User"}
                    </span>
                  </motion.div>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                      >
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-b border-gray-100 dark:border-gray-600"
                        >
                          <FaUserCircle className="text-amber-500" />
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-b border-gray-100 dark:border-gray-600"
                        >
                          <FaCog className="text-amber-500" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <FaSignOutAlt />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink to="/login">
                  <motion.div className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-white border-2 border-amber-400 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl">
                    Sign In
                  </motion.div>
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="lg:hidden p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                {menuOpen ? <FaTimes className="text-xl text-amber-500" /> : <FaBars className="text-xl" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-t border-amber-200 dark:border-amber-800 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-4 sm:px-6 py-6">
              <ul className="space-y-3">
                {navItems.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all duration-300 border-l-4 ${
                        isActive
                          ? "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 text-amber-600 dark:text-amber-400 border-amber-500 shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:text-amber-600 dark:hover:text-amber-400 border-transparent hover:border-amber-300"
                      }`
                    }
                  >
                    <item.icon className="text-lg" />
                    {item.name}
                  </NavLink>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-amber-200 dark:border-amber-800 space-y-6 flex flex-col items-center">
                <ThemeToggle />
                {currentUser && (
                  <div className="flex flex-col gap-2 w-full">
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-800"
                    >
                      <FaUserCircle className="text-amber-500" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-800"
                    >
                      <FaCog className="text-amber-500" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800"
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </div>
                )}
                {!currentUser && (
                  <NavLink to="/login">
                    <motion.div className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-white border-2 border-amber-400 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl">
                      Sign In
                    </motion.div>
                  </NavLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
