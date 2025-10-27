import React, { useEffect, useState } from "react";
import useUserAxios from "../../hook/useUserAxios";
import useAuth from "../../hook/useAxios";
import { FaTrash, FaEnvelope, FaUser, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loading, { SkeletonLoader } from "../../pages/Loading";

const AdminContacts = () => {
  const { axiosIntals } = useUserAxios();
  const { currentUser } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  // 🔹 Fetch all contacts (admin only)
  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentUser?.email) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axiosIntals.get("/contactpages");
        setContacts(response.data);
        setFilteredContacts(response.data);
      } catch (err) {
        console.error("Fetch contacts error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [currentUser, axiosIntals]);

  // 🔹 Search and filter functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  // 🔹 Delete contact handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;

    try {
      setDeletingId(id);
      await axiosIntals.delete(`/contactpages/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      // Show success message
      setError(null);
    } catch (err) {
      console.error("Delete contact error:", err);
      setError(err.response?.data?.message || "Failed to delete contact message");
    } finally {
      setDeletingId(null);
    }
  };

  // 🔹 Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 🔹 Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 animate-pulse"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-full"></div>
          </div>

          {/* Contacts Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Error State
  if (error && contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Contacts</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Contact Messages
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and review all contact form submissions
          </p>
        </motion.div>

        {/* Stats and Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search messages by name, email, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
              />
            </div>
          </motion.div>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredContacts.length === 0 && contacts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Contact Messages</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no contact messages to display. Messages will appear here once users start contacting you.
            </p>
          </motion.div>
        )}

        {/* Search Empty State */}
        {filteredContacts.length === 0 && contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Messages Found</h3>
            <p className="text-gray-600">
              No contact messages match your search criteria. Try different keywords.
            </p>
          </motion.div>
        )}

        {/* Contacts Grid */}
        <AnimatePresence>
          {filteredContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {contact.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {contact.name}
                          </h3>
                          <p className="text-amber-600 text-sm font-medium flex items-center gap-1">
                            <FaEnvelope className="text-xs" />
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed line-clamp-4">
                        {contact.message}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <FaClock className="mr-2 text-xs" />
                      {formatDate(contact.createdAt || contact.date)}
                    </div>

                    {/* Actions */}
                    <motion.button
                      onClick={() => handleDelete(contact._id)}
                      disabled={deletingId === contact._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === contact._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FaTrash />
                          Delete Message
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminContacts;