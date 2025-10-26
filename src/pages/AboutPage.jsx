import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Page Header */}
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-600"
        >
          About Our Blog Platform
        </motion.h1>

        {/* Mission & Vision Container */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all"
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">🌟 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We aim to create a modern blogging platform where users can share,
              explore, and interact with content seamlessly. Our mission is to
              empower writers and readers alike, fostering a community of
              creativity, knowledge, and engagement.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all"
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">🚀 Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              Our vision is to become the go-to platform for bloggers and readers,
              connecting ideas and stories globally. We focus on accessibility,
              responsiveness, and interactivity to create a rich blogging experience.
            </p>
          </motion.div>
        </div>

        {/* Developer / Creator Info */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all"
        >
          <h2 className="text-2xl font-semibold mb-6 text-blue-500">👨‍💻 Developer Info</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <motion.img
              src="/img/WhatsApp Image 2024-12-24 at 12.33.16_6bba692d.jpg"
              alt="Developer"
              className="w-32 h-32 rounded-full object-cover shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Robin Hossen</h3>
              <p className="text-gray-600">Full-Stack Web Developer</p>
              <p className="text-gray-700 leading-relaxed">
                I'm Robin, a passionate web developer who loves building responsive
                and interactive blogging platforms. Using React, Tailwind, Node.js,
                and MongoDB, I aim to create experiences that connect content creators
                and readers efficiently and beautifully.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <a
                  href="https://github.com/robin4533704"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  🐙 GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/hossain-robin-408a21339/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  🔗 LinkedIn
                </a>
                <a
                  href="mailto:robinhossen8428@gmail.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  📧 Email
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Blog Features / Highlights */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: "✍️",
              title: "Write & Share",
              desc: "Easily create blogs with rich text, images, and formatting tools."
            },
            {
              icon: "💬",
              title: "Engage Readers",
              desc: "Comments, likes, and sharing make your content interactive."
            },
            {
              icon: "📊",
              title: "Analytics",
              desc: "Track your blog’s performance and audience engagement in real-time."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all text-center"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold text-lg mb-2 text-blue-500">{feature.title}</h4>
              <p className="text-gray-700 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.section>

      </div>
    </div>
  );
};

export default About;
