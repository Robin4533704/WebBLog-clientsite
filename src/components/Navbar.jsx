import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FaBlog, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../provider/AuthContext";
import ThemeToggle from "../pages/darack/ThemsToggle";
import defaultImage from "../assets/image/pngtree-bearded-man-logo-icon-png-image_4046452.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user: currentUser, logOut } = useContext(AuthContext);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contactpage" },
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
        <motion.div
          whileHover={{ scale: 1.15, boxShadow: "0 0 12px #facc15" }}
          className="w-10 h-10 rounded-full border-2 border-transparent overflow-hidden cursor-pointer transition-all duration-300"
        >
          <Link to="/googleprofile">
            <img
              src={currentUser.photoURL || defaultImage}
              alt={currentUser.displayName || "User"}
              className="w-full h-full object-cover rounded-full"
            />
          </Link>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(255,0,0,0.4)" }}
          onClick={handleLogout}
          className="px-4 py-2 rounded-full bg-red-500 text-white font-medium shadow-md transition-shadow"
        >
          Logout
        </motion.button>
      </div>
    ) : (
      <NavLink to="/login" onClick={() => setMenuOpen(false)}>
        {({ isActive }) => (
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
            className={`px-4 py-2 w-full text-center rounded-full font-medium transition-all border-2 duration-300 ${
              isActive
                ? "bg-green-500 text-white border-green-600 shadow-lg"
                : "bg-green-400 text-white border-green-300 hover:bg-green-500 hover:border-green-500 hover:shadow-md"
            }`}
          >
            Sign in
          </motion.div>
        )}
      </NavLink>
    );

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 backdrop-blur-lg border-b border-yellow-400 shadow-lg
      ${scrollY > 20 ? "bg-white/70 dark:bg-gray-900/70" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          as={Link}
          to="/"
          whileHover={{ scale: 1.1, textShadow: "0 0 10px #facc15" }}
          className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white transition-transform"
        >
          <FaBlog className="text-yellow-500 text-3xl sm:text-4xl" />
          <span>
            Blog<span className="text-yellow-500">Hub</span>
          </span>
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-4 items-center">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg"
                      : "text-gray-700 dark:text-gray-200 bg-yellow-50 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-600 hover:text-white hover:shadow-md"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <AuthButton />
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 dark:text-gray-200 text-3xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-yellow-50 dark:bg-gray-800 shadow-lg border-t border-yellow-400 dark:border-yellow-300"
          >
            <ul className="flex flex-col gap-3 py-4 px-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-center w-full px-4 py-2 rounded-full font-medium transition-all border-2 duration-300 ${
                        isActive
                          ? "bg-yellow-400 text-white border-yellow-500 shadow-lg"
                          : "bg-yellow-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-yellow-200 dark:border-gray-600 hover:bg-yellow-400 hover:text-white hover:border-yellow-400 hover:shadow-md"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
              <li className="flex justify-center mt-2">
                <AuthButton />
              </li>
              <li className="flex justify-center mt-2">
                <ThemeToggle />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
