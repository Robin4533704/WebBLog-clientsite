import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import useUserAxios from "../hook/useUserAxios";
import { useActivity } from "../hook/ActivityContext";
import {
  FaFacebookF,
  FaTwitter,
  FaTelegramPlane,
  FaLink,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../pages/Loading";

const ViewDetails = () => {
  const { id } = useParams();
  const { axiosIntals } = useUserAxios();
  const { addActivity } = useActivity();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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
          if (auth.currentUser && blogData.likedBy?.includes(auth.currentUser.uid)) {
            setLiked(true);
          }

          const relatedRes = await axiosIntals(
            `/blogs?category=${encodeURIComponent(blogData.category)}`
          );
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
    if (!user) return toast.error("Please login to like");
    if (liked) return toast.info("Already liked");

    try {
      const res = await axiosIntals(`/blogs/${blog?._id}/like`, {
        method: "POST",
        data: { userId: user.uid },
      });
      if (res?.likes !== undefined) {
        setLikes(res.likes);
        setLiked(true);
        toast.success("❤️ Liked!");
        addActivity({
          type: "like",
          userName: user.displayName,
          userEmail: user.email,
          userPhoto: user.photoURL,
        });
      }
    } catch (err) {
      console.error("❌ Like error:", err);
      toast.error("Failed to like");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return toast.error("Review cannot be empty");

    const reviewData = {
      userId: user?.uid || "guest",
      userName: user?.displayName || "Guest",
      comment: reviewText,
      date: new Date().toISOString(),
      rating: 5, // default 5-star rating
    };

    try {
      const res = await axiosIntals(`/blogs/${blog?._id}/reviews`, {
        method: "POST",
        data: reviewData,
      });
      if (res?.reviews) {
        setBlog((prev) => ({ ...prev, reviews: res.reviews }));
        setReviewText("");
        toast.success("✅ Review added!");
        addActivity({
          type: "review",
          userName: user?.displayName || "Guest",
          userEmail: user?.email || "guest@example.com",
          userPhoto: user?.photoURL,
          comment: reviewText,
        });
      }
    } catch (err) {
      console.error("❌ Review error:", err);
      toast.error("Failed to add review");
    }
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog?.title);
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
        break;
      case "copy":
        navigator.clipboard.writeText(window.location.href);
        toast.success("✅ Link copied to clipboard!");
        return;
      default:
        break;
    }
    if (shareUrl) window.open(shareUrl, "_blank", "width=600,height=400");
  };

  if (!loaded) return <Loading />;
  if (!blog) return <p className="text-center mt-10">Blog not found</p>;

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 shadow-2xl rounded-lg"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      {/* Hero Image & Title */}
      <motion.img
        src={blog?.image || "https://via.placeholder.com/600x300"}
        alt={blog?.title}
        className="w-full h-64 md:h-96 object-cover rounded-lg mb-6 shadow-lg"
        whileHover={{ scale: 1.02 }}
      />
      <motion.h1 className="text-4xl md:text-5xl font-bold mb-3 text-amber-600" variants={fadeUp}>
        {blog?.title}
      </motion.h1>

      {/* Author, Date, Category */}
      <motion.div className="text-sm text-gray-500 mb-4 dark:text-gray-400 flex flex-wrap gap-3" variants={fadeUp}>
        <span>By <b>{blog?.author?.fullName || "Admin"}</b></span>
        <span>{blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Unknown Date"}</span>
        <span>Category: {blog?.category || "General"}</span>
      </motion.div>

      {/* Tags */}
      <motion.div className="flex flex-wrap gap-2 mb-6" variants={fadeUp}>
        {blog?.tags?.map((tag, i) => (
          <Link
            key={i}
            to={`/blogs?tag=${tag}`}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
          >
            #{tag}
          </Link>
        ))}
      </motion.div>

      {/* Like & Share */}
      <motion.div className="flex flex-wrap items-center gap-3 mb-6" variants={fadeUp}>
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.95 }}
          disabled={liked}
          className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition-all duration-300 ${
            liked ? "bg-red-500 text-white cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          <FaHeart /> {liked ? "Liked" : "Like"} ({likes})
        </motion.button>

        <motion.button onClick={() => handleSocialShare("facebook")} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
          <FaFacebookF />
        </motion.button>
        <motion.button onClick={() => handleSocialShare("twitter")} className="bg-sky-400 text-white px-3 py-2 rounded hover:bg-sky-500">
          <FaTwitter />
        </motion.button>
        <motion.button onClick={() => handleSocialShare("telegram")} className="bg-blue-400 text-white px-3 py-2 rounded hover:bg-blue-500">
          <FaTelegramPlane />
        </motion.button>
        <motion.button onClick={() => handleSocialShare("copy")} className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500">
          <FaLink />
        </motion.button>

        <Link to="/blogPage" className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600">
          Back to Blogs
        </Link>
      </motion.div>

      {/* Blog Content */}
      <motion.div className="prose dark:prose-invert text-gray-800 dark:text-gray-200 mb-8" variants={fadeUp}>
        <div className="whitespace-pre-line">{blog?.content}</div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div className="mt-10" variants={fadeUp}>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {blog?.reviews?.length > 0 ? (
          blog.reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              className="border-b border-gray-300 dark:border-gray-700 py-3 flex gap-3 items-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white font-bold">
                {rev.userName?.charAt(0) || "G"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{rev.userName}</p>
                  <div className="flex text-yellow-400">{[...Array(rev.rating || 5)].map((_, i) => <FaStar key={i} />)}</div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{rev.comment}</p>
                <p className="text-xs text-gray-400">{new Date(rev.date).toLocaleString()}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {user && (
          <form onSubmit={handleAddReview} className="mt-4 flex flex-col gap-2">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="border p-3 rounded w-full bg-gray-50 dark:bg-gray-800"
            />
            <motion.button type="submit" whileTap={{ scale: 0.95 }} className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 w-max">
              Add Review
            </motion.button>
          </form>
        )}
      </motion.div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <motion.div className="mt-12" variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-6">Related Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedBlogs.map((rb) => (
              <Link
                key={rb._id}
                to={`/blogs/${rb._id}`}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition transform hover:scale-105"
              >
                <img src={rb.image || "https://via.placeholder.com/300x150"} alt={rb.title} className="w-full h-36 md:h-40 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{rb.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rb.author?.fullName || "Admin"}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ViewDetails;
