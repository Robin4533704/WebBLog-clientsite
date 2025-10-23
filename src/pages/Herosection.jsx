import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundImage from "../assets/image/online-blog.jpg"; // আপনার banner image path

const HeroSection = () => {
  return (
    <section
      className="relative w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay text */}
      <div className="text-center px-4 md:px-0">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Our Blog
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-200 mb-6 drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Explore articles, tutorials, and latest trends in tech & lifestyle
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            to="/blogs"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Explore Blogs
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
