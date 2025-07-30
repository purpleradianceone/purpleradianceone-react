import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import LeadFormEmbed from "./LeadFormEmbed";
import LeadSetting from "../views/settings/lead-settings/LeadSetting";
import EmailSetting from "../../components/views/settings/email-settings/EmailSetting";
import MeetingSettings from "../views/settings/meeting-settings/MeetingSetting";
import CompanyPreferenceSetting from "../views/settings/company-preferences/CompanyPreferenceSetting";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import AccessDeniedMessagePage from "../views/not-found/AccessDeniedMessagePage";
import UserPrerefenceManagement from "../user-profile/UserPreferenceManagement";

function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("onlineLead");

  const {
    userHasAccessToViewSettingLeady,
    userHasAccessToViewCompanyPreferences,
    userHasAccessToViewMeetingSetting,
    userHasAccessToViewSettingGeneral,
  } = useUserAccessModules();

  const data = [
    {
      label: "Lead",
      value: "onlineLead",
      desc: (
        <>
          {userHasAccessToViewSettingLeady ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <LeadSetting />
              </div>

              <div className="col-span-1">
                <LeadFormEmbed></LeadFormEmbed>
              </div>
            </div>
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
    {
      label: "Email",
      value: "emailSettings",
      desc: <EmailSetting />,
    },
    {
      label: "Meetings",
      value: "meeting",
      desc: (
        <>
          {userHasAccessToViewMeetingSetting ? (
            <MeetingSettings></MeetingSettings>
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
    {
      label: "Company Preferences",
      value: "companyPreference",
      desc: (
        <>
          {userHasAccessToViewCompanyPreferences ? (
            <CompanyPreferenceSetting></CompanyPreferenceSetting>
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
    {
      label: "General",
      value: "general",
      desc: (
        <>
          {userHasAccessToViewSettingGeneral ? (
            <UserPrerefenceManagement />
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="relative">
      <Tabs value={activeTab}>
        <div className="sticky top-0 bg-white pb-2">
          <TabsHeader
            placeholder="Online Lead"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            className="rounded-none border-b border-blue-gray-50  bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
          >
            {data.map(({ label, value }) => (
              <Tab
                placeholder="Online Lead"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value ? "text-gray-900 text-sm" : "text-sm"
                }
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
          <TabsBody
            placeholder="Online Lead"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </div>
      </Tabs>
    </div>
  );
}

export default SettingsTabs;
