import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUpload, FaCheck } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import SocialLogin from "../pages/SocialLogin";
import UseAuth from "../hook/UseAuth";
import useAxios from "../hook/useAxios";
import { AuthContext } from "../provider/AuthContext";

const Register = () => {
  const { sendRequest } = useAxios();
  const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm();
  const { createUser, updateUserProfiles } = UseAuth();
  const { setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const password = watch("password", "");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("❌ Please select a valid image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("❌ Image size should be less than 5MB");
        return;
      }

      setProfilePicFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfilePicFile(null);
    setImagePreview(null);
  };

// Register.jsx - FIXED onSubmit function
const onSubmit = async (data) => {
  console.log("🎯 FORM SUBMITTED", data);

  if (!profilePicFile) {
    toast.error("📸 Please upload a profile picture");
    return;
  }

  setUploading(true);

  try {
    // 1️⃣ Upload image to imgbb
    console.log("📸 Uploading image to imgbb...");
    const formData = new FormData();
    formData.append("image", profilePicFile);

    const imgbbRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const imgbbData = await imgbbRes.json();
    if (!imgbbData.success) {
      toast.error("❌ Image upload failed");
      return;
    }
    const imageUrl = imgbbData.data.display_url;
    console.log("✅ Image URL:", imageUrl);

    // 2️⃣ Create Firebase user with profile data
    console.log("🔥 Creating Firebase user...");
    let firebaseUser;
    try {
      firebaseUser = await createUser(data.email, data.password, {
        name: data.name,
        displayName: data.name,
        photoURL: imageUrl
      });
      console.log("✅ Firebase user created:", firebaseUser.uid);
    } catch (err) {
      console.error("❌ Firebase error:", err);
      throw err; // Let the catch block handle it
    }

    // 3️⃣ User already saved to MongoDB via createUser function
    // No need to save again separately

    console.log("🎉 REGISTRATION COMPLETE!");
    toast.success("🎉 Registration successful! Welcome to BlogHub!");
    
    // Navigate after short delay
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 1500);

  } catch (error) {
    console.error("❌ FINAL ERROR:", error);
    
    // Better error messages
    if (error.message.includes('Email already exists')) {
      toast.error("📧 Email already exists! Please try logging in.");
    } else if (error.message.includes('Password should be at least')) {
      toast.error("🔒 Password should be at least 6 characters");
    } else if (error.message.includes('API error: 500')) {
      toast.error("🔄 Registration completed! You can login now.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } else {
      toast.error("❌ " + (error.message || "Registration failed. Please try again."));
    }
  } finally {
    setUploading(false);
  }
};
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
              Join BlogHub
            </motion.h1>
            <p className="text-amber-100 text-sm sm:text-base">
              Create your account and start your blogging journey
            </p>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    {...formRegister("name", { 
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                      }
                    })}
                    placeholder="Enter your full name"
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300 text-sm sm:text-base ${
                      errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs sm:text-sm mt-1"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    {...formRegister("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    placeholder="your.email@example.com"
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300 text-sm sm:text-base ${
                      errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs sm:text-sm mt-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    {...formRegister("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300 text-sm sm:text-base ${
                      errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
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
                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-xs sm:text-sm mt-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
                
                {/* Password Strength */}
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <FaCheck className={`text-xs ${password.length >= 6 ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                        At least 6 characters
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Profile Image Upload */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-3 sm:mb-4 text-center"
                  >
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-500 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* File Input */}
                <label className={`flex items-center justify-center gap-2 sm:gap-3 w-full p-3 sm:p-4 border-2 border-dashed rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 text-sm sm:text-base ${
                  profilePicFile 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-400'
                }`}>
                  <FaUpload className={`${profilePicFile ? 'text-green-500' : 'text-gray-400'} text-sm sm:text-base`} />
                  <span className={profilePicFile ? 'text-green-600 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                    {profilePicFile ? 'Image Selected' : 'Upload Profile Picture'}
                  </span>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  JPG, PNG, WEBP (Max 5MB)
                </p>
              </motion.div>

              {/* Submit Button with Gold/Amber Colors */}
              <motion.button
                type="submit"
                disabled={uploading}
                variants={itemVariants}
                whileHover={{ scale: uploading ? 1 : 1.02 }}
                whileTap={{ scale: uploading ? 1 : 0.98 }}
                className={`w-full py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl font-bold text-white shadow-lg transition-all duration-300 text-sm sm:text-base ${
                  uploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-amber-500/25'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs sm:text-sm">Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
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

            {/* Login Link */}
            <motion.div 
              variants={itemVariants}
              className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-amber-600 dark:text-amber-400 font-semibold hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;