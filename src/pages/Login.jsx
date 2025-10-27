import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight, FaUserPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../provider/AuthContext";
import Loading from "./Loading";
import SocialLogin from "./SocialLogin";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const { email, password } = form;
    if (!email || !password) return "All fields are required";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vErr = validate();
    if (vErr) {
      toast.error(`❌ ${vErr}`);
      return;
    }

    try {
      setLoading(true);
      await signInUser(form.email, form.password);

      toast.success("🎉 Login successful! Welcome back!");
      
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Login failed. Please try again.";
      
      if (err.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email. Please register first.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (      
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 pt-16 sm:pt-20 pb-12 sm:pb-16 flex items-center justify-center px-3 sm:px-4">
      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        theme="colored"
        pauseOnHover
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto"
      >
        {/* Card Container */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header with Gold/Amber Gradient */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-6 sm:p-8 text-center">
            <motion.h1 
              className="text-2xl sm:text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Welcome Back
            </motion.h1>
            <p className="text-amber-100 text-sm sm:text-base">
              Sign in to continue your blogging journey
            </p>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FaEyeSlash className="text-sm sm:text-base" /> : <FaEye className="text-sm sm:text-base" />}
                  </motion.button>
                </div>
                
                {/* Forgot Password Link */}
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </motion.div>

              {/* Submit Button with Gold/Amber Colors */}
              <motion.button
                type="submit"
                disabled={loading}
                variants={itemVariants}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-amber-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs sm:text-sm">Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FaArrowRight className="text-xs sm:text-sm" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center my-4 sm:my-6"
            >
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              <span className="px-3 sm:px-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Or continue with</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            </motion.div>

            {/* Social Login */}
            <motion.div variants={itemVariants}>
              <SocialLogin />
            </motion.div>

            {/* Register Link */}
            <motion.div 
              variants={itemVariants}
              className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-amber-600 dark:text-amber-400 font-semibold hover:underline transition-colors flex items-center justify-center gap-2"
                >
                  <FaUserPlus className="text-sm" />
                  Create Account
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Features */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-4 sm:mt-6"
        >
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-amber-600 dark:text-amber-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-amber-600 dark:text-amber-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl mx-4">
              <Loading message="Authenticating..." />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;