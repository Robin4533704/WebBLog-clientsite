import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaPlay, 
  FaPause,
  FaCircle,
  FaRegCircle
} from "react-icons/fa";

// Banner images array - আপনি আপনার images দিয়ে replace করুন
const bannerImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    title: "Welcome to BlogHub",
    subtitle: "Discover Amazing Stories & Insights",
    description: "Join our community of writers and readers exploring the world of knowledge",
    buttonText: "Explore Blogs",
    gradient: "from-blue-600/80 to-purple-600/80"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Write Your Story",
    subtitle: "Share Your Thoughts with the World",
    description: "Create engaging content and connect with like-minded individuals",
    buttonText: "Start Writing",
    gradient: "from-green-600/80 to-blue-600/80"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    title: "Join Our Community",
    subtitle: "Connect with Amazing Writers",
    description: "Be part of a vibrant community sharing knowledge and experiences",
    buttonText: "Join Now",
    gradient: "from-orange-600/80 to-red-600/80"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Latest Trends & Insights",
    subtitle: "Stay Updated with Modern Topics",
    description: "Explore cutting-edge content across technology, lifestyle, and more",
    buttonText: "Read Latest",
    gradient: "from-purple-600/80 to-pink-600/80"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide functionality
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <section 
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Background Image with Gradient Overlay */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${bannerImages[currentSlide].image})`,
              }}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${bannerImages[currentSlide].gradient} mix-blend-multiply`} />
            
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center w-full h-full px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {bannerImages[currentSlide].title}
                </motion.h1>

                <motion.h2
                  className="text-xl md:text-3xl lg:text-4xl font-semibold text-amber-300 mb-6 drop-shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {bannerImages[currentSlide].subtitle}
                </motion.h2>

                <motion.p
                  className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 drop-shadow-md max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {bannerImages[currentSlide].description}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Link
                    to="/blogs"
                    className="group relative bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/25 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {bannerImages[currentSlide].buttonText}
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Link>

                  <Link
                    to="/about"
                    className="group border-2 border-white/50 hover:border-white text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/10 backdrop-blur-sm"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
        aria-label="Previous slide"
      >
        <FaArrowLeft className="text-xl" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
        aria-label="Next slide"
      >
        <FaArrowRight className="text-xl" />
      </button>

      {/* Slide Indicators/Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="focus:outline-none transition-transform duration-300 hover:scale-125"
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide ? (
              <FaCircle className="text-amber-400 text-lg drop-shadow-lg" />
            ) : (
              <FaRegCircle className="text-white/70 hover:text-white text-lg drop-shadow-lg" />
            )}
          </button>
        ))}
      </div>

      {/* Auto-play Toggle */}
      <button
        onClick={toggleAutoPlay}
        className="absolute bottom-8 right-8 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
        aria-label={isAutoPlay ? "Pause slideshow" : "Play slideshow"}
      >
        {isAutoPlay ? <FaPause className="text-lg" /> : <FaPlay className="text-lg" />}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-amber-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 5, 
            ease: "linear",
            repeat: isAutoPlay && !isHovered ? Infinity : 0
          }}
          key={currentSlide}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-amber-400/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-6 h-6 bg-blue-400/20 rounded-full"
          animate={{
            y: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400/25 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-light">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;