import React, { useEffect, useState } from "react";
import useAxios from "../../hook/useAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrashAlt } from "react-icons/fa";

const SubscribersAdmin = () => {
  const { sendRequest, loading } = useAxios();
  const [subscribers, setSubscribers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      const res = await sendRequest("/subscribers", "GET");
      if (res.success) {
        setSubscribers(res.subscribers);
      } else {
        toast.error(res.message || "Failed to fetch subscribers");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch subscribers");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Delete subscriber
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      setDeletingId(id);
      const res = await sendRequest(`/subscribers/${id}`, "DELETE");
      if (res.success) {
        toast.success(res.message);
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Subscribers</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : subscribers.length === 0 ? (
        <p className="text-gray-500">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Subscribed At</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, idx) => (
                <tr key={sub._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{sub.email}</td>
                  <td className="px-4 py-2">{new Date(sub.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      disabled={deletingId === sub._id}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      {deletingId === sub._id ? "Deleting..." : <FaTrashAlt />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubscribersAdmin;
