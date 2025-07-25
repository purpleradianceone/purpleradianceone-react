// PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import RouteChildrenNode from "../../@types/config/RoutesChildrenNode";


function PrivateRoute({ children }:RouteChildrenNode){
  const storedLoginStatus = localStorage.getItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
  const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : false;

   console.log("inside private route : " + isLoggedIn.status && (isLoggedIn.activeUsersInCompany <=
                isLoggedIn.subscriptionAllowedUsers));

  console.log("is logged in : " + isLoggedIn.status);
  console.log("is active subscription : " + !isLoggedIn.isActiveSubscription);
   console.log("is allowed subscription : " + !isLoggedIn.subscriptionAllowedUsers);
  console.log("isActive");
  console.log(isLoggedIn.activeUsersInCompany <= isLoggedIn.subscriptionAllowedUsers);

  // note : this condtion is changed
  // && (isLoggedIn.subscriptionAllowedUsers >= isLoggedIn.activeUsersInCompany  || !isLoggedIn.isActiveSubscription)
  return isLoggedIn.status  && (isLoggedIn.activeUsersInCompany <=
                isLoggedIn.subscriptionAllowedUsers) ? <>{children}</> : <Navigate to={ROUTES_URL.SIGN_IN} />;
};

export default PrivateRoute;
