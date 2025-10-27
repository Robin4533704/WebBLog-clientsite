import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaClosedCaptioning,
  FaDownload,
  FaShare,
  FaHeart,
  FaBookmark,
  FaClock,
  FaUser,
  FaEye,
  FaStar,
  FaCode,
  FaImage,
  FaEdit,
  FaRocket,
  FaMobile,
  FaDesktop,
  FaPalette,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

const Tutorials = () => {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const tutorialCategories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: FaRocket,
      color: "from-blue-500 to-cyan-500",
      description: "Begin your blogging journey with these essential tutorials"
    },
    {
      id: "writing",
      name: "Writing & Editing",
      icon: FaEdit,
      color: "from-green-500 to-emerald-500",
      description: "Master the art of creating compelling content"
    },
    {
      id: "design",
      name: "Design & Formatting",
      icon: FaPalette,
      color: "from-purple-500 to-pink-500",
      description: "Make your blogs visually stunning and engaging"
    },
    {
      id: "seo",
      name: "SEO & Analytics",
      icon: FaChartLine,
      color: "from-orange-500 to-amber-500",
      description: "Optimize your content for maximum visibility"
    },
    {
      id: "community",
      name: "Community & Growth",
      icon: FaUsers,
      color: "from-red-500 to-rose-500",
      description: "Build your audience and engage with readers"
    },
    {
      id: "advanced",
      name: "Advanced Features",
      icon: FaCode,
      color: "from-indigo-500 to-blue-500",
      description: "Unlock powerful features for experienced bloggers"
    }
  ];

  const tutorials = [
    // Getting Started Tutorials
    {
      id: 1,
      title: "Welcome to BlogHub - Platform Overview",
      description: "Get familiar with BlogHub's interface and core features. Learn how to navigate the dashboard and access key tools.",
      duration: "8:15",
      level: "Beginner",
      views: "12.5K",
      likes: "1.2K",
      instructor: "Sarah Johnson",
      category: "getting-started",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "Platform cheat sheet PDF",
        "Keyboard shortcuts guide",
        "Feature checklist"
      ]
    },
    {
      id: 2,
      title: "Creating Your First Blog Post",
      description: "Step-by-step guide to writing and publishing your very first blog post on BlogHub.",
      duration: "15:30",
      level: "Beginner",
      views: "8.7K",
      likes: "890",
      instructor: "Mike Chen",
      category: "getting-started",
      thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "Blog post template",
        "Writing prompts",
        "Editor guide"
      ]
    },
    {
      id: 3,
      title: "Setting Up Your Profile",
      description: "Learn how to create an engaging profile that attracts readers and builds your personal brand.",
      duration: "12:45",
      level: "Beginner",
      views: "6.3K",
      likes: "654",
      instructor: "Emily Davis",
      category: "getting-started",
      thumbnail: "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "Profile optimization checklist",
        "Bio writing tips",
        "Social media integration guide"
      ]
    },

    // Writing & Editing Tutorials
    {
      id: 4,
      title: "Mastering the Rich Text Editor",
      description: "Deep dive into all formatting options, shortcuts, and advanced editing features.",
      duration: "22:10",
      level: "Intermediate",
      views: "15.2K",
      likes: "1.8K",
      instructor: "David Park",
      category: "writing",
      thumbnail: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "Editor keyboard shortcuts",
        "Formatting best practices",
        "Troubleshooting guide"
      ]
    },
    {
      id: 5,
      title: "Writing Engaging Introductions",
      description: "Learn techniques to hook readers from the very first sentence and keep them engaged.",
      duration: "18:25",
      level: "Intermediate",
      views: "9.8K",
      likes: "1.1K",
      instructor: "Lisa Wang",
      category: "writing",
      thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "Introduction templates",
        "Hook examples library",
        "Reader psychology guide"
      ]
    },

    // Design & Formatting Tutorials
    {
      id: 6,
      title: "Creating Visually Stunning Blogs",
      description: "Learn how to use images, layouts, and design elements to enhance your content.",
      duration: "25:40",
      level: "Intermediate",
      views: "11.3K",
      likes: "1.4K",
      instructor: "Alex Rivera",
      category: "design",
      thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "Image optimization guide",
        "Color scheme templates",
        "Layout best practices"
      ]
    },
    {
      id: 7,
      title: "Advanced Formatting Techniques",
      description: "Master tables, code blocks, custom CSS, and other advanced formatting options.",
      duration: "30:15",
      level: "Advanced",
      views: "7.2K",
      likes: "920",
      instructor: "Brian Thompson",
      category: "design",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "CSS snippets library",
        "Table design templates",
        "Code formatting guide"
      ]
    },

    // SEO & Analytics Tutorials
    {
      id: 8,
      title: "SEO Basics for Bloggers",
      description: "Learn fundamental SEO techniques to improve your blog's search engine visibility.",
      duration: "28:50",
      level: "Intermediate",
      views: "14.7K",
      likes: "1.6K",
      instructor: "Maria Gonzalez",
      category: "seo",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "SEO checklist",
        "Keyword research template",
        "Meta description guide"
      ]
    },

    // Community & Growth Tutorials
    {
      id: 9,
      title: "Building Your Reader Community",
      description: "Strategies to grow your audience and create an engaged community around your content.",
      duration: "32:20",
      level: "Intermediate",
      views: "10.1K",
      likes: "1.3K",
      instructor: "Kevin Wilson",
      category: "community",
      thumbnail: "https://images.unsplash.com/photo-1551836026-d5c2e0c49b13?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "Community engagement plan",
        "Newsletter templates",
        "Social media strategy guide"
      ]
    },

    // Advanced Features Tutorials
    {
      id: 10,
      title: "Custom Domains and Branding",
      description: "Learn how to set up custom domains and create a professional brand presence.",
      duration: "35:45",
      level: "Advanced",
      views: "5.8K",
      likes: "780",
      instructor: "Rachel Lee",
      category: "advanced",
      thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=225&fit=crop",
      videoUrl: "#",
      resources: [
        "Domain setup checklist",
        "Branding guidelines template",
        "Customization options guide"
      ]
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => 
    activeCategory === "all" || tutorial.category === activeCategory
  );

  const handleTutorialSelect = (tutorial) => {
    setSelectedTutorial(tutorial);
    setIsPlaying(true);
    setVideoProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <FaRocket className="text-3xl text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            BlogHub Tutorials
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Master BlogHub with our comprehensive video tutorials. From beginner basics to advanced features, we've got you covered.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search tutorials... (e.g., 'formatting', 'SEO', 'analytics')"
                className="w-full pl-4 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:text-white transition-all duration-300 shadow-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaPlay className="text-lg" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-3 justify-center">
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
                All Tutorials
              </motion.button>
              {tutorialCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r text-white shadow-lg`
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-gray-200 dark:border-gray-700"
                  } ${activeCategory === category.id ? category.color : ''}`}
                >
                  <category.icon className="text-sm" />
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tutorials List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTutorials.map((tutorial, index) => (
                  <motion.div
                    key={tutorial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleTutorialSelect(tutorial)}
                  >
                    {/* Thumbnail */}
                    <div className="relative">
                      <img
                        src={tutorial.thumbnail}
                        alt={tutorial.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <FaPlay className="text-amber-500 text-xl ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-lg">
                        {tutorial.duration}
                      </div>
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                        {tutorial.level}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                        {tutorial.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {tutorial.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <FaUser className="text-xs" />
                            <span>{tutorial.instructor}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaEye className="text-xs" />
                            <span>{tutorial.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaHeart className="text-red-500 text-xs" />
                          <span>{tutorial.likes}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Video Player Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
                {selectedTutorial ? (
                  <>
                    {/* Video Player */}
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={togglePlay}>
                            {isPlaying ? (
                              <FaPause className="text-white text-xl" />
                            ) : (
                              <FaPlay className="text-white text-xl ml-1" />
                            )}
                          </div>
                          <p className="text-white text-sm">Video Player</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="h-1 bg-gray-600">
                          <div 
                            className="h-full bg-amber-500 transition-all duration-300"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                        {selectedTutorial.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <FaClock className="text-xs" />
                          <span>{selectedTutorial.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaUser className="text-xs" />
                          <span>{selectedTutorial.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-amber-400 text-xs" />
                          <span>{selectedTutorial.level}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {selectedTutorial.description}
                      </p>

                      {/* Video Controls */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button onClick={togglePlay} className="p-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors duration-300">
                            {isPlaying ? <FaPause /> : <FaPlay />}
                          </button>
                          <div className="flex items-center gap-1">
                            <button onClick={toggleMute} className="p-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors duration-300">
                              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="w-20 accent-amber-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors duration-300">
                            <FaClosedCaptioning />
                          </button>
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors duration-300">
                            <FaExpand />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-4">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors duration-300">
                          <FaDownload className="text-sm" />
                          Download
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                          <FaShare className="text-sm" />
                          Share
                        </button>
                      </div>

                      {/* Resources */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FaBookmark className="text-amber-500" />
                          Resources
                        </h4>
                        <div className="space-y-2">
                          {selectedTutorial.resources.map((resource, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <FaDownload className="text-amber-500 text-sm" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{resource}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Placeholder when no tutorial is selected */
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <FaPlay className="text-gray-400 text-xl" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      Select a Tutorial
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Choose a tutorial from the list to start learning
                    </p>
                  </div>
                )}
              </div>

              {/* Learning Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaChartLine className="text-amber-500" />
                  Your Learning Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Getting Started</span>
                      <span>2/3 completed</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Writing & Editing</span>
                      <span>1/2 completed</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Design & Formatting</span>
                      <span>0/2 completed</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-8 text-white shadow-2xl shadow-amber-500/25">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Master BlogHub?
            </h3>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Join thousands of bloggers who have transformed their writing with our comprehensive tutorials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                Explore All Tutorials
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-amber-600 transition-all duration-300">
                Request a Tutorial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tutorials;