import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import LeadSetting from "../views/settings/lead-settings/LeadSetting";
import EmailSetting from "../../components/views/settings/email-settings/EmailSetting";
import MeetingSettings from "../views/settings/meeting-settings/MeetingSetting";
import CompanyPreferenceSetting from "../views/settings/company-preferences/CompanyPreferenceSetting";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import AccessDeniedMessagePage from "../views/not-found/AccessDeniedMessagePage";
import UserPrerefenceManagement from "../user-profile/UserPreferenceManagement";
import AccountTypeSetting from "../views/settings/account-type/AccountTypeSetting";

function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("onlineLead");

  const {
    userHasAccessToViewSettingLeady,
    userHasAccessToViewCompanyPreferences,
    userHasAccessToViewMeetingSetting,
    userHasAccessToViewSettingGeneral,
    userHasAccessToViewCompanyAccountType
  } = useUserAccessModules();

  const data = [
    {
      label: "Lead",
      value: "onlineLead",
      desc: (
        <>
          {userHasAccessToViewSettingLeady ? (
            activeTab === "onlineLead" &&
            <div className="grid grid-cols-1 gap-2">
              <div className="col-span-1 min-h-full">
                <LeadSetting />
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
      desc:  activeTab === "emailSettings" && <EmailSetting />,
    },
     {
      label: "Meetings",
      value: "meeting",
      desc: (
        <>
          {userHasAccessToViewMeetingSetting ? (
            activeTab === "meeting" && <MeetingSettings></MeetingSettings>
          ) : (
            <AccessDeniedMessagePage></AccessDeniedMessagePage>
          )}
        </>
      ),
    },
    {
      label: "Account Type",
      value: "accounttype",
      desc: (
        <>
          {userHasAccessToViewCompanyAccountType ? (
            activeTab === "accounttype" && <AccountTypeSetting/>
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
           activeTab === "companyPreference" && <CompanyPreferenceSetting></CompanyPreferenceSetting>
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
            activeTab === "general" && <UserPrerefenceManagement />
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
        <div className="sticky top-0  bg-white pb-2">
          <TabsHeader
            placeholder="Online Lead"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            indicatorProps={{
              className:
                "main-nav-custom active-header shadow-none focus:outline-none",
            }}
            className="shadow-none focus:outline-none"
            
          >
            {data.map(({ label, value }) => (
              <Tab
                placeholder="Online Lead"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
            onResizeCapture={undefined}
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value ? "main-nav-custom active-tab mt-0.5" : "main-nav-custom"
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
            onResize={undefined}
            onResizeCapture={undefined}
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
