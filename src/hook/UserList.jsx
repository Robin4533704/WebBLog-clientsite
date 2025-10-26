import useAxios from './hook/useAxios';
import { useEffect, useState } from 'react';

const UsersList = () => {
  const { sendRequest } = useAxios();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await sendRequest('/users');
        setUsers(data.data); // data.data কারণ response.json({ success:true, data: users })
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map(user => <li key={user._id}>{user.name}</li>)}
    </ul>
  );
};

export default UsersList;
