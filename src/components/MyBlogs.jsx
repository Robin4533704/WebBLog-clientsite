import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useUserAxios from "../hook/useUserAxios";
import useAuth from "../hook/UseAuth";
import Swal from "sweetalert2";
import Loading from "../pages/Loading";
import { EyeIcon, PencilIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

const MyBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", image: "", category: "", tags: [] });

  // Fetch user blogs
  const fetchMyBlogs = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const response = await axiosIntals(`/blogs/user/${encodeURIComponent(user.email)}`);
      setBlogs(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      Swal.fire({ title: "Error!", text: "Failed to load your blogs", icon: "error", confirmButtonColor: "#f59e0b" });
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBlogs(); }, [user]);

  // Delete blog
  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        await axiosIntals.delete(`/blogs/${id}`);
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        Swal.fire({ title: "Deleted!", text: "Your blog has been deleted.", icon: "success", confirmButtonColor: "#10b981" });
      } catch (err) {
        console.error("❌ Delete error:", err);
        Swal.fire({ title: "Error!", text: err.response?.data?.message || err.message || "Failed to delete blog", icon: "error", confirmButtonColor: "#f59e0b" });
      }
    }
  };

  // Edit blog
  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setForm({ title: blog.title || "", content: blog.content || "", image: blog.image || "", category: blog.category || "", tags: blog.tags || [] });
  };

  // Update blog
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingBlog) return Swal.fire({ title: "Error!", text: "No blog selected for update!", icon: "error", confirmButtonColor: "#f59e0b" });

    try {
      await axiosIntals.patch(`/blogs/${editingBlog._id}`, form);
      Swal.fire({ title: "Updated!", text: "Blog updated successfully", icon: "success", confirmButtonColor: "#10b981" });
      setEditingBlog(null);
      fetchMyBlogs();
    } catch (err) {
      console.error("❌ Update error:", err);
      Swal.fire({ title: "Error!", text: "Failed to update blog", icon: "error", confirmButtonColor: "#f59e0b" });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <DocumentTextIcon className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">My Blogs</h1>
          </div>
          <p className="text-gray-600 text-lg">Manage and edit your published articles</p>
        </motion.div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Blogs Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">You haven't created any blogs yet. Start sharing your thoughts with the world!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {blogs.map(blog => (
                <motion.div
                  key={blog._id}
                  layout
                  whileHover={{ scale: 1.03, y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-lg border border-amber-100 hover:border-amber-200 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={blog.image || "/placeholder.jpg"} alt={blog.title || "Blog"} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">{blog.category || "Uncategorized"}</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 leading-tight">{blog.title}</h3>
                    <p className="text-gray-600 text-sm flex-1 overflow-hidden line-clamp-3 mb-4 leading-relaxed">{blog.content}</p>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-medium">#{tag}</span>
                        ))}
                        {blog.tags.length > 3 && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">+{blog.tags.length - 3}</span>}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <button onClick={() => setViewingBlog(blog)} className="flex-1 py-2 bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-1 hover:bg-emerald-600 transition-all duration-200 font-medium text-sm shadow-md"><EyeIcon className="w-4 h-4" /><span className="hidden sm:inline">View</span></button>
                      <button onClick={() => handleEditClick(blog)} className="flex-1 py-2 bg-blue-500 text-white rounded-xl flex items-center justify-center gap-1 hover:bg-blue-600 transition-all duration-200 font-medium text-sm shadow-md"><PencilIcon className="w-4 h-4"/><span className="hidden sm:inline">Edit</span></button>
                      <button onClick={() => handleDelete(blog._id)} className="flex-1 py-2 bg-red-500 text-white rounded-xl flex items-center justify-center gap-1 hover:bg-red-600 transition-all duration-200 font-medium text-sm shadow-md"><TrashIcon className="w-4 h-4"/><span className="hidden sm:inline">Delete</span></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* View Modal */}
        <AnimatePresence>
          {viewingBlog && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4" onClick={() => setViewingBlog(null)}>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{viewingBlog.title}</h2>
                  {viewingBlog.image && <img src={viewingBlog.image} alt={viewingBlog.title} className="w-full h-64 object-cover rounded mb-4" />}
                  <p className="text-gray-700 whitespace-pre-line">{viewingBlog.content}</p>
                  <button onClick={() => setViewingBlog(null)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingBlog && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4" onClick={() => setEditingBlog(null)}>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full p-2 border rounded" required />
                    <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="w-full p-2 border rounded" />
                    <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full p-2 border rounded" />
                    <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} className="w-full p-2 border rounded" placeholder="Content" required />
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <button type="button" onClick={() => setEditingBlog(null)} className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                      <button type="submit" className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyBlogs;
