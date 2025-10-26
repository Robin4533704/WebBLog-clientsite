import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FaBlog, FaBars, FaTimes, FaUserCircle, FaHome, FaFileAlt, FaThLarge, FaEnvelope, FaInfoCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../provider/AuthContext";
import ThemeToggle from "../pages/darack/ThemsToggle";
import defaultImage from "../assets/image/pngtree-bearded-man-logo-icon-png-image_4046452.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { user: currentUser, logOut } = useContext(AuthContext);

  const navItems = [
  { name: "Home", path: "/", icon: FaHome },
    { name: "Blogs", path: "/blogs", icon: FaFileAlt },
    { name: "Dashboard", path: "/dashboard", icon: FaThLarge },
    { name: "Contact", path: "/contactpage", icon: FaEnvelope },
    { name: "About", path: "/about", icon: FaInfoCircle },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      setMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const AuthButton = () =>
    currentUser ? (
      <div className="flex items-center gap-3">
        {/* User Profile with Dropdown */}
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-yellow-400 overflow-hidden">
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
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <Link 
              to="/dashboard/profile" 
              className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              My Profile
            </Link>
            <Link 
              to="/settings" 
              className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    ) : (
      <NavLink to="/login" onClick={() => setMenuOpen(false)}>
        {({ isActive }) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 border-2 ${
              isActive
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg"
                : "bg-gradient-to-r from-green-400 to-green-500 text-white border-green-400 hover:from-green-500 hover:to-green-600 hover:shadow-md"
            }`}
          >
            Sign In
          </motion.div>
        )}
      </NavLink>
    );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('nav')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 backdrop-blur-lg border-b ${
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/90 border-yellow-400/50 shadow-lg" 
          : "bg-white/70 dark:bg-gray-900/70 border-yellow-400/30 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            as={Link}
            to="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 flex-shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <div className="relative">
              <FaBlog className="text-2xl sm:text-3xl text-yellow-500" />
              <motion.div
                className="absolute inset-0 text-yellow-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaBlog className="text-2xl sm:text-3xl opacity-20" />
              </motion.div>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-yellow-600 dark:from-white dark:to-yellow-400 bg-clip-text text-transparent">
              Blog<span className="text-yellow-500">Hub</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                        isActive
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
                      }`
                    }
                  >
                    {item.name}
                    <motion.span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 ${
                        scrollY > 20 ? "scale-x-100" : "scale-x-0"
                      } group-hover:scale-x-100 transition-transform duration-300`}
                      initial={false}
                    />
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-l-4 border-yellow-500"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-yellow-600 dark:hover:text-yellow-400"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <div className="flex justify-center">
                  <AuthButton />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;