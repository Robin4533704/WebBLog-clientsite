import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaUserAlt, FaTrash } from "react-icons/fa";
import useAxios from "../../hook/useAxios";
import Loading from "../../pages/Loading";
import { AuthContext } from "../../provider/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUsers = () => {
  const { sendRequest } = useAxios();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await sendRequest("/users", { method: "GET" });
      if (Array.isArray(res)) setUsers(res);
      else if (Array.isArray(res?.users)) setUsers(res.users);
      else setUsers([]);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const toggleRole = async (userId, currentRole) => {
    if (!window.confirm(`Change role to ${currentRole === "admin" ? "user" : "admin"}?`)) return;

    try {
      setActionLoading(true);
      await sendRequest(`/role/${userId}`, {
        method: "PATCH",
        body: { role: currentRole === "admin" ? "user" : "admin" },
      });
      toast.success("Role updated!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to change role: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm("Remove this user?")) return;

    try {
      setActionLoading(true);
      await sendRequest(`/users/${userId}`, { method: "DELETE" });
      toast.success("User removed!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove user: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Manage Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((u) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg flex flex-col gap-3 border border-gray-200 dark:border-gray-700"
            >
              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={u.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
                  alt={u.displayName || u.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {u.displayName || u.fullName || "Unknown"}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {u.role === "admin" ? (
                      <FaUserShield className="text-yellow-500" />
                    ) : (
                      <FaUserAlt className="text-blue-500" />
                    )}
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{u.role}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={actionLoading}
                  onClick={() => toggleRole(u._id, u.role)}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded ${
                    u.role === "admin"
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  } transition`}
                >
                  {u.role === "admin" ? "Demote" : "Promote"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={actionLoading}
                  onClick={() => removeUser(u._id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
                >
                  <FaTrash /> Remove
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
