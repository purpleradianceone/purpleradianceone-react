// PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";


interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const storedLoginStatus = localStorage.getItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
  const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : false;

  return isLoggedIn.status ? <>{children}</> : <Navigate to={ROUTES_URL.SIGN_IN} />;
};

export default PrivateRoute;
