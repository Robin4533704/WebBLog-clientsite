import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaQuestionCircle, 
  FaChevronDown, 
  FaChevronUp,
  FaRocket,
  FaUser,
  FaCog,
  FaBook,
  FaUsers,
  FaShieldAlt,
  FaFileAlt,
  FaCreditCard,
  FaMobile,
  FaGlobe,
  FaStar,
  FaThumbsUp,
  FaThumbsDown
} from "react-icons/fa";

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [helpfulFeedback, setHelpfulFeedback] = useState({});

  // FAQ Categories with Icons and Colors
  const faqCategories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: FaRocket,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500",
      description: "Begin your blogging journey"
    },
    {
      id: "account",
      name: "Account & Profile",
      icon: FaUser,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500",
      description: "Manage your account settings"
    },
    {
      id: "writing",
      name: "Writing & Content",
      icon: FaBook,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500",
      description: "Create and manage your blogs"
    },
    {
      id: "community",
      name: "Community",
      icon: FaUsers,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500",
      description: "Connect with other writers"
    },
    {
      id: "technical",
      name: "Technical Issues",
      icon: FaCog,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-500",
      description: "Troubleshoot problems"
    },
    {
      id: "billing",
      name: "Billing & Plans",
      icon: FaCreditCard,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-500",
      description: "Payment and subscription info"
    }
  ];

  // Comprehensive FAQ Data
  const allFaqs = [
    // Getting Started FAQs
    {
      id: 1,
      question: "How do I create my first blog post?",
      answer: "Creating your first blog post is easy! Follow these steps:\n\n1. Click the 'Write Blog' button in your dashboard\n2. Add a compelling title that grabs attention\n3. Use our rich text editor to write your content\n4. Format text with headings, lists, and emphasis\n5. Add relevant images or embed videos\n6. Choose appropriate tags for better discovery\n7. Preview your post before publishing\n8. Click 'Publish' to make it live instantly!",
      category: "getting-started",
      popularity: 95
    },
    {
      id: 2,
      question: "What should I write about in my first blog?",
      answer: "Great question! Here are some ideas for your first blog:\n\n• Share your personal experiences or journey\n• Write about something you're passionate about\n• Create a tutorial or how-to guide\n• Review a product, book, or service\n• Share industry insights or professional tips\n• Tell a personal story with lessons learned\n\nRemember, authenticity resonates best with readers!",
      category: "getting-started",
      popularity: 88
    },
    {
      id: 3,
      question: "How can I customize my blog's appearance?",
      answer: "You can customize your blog's look in several ways:\n\n🎨 Profile Customization:\n- Upload profile picture and cover image\n- Write a compelling bio\n- Add social media links\n- Choose accent colors\n\n📝 Blog Post Styling:\n- Use different font styles and sizes\n- Add custom CSS (premium feature)\n- Choose from various formatting options\n- Add custom headers and footers\n\nVisit Settings → Appearance to explore all options!",
      category: "getting-started",
      popularity: 82
    },

    // Account & Profile FAQs
    {
      id: 4,
      question: "How do I reset my password?",
      answer: "To reset your password:\n\n1. Go to the login page\n2. Click 'Forgot Password' below the login form\n3. Enter your registered email address\n4. Check your inbox for the password reset link\n5. Click the link and create your new password\n6. Login with your new credentials\n\nIf you don't receive the email within 5 minutes, check your spam folder or contact support.",
      category: "account",
      popularity: 92
    },
    {
      id: 5,
      question: "Can I change my username?",
      answer: "Yes, you can change your username, but with some considerations:\n\n✅ You can change it once every 30 days\n✅ Your profile URL will update automatically\n✅ Existing links to your profile will redirect\n❌ You cannot use a username that's already taken\n❌ Special characters are not allowed (only letters, numbers, underscores)\n\nTo change: Settings → Account → Username",
      category: "account",
      popularity: 76
    },
    {
      id: 6,
      question: "How do I delete my account?",
      answer: "We're sorry to see you go! To delete your account:\n\n1. Go to Settings → Privacy & Security\n2. Scroll to 'Account Management'\n3. Click 'Delete Account'\n4. Read the important information about data deletion\n5. Enter your password to confirm\n6. Click 'Permanently Delete Account'\n\n⚠️ Important: This action is irreversible! All your blogs, comments, and data will be permanently deleted.",
      category: "account",
      popularity: 68
    },

    // Writing & Content FAQs
    {
      id: 7,
      question: "How do I format my blog posts?",
      answer: "Our rich text editor offers comprehensive formatting:\n\n📋 Text Formatting:\n- Bold, italic, underline, and strikethrough\n- Headings (H1, H2, H3)\n- Bullet points and numbered lists\n- Text alignment and indentation\n\n🎨 Advanced Features:\n- Code blocks with syntax highlighting\n- Blockquotes for citations\n- Tables for organized data\n- Custom dividers and spacers\n- Emoji support 😊\n\n💡 Pro Tip: Use headings to structure your content for better readability!",
      category: "writing",
      popularity: 89
    },
    {
      id: 8,
      question: "Can I schedule posts for later publication?",
      answer: "Absolutely! Scheduling posts is a powerful feature:\n\n📅 How to schedule:\n1. Write your blog post as usual\n2. Instead of 'Publish Now', click 'Schedule'\n3. Choose your desired date and time\n4. Click 'Confirm Schedule'\n\n✨ Benefits:\n- Maintain consistent posting schedule\n- Write in batches and schedule for optimal times\n- Never miss posting during busy periods\n- Perfect for time-sensitive content\n\nScheduled posts can be edited or canceled anytime before publication.",
      category: "writing",
      popularity: 85
    },
    {
      id: 9,
      question: "What image formats and sizes are supported?",
      answer: "We support various image formats with optimized handling:\n\n🖼️ Supported Formats:\n- JPEG/JPG (recommended for photos)\n- PNG (recommended for graphics with transparency)\n- GIF (animated and static)\n- WebP (modern format with better compression)\n\n📏 Recommended Sizes:\n- Profile picture: 500x500 pixels (1:1 ratio)\n- Cover image: 1500x500 pixels (3:1 ratio)\n- Blog images: 1200x630 pixels (optimal for sharing)\n\n⚡ Automatic Optimization:\n- Images are automatically compressed\n- Multiple sizes generated for different devices\n- Lazy loading for faster page speeds",
      category: "writing",
      popularity: 79
    },

    // Community FAQs
    {
      id: 10,
      question: "How do I follow other bloggers?",
      answer: "Connecting with other bloggers is easy and rewarding:\n\n👥 Following Users:\n1. Visit any user's profile page\n2. Click the 'Follow' button\n3. You'll now see their posts in your feed\n4. Receive notifications for their new content\n\n🔔 Engagement Features:\n- Like and comment on posts\n- Share interesting blogs\n- Send private messages (mutual follow required)\n- Create reading lists from favorite blogs\n\n💫 Community Benefits:\n- Discover new content and ideas\n- Build your network\n- Get inspiration for your own writing\n- Receive feedback and support",
      category: "community",
      popularity: 83
    },
    {
      id: 11,
      question: "How do comments and moderation work?",
      answer: "Our comment system is designed for healthy discussions:\n\n💬 Comment Features:\n- Reply to specific comments\n- Like helpful comments\n- Report inappropriate content\n- Edit your own comments within 15 minutes\n\n🛡️ Moderation Tools:\n- Approve comments before they appear\n- Block specific users from commenting\n- Set keyword filters for automatic moderation\n- Receive notifications for new comments\n\n📜 Community Guidelines:\n- Be respectful and constructive\n- No spam or self-promotion\n- Keep discussions relevant\n- Help maintain a positive environment",
      category: "community",
      popularity: 77
    },

    // Technical Issues FAQs
    {
      id: 12,
      question: "The website is loading slowly. What can I do?",
      answer: "If you're experiencing slow performance, try these solutions:\n\n🔧 Quick Fixes:\n1. Refresh the page (Ctrl + F5 for hard refresh)\n2. Clear your browser cache and cookies\n3. Try a different web browser\n4. Check your internet connection\n5. Disable browser extensions temporarily\n\n📱 Mobile Issues:\n- Update your app to the latest version\n- Clear app cache from settings\n- Ensure sufficient storage space\n- Restart your device\n\n🌐 Still having issues?\n- Contact our support team with details\n- Include your browser and device information\n- Let us know what you were trying to do",
      category: "technical",
      popularity: 91
    },
    {
      id: 13,
      question: "I'm having trouble uploading images. What's wrong?",
      answer: "Image upload issues can have several causes:\n\n📄 Common Solutions:\n• Check file size (max 10MB per image)\n• Verify supported formats (JPG, PNG, GIF, WebP)\n• Ensure stable internet connection\n• Try a different browser\n• Clear browser cache\n\n🖥️ Technical Checks:\n- Disable ad-blockers for our site\n- Check browser console for errors (F12)\n- Try incognito/private browsing mode\n- Update your browser to latest version\n\n🚀 Pro Tips:\n- Compress large images before uploading\n- Use WebP format for better compression\n- Upload during off-peak hours if possible",
      category: "technical",
      popularity: 74
    },

    // Billing & Plans FAQs
    {
      id: 14,
      question: "What are the differences between free and premium plans?",
      answer: "Here's what each plan offers:\n\n🎯 Free Plan (Always Free):\n- Up to 10 blog posts\n- Basic formatting options\n- Standard community features\n- 1GB storage for images\n- Basic analytics\n\n⭐ Premium Plan ($9.99/month):\n- Unlimited blog posts\n- Advanced formatting and custom CSS\n- Priority support\n- 10GB storage space\n- Advanced analytics and insights\n- Custom domain support\n- Ad-free experience\n- Early access to new features\n\n💎 Pro Plan ($19.99/month):\n- Everything in Premium plus:\n- 50GB storage\n- Team collaboration features\n- White-label options\n- API access\n- Dedicated account manager",
      category: "billing",
      popularity: 87
    },
    {
      id: 15,
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime:\n\n📝 Cancellation Steps:\n1. Go to Settings → Billing & Subscription\n2. Click 'Manage Subscription'\n3. Select 'Cancel Subscription'\n4. Choose your reason for cancellation\n5. Confirm cancellation\n\n💡 Important Notes:\n- You'll retain premium features until the end of your billing period\n- No partial refunds for unused time\n- You can resubscribe anytime\n- All your content remains intact\n\nWe'd love to know why you're leaving! Your feedback helps us improve.",
      category: "billing",
      popularity: 72
    }
  ];

  // Filter FAQs based on active category and search query
  const filteredFaqs = allFaqs.filter(faq => 
    (activeCategory === "all" || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleFaq = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const handleHelpfulFeedback = (faqId, isHelpful) => {
    setHelpfulFeedback(prev => ({
      ...prev,
      [faqId]: isHelpful
    }));
  };

  const getCategoryFaqs = (categoryId) => {
    return allFaqs.filter(faq => faq.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Find quick answers to common questions about BlogHub. Can't find what you're looking for? 
            <a href="/contactpagepage" className="text-amber-600 dark:text-amber-400 hover:underline ml-1">
              Contact our support team.
            </a>
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search questions... (e.g., 'password reset', 'image upload')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:text-white transition-all duration-300 shadow-lg"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === "all"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <FaQuestionCircle className="text-sm" />
              All Questions ({allFaqs.length})
            </motion.button>
            
            {faqCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-gray-200 dark:border-gray-700"
                } ${activeCategory === category.id ? category.color : ''}`}
              >
                <category.icon className="text-sm" />
                <div className="text-left">
                  <div>{category.name}</div>
                  <div className="text-xs opacity-80 font-normal">
                    {getCategoryFaqs(category.id)} questions
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 group"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          faqCategories.find(cat => cat.id === faq.category)?.bgColor
                        } bg-opacity-10`}>
                          {faqCategories.find(cat => cat.id === faq.category)?.icon && 
                            React.createElement(faqCategories.find(cat => cat.id === faq.category).icon, {
                              className: `text-lg ${
                                faqCategories.find(cat => cat.id === faq.category)?.bgColor.replace('bg-', 'text-')
                              }`
                            })
                          }
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaStar className="text-amber-400" />
                          {faq.popularity}% helpful
                        </span>
                        <span className="capitalize">{faq.category.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-amber-500 flex-shrink-0"
                    >
                      {openFaq === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="px-6 pb-4 pt-4">
                          <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>
                          
                          {/* Feedback Section */}
                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Was this answer helpful?
                              </span>
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleHelpfulFeedback(faq.id, true)}
                                  className={`p-2 rounded-lg transition-all duration-300 ${
                                    helpfulFeedback[faq.id] === true
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                  }`}
                                >
                                  <FaThumbsUp className="text-sm" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleHelpfulFeedback(faq.id, false)}
                                  className={`p-2 rounded-lg transition-all duration-300 ${
                                    helpfulFeedback[faq.id] === false
                                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  }`}
                                >
                                  <FaThumbsDown className="text-sm" />
                                </motion.button>
                              </div>
                            </div>
                            
                            {helpfulFeedback[faq.id] !== undefined && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-amber-600 dark:text-amber-400"
                              >
                                Thank you for your feedback! {
                                  helpfulFeedback[faq.id] 
                                    ? "We're glad this was helpful!" 
                                    : "We'll use this to improve our answers."
                                }
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
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
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                We couldn't find any questions matching your search.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors duration-300"
                >
                  Clear Search
                </button>
                <a
                  href="/contactpagepage"
                  className="px-6 py-3 border border-amber-500 text-amber-500 font-semibold rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-300"
                >
                  Contact Support
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-8 text-white shadow-2xl shadow-amber-500/25">
            <h3 className="text-2xl font-bold mb-4">
              Still need help?
            </h3>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contactpagepage"
                className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Contact Support
              </a>
              <a
                href="/live-chat"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-amber-600 transition-all duration-300"
              >
                Live Chat
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;