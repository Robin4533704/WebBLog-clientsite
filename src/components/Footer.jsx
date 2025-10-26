import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAxios from "../hook/useAxios";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const { sendRequest, loading } = useAxios();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter an email address");
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    setIsSubmitting(true);
    try {
     const res = await sendRequest("/subscribers", {
  method: "POST",
  data: { email },  // <-- এখানে
  headers: { "Content-Type": "application/json" },
  skipToken: true
});

      if (res.success) {
        toast.success("🎉 Successfully subscribed to newsletter!");
        setEmail("");
      } else {
        toast.error(res.message || "Subscription failed. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error(err.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: FaFacebookF, href: "#", color: "hover:bg-blue-600", label: "Facebook" },
    { icon: FaInstagram, href: "#", color: "hover:bg-pink-600", label: "Instagram" },
    { icon: FaTwitter, href: "#", color: "hover:bg-blue-400", label: "Twitter" },
    { icon: FaLinkedinIn, href: "#", color: "hover:bg-blue-700", label: "LinkedIn" },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "Add Blog", path: "/add-blog" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Contact", path: "/contactpage" },
    { name: "About", path: "/about" },
  ];

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "FAQs", path: "/faq" },
    { name: "Community Guidelines", path: "/guidelines" },
    { name: "Support", path: "/support" },
  ];

  const contactInfo = [
    { icon: FaEnvelope, text: "support@bloghub.com", href: "mailto:support@bloghub.com" },
    { icon: FaPhone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: FaMapMarkerAlt, text: "123 Blog Street, Digital City", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-500/10"></div>
      </div>

      <ToastContainer 
        position="top-right" 
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section - Full width on mobile, 2 cols on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link to="/" className="inline-block mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
                  Blog<span className="text-amber-400">Hub</span>
                </span>
              </motion.div>
            </Link>
            
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base max-w-md">
              Join our vibrant community of writers and readers. Discover amazing stories, 
              share your thoughts, and connect with like-minded individuals from around the world.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors group text-sm"
                >
                  <item.icon className="text-amber-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>{item.text}</span>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.2, 
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 bg-gray-800 rounded-xl ${social.color} hover:shadow-lg transition-all duration-300 group`}
                >
                  <social.icon className="text-gray-400 group-hover:text-white transition-colors text-sm" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-all duration-300 group text-sm"
                  >
                    <FaArrowRight className="text-amber-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-all duration-300 group text-sm"
                  >
                    <FaArrowRight className="text-amber-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter - Full width on mobile, 2 cols on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaEnvelope className="text-amber-500" />
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Subscribe to our newsletter and never miss the latest blogs, updates, and community news.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 pr-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !email}
                  whileHover={{ scale: isSubmitting || !email ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting || !email ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe Now
                      <FaArrowRight className="text-sm" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                No spam ever. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} <span className="text-amber-400 font-semibold">BlogHub</span>. 
              All rights reserved. Crafted with ❤️ for the community.
            </div>
            
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-amber-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-amber-400 transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-amber-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;