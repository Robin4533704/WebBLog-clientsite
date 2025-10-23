// Profile.jsx
import { useState, useEffect } from "react";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useUserAxios from "../hook/useUserAxios";
import { uploadImageToImgbb } from "../uploadImage";
import { useAuth } from "../provider/AuthContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { user: contextUser, setUser } = useAuth(); // context
  const { axiosIntals, loading } = useUserAxios();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
  });
  const [uploading, setUploading] = useState(false);

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

    setUploading(true);
    try {
      const imageUrl = await uploadImageToImgbb(file);
      setFormData((prev) => ({ ...prev, photoURL: imageUrl }));
      Swal.fire("Success", "Image uploaded successfully ✅", "success");
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire("Error", "❌ Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Firebase profile update
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      // Firebase email update
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

     await axiosIntals(`/users/${user.uid}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  data: formData,
});


      // Update context
      setUser({ ...contextUser, ...formData });

      Swal.fire("Success", "Profile updated successfully ✅", "success");
      navigate("/dashboard/profile");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "❌ Error updating profile: " + err.message, "error");
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo */}
        <motion.div
          className="mb-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <label className="block mb-1 font-medium">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border rounded px-3 py-2"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
          {formData.photoURL && (
            <motion.img
              src={formData.photoURL}
              alt="Profile"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>

        {/* Username */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Username"
          />
        </motion.div>

        {/* Email */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? "Updating..." : "Update Profile"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Profile;
