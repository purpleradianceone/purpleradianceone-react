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
import { NotificationCountContextProvider } from "./context/notification/NotificationCountContext";
import { useAxiosForbiddenHandler } from "./config/hooks/useAxiosForbiddenHandler";
import { DialogueBox } from "./components/dialogue-box/Dialogue";
import { IndustryTypeDataProvider } from "./context/Account/IndustryTypeData";
import { BusinessTypeDataProvider } from "./context/Account/BusinessTypeData";

/**
 *
 * @returns JSX.Element of all html elements to be rendered as child element of root element in index.html
 */
function App() {
  const { confirmHandler, dialogMessage, isDialogOpen } =
    useAxiosForbiddenHandler();
  return (
    <LoggedInUserContextProvider>
      <AccessManagementContextProvider>
        <BusinessTypeDataProvider>
          <IndustryTypeDataProvider>
            <NotificationCountContextProvider>
              <UserPreferenceContextProvider>
                <PanelProvider>
                  <ZoomMeetingContextProvider>
                    <GoogleMeetContextProvider>
                      <NotificationProvider>
                        <Toaster
                          position="top-center"
                          toastOptions={{
                            style: { zIndex: 2147483647 }, // max safe z-index
                          }}
                        />

                        <DialogueBox
                          isOpen={isDialogOpen}
                          // onClose={closeDialog}
                          onConfirm={confirmHandler}
                          title="Session Expired !"
                          message={dialogMessage}
                        />
                        <RouterProvider router={router} />
                      </NotificationProvider>
                    </GoogleMeetContextProvider>
                  </ZoomMeetingContextProvider>
                </PanelProvider>
              </UserPreferenceContextProvider>
            </NotificationCountContextProvider>
          </IndustryTypeDataProvider>
        </BusinessTypeDataProvider>
      </AccessManagementContextProvider>
    </LoggedInUserContextProvider>
  );
}

/**
 * @exports App App as default export
 */
export default App;
