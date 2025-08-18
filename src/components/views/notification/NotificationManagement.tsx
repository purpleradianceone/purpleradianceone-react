/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import NotificationListForWeb from "../../../@types/notification/NotificationListForWeb";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import { useUserPreference } from "../../../context/user/UserPreference";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import { Loader2Icon } from "lucide-react";
type NotificationPopupProps = {
  onClose?: () => void;
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({ onClose }) => {
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();
  const lastNotificationRef = useRef<HTMLDivElement | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(userPreference.rowsInGrid || 30);
  const [notificationList, setNotificationList] = useState<
    NotificationListForWeb[]
  >([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  //   const [pageFetched , setPageFetched] = useState<Set<number>>(new Set())

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose!();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  //   api call to get notifications

  const getNotificationListForWeb = async (currentOffset: number = 0) => {
    setShowLoadingSpinner(true);

    const postDataToGetNotificationListForWeb = {
      company_id: loginStatus.companyId,
      id: null,
      company_user_id: loginStatus.id,
      notification_status_id: null,
      notification_type_id: null,
      offset: currentOffset,
      limit: limit,
      requestedby: loginStatus.id,
    };
    await axios
      .post(
        POST_API.GET_NOTIFICATION_LIST_FOR_WEB,
        postDataToGetNotificationListForWeb,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setShowLoadingSpinner(false);

        const fetchedData = response.data;

        setNotificationList((prev) => [...prev, ...fetchedData]);

        // set the count only on forst round
        if (currentOffset === 0 && fetchedData.length > 0) {
          setTotalCount(fetchedData[0].count);
        }
      })
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        setShowLoadingSpinner(false);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: getNotificationListForWeb,
          });
          if (refreshTokenResponse) {
            getNotificationListForWeb(currentOffset);
          }
        } else if (error.response.status === 503) {
          toast.error("Service is down.");
        } else if (error.response.status === 500) {
          toast.error("Internal Server Error");
        }
      });
  };

  //Note : api call to get notifications
  useEffect(() => {
    setNotificationList([]);
    getNotificationListForWeb(0);
  }, []);

  useEffect(() => {
    if (showLoadingSpinner) return; // Prevent triggering while loading
    if (notificationList.length >= totalCount) return; // All data fetched

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextOffset = offset + limit;
          setOffset(nextOffset);
          getNotificationListForWeb(nextOffset);
        }
      },
      { threshold: 1.0 }
    );

    if (lastNotificationRef.current) {
      observer.observe(lastNotificationRef.current);
    }

    return () => {
      if (lastNotificationRef.current)
        observer.unobserve(lastNotificationRef.current);
    };
  }, [notificationList, offset, showLoadingSpinner, totalCount]);

  const handleUpdateNotificationListWebClear = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log(notificationList.length);

    if (notificationList.length === 0) {
      toast.error("No notification found");
      return;
    }
    event.preventDefault();
    const postDataToClearNotificationListWeb = {
      company_id: loginStatus.companyId,
      company_user_id: loginStatus.id,
      updatedby: loginStatus.id,
    };

    await axios
      .post(
        POST_API.UPDATE_NOTIFICATION_LIST_FOR_WEB_CLEAR,
        postDataToClearNotificationListWeb,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        if (response.data.status) {
          setNotificationList([]);
          setOffset(0);
          setTotalCount(0);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // .catch((error: any) => {
      // console.log(error);

      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleUpdateNotificationListWebClear,
          });
          if (refreshTokenResponse) {
            handleUpdateNotificationListWebClear(event);
          }
        } else if (error.response.status === 503) {
          toast.error("Service is down.");
        } else if (error.response.status === 500) {
          toast.error("Internal Server Error");
        }
      });
    // });
  };

  const handleUpdateNotificationListWeb = async (id: number) => {
    setLoadingId(id);

    const postDataToUpdateNotificationListWeb = {
      company_id: loginStatus.companyId,
      id: id,
      updatedby: loginStatus.id,
    };

    await axios
      .post(
        POST_API.UPDATE_NOTIFICATION_LIST_FOR_WEB,
        postDataToUpdateNotificationListWeb,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const res = response.data;
        if (res.status) {
          toast.success(res.message);
          setNotificationList((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    is_read: true,
                  }
                : item
            )
          );
        }
      })
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        setShowLoadingSpinner(false);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: handleUpdateNotificationListWeb,
          });
          if (refreshTokenResponse) {
            handleUpdateNotificationListWeb(id);
          }
        } else if (error.response.status === 503) {
          toast.error("Service is down.");
        } else if (error.response.status === 500) {
          toast.error("Internal Server Error");
        }
      })
      .finally(() => {
        setLoadingId(null);
      });
  };
  return (
    <div
      ref={popupRef}
      className="absolute -right-72 mt-1 w-96 bg-white border border-gray-300 rounded-2xl shadow-2xl z-50"
    >
      {/* Header with Clear All */}
      <div className="flex justify-between items-center p-3 border-b text-sm font-semibold text-gray-800 bg-gray-100 rounded-t-2xl">
        <span>Notifications!</span>
        <button
          type="button"
          onClick={handleUpdateNotificationListWebClear}
          className="text-xs text-red-600 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px]  overflow-y-auto custom-scrollbar">
        {notificationList.length === 0 && !showLoadingSpinner ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No notifications to display
          </div>
        ) : showLoadingSpinner && notificationList.length === 0 ? (
          <div className="p-5 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="border-b">
            {notificationList.map((notification, index) => (
              <div
                key={notification.id}
                ref={
                  index === notificationList.length - 1
                    ? lastNotificationRef
                    : null
                }
                className={`p-2 transition-all border-gray-100
                ${notification.is_read ? "bg-white" : "bg-blue-50"}
              `}
              >
                {/* Subject and Date */}
                <div className="flex justify-between items-center ">
                  <p className="font-medium text-sm text-gray-900">
                    {notification.notification_subject}
                  </p>
                  {/* Mark as Read Button */}

                  {!notification.is_read ? (
                    loadingId === notification.id ? (
                      <div className="w-auto mr-7 h-auto flex items-center justify-end ">
                        <Loader2Icon className="w-4 h-4 text-gray-600 animate-spin " />
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleUpdateNotificationListWeb(notification.id)
                        }
                        className="text-xs underline  text-gray-400 bg-blue-00"
                      >
                        Mark as Read
                      </button>
                    )
                  ) : null}
                </div>

                {/* Body */}
                <p className="text-xs text-gray-700 ">
                  {notification.notification_body}
                </p>

                <span className="text-xs text-gray-600">
                  {notification.notification_request_date}
                </span>
              </div>
            ))}

            {/* Bottom Loader */}
            {showLoadingSpinner && (
              <div className="p-4 flex justify-center text-sm text-gray-500 animate-pulse">
                <span>Loading more data...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
