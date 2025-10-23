import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      try {
        const res = await axios.get("/blogs/popular?limit=6");
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPopularBlogs();
  }, []);

  return (
    <section className="py-12 container mx-auto">
      <h2 className="text-3xl font-bold mb-6">Most Liked & Reviewed Blogs</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link
            to={`/blog/${blog._id}`}
            key={blog._id}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={blog.image || "/placeholder.jpg"}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {blog.content.slice(0, 100)}...
            </p>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>👍 {blog.likes || 0}</span>
              <span>💬 {blog.reviews?.length || 0}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestBlogs;
