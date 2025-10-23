// components/Newsletter.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import useAxios from "../hook/useAxios";

const Newsletter = () => {
  const { sendRequest, loading, error } = useAxios();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!email) return alert("Please enter an email");

    try {
      const res = await sendRequest("/subscribe", "POST", { email });
      if (res.success) {
        setSuccess(res.message);
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Subscription failed");
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-6 bg-gray-100 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Subscribe to our Newsletter</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Subscribe"}
        </button>
      </form>

      {success && <p className="mt-4 text-green-600 font-medium">{success}</p>}
      {error && <p className="mt-4 text-red-600 font-medium">{error.message}</p>}
    </motion.div>
  );
};

export default Newsletter;
