// Loading.jsx
import React from "react";

const Loading = ({ message }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50 z-50">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>

      {/* Optional message */}
      {message && <p className=" text-gray-700 text-lg font-medium">{message}</p>}
    </div>
  );
};

export default Loading;
