import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAxios from "../hook/useAxios";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const { sendRequest, loading } = useAxios();
  const [email, setEmail] = useState("");

const handleSubscribe = async (e) => {
  e.preventDefault();

  if (!email) return toast.error("Please enter an email");

  try {
    const res = await sendRequest("/subscribers", {
  method: "POST",
  body: { email },
  skipToken: true, 
});

    if (res.success) {
      toast.success(res.message);
      setEmail("");
    } else {
      toast.error(res.message || "Subscription failed");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Subscription failed");
  }
};

  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 px-6 md:px-12 lg:px-20">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-white mb-3">Blog<span className="text-amber-400">Hub</span></h2>
          <p className="text-sm leading-relaxed mb-4">
            Explore, create and share amazing blogs. Join our community of writers & readers.
          </p>
          <div className="flex gap-3 mt-4">
            {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
              <motion.a key={idx} href="#" whileHover={{ scale: 1.2, backgroundColor: "#f59e0b" }} className="p-2 bg-gray-800 rounded-full transition-colors">
                <Icon />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
            <li><Link to="/blogs" className="hover:text-amber-400 transition">Blogs</Link></li>
            <li><Link to="/add-blog" className="hover:text-amber-400 transition">Add Blog</Link></li>
            <li><Link to="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
          </ul>
        </motion.div>

        {/* Support */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="hover:text-amber-400 transition">Help Center</Link></li>
            <li><Link to="/privacy" className="hover:text-amber-400 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-amber-400 transition">Terms & Conditions</Link></li>
            <li><Link to="/faq" className="hover:text-amber-400 transition">FAQs</Link></li>
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-md mx-auto p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200 mb-3 text-center">Subscribe to our Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600" disabled={loading}>
              {loading ? "Submitting..." : "Subscribe"}
            </button>
          </form>
        </motion.div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-amber-400">BlogHub</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
