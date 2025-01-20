/**
 * @import {BrowserRouter, Routes, Route,Link} for routing components from react-router-dom
 * @import AuthLayout for AuthLayout component from components/views/auth/AuthLayout
 * @import SignInForm for SignInForm component from components/forms/SignInForm
 */
import { RouterProvider } from "react-router-dom";
import { router } from "./config/routes/Route";
import { NavBarContextProvider } from "./context/home/NavBarContext";
import { LoggedInUserContextProvider } from "./context/user/LoggedInUserContext";
// import { UserContextProvider } from "./context/user/UserContextProvider";
// import { ManageCompanyUserContextProvider } from './context/user/ManageCompanyUserContext';

/**
 *
 * @returns JSX.Element of all html elements to be rendered as child element of root element in index.html
 */
function App() {
  return (

    <LoggedInUserContextProvider>
      {/* <UserContextProvider> */}
        <NavBarContextProvider>
          <RouterProvider router={router} />
        </NavBarContextProvider>
      {/* </UserContextProvider> */}
    </LoggedInUserContextProvider>
  );
}

/**
 * @exports App App as default export
 */
export default App;
