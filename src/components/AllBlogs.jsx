import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight,
  FaTimes 
} from "react-icons/fa";
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
  const limit = 9;

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  // 🔹 useRef for debounced search
  const searchTimeout = useRef(null);

  const handleSearchChange = (value) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 500);
  };

  // Memoized query parameters
  const queryParams = useMemo(() => ({
    page,
    limit,
    ...(category && { category }),
    ...(author && { author }),
    ...(sort && { sort }),
  }), [page, limit, category, author, sort]);

  // Fetch Blogs function
  const fetchBlogs = useCallback(async () => {
    try {
      console.log("🔄 Fetching blogs with params:", queryParams);
      const res = await sendRequest("/blogs", { params: queryParams });

      let data = Array.isArray(res) ? res :
                 Array.isArray(res?.blogs) ? res.blogs : [];

      console.log("📦 Received data:", data.length, "blogs");

      // Extract unique categories and authors
      const uniqueCategories = [...new Set(data.map(b => b.category).filter(Boolean))];
      const uniqueAuthors = [
        ...new Map(
          data
            .filter(b => b.author)
            .map(b => [b.author.email, b.author])
        ).values(),
      ];

      setCategories(uniqueCategories);
      setAuthors(uniqueAuthors);

      // Apply search filter
      if (search.trim()) {
        data = data.filter(b =>
          b.title?.toLowerCase().includes(search.toLowerCase()) ||
          b.content?.toLowerCase().includes(search.toLowerCase()) ||
          b.author?.displayName?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply sorting
      if (sort === "date") {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === "popularity") {
        data.sort((a, b) => (b.views || 0) - (a.views || 0));
      }

      setBlogs(data);
      setTotal(Array.isArray(res) ? data.length : res.total || data.length);
    } catch (err) {
      console.error("❌ Error fetching blogs:", err);
      setBlogs([]);
      setTotal(0);
    }
  }, [queryParams, search, sendRequest]);

  // Initial fetch effect
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const totalPages = Math.ceil(total / limit) || 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Blogs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore a world of knowledge, stories, and insights from talented writers across various categories.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8" variants={itemVariants} initial="hidden" animate="visible">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs by title, content, or author..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                defaultValue={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3 flex-wrap">
              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300 min-w-[160px]"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              >
                <option value="">All Categories</option>
                {categories.map((c, idx) => (<option key={`${c}-${idx}`} value={c}>{c}</option>))}
              </select>

              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300 min-w-[180px]"
                value={author}
                onChange={(e) => { setAuthor(e.target.value); setPage(1); }}
              >
                <option value="">All Authors</option>
                {authors.map((a, idx) => (<option key={`${a.email}-${idx}`} value={a.email}>{a.displayName || a.fullName || a.email}</option>))}
              </select>

              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-all duration-300 min-w-[140px]"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="date">Newest First</option>
                <option value="popularity">Most Popular</option>
              </select>

              {hasActiveFilters && (
                <button onClick={resetFilters} className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300 flex items-center gap-2">
                  <FaTimes /> Clear Filters
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors duration-300">
              <FaFilter /> Filters
            </button>
          </div>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (<Loading key={i} />))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error loading blogs: {error.message || error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{hasActiveFilters ? "No blogs found with current filters." : "No blogs available yet."}</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
            {blogs.map(blog => (
              <motion.div key={blog._id} variants={itemVariants}><BlogCard blog={blog} /></motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div className="flex justify-center items-center gap-4 mt-12">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-6 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition">
              <FaChevronLeft /> Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button key={pageNumber} onClick={() => setPage(pageNumber)} className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${page===pageNumber?"bg-amber-500 text-white":"bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-gray-300 dark:border-gray-600"}`}>
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-6 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition">
              Next <FaChevronRight />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
