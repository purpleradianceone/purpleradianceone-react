/**
 * @import {BrowserRouter, Routes, Route,Link} for routing components from react-router-dom
 * @import AuthLayout for AuthLayout component from components/views/auth/AuthLayout
 * @import SignInForm for SignInForm component from components/forms/SignInForm
 */
import { RouterProvider } from "react-router-dom";
import { router } from "./config/routes/Route";
import { LoggedInUserContextProvider } from "./context/user/LoggedInUserContext";
import { AccessManagementContextProvider } from "./context/user/AccessManagementContext";
import { PanelProvider } from "./context/panel/usePanel";
import { GoogleMeetContextProvider } from "./context/meeting/GoogleMeetContext";
import { ZoomMeetingContextProvider } from "./context/meeting/ZoomMeetingContext";
import { UserPreferenceContextProvider } from "./context/user/UserPreference";
import { NotificationProvider } from "./context/notification/NotificationProvider";
import { Toaster } from "react-hot-toast";

/**
 *
 * @returns JSX.Element of all html elements to be rendered as child element of root element in index.html
 */
function App() {
  return (
   
      <UserPreferenceContextProvider>
        <PanelProvider>
          <ZoomMeetingContextProvider>
            <GoogleMeetContextProvider>
              <AccessManagementContextProvider>
                <LoggedInUserContextProvider>
                   <NotificationProvider>
                     <Toaster position="top-center" reverseOrder={false} />
                  <RouterProvider router={router} />
                   </NotificationProvider>
                </LoggedInUserContextProvider>
              </AccessManagementContextProvider>
            </GoogleMeetContextProvider>
          </ZoomMeetingContextProvider>
        </PanelProvider>
      </UserPreferenceContextProvider>
    
  );
}

/**
 * @exports App App as default export
 */
export default App;
