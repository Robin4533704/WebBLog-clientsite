import React, { useEffect, useState } from "react";
import useAxios from "../hook/useAxios";
import { getAuth } from "firebase/auth";

const UsersPage = () => {
  const { sendRequest } = useAxios();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setUsers([]);
          setLoading(false);
          return;
        }

        const data = await sendRequest("/users");
        setUsers(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!users.length) return <p>No users found</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="border p-4 rounded shadow">
            <img
              src={user.photoURL || "https://via.placeholder.com/150"}
              alt={user.displayName || user.fullName || "User"}
              className="w-20 h-20 rounded-full mb-2"
            />
            <h3 className="font-semibold">{user.displayName || user.fullName}</h3>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
