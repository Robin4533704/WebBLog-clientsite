import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxios from "../hook/useAxios";

const AboutPage = () => {
  const { sendRequest } = useAxios();
  const [aboutData, setAboutData] = useState(null);

  // Fetch About info (from API)
  const fetchAbout = async () => {
    try {
      const res = await sendRequest("/about");
      setAboutData(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  if (!aboutData)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const { mission, vision, developer } = aboutData;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-gray-800">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-900">About Our Platform</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn about our mission, our vision, and the people who make this
          platform possible.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-blue-50 rounded-xl p-8 mb-10 shadow"
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">{mission}</p>
      </motion.div>

      {/* Vision Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-green-50 rounded-xl p-8 mb-10 shadow"
      >
        <h2 className="text-2xl font-semibold text-green-700 mb-3">Our Vision</h2>
        <p className="text-gray-700 leading-relaxed">{vision}</p>
      </motion.div>

      {/* Developer Info */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-50 rounded-xl p-8 text-center shadow"
      >
        <img
          src="/img/WhatsApp Image 2025-09-29 at 21.08.53_b8a6f99e.jpg" // নিজের প্রোফাইল ছবি দিতে পারো
          alt={developer.name}
          className="w-28 h-28 rounded-full mx-auto mb-4 shadow-lg object-cover"
        />
        <h3 className="text-xl font-semibold text-gray-800">{developer.name}</h3>
        <p className="text-gray-500 mb-2">{developer.role}</p>
        <div className="space-x-4">
          <a
            href={`mailto:${developer.email}`}
            className="text-blue-600 hover:underline"
          >
            {developer.email}
          </a>
          <a
            href={developer.github}
            className="text-gray-700 hover:text-black"
            target="_blank"
          >
            GitHub
          </a>
          <a
            href={developer.linkedin}
            className="text-blue-700 hover:underline"
            target="_blank"
          >
            LinkedIn
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
