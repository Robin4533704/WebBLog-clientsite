import React from "react";
import Loading from "../../pages/Loading";
import useAxios from "../../hook/useAxios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersTable = ({
  users = [],
  changeRole,
  actionLoading,
  loading,
  error,
  refreshUsers,
}) => {
  const { sendRequest } = useAxios();

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error.message || error}</p>;
  if (!users || users.length === 0) return <p className="text-center mt-6">No users found</p>;

const handleDelete = async (userId) => {
  if (!userId) return;
  const confirmDelete = window.confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    await sendRequest(`/users/${userId}`, "DELETE");
    toast.success("User deleted successfully!");
    refreshUsers && refreshUsers();
  } catch (err) {
    console.error("Error deleting user:", err);
    toast.error(err.response?.data?.message || "Failed to delete user");
  }
};


  // ✅ Change Role
  const handleChangeRole = async (userId, currentRole) => {
    if (!userId) return;
    try {
      if (!window.confirm(`Change role to ${currentRole === "admin" ? "user" : "admin"}?`)) return;

      await changeRole(userId, currentRole);
      toast.success(`Role changed to ${currentRole === "admin" ? "User" : "Admin"}!`);
    } catch (err) {
      console.error("Error changing role:", err);
      toast.error(err.response?.data?.message || "Failed to change role");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">All Users</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">#</th>
              <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, idx) => (
              <tr key={user._id ?? user.email} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-xs sm:text-sm">{idx + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs sm:text-sm">{user.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs sm:text-sm">{user.email}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs sm:text-sm capitalize">{user.role}</td>
                <td className="px-4 py-2 whitespace-nowrap flex flex-wrap gap-2">
                  {changeRole && (
                    <button
                      onClick={() => handleChangeRole(user._id, user.role)}
                      disabled={actionLoading}
                      className={`px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm ${
                        user.role === "admin"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-amber-500 hover:bg-amber-600"
                      }`}
                    >
                      {actionLoading
                        ? "Processing..."
                        : user.role === "admin"
                        ? "Make User"
                        : "Make Admin"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
