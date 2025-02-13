import { Navigate } from "react-router-dom";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import ROUTES_URL from "../../constants/Routes";
import RouteChildrenNode from "../../@types/config/RoutesChildrenNode";
import { BOOLEAN_VALUES } from "../../constants/AppConstants";



function LoggedInRoute({children} : RouteChildrenNode){
    const storedLoginStatus = localStorage.getItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
  const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : BOOLEAN_VALUES.FALSE;

  return isLoggedIn.status ? <Navigate to={ROUTES_URL.HOME}/>: <>{children}</>;
}

export default LoggedInRoute;