import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogCard from "../components/DhasBord/Blogcard";
import useAxios from "../hook/useAxios";

const AllBlogs = () => {
  const { sendRequest, loading, error } = useAxios();

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [sort, setSort] = useState("");
  const limit = 6;

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const query = { page, limit, ...(category && { category }), ...(author && { author }), ...(sort && { sort }) };
        const res = await sendRequest("/blogs", { params: query });

        let data = Array.isArray(res) ? res : Array.isArray(res.blogs) ? res.blogs : [];

        // extract categories & authors dynamically
        const cats = [...new Set(data.map((b) => b.category))];
        const auths = [...new Set(data.map((b) => b.author))];
        setCategories(cats);
        setAuthors(auths);

        // client-side search
        if (search.trim()) {
          data = data.filter((b) => b.title?.toLowerCase().includes(search.toLowerCase()));
        }

        // client-side sorting fallback
        if (sort === "date") data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else if (sort === "popularity") data.sort((a, b) => (b.views || 0) - (a.views || 0));

        setBlogs(data);
        setTotal(Array.isArray(res) ? data.length : res.total || data.length);
      } catch (err) {
        console.error(err);
        setBlogs([]);
        setTotal(0);
      }
    };

    fetchBlogs();
  }, [page, category, author, sort, search, sendRequest]);

  const totalPages = Math.ceil(total / limit) || 1;

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="max-w-7xl mt-8 mx-auto p-6">
      {/* Header */}
      <motion.h1
        className="text-3xl font-bold mb-6 text-center text-amber-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Explore All Blogs
      </motion.h1>

      {/* Filters & Search */}
      <motion.div
        className="flex flex-wrap gap-4 mb-6 justify-center items-center"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        {/* Category Filter */}
        <select
          className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-amber-400 transition"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Author Filter */}
        <select
          className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-amber-400 transition"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
            setPage(1);
          }}
        >
         {authors.map((a, idx) => (
  <option key={`${a.email}-${idx}`} value={a.email}>
    {a.fullName}
  </option>
))}

       
        </select>

        {/* Sort */}
        <select
          className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-amber-400 transition"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="date">Newest</option>
          <option value="popularity">Most Popular</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title..."
          className="border px-3 py-2 rounded-md w-full sm:w-64 shadow-sm focus:ring-2 focus:ring-amber-400 transition"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </motion.div>

      {/* Blog Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-10">Error: {error.message || error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No blogs found.</p>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((blog) => (
            <motion.div key={blog._id} variants={fadeUp} whileHover={{ scale: 1.03 }}>
              <BlogCard
                blog={blog}
                className="transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-500 hover:text-white shadow hover:shadow-lg rounded-lg overflow-hidden"
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-8 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            className="px-4 py-2 border rounded-md hover:bg-yellow-100 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-3 py-2 font-medium">
            {page} / {totalPages}
          </span>
          <button
            className="px-4 py-2 border rounded-md hover:bg-yellow-100 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AllBlogs;
