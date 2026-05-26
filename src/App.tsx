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
import { TutorailDataContextProvider } from "./context/tutorail/useTutorailDataContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

// import common locales you expect
import "dayjs/locale/en";
import "dayjs/locale/en-gb";
import "dayjs/locale/en-in";
import localizedFormat from "dayjs/plugin/localizedFormat";

import "dayjs/locale/en-gb";

dayjs.extend(localizedFormat);

const systemLocale = navigator.language.toLowerCase(); // en-gb

dayjs.locale(systemLocale);
const queryClient = new QueryClient();
/**
 *
 * @returns JSX.Element of all html elements to be rendered as child element of root element in index.html
 */
function App() {
  const { confirmHandler, dialogMessage, isDialogOpen } =
    useAxiosForbiddenHandler();

  

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={systemLocale}
    >
      <LoggedInUserContextProvider>
        <TutorailDataContextProvider>
          <AccessManagementContextProvider>
            <NotificationCountContextProvider>
              <UserPreferenceContextProvider>
                <PanelProvider>
                  <ZoomMeetingContextProvider>
                    <GoogleMeetContextProvider>
                      <QueryClientProvider client={queryClient}>
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
                      </QueryClientProvider>
                    </GoogleMeetContextProvider>
                  </ZoomMeetingContextProvider>
                </PanelProvider>
              </UserPreferenceContextProvider>
            </NotificationCountContextProvider>
          </AccessManagementContextProvider>
        </TutorailDataContextProvider>
      </LoggedInUserContextProvider>
    </LocalizationProvider>
  );
}

/**
 * @exports App App as default export
 */
export default App;
