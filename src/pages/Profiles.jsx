// Profile.jsx
import { useState, useEffect } from "react";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useUserAxios from "../hook/useUserAxios";
import { uploadImageToImgbb } from "../uploadImage";
import { useAuth } from "../provider/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { 
  FaUser, 
  FaEnvelope, 
  FaCamera, 
  FaSave, 
  FaArrowLeft,
  FaUpload,
  FaSpinner
} from "react-icons/fa";

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { user: contextUser, setUser } = useAuth();
  const { axiosIntals, loading } = useUserAxios();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
  });
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Image size must be less than 5MB", "error");
      return;
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire("Error", "Please select a valid image file", "error");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImageToImgbb(file);
      setFormData((prev) => ({ ...prev, photoURL: imageUrl }));
      Swal.fire({
        title: "Success!",
        text: "Profile image uploaded successfully",
        icon: "success",
        confirmButtonColor: "#10b981"
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire({
        title: "Upload Failed!",
        text: "Failed to upload image. Please try again.",
        icon: "error",
        confirmButtonColor: "#f59e0b"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Firebase profile update
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      // Firebase email update (if changed)
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      // Update in MongoDB
      await axiosIntals(`/users/${user.uid}`, {
        method: "PATCH",
        data: formData,
      });

      // Update context
      setUser({ ...contextUser, ...formData });

      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonColor: "#10b981"
      });
      
      navigate("/dashboard/profile");
    } catch (err) {
      console.error("Profile update error:", err);
      
      let errorMessage = "Error updating profile";
      if (err.code === 'auth/requires-recent-login') {
        errorMessage = "Please log in again to update your email";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use";
      } else if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire({
        title: "Update Failed!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#f59e0b"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4 mx-auto sm:mx-0 sm:mb-0 sm:absolute sm:left-6 sm:top-6"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Update your personal information and profile settings
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Profile Photo
                </label>
                
                <div className="relative inline-block">
                  <div className="relative">
                    <img
                      src={formData.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
                      alt="Profile"
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
                    />
                    
                    {/* Upload Overlay */}
                    <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 cursor-pointer">
                      <FaCamera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <AnimatePresence>
                    {uploading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                      >
                        <FaSpinner className="w-6 h-6 text-white animate-spin" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-gray-500 text-sm mt-3">
                  Click the camera icon to upload a new photo
                </p>
              </motion.div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Display Name */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="w-4 h-4 text-blue-500" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your display name"
                    required
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-blue-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email address"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Changing your email will require verification
                  </p>
                </motion.div>
              </div>

              {/* Current Photo Preview */}
              {formData.photoURL && formData.photoURL !== user?.photoURL && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                  <p className="text-sm text-blue-700 font-medium mb-2">
                    New Profile Photo Preview
                  </p>
                  <img
                    src={formData.photoURL}
                    alt="New Profile Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                  />
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={loading || uploading || isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(loading || uploading || isSubmitting) ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Update Profile
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;