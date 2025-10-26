import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import useUserAxios from "../hook/useUserAxios";
import { useActivity } from "../hook/ActivityContext";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaTelegramPlane, 
  FaLink, 
  FaHeart, 
  FaStar,
  FaCalendar,
  FaUser,
  FaTag,
  FaArrowLeft,
  FaShareAlt,
  FaBookmark,
  FaEye,
  FaClock
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../pages/Loading";
import ReviewForm from "./../pages/ReviewFrom";

const ViewDetails = () => {
  const { id } = useParams();
  const { axiosIntals } = useUserAxios();
  const { addActivity } = useActivity();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [views, setViews] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Animation variants
  const fadeUp = { 
    hidden: { opacity: 0, y: 30 }, 
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    } 
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);

    const fetchBlog = async () => {
      try {
        const res = await axiosIntals(`/blogs/${id}`);
        const blogData = res?.blog || res;

        if (blogData) {
          setBlog(blogData);
          setLikes(blogData.likes || 0);
          setViews(blogData.views || 0);
          
          if (auth.currentUser && blogData.likedBy?.includes(auth.currentUser.uid)) {
            setLiked(true);
          }

          // Fetch related blogs
          const relatedRes = await axiosIntals(`/blogs?category=${encodeURIComponent(blogData.category)}&limit=4`);
          setRelatedBlogs(relatedRes.filter((b) => b._id !== blogData._id).slice(0, 3));
        } else {
          toast.error("Blog not found");
        }
      } catch (err) {
        console.error("❌ Blog load error:", err);
        toast.error("Failed to load blog");
      } finally {
        setLoaded(true);
      }
    };

    fetchBlog();
  }, [id, axiosIntals]);

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like this blog");
    if (liked) return toast.info("You've already liked this blog");

    try {
      const res = await axiosIntals(`/blogs/${blog?._id}/like`, {
        method: "POST",
        data: { userId: user.uid },
      });
      
      if (res?.likes !== undefined) {
        setLikes(res.likes);
        setLiked(true);
        toast.success("❤️ Liked this blog!");
        addActivity({
          type: "like",
          userName: user.displayName,
          userEmail: user.email,
          userPhoto: user.photoURL,
          blogTitle: blog?.title,
        });
      }
    } catch (err) {
      console.error("❌ Like error:", err);
      toast.error("Failed to like blog");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog?.title);
    const description = encodeURIComponent(blog?.content?.substring(0, 100) || "");
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}&hashtags=blog`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
        break;
      case "copy":
        navigator.clipboard.writeText(window.location.href);
        toast.success("✅ Link copied to clipboard!");
        setShowShareMenu(false);
        return;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <Loading />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog Not Found</h2>
          <Link to="/blogs" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(blog.content);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="colored"
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to="/blogs" 
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <FaArrowLeft />
            Back to Blogs
          </Link>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Hero Image */}
          <div className="relative">
            <motion.img
              src={blog?.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop"}
              alt={blog?.title}
              className="w-full h-64 md:h-96 object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg capitalize">
                {blog?.category || "General"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookmark}
                className={`p-3 rounded-full shadow-lg backdrop-blur-sm ${
                  isBookmarked 
                    ? "bg-amber-500 text-white" 
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300"
                }`}
              >
                <FaBookmark />
              </motion.button>
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-full shadow-lg backdrop-blur-sm"
                >
                  <FaShareAlt />
                </motion.button>

                {/* Share Dropdown */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 min-w-[160px] z-10"
                    >
                      <button
                        onClick={() => handleSocialShare("facebook")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaFacebookF className="text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleSocialShare("twitter")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaTwitter className="text-sky-500" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleSocialShare("telegram")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaTelegramPlane className="text-blue-500" />
                        Telegram
                      </button>
                      <button
                        onClick={() => handleSocialShare("copy")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FaLink className="text-gray-500" />
                        Copy Link
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
              variants={fadeUp}
            >
              {blog?.title}
            </motion.h1>

            {/* Meta Information */}
            <motion.div 
              className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6"
              variants={fadeUp}
            >
              <div className="flex items-center gap-2">
                <FaUser className="text-amber-500" />
                <span className="font-medium">{blog?.author?.fullName || "Admin"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaCalendar className="text-amber-500" />
                <span>{blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : "Unknown Date"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaClock className="text-amber-500" />
                <span>{readTime} min read</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaEye className="text-amber-500" />
                <span>{views} views</span>
              </div>
            </motion.div>

            {/* Tags */}
            {blog?.tags?.length > 0 && (
              <motion.div className="flex flex-wrap gap-2 mb-6" variants={fadeUp}>
                {blog.tags.map((tag, i) => (
                  <Link 
                    key={i} 
                    to={`/blogs?tag=${tag}`}
                    className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-sm hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    <FaTag className="text-[10px]" />
                    #{tag}
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div className="flex flex-wrap items-center gap-3 mb-8" variants={fadeUp}>
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={liked}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  liked 
                    ? "bg-red-500 text-white cursor-not-allowed shadow-lg" 
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                <FaHeart className={liked ? "animate-pulse" : ""} />
                {liked ? "Liked" : "Like"} ({likes})
              </motion.button>
            </motion.div>

            {/* Blog Content */}
            <motion.div 
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              variants={fadeUp}
            >
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                {blog?.content}
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div 
              className="border-t border-gray-200 dark:border-gray-700 my-8"
              variants={fadeUp}
            />

            {/* Reviews Section */}
            <motion.section 
              className="mt-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Reviews ({blog?.reviews?.length || 0})
              </h2>

              {blog?.reviews?.length > 0 ? (
                <div className="space-y-6">
                  {blog.reviews.map((rev, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
                      variants={fadeUp}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {rev.userName?.charAt(0)?.toUpperCase() || "G"}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">
                              {rev.userName}
                            </p>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={i < (rev.rating || 5) ? "fill-current" : "text-gray-300 dark:text-gray-600"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                            {rev.comment}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(rev.date).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                  variants={fadeUp}
                >
                  <FaStar className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-lg">No reviews yet. Be the first to share your thoughts!</p>
                </motion.div>
              )}

              {/* Review Form */}
              {user && (
                <motion.div variants={fadeUp}>
                  <ReviewForm
                    blogId={blog?._id}
                    onNewReview={(newReview) =>
                      setBlog((prev) => ({ 
                        ...prev, 
                        reviews: [...prev.reviews, newReview] 
                      }))
                    }
                  />
                </motion.div>
              )}
            </motion.section>
          </div>
        </motion.div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <motion.section 
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Related Blogs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((rb) => (
                <motion.div
                  key={rb._id}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/blogs/${rb._id}`} className="block">
                    <img 
                      src={rb.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop"} 
                      alt={rb.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-tight">
                        {rb.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{rb.author?.fullName || "Admin"}</span>
                        <span>{calculateReadTime(rb.content)} min read</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;