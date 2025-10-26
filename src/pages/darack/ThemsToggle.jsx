// src/components/ThemeToggle.jsx - useTheme diye
import { motion } from 'framer-motion';
import { useTheme } from '../../pages/darack/ThemeContext'; // ✅ useTheme import
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme(); // ✅ useTheme use

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-yellow-500 text-white shadow-lg' 
          : 'bg-gray-200 text-gray-700 shadow-md'
      }`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
    </motion.button>
  );
};

export default ThemeToggle;