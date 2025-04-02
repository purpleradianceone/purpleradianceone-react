// PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import RouteChildrenNode from "../../@types/config/RoutesChildrenNode";


function PrivateRoute({ children }:RouteChildrenNode){
  const storedLoginStatus = localStorage.getItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
  const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : false;

  // note : this condtion is changed
  // && (isLoggedIn.subscriptionAllowedUsers >= isLoggedIn.activeUsersInCompany  || !isLoggedIn.isActiveSubscription)
  return isLoggedIn.status   ? <>{children}</> : <Navigate to={ROUTES_URL.SIGN_IN} />;
};

export default PrivateRoute;
