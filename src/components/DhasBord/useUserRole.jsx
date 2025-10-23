
import { useEffect, useState } from "react";
import useAxios from "../../hook/useAxios";
import { getAuth } from "firebase/auth";

const useUserRole = () => {
  const { sendRequest } = useAxios();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const auth = getAuth();
        let user = auth.currentUser;

        // Wait until Firebase user is ready
        if (!user) {
          user = await new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((u) => {
              resolve(u);
              unsubscribe();
            });
          });
        }

        if (!user) throw new Error("User not logged in");

        // Get Firebase token
        const token = await user.getIdToken();

        // Fetch role from backend
        const res = await sendRequest(`/users/role?email=${user.email}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        setRole(res?.role || "user");
      } catch (err) {
        console.error("Failed to fetch role:", err);
        setRole("user");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, roleLoading };
};

export default useUserRole;
