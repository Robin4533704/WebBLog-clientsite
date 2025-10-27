import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaBlog,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeadset,
  FaQuestionCircle,
  FaShieldAlt,
  FaRocket
} from "react-icons/fa";
import useAxios from "../hook/useAxios"; // Make sure this exists

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { sendRequest } = useAxios();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter an email address");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Please enter a valid email address");

    setIsSubmitting(true);
    try {
      const res = await sendRequest("/subscribers", {
        method: "POST",
        data: { email },
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

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "Blogs", path: "/blogs" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contactpage" }
      ]
    },
    {
      title: "Help Center",
      links: [
        { name: "FAQ", path: "/help/faq" },
        { name: "Support", path: "/help/support" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Community Guidelines", path: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", path: "#" },
        { name: "Tutorials", path: "/tutorials" },
        { name: "Blog Guidelines", path: "#" },
        { name: "API", path: "#" },
        { name: "Sitemap", path: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, url: "https://facebook.com", color: "hover:text-blue-600" },
    { icon: FaTwitter, url: "https://twitter.com", color: "hover:text-blue-400" },
    { icon: FaInstagram, url: "https://instagram.com", color: "hover:text-pink-500" },
    { icon: FaLinkedin, url: "https://linkedin.com", color: "hover:text-blue-700" },
    { icon: FaGithub, url: "https://github.com", color: "hover:text-gray-700 dark:hover:text-gray-300" }
  ];

  const helpFeatures = [
    {
      icon: FaQuestionCircle,
      title: "FAQ",
      description: "Find answers to common questions",
      path: "/help/faq"
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Get help anytime, anywhere",
      path: "/help/support"
    },
    {
      icon: FaShieldAlt,
      title: "Privacy & Security",
      description: "Your data is safe with us",
      path: "/privacy"
    },
    {
      icon: FaRocket,
      title: "Quick Start",
      description: "Begin your blogging journey",
      path: "/tutorials"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Help Features */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {helpFeatures.map((feature, i) => (
            <motion.div key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 group cursor-pointer"
            >
              <Link to={feature.path} className="block">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-xl text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand & Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <Link to="/" className="inline-block">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                  <FaBlog className="text-3xl text-amber-400" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  Blog<span className="text-amber-400">Hub</span>
                </span>
              </motion.div>
            </Link>

            <p className="text-gray-300 leading-relaxed max-w-md">
              Join thousands of writers and readers on BlogHub - the ultimate platform for sharing ideas, stories, and knowledge.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors duration-300">
                <FaEnvelope className="text-amber-400" /> support@bloghub.com
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors duration-300">
                <FaPhone className="text-amber-400" /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors duration-300">
                <FaMapMarkerAlt className="text-amber-400" /> 123 Blog Street, Digital City
              </div>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <motion.a key={i} href={social.url} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}
                  className={`p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 ${social.color} transition-all duration-300 hover:bg-amber-500 hover:border-amber-400 group`}
                >
                  <social.icon className="text-xl text-white group-hover:text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {footerSections.map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="font-bold text-lg text-amber-400 mb-4 border-l-4 border-amber-400 pl-3">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <motion.li key={j} whileHover={{ x: 5 }}>
                      <Link to={link.path} className="text-gray-300 hover:text-amber-400 transition-all duration-300 flex items-center gap-2 group">
                        <motion.span className="w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100" animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.3 }} />
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-lg rounded-2xl p-8 border border-amber-400/30 mb-12">
          <form onSubmit={handleSubscribe} className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-amber-100">Subscribe to our newsletter for the latest updates, tips, and blog posts.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-amber-400 transition-colors duration-300 flex-1 min-w-64" />
              <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 whitespace-nowrap">
                {isSubmitting ? "Submitting..." : "Subscribe"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© {currentYear} BlogHub. All rights reserved. Made with ❤️ for the blogging community.</p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-amber-400 transition-colors duration-300">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-amber-400 transition-colors duration-300">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-amber-400 transition-colors duration-300">Cookie Policy</Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Help Button */}
      <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="fixed bottom-6 right-6 z-40">
        <motion.div whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} className="relative group">
          <Link to="/helpcenter" className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-all duration-300">
            <FaHeadset className="text-xl text-white" />
          </Link>
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl border border-gray-700">
            Need Help?
            <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
