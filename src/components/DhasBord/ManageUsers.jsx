import React, { useEffect, useState, useContext } from "react";
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
    if (user) fetchUsers(); // fetch only if user logged in
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
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="text-center">
              <td className="border px-4 py-2">{u.displayName || u.fullName || "Unknown"}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.role}</td>
              <td className="border px-4 py-2 flex justify-center gap-2">
                <button
                  disabled={actionLoading}
                  onClick={() => toggleRole(u._id, u.role)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  {u.role === "admin" ? "Demote" : "Promote"}
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => removeUser(u._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
