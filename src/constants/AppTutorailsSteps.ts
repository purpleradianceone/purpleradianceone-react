import type { Step } from "react-joyride";

export const NavbarSteps: Step[] = [
    {
    target: "#company-name-navbar",
    content: "Company Name is displayed here and you and click here to return to the dashboard",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#left-side-navbar",
    content: "navigate to different modules easily",
    placement: "right",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#notifications-navbar",
    content: "See your notifications and manage it from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#panel-layout-navbar",
    content: "Manage your navbar position form here as per your choice",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#profile-actions-navbar",
    content: "Manage your profile and its settings form here as per your choice",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
]

export const DashboardTabsSteps: Step[] = [
  {
    target: "#CRMDashboardTab",
    content: "Navigate to Crm related dashboard from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#SupportDashboardTab",
    content: "Navigate to Support related dashboard from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#InventoryDashboardTab",
    content: "Navigate to Inventory related dashboard from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#FinanceDashboardTab",
    content: "Navigate to Finance related dashboard from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#HRMSDashboardTab",
    content: "Navigate to HRMS related dashboard from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#crmDashBoardCompanyUsersDropdown",
    content: "Browse to other users dashboard and check there insights from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
    locale: { last: "Finish Tour" },
  },
];

export const DashboardCrmSteps: Step[] = [
  {
    target: "#totalLeadsMetricCard",
    content: "Number of your total leads",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
    disableScrolling:true,
  },
  {
    target: "#activeLeadsMetricCard",
    content: "Number of your total leads",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
    disableScrolling:true,
  },
  {
    target: "#convertedLeadsMetricCard",
    content: "Number of your converted leads",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
    disableScrolling:true,
  },
  {
    target: "#unqualifiedLeadsMetricCard",
    content: "Number of your unqaualified leads",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
    disableScrolling:true,
  },
  {
    target: "#lostLeadsMetricCard",
    content: "Number of your lost leads",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
    disableScrolling:true,
  },
  {
    target: "#conversionRateMetricCard",
    content: "your conversion rate",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
    disableScrolling:true,
  },
  {
    target: "#leadByStatusPipeline",
    content: "Check your insights of leads by the lead status",
    placement: "top",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#leadBySource",
    content: "Check your insights of leads by the lead Sources",
    placement: "top",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#monthlyPerformance",
    content: "Check your insights of leads for last 12 months",
    placement: "top",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#pendingTasks",
    content: "Check your insights of pending lead tasks",
    placement: "top",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#upcomingTasks",
    content: "Check your insights of upcoiming lead tasks",
    placement: "top",
    disableBeacon: true,
    isFixed:true,
    disableOverlayClose: true,
  },
  {
    target: "#quickActions",
    content: "access all your quick actions for your application",
    placement: "top",
    disableBeacon: true,
    isFixed:true, 
    disableOverlayClose: true,
    locale: { last: "Finish Tour" },
  },
];

export const CompanyUsersModuleSteps: Step[] = [
   {
    target: ".company-user-module-search-box",
    content: "Search the company users using this search box",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#company-users-module-date-range-filter",
    content: "Use different type of date related filters for applying the filters",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#company-users-module-add-button",
    content: "Add/Create the new company users from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  {
    target: "#add-company-user-modal",
    content: "Add/Create the new company users using this form",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
    styles : {
      overlay : {
        accentColor: "white",
        opacity : 0.6
      }
    }
  },
  // {
  //   target: ".company-users-actions-column",
  //   content: "Manage your company users related actions from here",
  //   placement: "bottom",
  //   disableBeacon: true,
  //   disableOverlayClose: true,
  // },
  {
    target: "#actions-button",
    content: "Manage your company users related actions from here",
    placement: "bottom",
    disableBeacon: true,
    disableOverlayClose: true,
  },
  
]
