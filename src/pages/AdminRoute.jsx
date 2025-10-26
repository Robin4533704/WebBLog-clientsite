// src/components/AdminRoute.jsx - Fixed
import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../provider/AuthContext';
import Loading from '../pages/Loading';
import useAxios from '../hook/useAxios';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { sendRequest } = useAxios();
  const location = useLocation();
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const response = await sendRequest('/users');
          const usersData = response.data || response;
          const currentUserInDB = usersData.find(
            (u) => u.email === user.email || u.uid === user.uid
          );
          setIsAdmin(currentUserInDB?.role === 'admin');
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
      setCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [user, sendRequest]);

  if (loading || checkingAdmin) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            অ্যাডমিন এক্সেস প্রয়োজন
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            এই পেজ শুধুমাত্র অ্যাডমিন এক্সেস করতে পারবে।
          </p>
          <p className="text-sm text-gray-500">আপনার ইমেইল: {user.email}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
