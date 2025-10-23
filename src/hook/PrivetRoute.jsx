import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider"; // 🔹 তোমার Firebase Auth context

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🕐 Wait for Firebase to check login state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  // 🚫 If not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Logged-in user → allow access
  return children;
};

export default PrivateRoute;
