import React from "react";
import { motion } from "framer-motion";

// Default Loading component
const Loading = ({ 
  size = "medium", 
  type = "spinner", 
  text = "Loading...",
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-24 h-24"
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        rotate: { duration: 1, ease: "linear", repeat: Infinity }
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const dotsVariants = {
    animate: { transition: { staggerChildren: 0.2 } }
  };

  const dotVariants = {
    animate: { y: [0, -10, 0], transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" } }
  };

  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return (
          <motion.div
            className={`border-4 border-amber-200 border-t-amber-600 rounded-full ${sizeClasses[size]}`}
            variants={spinnerVariants}
            animate="animate"
          />
        );
      case "pulse":
        return (
          <motion.div
            className={`bg-gradient-to-r from-amber-500 to-orange-500 rounded-full ${sizeClasses[size]}`}
            variants={pulseVariants}
            animate="animate"
          />
        );
      case "dots":
        return (
          <motion.div className="flex gap-2" variants={dotsVariants} animate="animate">
            {[1, 2, 3].map((dot) => (
              <motion.div key={dot} className="w-3 h-3 bg-amber-500 rounded-full" variants={dotVariants} />
            ))}
          </motion.div>
        );
      case "skeleton":
        return <SkeletonLoader />;
      default:
        return (
          <motion.div
            className={`border-4 border-amber-200 border-t-amber-600 rounded-full ${sizeClasses[size]}`}
            variants={spinnerVariants}
            animate="animate"
          />
        );
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className="text-center">
          {renderLoader()}
          {text && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-gray-600 font-medium">
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {renderLoader()}
      {text && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-3 text-gray-500 text-sm">
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Named SkeletonLoader export
export const SkeletonLoader = () => (
  <div className="space-y-3">
    <div className="flex space-x-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  </div>
);

export default Loading;
