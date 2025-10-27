import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaHeadset, FaEnvelope, FaPhone, FaComments, FaClock, FaCheckCircle, 
  FaUsers, FaTrash, FaPaperclip
} from "react-icons/fa";
import useAxios from "../hook/useAxios";

const Support = () => {
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    priority: "medium",
    message: "",
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [supportTickets, setSupportTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // ✅ useAxios hook use korchi
  const { sendRequest } = useAxios();

  const supportOptions = [
    { id: "email", icon: FaEnvelope, title: "Email Support", description: "Get detailed help via email with 24-hour response time", responseTime: "Within 24 hours", features: ["Detailed responses", "File attachments", "Follow-up threads", "Technical analysis"], action: "Send us an email", color: "from-blue-500 to-cyan-500" },
    { id: "live-chat", icon: FaComments, title: "Live Chat", description: "Instant help from our support team during business hours", responseTime: "Within 5 minutes", features: ["Real-time conversation", "Screen sharing", "Quick solutions", "Instant support"], action: "Start live chat", color: "from-green-500 to-emerald-500" },
    { id: "phone", icon: FaPhone, title: "Phone Support", description: "Talk directly with our support specialists", responseTime: "Within 15 minutes", features: ["Voice call support", "Personal assistance", "Complex issue resolution", "Immediate help"], action: "Call now", color: "from-purple-500 to-pink-500" },
    { id: "community", icon: FaUsers, title: "Community Help", description: "Get help from our active community of users", responseTime: "Within 1 hour", features: ["Peer-to-peer support", "Multiple perspectives", "Community wisdom", "Quick tips"], action: "Visit community", color: "from-orange-500 to-amber-500" }
  ];

  // ✅ GET API - useAxios diye fetch support tickets
  const fetchSupportTickets = async () => {
    if (!formData.email) {
      setError("Please enter your email to view tickets");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await sendRequest("/support/tickets", {
        method: "GET",
        params: {
          email: formData.email
        }
      });
      
      console.log("✅ Tickets response:", response);
      
      if (response.success) {
        setSupportTickets(response.tickets || []);
      } else {
        setError(response.message || "Failed to fetch support tickets");
      }
    } catch (error) {
      console.error("❌ Error fetching support tickets:", error);
      setError("Unable to load support tickets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ POST API - useAxios diye submit support ticket
  const submitSupportTicket = async (ticketData) => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await sendRequest("/support/tickets", {
        method: "POST",
        data: ticketData
      });

      console.log("✅ Ticket submission response:", response);

      if (response.success) {
        return { success: true, data: response };
      } else {
        return { 
          success: false, 
          message: response.message || "Submission failed" 
        };
      }
    } catch (error) {
      console.error("❌ Error submitting support ticket:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Network error. Please try again." 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load support tickets when component mounts or email changes
  useEffect(() => {
    if (formData.email) {
      fetchSupportTickets();
    }
  }, [formData.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.attachments.length > 5) {
      setError("Maximum 5 files allowed");
      return;
    }
    setFormData(prev => ({ 
      ...prev, 
      attachments: [...prev.attachments, ...files] 
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      attachments: prev.attachments.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const result = await submitSupportTicket(formData);

    if (result.success) {
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        priority: "medium",
        message: "",
        attachments: []
      });
      setError("");
      
      // Refresh the tickets list after successful submission
      fetchSupportTickets();
    } else {
      setError(result.message);
    }
  };

  const handleViewTickets = () => {
    if (!formData.email) {
      setError("Please enter your email first to view tickets");
      setActiveTab("contact");
      return;
    }
    
    // Email validation for ticket viewing
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address to view tickets");
      return;
    }
    
    fetchSupportTickets();
    setActiveTab("tickets");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/25"
          >
            <FaHeadset className="text-3xl text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            We're Here to Help
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get instant support from our dedicated team. Choose the method that works best for you.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "contact" 
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" 
                  : "text-gray-600 dark:text-gray-300 hover:text-amber-500"
              }`}
            >
              Contact Support
            </button>
            <button
              onClick={handleViewTickets}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "tickets" 
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" 
                  : "text-gray-600 dark:text-gray-300 hover:text-amber-500"
              }`}
            >
              My Tickets
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-3xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Support Options & Contact Form */}
        {activeTab === "contact" && (
          <>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {supportOptions.map((option, idx) => (
                <motion.div 
                  key={option.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }} 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer" 
                  onClick={() => setActiveTab(option.id)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center mb-4`}>
                    <option.icon className="text-xl text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{option.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{option.description}</p>
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-3">
                    <FaClock className="text-xs" />
                    <span>{option.responseTime}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
            >
              {isSubmitted ? (
                <motion.div 
                  className="text-center py-12" 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ticket Created Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => setIsSubmitted(false)} 
                      className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors duration-300"
                    >
                      Send Another Message
                    </button>
                    <button 
                      onClick={handleViewTickets} 
                      className="px-6 py-3 border border-amber-500 text-amber-500 font-semibold rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors duration-300"
                    >
                      View My Tickets
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Full Name *" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Email *" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                      />
                    </div>
                  </div>
                  
                  <input 
                    type="text" 
                    name="subject" 
                    placeholder="Subject *" 
                    value={formData.subject} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Issue</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                    </select>
                    
                    <select 
                      name="priority" 
                      value={formData.priority} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <textarea 
                    name="message" 
                    placeholder="Describe your issue in detail... *" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    rows={6} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                  />
                  
                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      id="attachments" 
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                    <label 
                      htmlFor="attachments" 
                      className="inline-flex items-center gap-2 px-4 py-2 border border-amber-500 text-amber-500 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 cursor-pointer transition-colors duration-300"
                    >
                      <FaPaperclip className="text-sm" />
                      Attach Files (Max 5)
                    </label>
                    
                    {formData.attachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Attached files:</p>
                        <ul className="space-y-2">
                          {formData.attachments.map((file, i) => (
                            <li key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                                {file.name}
                              </span>
                              <button 
                                type="button" 
                                onClick={() => removeAttachment(i)}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:bg-amber-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Support Ticket"
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}

        {/* Support Tickets List */}
        {activeTab === "tickets" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Support Tickets</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("contact")}
                  className="px-4 py-2 border border-amber-500 text-amber-500 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors duration-300"
                >
                  New Ticket
                </button>
                <button
                  onClick={fetchSupportTickets}
                  disabled={isLoading}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:bg-amber-400 transition-colors duration-300"
                >
                  {isLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading your tickets...</p>
              </div>
            ) : supportTickets.length === 0 ? (
              <div className="text-center py-12">
                <FaEnvelope className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Support Tickets Found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  {formData.email ? `No tickets found for ${formData.email}` : "Please enter your email to view tickets"}
                </p>
                <button
                  onClick={() => setActiveTab("contact")}
                  className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors duration-300"
                >
                  Create New Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {supportTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">#{ticket.ticketNumber}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        ticket.status === 'closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{ticket.message}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>Priority: <span className={`font-medium ${
                        ticket.priority === 'high' ? 'text-red-600' :
                        ticket.priority === 'urgent' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>{ticket.priority}</span></span>
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Support;