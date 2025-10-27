import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaQuestionCircle, 
  FaHeadset, 
  FaShieldAlt, 
  FaRocket, 
  FaBook,
  FaUserFriends,
  FaCog,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaVideo,
  FaFileAlt,
  FaStar
} from "react-icons/fa";

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ Data
  const faqCategories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: FaRocket,
      color: "from-blue-500 to-cyan-500",
      faqs: [
        {
          question: "How do I create my first blog post?",
          answer: "To create your first blog post, click on the 'Write Blog' button in your dashboard. You can then add a title, content, images, and tags. Once you're done, click 'Publish' to make it live."
        },
        {
          question: "How do I customize my profile?",
          answer: "Go to your profile settings from the dashboard. You can upload a profile picture, update your bio, and customize your social media links there."
        },
        {
          question: "What are the blogging guidelines?",
          answer: "We encourage original content, proper attribution for images, and respectful communication. Please avoid spam, plagiarism, and inappropriate content."
        }
      ]
    },
    {
      id: "account",
      name: "Account & Settings",
      icon: FaCog,
      color: "from-purple-500 to-pink-500",
      faqs: [
        {
          question: "How do I reset my password?",
          answer: "Go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a password reset link."
        },
        {
          question: "Can I change my username?",
          answer: "Yes, you can change your username once every 30 days from your account settings. Keep in mind this will change your profile URL."
        },
        {
          question: "How do I delete my account?",
          answer: "You can delete your account from the privacy settings. Please note this action is permanent and will remove all your content."
        }
      ]
    },
    {
      id: "content",
      name: "Content Management",
      icon: FaBook,
      color: "from-green-500 to-emerald-500",
      faqs: [
        {
          question: "How do I format my blog posts?",
          answer: "We provide a rich text editor with formatting options like bold, italic, headings, lists, and code blocks. You can also embed images and videos."
        },
        {
          question: "Can I schedule posts for later?",
          answer: "Yes! When publishing, you can choose 'Schedule' instead of 'Publish Now' and select your desired date and time."
        },
        {
          question: "How do I add images to my posts?",
          answer: "Click the image icon in the editor to upload from your device or add from URL. We support JPG, PNG, and GIF formats."
        }
      ]
    },
    {
      id: "community",
      name: "Community",
      icon: FaUserFriends,
      color: "from-orange-500 to-amber-500",
      faqs: [
        {
          question: "How do I follow other bloggers?",
          answer: "Visit any user's profile and click the 'Follow' button. You'll see their latest posts in your feed."
        },
        {
          question: "Can I collaborate with other writers?",
          answer: "Yes! You can mention other users in your posts using @username, and co-authoring features are coming soon."
        },
        {
          question: "How do comments and likes work?",
          answer: "Readers can like and comment on your posts. You can moderate comments and receive notifications for interactions."
        }
      ]
    }
  ];

  // Help Resources
  const helpResources = [
    {
      icon: FaFileAlt,
      title: "Documentation",
      description: "Complete guides and API documentation",
      link: "/docs",
      color: "bg-blue-500"
    },
    {
      icon: FaVideo,
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      link: "/tutorials",
      color: "bg-purple-500"
    },
    {
      icon: FaComments,
      title: "Community Forum",
      description: "Get help from other users",
      link: "/community",
      color: "bg-green-500"
    },
    {
      icon: FaBook,
      title: "Blogging Guide",
      description: "Best practices for writers",
      link: "/blogging-guide",
      color: "bg-orange-500"
    }
  ];

  // Support Options
  const supportOptions = [
    {
      icon: FaEnvelope,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@bloghub.com",
      action: "mailto:support@bloghub.com"
    },
    {
      icon: FaPhone,
      title: "Live Chat",
      description: "Instant help from our support team",
      contact: "Available 9AM-6PM EST",
      action: "/live-chat"
    },
    {
      icon: FaComments,
      title: "Community Help",
      description: "Ask questions to our community",
      contact: "500+ active helpers",
      action: "/community"
    }
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqCategories.flatMap(category => 
    category.faqs.filter(faq => 
      (activeCategory === "all" || category.id === activeCategory) &&
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
       faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    ).map(faq => ({ ...faq, category: category.name }))
  );

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/25"
          >
            <FaQuestionCircle className="text-3xl text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions, browse documentation, or get in touch with our support team.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:text-white transition-all duration-300 shadow-lg"
            />
          </div>
        </motion.div>

        {/* Quick Help Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {helpResources.map((resource, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <Link to={resource.link} className="block">
                <div className={`w-12 h-12 ${resource.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <resource.icon className="text-xl text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 mt-4 text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <FaArrowRight className="text-xs" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3 mb-8 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-gray-200 dark:border-gray-700"
              }`}
            >
              All Questions
            </motion.button>
            {faqCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r text-white shadow-lg shadow-amber-500/25"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-gray-200 dark:border-gray-700"
                } ${activeCategory === category.id ? category.color : ''}`}
              >
                <category.icon className="text-sm" />
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                        {faq.question}
                      </h3>
                      <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-amber-500"
                    >
                      {openFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Was this helpful?
                            </span>
                            <button className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-300">
                              Yes
                            </button>
                            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300">
                              No
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms or browse the categories above.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-4xl mx-auto mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Our support team is here to assist you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center group cursor-pointer"
              >
                <Link to={option.action} className="block">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <option.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {option.description}
                  </p>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold">
                    {option.contact}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4 text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all duration-300">
                    <span className="text-sm font-semibold">Contact now</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-8 text-white shadow-2xl shadow-amber-500/25">
            <h3 className="text-2xl font-bold mb-4">
              Ready to start your blogging journey?
            </h3>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Join thousands of writers who are already sharing their stories on BlogHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Get Started Free
                </motion.button>
              </Link>
              <Link to="/contactpage">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-amber-600 transition-all duration-300"
                >
                  Contact Sales
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenter;