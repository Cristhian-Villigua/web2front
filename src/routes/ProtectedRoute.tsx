// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/Login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;