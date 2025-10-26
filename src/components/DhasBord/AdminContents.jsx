import React, { useEffect, useState } from "react";
import useUserAxios from "../../hook/useUserAxios";
import useAuth from "../../hook/useAuth";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminContacts = () => {
  const { axiosIntals } = useUserAxios();
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentUser?.email) return;

      try {
        const data = await axiosIntals("/contacts", { method: "GET" });
        setContacts(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await axiosIntals(`/contacts/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete contact");
    }
  };

  if (loading) return <p>Loading contacts...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!contacts || contacts.length === 0) return <p>No contacts found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Contacts</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact._id}
            className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between"
            whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          >
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-800">{contact.name}</p>
              <p className="text-gray-600">{contact.email}</p>
              <p className="mt-2 text-gray-700">{contact.message}</p>
            </div>
            <button
              onClick={() => handleDelete(contact._id)}
              className="self-start flex items-center gap-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <FaTrash /> Delete
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminContacts;
