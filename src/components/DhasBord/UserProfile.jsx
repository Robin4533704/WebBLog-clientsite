import { useEffect, useState } from "react";
import useUserAxios from "../../hook/useUserAxios";
import useAuth from "../../hook/useAuth";
import Loading from "../../pages/Loading";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaEdit, 
  FaBlog,
  FaEye,
  FaHeart,
  FaComment,
  FaCamera,
  FaMapMarkerAlt,
  FaGlobe,
  FaSave,
  FaTimes
} from "react-icons/fa";

const UserProfile = () => {
  const { user: currentUser } = useAuth();
  const { axiosIntals } = useUserAxios();

  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [saving, setSaving] = useState(false);

  // ✅ UPDATED: fetchUserProfile function
  const fetchUserProfile = async () => {
    if (!currentUser?.email) return;
    setLoading(true);
    try {
      console.log("🔍 Fetching user profile for:", currentUser.email);
      
      let userRes;
      try {
        // ✅ MongoDB থেকে user খুঁজুন
        userRes = await axiosIntals(`/users?email=${encodeURIComponent(currentUser.email)}`);
        console.log("📦 User API Response:", userRes);
      } catch (mongoError) {
        console.log("❌ User not found in MongoDB:", mongoError);
        userRes = null;
      }

      let fetchedUser;
      
      // ✅ Check multiple response formats
      if (userRes && userRes._id) {
        // Case 1: Direct user object with _id
        fetchedUser = userRes;
        console.log("✅ User found with _id:", fetchedUser._id);
      } else if (userRes && userRes.data && userRes.data._id) {
        // Case 2: { data: user } format
        fetchedUser = userRes.data;
        console.log("✅ User found in data object:", fetchedUser._id);
      } else if (userRes && Array.isArray(userRes) && userRes[0]?._id) {
        // Case 3: Array of users
        fetchedUser = userRes[0];
        console.log("✅ User found in array:", fetchedUser._id);
      } else {
        // ✅ User MongoDB-তে নেই, Firebase data use করুন
        console.log("🔄 User not in MongoDB, using Firebase data");
        fetchedUser = {
          _id: currentUser.uid, // Firebase UID
          displayName: currentUser.displayName || "User",
          name: currentUser.displayName || "User", 
          email: currentUser.email,
          photoURL: currentUser.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png",
          role: "user",
          created_at: new Date(),
          bio: "",
          location: "", 
          website: ""
        };
        
        // ✅ Automatically user create করার চেষ্টা করুন MongoDB-তে
        try {
          console.log("🚀 Creating user in MongoDB...");
          const newUserRes = await axiosIntals("/users", {
            method: "POST",
            data: {
              name: currentUser.displayName || "User",
              email: currentUser.email,
              photoURL: currentUser.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png",
              role: "user"
            }
          });
          console.log("✅ User creation response:", newUserRes);
          
          // নতুন created user data set করুন
          if (newUserRes.user) {
            fetchedUser = newUserRes.user;
          } else if (newUserRes.data) {
            fetchedUser = newUserRes.data;
          }
        } catch (createError) {
          console.log("⚠️ Could not create user in MongoDB:", createError);
        }
      }

      setUserData(fetchedUser);
      setUpdatedData(fetchedUser);

      // ✅ User blogs fetch করুন
      try {
        const userBlogs = await axiosIntals(`/blogs/user/${encodeURIComponent(currentUser.email)}`);
        console.log("📝 User blogs:", userBlogs);
        
        if (Array.isArray(userBlogs)) {
          setBlogs(userBlogs);
        } else if (userBlogs && Array.isArray(userBlogs.data)) {
          setBlogs(userBlogs.data);
        } else {
          setBlogs([]);
        }
      } catch (blogError) {
        console.log("❌ Error fetching blogs:", blogError);
        setBlogs([]);
      }

    } catch (err) {
      console.error("❌ Error in fetchUserProfile:", err);
      // Fallback: Firebase data use করুন
      setUserData({
        _id: currentUser.uid,
        displayName: currentUser.displayName || "User",
        email: currentUser.email,
        photoURL: currentUser.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png",
        role: "user",
        created_at: new Date()
      });
      setUpdatedData({
        displayName: currentUser.displayName || "User",
        email: currentUser.email,
        photoURL: currentUser.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  // ✅ UPDATED: handleUpdateProfile function
  const handleUpdateProfile = async () => {
    // ✅ Check if user has valid MongoDB ID (not Firebase UID)
    if (!userData._id || userData._id === currentUser.uid || userData._id.length < 20) {
      Swal.fire({
        title: "Profile View Mode",
        text: "You can view your profile. Edit feature will be available once your account is fully synced with our database.",
        icon: "info",
        confirmButtonColor: "#3b82f6"
      });
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      console.log("🔄 Updating profile for user:", userData._id);
      console.log("📦 Update data:", updatedData);
      
      const response = await axiosIntals(`/users/${userData._id}`, {
        method: "PATCH",
        data: {
          displayName: updatedData.displayName,
          name: updatedData.displayName,
          photoURL: updatedData.photoURL,
          bio: updatedData.bio,
          location: updatedData.location,
          website: updatedData.website
        }
      });

      console.log("✅ Update response:", response);

      Swal.fire({
        title: "Success!",
        text: response.data?.message || "Profile updated successfully",
        icon: "success",
        confirmButtonColor: "#10b981"
      });

      setIsEditing(false);
      fetchUserProfile();

    } catch (err) {
      console.error("❌ Update error:", err);
      
      let errorMessage = "Failed to update profile. Please try again later.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
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
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUpdatedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancelEdit = () => {
    setUpdatedData(userData);
    setIsEditing(false);
  };

  // ✅ UPDATED: Edit button click handler
  const handleEditClick = () => {
    if (!userData._id || userData._id === currentUser.uid || userData._id.length < 20) {
      Swal.fire({
        title: "View Mode Active",
        text: "Your profile is in view-only mode. Editing will be available soon!",
        icon: "info",
        confirmButtonColor: "#3b82f6"
      });
      return;
    }
    setIsEditing(!isEditing);
  };

  if (loading || !userData) return <Loading />;

  // Calculate user statistics
  const userStats = {
    totalBlogs: blogs.length,
    totalLikes: blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0),
    totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
    totalComments: blogs.reduce((sum, blog) => sum + (blog.reviews?.length || 0), 0)
  };

  // Check if user has MongoDB ID (for edit functionality)
  const hasMongoDBId = userData._id && userData._id !== currentUser.uid && userData._id.length > 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your personal information and track your blog performance</p>
          
          {/* Debug Info */}
          <div className="mt-2 text-xs text-gray-400">
            User ID: {userData._id ? (hasMongoDBId ? "MongoDB User" : "Firebase User") : "No ID"}
            {!hasMongoDBId && (
              <span className="ml-2 text-amber-500">(View Only)</span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden"
            >
              {/* Profile Header */}
              <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 h-20"></div>
              
              {/* Profile Image & Info */}
              <div className="relative px-6 pb-6">
                <div className="flex justify-center -mt-12 mb-4">
                  <div className="relative">
                    <img
                      src={userData.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
                      alt={userData.displayName || userData.name || "User"}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    {isEditing && hasMongoDBId && (
                      <button 
                        className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-200"
                        onClick={() => {
                          const newUrl = prompt("Enter new profile image URL:", userData.photoURL);
                          if (newUrl) handleInputChange('photoURL', newUrl);
                        }}
                      >
                        <FaCamera className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {userData.displayName || userData.name || "User"}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">{userData.email}</p>
                  
                  {/* Additional Info */}
                  {userData.bio && (
                    <p className="text-gray-700 text-sm mb-2 line-clamp-2">{userData.bio}</p>
                  )}
                  
                  {(userData.location || userData.website) && (
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      {userData.location && (
                        <div className="flex items-center justify-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span>{userData.location}</span>
                        </div>
                      )}
                      {userData.website && (
                        <div className="flex items-center justify-center gap-1">
                          <FaGlobe className="w-3 h-3" />
                          <a href={userData.website} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-2">
                    <FaCalendarAlt className="w-3 h-3" />
                    <span>
                      Joined: {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : "Recently"}
                    </span>
                  </div>

                  {/* Role Badge */}
                  <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      userData.role === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {userData.role || 'user'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditClick}
                  className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium shadow-lg ${
                    hasMongoDBId 
                      ? 'bg-amber-500 text-white hover:bg-amber-600' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  <FaEdit className="w-4 h-4" />
                  {hasMongoDBId 
                    ? (isEditing ? 'Cancel Editing' : 'Edit Profile') 
                    : 'View Profile'
                  }
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBlog className="text-amber-500" />
                Blog Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <FaBlog className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Total Blogs</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">{userStats.totalBlogs}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FaHeart className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Total Likes</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{userStats.totalLikes}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaEye className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Total Views</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{userStats.totalViews}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaComment className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Total Comments</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{userStats.totalComments}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Edit Form & Blogs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form - শুধু MongoDB users-এর জন্য */}
            {isEditing && hasMongoDBId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Edit Profile Information</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium flex items-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaSave className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={updatedData.displayName || ''}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-200"
                      placeholder="Enter your display name"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={updatedData.email || ''}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Photo URL
                    </label>
                    <input
                      type="url"
                      value={updatedData.photoURL || ''}
                      onChange={(e) => handleInputChange('photoURL', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-200"
                      placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter a valid image URL</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={updatedData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows="3"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-200 resize-vertical"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={updatedData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-200"
                      placeholder="Your city, country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={updatedData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-200"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Authored Blogs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaBlog className="text-amber-500" />
                  My Authored Blogs ({blogs.length})
                </h3>
              </div>

              {blogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">No Blogs Yet</h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    You haven't authored any blogs yet. Start sharing your thoughts with the world!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map((blog) => (
                    <motion.div
                      key={blog._id}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -5,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" 
                      }}
                      className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 transition-all duration-300"
                    >
                      <img
                        src={blog.image || "/placeholder.jpg"}
                        alt={blog.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800">
                          {blog.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {blog.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs">
                            {blog.category || "Uncategorized"}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <FaHeart className="w-3 h-3 text-red-500" />
                              {blog.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaComment className="w-3 h-3 text-blue-500" />
                              {blog.reviews?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;