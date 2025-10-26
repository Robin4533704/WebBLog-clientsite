import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../provider/AuthContext";

const useUserRole = () => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState("user");
  const [roleLoading, setRoleLoading] = useState(true);
 console.log("admin", user)
  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setRole("user");
        setRoleLoading(false);
        return;
      }

      try {
        const token = await user?.getIdToken(true); // ✅ always fresh
        localStorage.setItem("fbToken", token); // optional reuse

console.log("🔥 Firebase Token:", token);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/users/role`,
          {
            params: { email: user.email },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Role response:", res.data);
        setRole(res.data?.role || "user");
      } catch (err) {
        console.error("❌ Role fetch error:", err.response?.data || err.message);
        setRole("user");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user?.email]);

  return { role, roleLoading };
};

export default useUserRole;
