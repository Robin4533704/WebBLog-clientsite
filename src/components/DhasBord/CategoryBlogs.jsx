import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxios from "../../hook/useAxios";
import BlogCard from "../DhasBord/Blogcard"; 
import { useParams } from "react-router-dom";

const CategoryBlogs = () => {
  const { categoryName } = useParams();
  const { sendRequest } = useAxios();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 6;

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      setLoading(true);
      try {
        const res = await sendRequest("/blogs", {
          params: {
            page,
            limit,
            category: categoryName,
          },
        });

        if (res.success) {
          let filteredBlogs = res.blogs;

          // ✅ Search filter
          if (search.trim()) {
            filteredBlogs = filteredBlogs.filter((b) =>
              b.title?.toLowerCase().includes(search.toLowerCase())
            );
          }

          // ✅ Remove duplicate blogs by _id
          const uniqueBlogs = Array.from(new Set(filteredBlogs.map(b => b._id)))
            .map(id => filteredBlogs.find(b => b._id === id));

          setBlogs(uniqueBlogs);
          setTotalPages(Math.ceil(res.total / limit));
        }
      } catch (error) {
        console.error("Error fetching category blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBlogs();
  }, [page, categoryName, search]);

  return (
    <div className="container mx-auto p-6 mt-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-center text-amber-600 mb-6"
      >
        {categoryName
          ? `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Blogs`
          : "Category Blogs"}
      </motion.h1>

      {/* 🔍 Search Box */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-4 py-2 flex-1 max-w-md"
        />
      </div>

      {/* 📄 Blog Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found in this category.</p>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </motion.div>
      )}

      {/* 🔢 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryBlogs;
