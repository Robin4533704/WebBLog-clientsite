import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthContext";

const GoogleProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="text-center mt-10 text-gray-500">Login first!</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <img
        src={user.photoURL}
        alt={user.displayName}
        className="w-24 h-24 rounded-full shadow-lg"
      />
      <h2 className="mt-4 text-xl font-semibold">{user.displayName}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
};

export default GoogleProfile;
