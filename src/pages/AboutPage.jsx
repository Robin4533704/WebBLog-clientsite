import React from "react";
import { motion } from "framer-motion";
import { 
  FaRocket, 
  FaUsers, 
  FaLightbulb, 
  FaCode, 
  FaLinkedin, 
  FaGithub, 
  FaEnvelope,
  FaMobile,
  FaPalette,
  FaHeart,
  FaLock,
  FaStar,
  FaGlobeAmericas,
  FaBolt
} from "react-icons/fa";

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <FaCode className="text-3xl" />,
      title: "Modern Tech Stack",
      description: "Built with React, Tailwind CSS, Node.js, and MongoDB for optimal performance and scalability."
    },
    {
      icon: <FaMobile className="text-3xl" />,
      title: "Fully Responsive",
      description: "Seamless experience across all devices - desktop, tablet, and mobile."
    },
    {
      icon: <FaPalette className="text-3xl" />,
      title: "Beautiful UI/UX",
      description: "Clean, modern design with smooth animations and intuitive user interface."
    },
    {
      icon: <FaLock className="text-3xl" />,
      title: "Secure Platform",
      description: "Advanced security features including authentication and data protection."
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Community Driven",
      description: "Connect with writers and readers worldwide in a vibrant community."
    },
    {
      icon: <FaBolt className="text-3xl" />,
      title: "High Performance",
      description: "Lightning-fast loading times and optimized for the best user experience."
    }
  ];

  const stats = [
    { number: "10K+", label: "Blogs Published" },
    { number: "50K+", label: "Active Readers" },
    { number: "1K+", label: "Writers" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              About BlogHub
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Empowering writers and readers through a modern, intuitive, and feature-rich blogging platform that connects ideas and inspires creativity worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <FaLightbulb className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                To create a revolutionary blogging platform where creativity meets technology. 
                We empower writers to share their stories and readers to discover inspiring content 
                in a seamless, engaging, and beautiful environment that fosters meaningful connections.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <FaRocket className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                To become the world's most trusted and innovative blogging platform, 
                connecting millions of writers and readers through cutting-edge technology, 
                exceptional user experience, and a commitment to fostering creative expression 
                and knowledge sharing across the globe.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BlogHub?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of blogging with features designed for modern creators and readers.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Developer Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex-shrink-0"
              >
                <img
                  src="/img/WhatsApp Image 2024-12-24 at 12.33.16_6bba692d.jpg"
                  alt="Robin Hossen"
                  className="w-48 h-48 rounded-2xl object-cover shadow-2xl border-4 border-white/20"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
                  }}
                />
              </motion.div>

              {/* Developer Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                  <FaCode className="text-sm" />
                  <span className="text-sm font-semibold">Full-Stack Developer</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Robin Hossen
                </h2>
                
                <p className="text-lg text-blue-100 leading-relaxed mb-6 max-w-2xl">
                  Passionate about creating digital experiences that make a difference. 
                  With expertise in modern web technologies, I specialize in building 
                  scalable, user-friendly applications that solve real-world problems 
                  and deliver exceptional value to users.
                </p>

                {/* Social Links */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <motion.a
                    href="https://github.com/robin4533704"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-6 py-3 transition-all duration-300 backdrop-blur-sm"
                  >
                    <FaGithub />
                    <span>GitHub</span>
                  </motion.a>
                  
                  <motion.a
                    href="https://www.linkedin.com/in/hossain-robin-408a21339/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-6 py-3 transition-all duration-300 backdrop-blur-sm"
                  >
                    <FaLinkedin />
                    <span>LinkedIn</span>
                  </motion.a>
                  
                  <motion.a
                    href="mailto:robinhossen8428@gmail.com"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-6 py-3 transition-all duration-300 backdrop-blur-sm"
                  >
                    <FaEnvelope />
                    <span>Email</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-12 text-white shadow-2xl"
          >
            <FaHeart className="text-4xl mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Blogging Journey?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Join thousands of writers and readers who are already sharing their stories and discovering amazing content on BlogHub.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-amber-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;