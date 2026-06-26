/* eslint-disable @typescript-eslint/no-explicit-any */

import { Bell, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import FormHeader from "../../../ui/FormHeader";
import GoogleCalendarIcon from "../../../../assets/svg/GoogleCalendarIcon";
import axiosClient from "../../../../axios-client/AxiosClient";
// import OutlookCalendarIcon from "../../../../assets/svg/OutlookCalendarIcon";
import POST_API from "../../../../constants/PostApi";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import AccessDeniedMessagePage from "../../not-found/AccessDeniedMessagePage";
import MESSAGE from "../../../../constants/Messages";
import FacebookPageSkeleton from "../social-media-integration/meta-app-facebook/PafeIdListCardPopUp";

interface ProviderCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  email: string;
  isConnected: boolean;
  onConnect: () => void;
  onRevoke: () => void;
  isEnable?: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  icon: Icon,
  title,
  description,
  email,
  isConnected,
  onConnect,
  onRevoke,
  isEnable,
}) => {
  return (
    <div className="rounded-lg p-4 bg-white shadow-sm border border-gray-200 h-40 flex flex-col justify-between hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <Icon className="w-8 h-8" />

        <div>
          <h3 className="table-data-custom">{title}</h3>
          <p className="caption-custom">{description}</p>
          {isConnected && email && (
            <p className="text-xs flex items-center gap-1 text-gray-500 mt-1">
              <Mail size={12} color="red" />
              Connected as: <span className="font-medium">{email}</span>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={isConnected ? onRevoke : onConnect}
        title={isEnable ? "" : "access denied"}
        disabled={!isEnable}
        className={`self-end px-3 py-1 text-sm text-white rounded transition ${isEnable ? "" : "cursor-not-allowed bg-blue-200 hover:bg-blue-200"} ${
          isConnected
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isConnected ? "Revoke" : "Connect"}
      </button>
    </div>
  );
};

function ReminderSetting() {
  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
  const [googleCalendarData, setGoogleCalendarData] = useState<any>({});
  // const [isOutlookConnected, setIsoutlookConnected] = useState<boolean>(false);
  const {
    userHasAccessToUpdateSettingReminder,
    userHasAccessToViewSettingReminder,
  } = useUserAccessModules();

  // =============================
  // Fetch provider status
  // =============================
  const fetchProviderStatus = async () => {
    if (!userHasAccessToViewSettingReminder) return;
    try {
      setIsLoading(true);

      const response = await axiosClient.post(
        POST_API.GET_GOOGLE_CALENDAR_PROVIDER_STATUS,
        {
          company_user_id: loginStatus.id,
          company_id: loginStatus.companyId,
          requestedby_id: loginStatus.id,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;

      if (data && data.length > 0) {
        const googleProvider = data.find((p: any) => p.calendar_type_id == 1);
        // const outlookProvider = data.find((p: any) => p.calendar_type_id == 2);

        if (googleProvider) {
          setGoogleCalendarData(googleProvider);
          setIsGoogleConnected(googleProvider.isactive);
        }
        // if (outlookProvider) {
        //   setIsoutlookConnected(outlookProvider.isactive);
        // }
      }
    } catch (error) {
      console.error("Error fetching provider status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderStatus();
  }, []);

  // =============================
  // Connect Google
  // =============================
  const connectGoogleCalendar = () => {
    const userId = loginStatus.id;
    const companyId = loginStatus.companyId;

    const state = encodeURIComponent(
      JSON.stringify({
        userId: userId,
        companyId: companyId,
      }),
    );

    window.location.href = POST_API.GOOGLE_CALENDAR_CONNECT_URL + state;
  };

  // =============================
  // Revoke Google
  // =============================
  const revokeGoogleCalendar = async () => {
    try {
      setIsLoading(true);

      await axiosClient.post(POST_API.GOOGLE_CALENDAR_REVOKE, {
        company_id: loginStatus.companyId,
        company_user_id: loginStatus.id,
        calendar_type_id: 1,
        isactive: true,
        requestedby_id: loginStatus.id,
        updatedby_id: loginStatus.id,
      });

      setIsGoogleConnected(false);
    } catch (error) {
      console.error("Error revoking Google:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const integrations = [
    {
      id: "google",
      providerId: 1,
      icon: GoogleCalendarIcon,
      title: "Google Calendar",
      description:
        "Sync CRM tasks and reminders with your Google Calendar automatically.",
      email: googleCalendarData?.email,
      onConnect: connectGoogleCalendar,
      onRevoke: revokeGoogleCalendar,
      isConnect: isGoogleConnected,
      isEnable: userHasAccessToUpdateSettingReminder,
    },
    // {
    //   id: "outlook",
    //   providerId: 2,
    //   icon: OutlookCalendarIcon,
    //   title: "Outlook Calendar",
    //   description:
    //     "Integrate Outlook Calendar to manage meetings and CRM reminders.",
    //   email: "",
    //   onConnect: connectGoogleCalendar,
    //   onRevoke: revokeGoogleCalendar,
    //   isConnect: isOutlookConnected,
    //   isEnable: userHasAccessToUpdateSettingReminder,
    // },
  ];
  return userHasAccessToViewSettingReminder ? (
    <div className="w-full min-h-screen lg:p-2">
      <FormHeader
        preText="Manage your company's default settings and services."
        description="Choose how you want to receive Reminders. You can enable or disable different channels based on your preference. Reminders will be sent through Mobile, or directly in your Web browser."
        icon={Bell}
        isModal={false}
        wantBorderBottom={false}
      />

      {isLoading ? (
         <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                <FacebookPageSkeleton />
              </div>
      ) : (
        <div className="grid grid-cols-2 p-5 gap-6 mt-1">
          {/* //  <div className="w-full max-w-2xl min-h-96 mx-auto p-4 space-y-4"> */}
          {integrations.map((provider: any) => (
            <ProviderCard
              key={provider.id}
              icon={provider.icon}
              title={provider.title}
              description={provider.description}
              email={provider?.email}
              isConnected={provider.isConnect}
              onConnect={provider.onConnect}
              onRevoke={provider.onRevoke}
              isEnable={userHasAccessToUpdateSettingReminder}
            />
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="flex-none mx-96 mt-14 h-[77vh] justify-center items-center">
      <AccessDeniedMessagePage
        message={MESSAGE.MODULE_ACCESS.SETTING.REMINDER.DENIED_VIEW_ACCESS}
      ></AccessDeniedMessagePage>
    </div>
  );
}

export default ReminderSetting;
