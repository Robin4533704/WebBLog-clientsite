import React, { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const SocialLogin = () => {
  const { signInGoogleUser, loading } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setIsLoggingIn(true);
      
      console.log("🔄 Starting Google login...");
      const user = await signInGoogleUser();
      
      if (user) {
        console.log("✅ Google login successful, redirecting...");
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("❌ Google login error:", err);
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const isLoading = loading || isLoggingIn;

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-0">
      {/* Divider */}
      <div className="relative my-4 sm:my-6 md:my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
      
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 sm:mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Google Login Button */}
      <motion.button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="flex items-center justify-center w-full gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 
                   bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                   font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600
                   hover:border-blue-500 dark:hover:border-blue-400
                   hover:shadow-lg hover:shadow-blue-500/10
                   transition-all duration-300 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   relative overflow-hidden group
                   text-sm sm:text-base"
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Google Icon */}
        <FcGoogle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
        
        {/* Button Text */}
        <span className={isLoading ? "opacity-70" : ""}>
          {isLoading ? (
            <>
              <span className="hidden xs:inline">Signing in with Google...</span>
              <span className="xs:hidden">Signing in...</span>
            </>
          ) : (
            <>
              <span className="hidden xs:inline">Continue with Google</span>
              <span className="xs:hidden">Google</span>
            </>
          )}
        </span>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>

      {/* Privacy Note */}
      <p className="mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400 text-center px-2">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default SocialLogin;