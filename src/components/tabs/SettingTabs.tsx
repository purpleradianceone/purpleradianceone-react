import {
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";

// function SettingsTabs() {
//   const [activeTab, setActiveTab] = useState("onlineLead");

//   const {
//     userHasAccessToViewSettingLeady,
//     userHasAccessToViewCompanyPreferences,
//     userHasAccessToViewMeetingSetting,
//     userHasAccessToViewSettingGeneral,
//     userHasAccessToViewCompanyAccountType,
//   } = useUserAccessModules();

//   const data = [
//     {
//       label: "Lead",
//       value: "onlineLead",
//       desc: (
//         <>
//           {userHasAccessToViewSettingLeady ? (
//             activeTab === "onlineLead" && (
//               <div className="grid grid-cols-1 gap-2">
//                 <div className="col-span-1 min-h-full">
//                   <LeadSetting />
//                 </div>
//               </div>
//             )
//           ) : (
//             <AccessDeniedMessagePage></AccessDeniedMessagePage>
//           )}
//         </>
//       ),
//     },
//     {
//       label: "Email",
//       value: "emailSettings",
//       desc: activeTab === "emailSettings" && <EmailSetting />,
//     },
//     {
//       label: "Meetings",
//       value: "meeting",
//       desc: (
//         <>
//           {userHasAccessToViewMeetingSetting ? (
//             activeTab === "meeting" && <MeetingSettings></MeetingSettings>
//           ) : (
//             <AccessDeniedMessagePage></AccessDeniedMessagePage>
//           )}
//         </>
//       ),
//     },
//     {
//       label: "Account Type",
//       value: "accounttype",
//       desc: (
//         <>
//           {userHasAccessToViewCompanyAccountType ? (
//             activeTab === "accounttype" && <AccountTypeSetting />
//           ) : (
//             <AccessDeniedMessagePage></AccessDeniedMessagePage>
//           )}
//         </>
//       ),
//     },
//     {
//       label: "Company Preferences",
//       value: "companyPreference",
//       desc: (
//         <>
//           {userHasAccessToViewCompanyPreferences ? (
//             activeTab === "companyPreference" && (
//               <CompanyPreferenceSetting></CompanyPreferenceSetting>
//             )
//           ) : (
//             <AccessDeniedMessagePage></AccessDeniedMessagePage>
//           )}
//         </>
//       ),
//     },
//     {
//       label: "General",
//       value: "general",
//       desc: (
//         <>
//           {userHasAccessToViewSettingGeneral ? (
//             activeTab === "general" && <UserPrerefenceManagement />
//           ) : (
//             <AccessDeniedMessagePage></AccessDeniedMessagePage>
//           )}
//         </>
//       ),
//     },
//     {
//       label: "Support Ticket Category",
//       value: "setting",
//       desc: (
//         <>
//           {userHasAccessToViewSettingGeneral ? (
//             activeTab == "setting" && <SupportTicketCategorySetting></SupportTicketCategorySetting>
//           ) : (
//             <AccessDeniedMessagePage></AccessDeniedMessagePage>
//           )}
//         </>
//       ),
//     },

//     {
//       label: "Company Warehouse",
//       value: "warehouse",
//       desc: (
//         <>
//           {userHasAccessToViewSettingGeneral ? (
//             activeTab == "warehouse" && <CompanyWarehouseSetting></CompanyWarehouseSetting>
//           ) : (
//             <AccessDeniedMessagePage></AccessDeniedMessagePage>
//           )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="relative">
//       <Tabs value={activeTab}>
//         <div className="sticky top-0  bg-white pb-2">
//           <TabsHeader
//             placeholder="Online Lead"
//             onPointerEnterCapture={undefined}
//             onPointerLeaveCapture={undefined}
//             onResize={undefined}
//             onResizeCapture={undefined}
//             indicatorProps={{
//               className:
//                 "main-nav-custom active-header shadow-none focus:outline-none",
//             }}
//             className="shadow-none focus:outline-none"
//           >
//             {data.map(({ label, value }) => (
//               <Tab
//                 placeholder="Online Lead"
//                 onPointerEnterCapture={undefined}
//                 onPointerLeaveCapture={undefined}
//                 onResize={undefined}
//                 onResizeCapture={undefined}
//                 key={value}
//                 value={value}
//                 onClick={() => setActiveTab(value)}
//                 className={
//                   activeTab === value
//                     ? "main-nav-custom active-tab mt-0.5"
//                     : "main-nav-custom"
//                 }
//               >
//                 {label}
//               </Tab>
//             ))}
//           </TabsHeader>
//         </div>

//         {/* Scrollable content */}
//         <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
//           <TabsBody
//             placeholder="Online Lead"
//             onPointerEnterCapture={undefined}
//             onPointerLeaveCapture={undefined}
//             onResize={undefined}
//             onResizeCapture={undefined}
//           >
//             {data.map(({ value, desc }) => (
//               <TabPanel key={value} value={value}>
//                 { desc}
//               </TabPanel>
//             ))}
//           </TabsBody>
//         </div>
//       </Tabs>
//     </div>
//   );
// }

function SettingsTabs() {
  const TABS = [
    { label: "Lead", value: "lead", path: "" }, // index route
    { label: "Email", value: "email-setting", path: ROUTES_URL.SETTING_EMAIL },
    { label: "Meetings", value: "meeting", path: ROUTES_URL.SETTING_MEETINGS },
    { label: "Account Type", value: "accounttype", path: ROUTES_URL.SETTING_ACCOUNT_TYPE },
    {
      label: "Notifications",
      value: "companyPreference",
      path: ROUTES_URL.SETTING_NOTIFICATIONS,
    },
    { label: "General", value: "general", path: ROUTES_URL.SETTING_GENERAL },
    {
      label: "Support Ticket Category",
      value: "support-ticket-category",
      path: ROUTES_URL.SETTING_SUPPORT_TICKET_CATEGORY,
    },
    { label: "Company Warehouse", value: "warehouse", path: ROUTES_URL.SETTING_COMPANY_WAREHOUSE },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const basePath = ROUTES_URL.COMPANY_SETTING;

  const activeTab =
    TABS.find((tab) =>
      tab.path
        ? location.pathname.includes(tab.path)
        : location.pathname === basePath
    )?.value || "lead";

  return (
    <div className="relative">
      <Tabs value={activeTab}>
        <div className="sticky top-0 bg-white">
          <TabsHeader
            placeholder=""
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            indicatorProps={{
              className: "main-nav-custom-setting active-header-setting shadow-none",
            }}
            className="shadow-none"
          >
            {TABS.map(({ label, value, path }) => (
              <Tab
                key={value}
                value={value}
                onClick={() =>
                  navigate(path ? `${basePath}/${path}` : basePath)
                }
                className={
                  activeTab === value
                    ? "main-nav-custom-setting active-tab-setting mt-0.5"
                    : "main-nav-custom-setting"
                }
                placeholder=""
                onResize={undefined}
                onResizeCapture={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      </Tabs>
    </div>
  );
}

export default SettingsTabs;
