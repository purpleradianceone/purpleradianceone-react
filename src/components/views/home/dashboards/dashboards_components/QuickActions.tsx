import {
  Plus,
  UserPlus,
  Calendar,
  Mail,
  LayoutPanelLeft,
  Store,
  Network,
  Settings,
  Headset,
} from "lucide-react";
import ROUTES_URL from "../../../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import { getQuickActionColor } from "../../../../../constants/QuickActionsStyle";
import { AccessManagementType } from "../../../../../@types/company-users/AccessManagementContextType";

interface QuickActionsProp {
  companyUserId: number | null;
  moduleAccessCompanyUser: AccessManagementType[];
}
const QuickActions: React.FC<QuickActionsProp> = ({
  companyUserId,
  moduleAccessCompanyUser,
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: "New Deal",
      description: "Create opportunity",
      icon: Plus,
      shortcut: "Lead",
      route: ROUTES_URL.CREATE_LEAD,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 3
            )[0].add ?? false
          : false,
    },
    {
      id: 2,
      title: "Add User",
      description: "New User",
      icon: UserPlus,
      shortcut: "Users",
      route: ROUTES_URL.CREATE_COMPANY_USER,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 1
            )[0].add ?? false
          : false,
    },
    {
      id: 3,
      title: "Schedule",
      description: "Book meeting",
      icon: Calendar,
      shortcut: "Meetings",
      route: ROUTES_URL.SCHEDULE_MEETING,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 12
            )[0].add ?? false
          : false,
    },
    {
      id: 4,
      title: "Email Template",
      description: "Create Email Template",
      icon: Mail,
      shortcut: "Templates",
      route: ROUTES_URL.EMAIL_TEMPLATE,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 15
            )[0].add ?? false
          : false,
    },
    {
      id: 5,
      title: "Settings",
      description: "Manage Settings ",
      icon: Settings,
      shortcut: "Settings",
      route: ROUTES_URL.COMPANY_SETTING,
      visibility: moduleAccessCompanyUser.length !== 0 ? true : false,
    },
    {
      id: 6,
      title: "Prefrences",
      description: "Manage Prefrences",
      icon: LayoutPanelLeft,
      shortcut: "Preferences",
      route: ROUTES_URL.USER_PROFILE_SETTING,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 9
            )[0].view ?? false
          : false,
    },
    {
      id: 7,
      title: "Products",
      description: "Manage Products",
      icon: Store,
      shortcut: "Product",
      route: ROUTES_URL.PRODUCT_MANAGEMENT,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 4
            )[0].view ?? false
          : false,
    },
    {
      id: 8,
      title: "Teams",
      description: "Manage Teams  ",
      icon: Network,
      shortcut: "Team",
      route: ROUTES_URL.TEAM_MANAGEMENT,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 6
            )[0].view ?? false
          : false,
    },
    {
      id: 10,
      title: "New Product",
      description: "Create Product",
      icon: Plus,
      shortcut: "Product",
      route: ROUTES_URL.CREATE_PRODUCT,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 4
            )[0].add ?? false
          : false,
    },
    {
      id: 11,
      title: "Create Team",
      description: "New Team     ",
      icon: UserPlus,
      shortcut: "Teams",
      route: ROUTES_URL.CREATE_TEAM,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 6
            )[0].add ?? false
          : false,
    },
    {
      id: 12,
      title: "Account Management",
      description: "Account Section   ",
      icon: UserPlus,
      shortcut: "Accounts",
      route: ROUTES_URL.ACCOUNT_MANAGEMENT,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 20
            )[0].view ?? false
          : false,
    },
    {
      id: 13,
      title: "Support",
      description: "Support Ticket Management  ",
      icon: Headset,
      shortcut: "Support Tickets",
      route: ROUTES_URL.SUPPORT_TICKET_MANAGEMENT,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 22
            )[0].view ?? false
          : false,
    },
    {
      id: 14,
      title: "Support",
      description: "Create Support Ticket Management",
      icon: Headset,
      shortcut: "Create Ticket",
      route: `${ROUTES_URL.SUPPORT_TICKET_MANAGEMENT}?fromDashboard=true`,
      visibility:
        moduleAccessCompanyUser.length !== 0
          ? moduleAccessCompanyUser.filter(
              (molule) => molule.crm_module_id === 22
            )[0].add ?? false
          : false,
    },
  ];

  return (
    <div className="bg-white min-h-full rounded-2xl shadow-lg border border-gray-100 p-8 ">
      <div className="mb-8">
        <h3 className="section-header-custom mb-2">Quick Actions</h3>
        <p className="table-header-custom">Frequently used CRM functions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions
          .filter((action) => action.visibility)
          .map((action, index) => (
            <button
              key={action.id}
              onClick={() => {
                if (loginStatus.id !== companyUserId) {
                  // toast.error(MESSAGE.ERROR.YOU_ARE_NOT_ON_YOUR_DASHBOARD);
                  // return;
                }
                if (action.id !== 3) {
                  navigate(action.route);
                } else {
                  navigate(
                    ROUTES_URL.SCHEDULE_MEETING +
                      "?from=" +
                      window.location.pathname
                  );
                }
              }}
              className={`${getQuickActionColor(
                action.description.length
              )} text-white p-5 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 group relative overflow-hidden `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* The change is in this div, specifically the flex classes */}
              <div className="relative flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <action.icon className="w-6 h-6" />
                  <span className="caption-custom white-text opacity-75">
                    {action.shortcut}
                  </span>
                </div>
                <div className="text-left mt-auto">
                  {" "}
                  {/* mt-auto pushes this to the bottom */}
                  <h4 className="caption-custom white-text mb-1">
                    {action.title}
                  </h4>
                  <p className="caption-custom white-text opacity-90">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default QuickActions;
