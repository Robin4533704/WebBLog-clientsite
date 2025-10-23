import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBlog, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../provider/AuthContext";
import ThemsToggle from "../pages/darack/ThemsToggle";
import defaultImage from "../assets/image/pngtree-bearded-man-logo-icon-png-image_4046452.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user: currentUser, logOut } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Dashboard", path: "/dashboard" },
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
        <Link to="/dashboard/profile">
          <img
            src={currentUser.photoURL || defaultImage}
            alt={currentUser.displayName || "User"}
            className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400 transition-all"
          />
        </Link>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
          onClick={handleLogout}
          className="px-4 py-2 rounded-full bg-red-500 text-white font-medium transition-shadow shadow-sm"
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
                ? "bg-green-500 text-white border-green-600 shadow-md"
                : "bg-green-400 text-white border-green-300 hover:bg-green-500 hover:border-green-500 hover:shadow-md"
            }`}
          >
            Sign in
          </motion.div>
        )}
      </NavLink>
    );

  // scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b-2 border-yellow-400 shadow-lg"
          : "bg-transparent border-b-0"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          as={Link}
          to="/"
          whileHover={{ scale: 1.1, textShadow: "0 0 8px #facc15" }}
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
    `block text-center w-full px-4 py-2 rounded-full font-medium transition-all border-2 duration-300 ${
      isActive
        ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-500 shadow-lg"
        : "bg-yellow-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-yellow-200 dark:border-gray-600 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-600 hover:text-white hover:border-yellow-400 hover:shadow-md"
    }`
  }
>
  {item.name}
</NavLink>

            </li>
          ))}
          <li>
            <ThemsToggle />
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
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-yellow-50 dark:bg-gray-800 shadow-lg border-t-2 border-yellow-400 dark:border-yellow-300"
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
              <ThemsToggle />
            </li>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
