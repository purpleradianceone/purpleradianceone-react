import { Navigate } from "react-router-dom";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import ROUTES_URL from "../../constants/Routes";
import RouteChildrenNode from "../../@types/config/RoutesChildrenNode";



function LoggedInRoute({children} : RouteChildrenNode){
    const storedLoginStatus = localStorage.getItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
  const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : false;

  // console.log("inside logged in route : " + isLoggedIn.status && isLoggedIn.isActiveSubscription && (isLoggedIn.active >
  //               isLoggedIn.subscriptionAllowedUsers));

  // console.log("is logged in : " + isLoggedIn.status);
  // console.log("is active subscription : " + !isLoggedIn.isActiveSubscription);
  // console.log("isActive");
  // console.log(isLoggedIn.activeUsersInCompany < isLoggedIn.subscriptionAllowedUsers);

  return isLoggedIn.status && (isLoggedIn.activeUsersInCompany <
                isLoggedIn.subscriptionAllowedUsers)  ? <Navigate to={ROUTES_URL.HOME}/>: <>{children}</>;
}

export default LoggedInRoute;