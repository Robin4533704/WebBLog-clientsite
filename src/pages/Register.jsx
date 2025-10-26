import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import SocialLogin from "../pages/SocialLogin";
import UseAuth from "../hook/UseAuth";
import useAxios from "../hook/useAxios";
import { AuthContext } from "../provider/AuthContext";

const Register = () => {
  const { sendRequest } = useAxios();
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUserProfiles } = UseAuth();
  const { setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    if (!profilePicFile) {
      toast.error("Please upload a profile picture");
      return;
    }

    try {
      // 🖼 Upload image to imgbb
      const formData = new FormData();
      formData.append("image", profilePicFile);
      const imgbbKey = import.meta.env.VITE_IMAGE_UPLOAD_KEY;
      if (!imgbbKey) return toast.error("Image upload key missing!");

      setUploading(true);
      const res = await sendRequest(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.success) {
        toast.error("Image upload failed");
        return;
      }

      const uploadedImageUrl = res.data.display_url;

      // 🔥 Firebase register
      let result;
      try {
        result = await createUser(data.email, data.password);
      } catch (firebaseErr) {
        if (firebaseErr.code === "auth/email-already-in-use") {
          return toast.error("Email already exists!");
        }
        return toast.error(firebaseErr.message);
      }

      // 🔄 Update Firebase user profile
      await updateUserProfiles({
        displayName: data.name,
        photoURL: uploadedImageUrl,
      });

      // 👤 Update Navbar user state
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: data.name,
        photoURL: uploadedImageUrl,
      });

      // 🔑 Get Firebase ID Token and save it in localStorage
      const token = await result.user.getIdToken();
      localStorage.setItem("fbToken", token);
      console.log("✅ Firebase Token Saved:", token);

      // 💾 Save user info to MongoDB
      try {
        await sendRequest("/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            name: data.name,
            photoURL: uploadedImageUrl,
            role: "user",
          }),
        });
      } catch (mongoErr) {
        return toast.warn(mongoErr.response?.data?.message || "User already exists!");
      }

      toast.success("🎉 Registration successful!");
      navigate(from);

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto mt-10 p-6 shadow-2xl rounded-xl bg-white"
    >
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <motion.input
          {...formRegister("name", { required: "Name is required" })}
          placeholder="Name"
          className={`input input-bordered w-full ${errors.name ? "border-red-500" : ""}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        {/* Email */}
        <motion.input
          {...formRegister("email", { required: "Email is required" })}
          type="email"
          placeholder="Email"
          className={`input input-bordered w-full ${errors.email ? "border-red-500" : ""}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        {/* Password */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <input
            {...formRegister("password", { required: "Password is required", minLength: 6 })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`input input-bordered w-full pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <motion.button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </motion.button>
        </motion.div>
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        {/* Profile Image */}
        <motion.input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="input w-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        />

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={uploading}
          className="btn w-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {uploading ? "Uploading..." : "Register"}
        </motion.button>
      </form>

      {/* Login link */}
      <motion.p
        className="mt-3 text-center text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 font-semibold hover:underline">
          Login
        </Link>
      </motion.p>

      {/* Social Login */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4"
      >
        <SocialLogin />
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default Register;
