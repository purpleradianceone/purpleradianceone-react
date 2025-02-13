// PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import RouteChildrenNode from "../../@types/config/RoutesChildrenNode";
import { BOOLEAN_VALUES } from "../../constants/AppConstants";


function PrivateRoute({ children }:RouteChildrenNode){
  const storedLoginStatus = localStorage.getItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
  const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : BOOLEAN_VALUES.FALSE;

  return isLoggedIn.status ? <>{children}</> : <Navigate to={ROUTES_URL.SIGN_IN} />;
};

export default PrivateRoute;
