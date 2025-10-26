import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../provider/AuthContext";
import { 
  FaBookmark, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaClock, 
  FaUser, 
  FaEye,
  FaHeart,
  FaComment,
  FaCalendarAlt,
  FaSort,
  FaTimes,
  FaRegBookmark
} from "react-icons/fa";
import useAxios from "../hook/useAxios";
import Loading from "../pages/Loading";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  const { user } = useContext(AuthContext);
  const { sendRequest, loading } = useAxios();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Mock data - Replace with actual API call
  const mockBookmarks = [
    {
      id: "1",
      blogId: "blog1",
      title: "The Future of Web Development in 2024",
      excerpt: "Exploring the latest trends and technologies that are shaping the future of web development...",
      author: {
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      category: "Technology",
      readTime: "5 min read",
      views: 1245,
      likes: 89,
      comments: 23,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      createdAt: "2024-01-15T10:30:00Z",
      bookmarkedAt: "2024-01-20T14:25:00Z"
    },
    {
      id: "2",
      blogId: "blog2",
      title: "Mastering React Hooks: A Comprehensive Guide",
      excerpt: "Deep dive into React Hooks and how to use them effectively in your projects...",
      author: {
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      category: "Programming",
      readTime: "8 min read",
      views: 2890,
      likes: 156,
      comments: 42,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      createdAt: "2024-01-10T08:15:00Z",
      bookmarkedAt: "2024-01-19T09:45:00Z"
    },
    {
      id: "3",
      blogId: "blog3",
      title: "The Art of Writing Clean Code",
      excerpt: "Learn the principles and practices that will help you write maintainable and efficient code...",
      author: {
        name: "Mike Johnson",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      category: "Programming",
      readTime: "6 min read",
      views: 1876,
      likes: 234,
      comments: 67,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      createdAt: "2024-01-08T16:20:00Z",
      bookmarkedAt: "2024-01-18T11:30:00Z"
    },
    {
      id: "4",
      blogId: "blog4",
      title: "Building Scalable Applications with Microservices",
      excerpt: "Understanding microservices architecture and how to build scalable applications...",
      author: {
        name: "Sarah Wilson",
        avatar: "https://i.pravatar.cc/150?img=4"
      },
      category: "Architecture",
      readTime: "12 min read",
      views: 3421,
      likes: 189,
      comments: 54,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      createdAt: "2024-01-05T14:10:00Z",
      bookmarkedAt: "2024-01-17T16:15:00Z"
    },
    {
      id: "5",
      blogId: "blog5",
      title: "Introduction to Machine Learning for Developers",
      excerpt: "A beginner-friendly introduction to machine learning concepts and implementations...",
      author: {
        name: "Alex Chen",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      category: "AI/ML",
      readTime: "15 min read",
      views: 4321,
      likes: 321,
      comments: 89,
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      createdAt: "2024-01-03T11:45:00Z",
      bookmarkedAt: "2024-01-16T13:20:00Z"
    }
  ];

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      
      try {
        // Replace with actual API call
        // const response = await sendRequest(`/users/${user.uid}/bookmarks`);
        // setBookmarks(response.data || []);
        
        // Using mock data for now
        setBookmarks(mockBookmarks);
        setFilteredBookmarks(mockBookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setBookmarks(mockBookmarks);
        setFilteredBookmarks(mockBookmarks);
      }
    };

    fetchBookmarks();
  }, [user, sendRequest]);

  // Filter and sort bookmarks
  useEffect(() => {
    let result = [...bookmarks];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(bookmark =>
        bookmark.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== "all") {
      result = result.filter(bookmark => bookmark.category === filterBy);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt));
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredBookmarks(result);
  }, [bookmarks, searchTerm, sortBy, filterBy]);

  const handleRemoveBookmark = async (bookmarkId) => {
    setDeleteLoading(bookmarkId);
    try {
      // Replace with actual API call
      // await sendRequest(`/bookmarks/${bookmarkId}`, { method: "DELETE" });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all bookmarks? This action cannot be undone.")) {
      setBookmarks([]);
      setFilteredBookmarks([]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const categories = [...new Set(bookmarks.map(b => b.category))];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaRegBookmark className="text-amber-500 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to view your bookmarked articles.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-300 font-medium"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Bookmarks</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Your saved articles and favorite reads, all in one place.
          </p>
        </motion.div>

        {/* Stats and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{bookmarks.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Saved</div>
              </div>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Categories</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {bookmarks.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center gap-2 justify-center text-sm"
                >
                  <FaTrash className="text-sm" />
                  Clear All
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none transition-all duration-300"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSort className="text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none transition-all duration-300"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-amber-600">{filteredBookmarks.length}</span> of{" "}
            <span className="font-semibold text-amber-600">{bookmarks.length}</span> bookmarks
          </p>
          
          {(searchTerm || filterBy !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterBy("all");
              }}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors"
            >
              <FaTimes />
              Clear filters
            </button>
          )}
        </motion.div>

        {/* Bookmarks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRegBookmark className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {bookmarks.length === 0 ? "No Bookmarks Yet" : "No Bookmarks Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              {bookmarks.length === 0 
                ? "Start saving your favorite articles by clicking the bookmark icon on any blog post."
                : "Try adjusting your search terms or filters to find what you're looking for."
              }
            </p>
            {bookmarks.length === 0 && (
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-300 font-medium"
              >
                Explore Blogs
              </Link>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBookmarks.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Blog Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={bookmark.image}
                      alt={bookmark.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                        {bookmark.category}
                      </span>
                    </div>
                    
                    {/* Remove Bookmark Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                      disabled={deleteLoading === bookmark.id}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
                    >
                      {deleteLoading === bookmark.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FaTrash className="text-sm" />
                      )}
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <Link to={`/blogs/${bookmark.blogId}`}>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                        {bookmark.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {bookmark.excerpt}
                    </p>

                    {/* Author and Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={bookmark.author.avatar}
                          alt={bookmark.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {bookmark.author.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            {formatDate(bookmark.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats and Bookmark Time */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <FaEye className="text-xs" />
                          {bookmark.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaHeart className="text-xs" />
                          {bookmark.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaComment className="text-xs" />
                          {bookmark.comments}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-amber-600" title={`Bookmarked on ${formatDate(bookmark.bookmarkedAt)}`}>
                        <FaBookmark className="text-xs" />
                        {getRelativeTime(bookmark.bookmarkedAt)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;