/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import NotificationListForWeb from "../../../@types/notification/NotificationListForWeb";
import { useUserPreference } from "../../../context/user/UserPreference";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import { Loader2Icon } from "lucide-react";
import NotificationSkeleton from "./NotificationSkeleton";
type NotificationPopupProps = {
  onClose?: () => void;
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({ onClose }) => {
   const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const lastNotificationRef = useRef<HTMLDivElement | null>(null);

  const [notificationList, setNotificationList] = useState<
    NotificationListForWeb[]
  >([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(userPreference.rowsInGrid || 25);
  const [showLoadingSpinner, setShowLoadingSpinner] =
    useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  /*Close On Outside Click */

  useEffect(() => {
    setHasMore(true)
    setNotificationList([])
    setOffset(0)

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

 

  const getNotificationListForWeb = useCallback(
    async (currentOffset: number) => {
      if (loginStatus.companyId === 0) return;
      if (showLoadingSpinner) return;

      setShowLoadingSpinner(true);

      try {
        const postData = {
          company_id: loginStatus.companyId,
          id: null,
          company_user_id: loginStatus.id,
          notification_status_id: null,
          notification_type_id: null,
          offset: currentOffset,
          limit: limit,
          requestedby: loginStatus.id,
        };

        const response = await axios.post(
          POST_API.GET_NOTIFICATION_LIST_FOR_WEB,
          postData,
          { withCredentials: true }
        );

        const fetchedData = response.data || [];

        setNotificationList((prev) => [...prev, ...fetchedData]);

        //  Key Logic: If returned records < limit → no more data
        if (fetchedData.length < limit) {
          setHasMore(false);
        }
      } catch (error: any) {
        if (error?.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: getNotificationListForWeb,
          });

          if (refreshTokenResponse) {
            getNotificationListForWeb(currentOffset);
          }
        } else if (error?.response?.status === 503) {
          toast.error("Service is down.");
        } else if (error?.response?.status === 500) {
          toast.error("Internal Server Error");
        }
      } finally {
        setShowLoadingSpinner(false);
      }
    },
    [loginStatus, limit, showLoadingSpinner]
  );

  /*Initial Load */

  useEffect(() => {
    setNotificationList([]);
    setOffset(0);
    setHasMore(true);

    getNotificationListForWeb(0);
  }, []);

  /* Infinite Scroll*/

  useEffect(() => {
    if (showLoadingSpinner || !hasMore) return;

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
      if (lastNotificationRef.current) {
        observer.unobserve(lastNotificationRef.current);
      }
    };
  }, [offset, hasMore, showLoadingSpinner, limit, getNotificationListForWeb]);

  /* Clear Notifications*/

  const handleUpdateNotificationListWebClear = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (notificationList.length === 0) {
      toast.error("No notification found");
      return;
    }

    try {
      const postData = {
        company_id: loginStatus.companyId,
        company_user_id: loginStatus.id,
        updatedby: loginStatus.id,
      };

      const response = await axios.post(
        POST_API.UPDATE_NOTIFICATION_LIST_FOR_WEB_CLEAR,
        postData,
        { withCredentials: true }
      );

      toast.success(response.data.message);

      if (response.data.status) {
        setNotificationList([]);
        setOffset(0);
        setHasMore(true);
      }
    } catch (error: any) {
      if (error?.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithEvent: handleUpdateNotificationListWebClear,
        });

        if (refreshTokenResponse) {
          handleUpdateNotificationListWebClear(event);
        }
      } else if (error?.response?.status === 503) {
        toast.error("Service is down.");
      } else if (error?.response?.status === 500) {
        toast.error("Internal Server Error");
      }
    }
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
      <div className="flex justify-between items-center p-2 border-b table-header-custom bg-gray-100 rounded-t-2xl">
        <span>Notifications!</span>
        <button
          type="button"
          onClick={handleUpdateNotificationListWebClear}
          className="caption-custom-inactive hover:text-red-600"
        >
          Clear all
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px] rounded-b-2xl  overflow-y-auto custom-scrollbar">
        {notificationList.length === 0 && !showLoadingSpinner ? (
          <div className="p-6 text-center caption-custom">
            No notifications to display
          </div>
        ) : showLoadingSpinner && notificationList.length === 0 ? (
          <NotificationSkeleton count={4}/>
        ) : (
          <div className="border-b ">
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
                  <p className="input-label-custom-blue">
                    {notification.notification_subject}
                  </p>
                  {/* Mark as Read Button */}

                  {!notification.is_read ? (
                    loadingId === notification.id ? (
                      <div className="w-auto mr-7 h-auto flex items-center justify-end ">
                        <Loader2Icon className="w-4 h-4 caption-custom animate-spin " />
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleUpdateNotificationListWeb(notification.id)
                        }
                        className="caption-custom-blue bg-blue-00"
                      >
                        Mark as Read
                      </button>
                    )
                  ) : null}
                </div>

                {/* Body */}
                <p className="caption-custom ">
                  {notification.notification_body}
                </p>

                <span className="caption-custom">
                  {notification.notification_request_date}
                </span>
              </div>
            ))}

            {/* Bottom Loader */}
            {showLoadingSpinner && (
              <NotificationSkeleton count={4}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
