import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { verifiedToken, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!verifiedToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
