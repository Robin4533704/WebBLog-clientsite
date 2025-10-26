import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../provider/AuthContext";

const useUserRole = () => {
  const { currentUser } = useContext(AuthContext);
  const [role, setRole] = useState("user");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser?.email) {
        setRole("user");
        setRoleLoading(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken(true); // ✅ always fresh
        localStorage.setItem("fbToken", token); // optional reuse

console.log("🔥 Firebase Token:", token);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/users/role`,
          {
            params: { email: currentUser.email },
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
  }, [currentUser?.email]);

  return { role, roleLoading };
};

export default useUserRole;
