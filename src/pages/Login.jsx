import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AuthContext } from "../provider/AuthContext";
import Loading from "./Loading";
import SocialLogin from "./SocialLogin";

const Login = () => {
  const navigate = useNavigate();
  const { signInUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const { email, password } = form;
    if (!email || !password) return "All fields are required";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vErr = validate();
    if (vErr) {
      toast.error(vErr);
      return;
    }

    try {
      setLoading(true);
      await signInUser(form.email, form.password);

      // Toast success
      toast.success("Login successful!");

      // Navigate after short delay for toast visibility
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (      
      <section className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10"
      >
     
        <h2 className="text-3xl font-bold text-amber-400 dark:text-gray-100 mb-8 text-center">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Email address
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Password
            </label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10 dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <motion.div
              className="absolute pt-5 inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              )}
            </motion.div>
          </motion.div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg shadow-lg transition disabled:opacity-60"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? "Logging in..." : "Sign in"}
          </motion.button>

          {/* Loading overlay */}
          {loading && <Loading message="Logging in..." />}
        </form>

        {/* Social Login */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SocialLogin />
        </motion.div>

        {/* Register link */}
        <motion.p
          className="text-sm text-center text-gray-600 dark:text-gray-300 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-500 font-medium hover:underline"
          >
            Register
          </Link>
        </motion.p>
      </motion.div>
    </section>

  );
};

export default Login;
