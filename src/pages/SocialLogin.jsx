import React, { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthContext";
import { FcGoogle } from "react-icons/fc";

const SocialLogin = () => {
  const { signInGoogleUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await signInGoogleUser();
      // User is automatically updated in AuthContext
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto ">
      <div className="text-center my-2 text-gray-500 font-medium">OR</div>

      {error && (
        <div className="text-center mb-3 text-red-500 font-medium">{error}</div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center justify-center w-full gap-3 px-6 py-3 text-white font-semibold
                   rounded-xl bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500
                   hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500
                   transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FcGoogle size={28} />
        {loading ? "Signing in..." : "Login with Google"}
      </button>
    </div>
  );
};

export default SocialLogin;
