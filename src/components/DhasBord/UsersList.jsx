import React, { useEffect, useState } from "react";
import useUserAxios from "../hooks/useUserAxios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { axiosIntals } = useUserAxios();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await axiosIntals("/users"); // automatically adds token if user logged in
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      {users.length === 0 && <p>No users found or you are not authorized.</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
