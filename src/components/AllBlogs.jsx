import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import BlogCard from "../components/DhasBord/Blogcard";
import useAxios from "../hook/useAxios";
import Loading from "../pages/Loading";

const AllBlogs = () => {
  const { sendRequest, loading, error } = useAxios();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [sort, setSort] = useState("date");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const limit = 6; // 6 blogs per page

  const fetchBlogs = useCallback(async () => {
    try {
      // Fetch all blogs from API
      const res = await sendRequest("/blogs");
      let data = Array.isArray(res) ? res : Array.isArray(res?.blogs) ? res.blogs : [];

      // Apply search filter
      if (search.trim()) {
        data = data.filter(b =>
          b.title?.toLowerCase().includes(search.toLowerCase()) ||
          b.content?.toLowerCase().includes(search.toLowerCase()) ||
          b.author?.displayName?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply category filter
      if (category) {
        data = data.filter(b => b.category === category);
      }

      // Apply author filter
      if (author) {
        data = data.filter(b => b.author?.email === author);
      }

      // Apply sorting
      if (sort === "date") data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      else if (sort === "popularity") data.sort((a, b) => (b.views || 0) - (a.views || 0));

      setTotal(data.length);
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
      setTotal(0);
    }
  }, [sendRequest, search, category, author, sort]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Slice blogs for current page
  const currentBlogs = blogs.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(total / limit) || 1;

  const resetFilters = () => {
    setCategory("");
    setAuthor("");
    setSort("date");
    setSearch("");
    setPage(1);
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters = category || author || sort !== "date" || search;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-4">
            Discover Amazing Blogs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore a world of knowledge, stories, and insights from talented writers.
          </p>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => <Loading key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 text-lg">{error.message || error}</div>
        ) : currentBlogs.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">{hasActiveFilters ? "No blogs found." : "No blogs available yet."}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBlogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-6 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition">
              <FaChevronLeft /> Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button key={pageNumber} onClick={() => setPage(pageNumber)} className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${page === pageNumber ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-gray-300 dark:border-gray-600"}`}>
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-6 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition">
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
