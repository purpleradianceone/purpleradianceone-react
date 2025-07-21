/* eslint-disable react-hooks/rules-of-hooks */
import React, { createContext, useEffect, useState, useContext, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WEB_SOCKET_CONNECTION_URL } from "../../constants/PostApi";
import toast, { Toaster } from "react-hot-toast";
import { useLoggedInUserContext } from "../user/LoggedInUserContext";
import { useNotificationCountContext } from "./NotificationCountContext";

type Notification = {
  notificationSubject: string;
  notitficationBody: string;
};

const NotificationContext = createContext<Notification[] >([]);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);


  const {loginStatus} = useLoggedInUserContext();
  // useEffect(() => {
  //   let client : Client | null = null;

  //   const socket = new SockJS(WEB_SOCKET_CONNECTION_URL);
  //    client = new Client({
  //     webSocketFactory: () => socket,
  //     debug: (str) => console.log(str),
  //     onConnect: () => {
  //       console.log("WebSocket connected");

  //       const showToast = (body: Notification) => {
  //         toast.custom((t) => (
  //           <div
  //             className={`${
  //               t.visible ? "animate-enter" : "animate-leave"
  //             } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  //           >
  //             <div className="flex-1 w-0 p-4">
  //               <div className="flex items-start">
  //                 <div className="ml-3 flex-1">
  //                   <p className="text-sm font-medium text-gray-900">
  //                     {body.notificationSubject}
  //                   </p>
  //                   <p className="mt-1 text-sm text-gray-500">
  //                     {body.notitficationBody}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="flex border-l border-gray-200">
  //               <button
  //                 onClick={() => toast.dismiss(t.id)}
  //                 className="w-full border-none rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
  //               >
  //                 Close
  //               </button>
  //             </div>
  //           </div>
  //         ));
  //       };

  //       client.subscribe("/topic/users/notifications", (message) => {
  //         const body: Notification = JSON.parse(message.body);
  //         setNotifications((prev) => [body, ...prev]);
  //         showToast(body);
  //       });

  //       client.subscribe("/user/queue/notifications", (message) => {
  //         const body: Notification = JSON.parse(message.body);
  //         setNotifications((prev) => [body, ...prev]);
  //         showToast(body);
  //       });
  //     },
  //     onStompError: (frame) =>
  //       console.error("STOMP error", frame.headers["message"]),
  //     onWebSocketClose: () => console.warn("WebSocket closed"),
  //   });

  //   client.activate();

  //   return () => {
  //     console.log("Websocket Disconnected.");
  //     client.deactivate();
  //   };
  // }, []);

  // Use useRef to hold the client instance across renders without triggering re-renders
  const clientRef = useRef<Client | null>(null);
  const {notificationCount,setNotificationCount} = useNotificationCountContext();

  useEffect(() => {
    // Only connect if authenticated AND no existing client is active
    if (loginStatus.id !==0 && !clientRef.current?.active) { // Check if not active or doesn't exist
      console.log("User is authenticated. Attempting WebSocket connection...");
      const socket = new SockJS(WEB_SOCKET_CONNECTION_URL);
      const newClient = new Client({ // Create a new client
        webSocketFactory: () => socket,
        // Note : do not remove below code 
        // debug: (str) => console.log(str),
        onConnect: () => {
          console.log("WebSocket connected");

          const showToast = (body: Notification) => {
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {body.notificationSubject}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {body.notitficationBody}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border-none rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            ));
          };

          // Use newClient for subscriptions, as clientRef.current might be updated asynchronously
          newClient.subscribe("/topic/users/notifications", (message) => {
            const body: Notification = JSON.parse(message.body);
            setNotifications((prev) => [body, ...prev]);

            showToast(body);
          });

          newClient.subscribe("/user/queue/notifications", (message) => {
            const body: Notification = JSON.parse(message.body);
            setNotifications((prev) => [body, ...prev]);

            console.log("inside User queue");
            console.log(notificationCount);
            setNotificationCount((prev) => prev+1);
            showToast(body);
          });
        },
        onStompError: (frame) =>
          console.error("STOMP error", frame.headers["message"]),
        onWebSocketClose: () => console.warn("WebSocket closed"),
      });

      newClient.activate();
      clientRef.current = newClient; // Store the new client in the ref
    } else if (loginStatus.id===0) { // If not authenticated, disconnect
      if (clientRef.current && clientRef.current.active) {
        console.log("User logged out. Deactivating WebSocket client.");
        clientRef.current.deactivate();
        clientRef.current = null; // Clear the ref
      } else {
        console.log("Not authenticated, and client not active or not initialized.");
      }
    }


    return () => {
      // This cleanup runs when the component unmounts OR when `isAuthenticated` changes
      if (clientRef.current && clientRef.current.active) {
        console.log("Websocket Disconnected via cleanup.");
        clientRef.current.deactivate();
        clientRef.current = null; // Clear the ref on cleanup
      }
    };
  }, [loginStatus.id]); // Dependency array includes isAuthenticated


  return (
    <NotificationContext.Provider value={notifications}>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
