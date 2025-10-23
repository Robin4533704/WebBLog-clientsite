import React, { useEffect, useState } from "react";
import useUserAxios from "../../hook/useUserAxios";
import { toast } from "react-hot-toast";
import Loading from "../../pages/Loading";

const ManageBlogs = () => {
  const { axiosIntals } = useUserAxios();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await axiosIntals("/blogs");
      setBlogs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Approve blog
  const handleApprove = async (id) => {
    try {
     await axiosIntals(`/blogs/${id}/approve`, { method: "PATCH" });

      toast.success("Blog approved!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve blog");
    }
  };

  // Feature blog
  const handleFeature = async (id) => {
    try {
      await axiosIntals(`/blogs/${id}/feature`, { method: "PATCH" });
      toast.success("Blog featured!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to feature blog");
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axiosIntals(`/blogs/${id}`, { method: "DELETE" });
      toast.success("Blog deleted!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

  if (loading) return <Loading/>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Author</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td className="border px-4 py-2">{blog.title}</td>
                <td className="border px-4 py-2">
                  {blog.author?.fullName || blog.author?.email || "Unknown"}
                </td>
                <td className="border px-4 py-2">{blog.status || "pending"}</td>
                <td className="border px-4 py-2 flex gap-2">
                  {blog.status !== "approved" && (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleApprove(blog._id)}
                    >
                      Approve
                    </button>
                  )}
                  {blog.status !== "featured" && (
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handleFeature(blog._id)}
                    >
                      Feature
                    </button>
                  )}
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageBlogs;
