import {  Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxios from "../hook/useAxios";

const SingleBlogPage = () => {
  const { id } = useParams();
  const { sendRequest } = useAxios();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return; // prevent request if id is undefined
      setLoading(true);
      try {
        const res = await sendRequest(`/blogs/${id}`, "GET");
        setBlog(res.blog);

        if (res.blog?.category) {
          const relatedRes = await sendRequest(
            `/blogs/related/${res.blog.category}`,
            "GET"
          );
          setRelatedBlogs(relatedRes.related || []);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, sendRequest]);

  if (loading) return <div className="text-center py-10">⏳ Loading blog...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!blog) return <div className="text-center py-10">No blog found</div>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-72 object-cover rounded-xl shadow-md mb-6"
      />

      <h1 className="text-4xl font-bold mb-3">{blog.title}</h1>
      <p className="text-gray-500 mb-6">
        ✍️ {blog.author} • 🗓️ {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
      </p>

      <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
        {blog.content}
      </div>

      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {relatedBlogs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Related Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {relatedBlogs.map((related) => (
              <div
                key={related._id}
                className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
              >
                <img
                  src={related.image}
                  alt={related.title}
                  className="h-40 w-full object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-lg line-clamp-2">{related.title}</h3>
                <p className="text-sm text-gray-500">{related.author}</p>
                <Link
                  to={`/singlepage/${related._id}`}
                  className="text-blue-600 mt-2 inline-block"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">💬 Comments</h2>
        <p className="text-gray-500">Comment section coming soon...</p>
      </div>
    </div>
  );
};

export default SingleBlogPage;
