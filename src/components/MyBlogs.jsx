import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useUserAxios from "../hook/useUserAxios";
import useAuth from "../hook/UseAuth";
import Swal from "sweetalert2";
import Loading from "../pages/Loading";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const MyBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", image: "", category: "" });

  const fetchMyBlogs = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const response = await axiosIntals(`/blogs/user/${encodeURIComponent(user.email)}`);
      setBlogs(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      Swal.fire("Error", "Failed to load your blogs", "error");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBlogs(); }, [user]);

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (confirmed.isConfirmed) {
      try {
        await axiosIntals(`/blogs/${id}`, { method: "DELETE" });
        setBlogs(prev => prev.filter(b => b._id !== id));
        Swal.fire("Deleted!", "Your blog has been deleted.", "success");
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      content: blog.content,
      image: blog.image,
      category: blog.category || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosIntals(`/blogs/${editingBlog._id}`, { method: "PATCH", data: form });
      Swal.fire("Updated!", "Blog updated successfully", "success");
      setEditingBlog(null);
      fetchMyBlogs();
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", "Failed to update blog", "error");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">My Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">You haven’t created any blogs yet.</p>
      ) : (
        <AnimatePresence>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map(blog => (
              <motion.div
                key={blog._id}
                layout
                whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md transition-all duration-300"
              >
                <img src={blog.image || "/placeholder.jpg"} alt={blog.title || "Blog"} className="w-full h-48 object-cover"/>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-gray-800">{blog.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 truncate">Category: {blog.category || "Uncategorized"}</p>
                  <p className="text-gray-700 text-sm flex-1 overflow-hidden line-clamp-4">{blog.content}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setViewingBlog(blog)} className="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-1 hover:bg-green-700 transition">
                      <EyeIcon className="w-5 h-5"/> View
                    </button>
                    <button onClick={() => handleEditClick(blog)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-1 hover:bg-blue-700 transition">
                      <PencilIcon className="w-5 h-5"/> Edit
                    </button>
                    <button onClick={() => handleDelete(blog._id)} className="flex-1 py-2 bg-red-600 text-white rounded-lg flex items-center justify-center gap-1 hover:bg-red-700 transition">
                      <TrashIcon className="w-5 h-5"/> Delete
                    </button>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative overflow-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">{viewingBlog.title}</h2>
              <img src={viewingBlog.image || "/placeholder.jpg"} alt={viewingBlog.title} className="w-full h-64 object-cover mb-4 rounded-lg"/>
              <p className="text-gray-700 mb-2"><strong>Category:</strong> {viewingBlog.category || "Uncategorized"}</p>
              <p className="text-gray-700">{viewingBlog.content}</p>
              <div className="flex justify-end mt-4">
                <button onClick={() => setViewingBlog(null)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative"
            >
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Edit Blog</h2>
              <form onSubmit={handleUpdate} className="space-y-3">
                <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required/>
                <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <textarea placeholder="Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows="5" className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" required></textarea>
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setEditingBlog(null)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Update</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyBlogs;
