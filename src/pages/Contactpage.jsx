import { useState } from "react";
import { motion } from "framer-motion";
import useAxios from "../hook/useAxios";

const ContactPage = () => {
  const { sendRequest, loading } = useAxios();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [feedback, setFeedback] = useState(null);

  // ফর্ম ডাটা হ্যান্ডল
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ফর্ম সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    try {
      const res = await sendRequest("/contact", "POST", formData);
      if (res.success) {
        setFeedback({ type: "success", message: res.message });
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
        <p className="text-gray-600">
          We'd love to hear from you! Fill out the form below and we’ll get back
          to you soon.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-xl shadow-md p-8 space-y-5"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Write your message..."
            rows="5"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {feedback && (
          <p
            className={`text-center font-medium mt-3 ${
              feedback.type === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {feedback.message}
          </p>
        )}
      </motion.form>
    </div>
  );
};

export default ContactPage;
