import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthContext";
import useAxios from "../hook/useAxios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadImageToImgbb } from "../uploadImage"; // যদি local image upload ফাংশন থাকে

const Register = () => {
  const navigate = useNavigate();
  const { createUser, sendVerificationEmail, loading: authLoading } = useContext(AuthContext);
  const { sendRequest, loading: axiosLoading } = useAxios();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    photoFile: null, // নতুন ফিল্ড
    photoURL: "",    // Firebase/MongoDB এ save এর জন্য
  });

  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, photoFile: file });
  };

  const validate = () => {
    const { displayName, email, password, confirmPassword } = form;
    if (!displayName || !email || !password || !confirmPassword) return "All fields are required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const vErr = validate();
    if (vErr) {
      setFormError(vErr);
      toast.error(vErr);
      return;
    }

    try {
      setUploading(true);
      // যদি user image select করে
      if (form.photoFile) {
        const imageUrl = await uploadImageToImgbb(form.photoFile);
        form.photoURL = imageUrl; // Save Firebase/MongoDB এ path
      }

      // 1️⃣ Firebase register
      const userCredential = await createUser(form.email, form.password);
      await sendVerificationEmail();

      // 2️⃣ Firebase profile update
      await userCredential.user.updateProfile({
        displayName: form.displayName,
        photoURL: form.photoURL || "",
      });

      // 3️⃣ Token
      const token = await userCredential.user.getIdToken();

      // 4️⃣ MongoDB register
      await sendRequest("/users", {
        method: "POST",
        body: {
          uid: userCredential.user.uid,
          name: form.displayName,
          email: form.email,
          photoURL: form.photoURL || "",
          role: "user",
        },
        token,
      });

      // 5️⃣ Toast + navigate
      toast.success("✅ Registration successful! Please check your email.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || "Registration failed. Try again.";
      setFormError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || axiosLoading) return null;

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              type="text"
              placeholder="Your full name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10"
              required
            />
            <div
              className="absolute pt-6 inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10"
              required
            />
            <div
              className="absolute pt-6 inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block mb-1 font-medium">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded px-3 py-2" />
          </div>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <button
            type="submit"
            disabled={authLoading || axiosLoading || uploading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-md transition disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Register"}
          </button>
        </form>

        <p className="text-blue-400 p-2">
          Already have an account?
          <Link className="ml-2 text-amber-400 hover:border-b-2" to="/login">Login</Link>
        </p>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </section>
  );
};

export default Register;
