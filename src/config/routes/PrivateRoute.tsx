// PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const storedLoginStatus = sessionStorage.getItem("loginStatus");
  const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : false;

  return isLoggedIn.status ? <>{children}</> : <Navigate to="/signin" />;
};

export default PrivateRoute;
