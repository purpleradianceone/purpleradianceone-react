import {
  Building2,
  Calendar,
  Handshake,
  Home,
  Menu,
  Network,
  Settings,
  Store,
  UserCogIcon,
  X,
} from "lucide-react";
import SideBarProps from "../../../../@types/home/navbar/SideBarProps";
import SideNavBarItem from "./SideNavBarItem";
import { NavLink } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";

function SideNavBar({ isOpen, onToggle }: SideBarProps) {
  const {
    userHasAccessToViewUser,
    userHasAccessToViewLead,
    userHasAccessToViewAccount,
    userHasAccessToViewProduct,
    userHasAccessToViewTeamManagement,
    userHasAccessToViewMeeting,
  } = useUserAccessModules();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white border-r transition-all duration-300 z-30
          ${isOpen ? "w-64" : "w-14"}`}
    >
      <div className="flex items-center border-b justify-between px-4 h-12">
        {isOpen && (
          <span className="section-header-custom-blue">PurpleRadiance One</span>
        )}
        <button
          onClick={onToggle}
          className="section-header-custom hover:text-blue-800 rounded-lg"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav className="p-3 space-y-1">
        <NavLink to={ROUTES_URL.HOME}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Home}
              label="Home"
              isOpen={isOpen}
              isActive={isActive}
            />
          )}
        </NavLink>

        {/* Enabled Nav Links */}
        {userHasAccessToViewUser && (
          <NavLink to={ROUTES_URL.GET_COMPANY_USERS}>
            {({ isActive }) => (
              <SideNavBarItem
                icon={Building2}
                label="Manage Users"
                isOpen={isOpen}
                isActive={isActive}
              />
            )}
          </NavLink>
        )}
        {userHasAccessToViewLead && (
          <NavLink to={ROUTES_URL.GET_LEAD_MANAGEMENT}>
            {({ isActive }) => (
              <SideNavBarItem
                icon={Handshake}
                label="Leads"
                isOpen={isOpen}
                isActive={isActive}
              />
            )}
          </NavLink>
        )}
        {userHasAccessToViewAccount && (
          <NavLink to={ROUTES_URL.ACCOUNT_MANAGEMENT}>
            {({ isActive }) => (
              <SideNavBarItem
                icon={UserCogIcon}
                label="Accounts"
                isOpen={isOpen}
                isActive={isActive}
              />
            )}
          </NavLink>
        )}
        {userHasAccessToViewProduct && (
          <NavLink to={ROUTES_URL.PRODUCT_MANAGEMENT}>
            {({ isActive }) => (
              <SideNavBarItem
                icon={Store}
                label="Products"
                isOpen={isOpen}
                isActive={isActive}
              />
            )}
          </NavLink>
        )}
        {userHasAccessToViewTeamManagement && (
          <NavLink to={ROUTES_URL.TEAM_MANAGEMENT}>
            {({ isActive }) => (
              <SideNavBarItem
                icon={Network}
                label="Teams"
                isOpen={isOpen}
                isActive={isActive}
              />
            )}
          </NavLink>
        )}
        {userHasAccessToViewMeeting && (
          <NavLink to={ROUTES_URL.MEETINGS}>
            {({ isActive }) => (
              <SideNavBarItem
                icon={Calendar}
                label="Meetings"
                isOpen={isOpen}
                isActive={isActive}
              />
            )}
          </NavLink>
        )}

        {/* Disabled Nav Links - Don't need NavLink, as they don't navigate */}
        {!userHasAccessToViewUser && (
          <SideNavBarItem
            icon={Building2}
            label="Manage Users"
            isOpen={isOpen}
            disabled={true}
          />
        )}
        {!userHasAccessToViewLead && (
          <SideNavBarItem
            icon={Handshake}
            label="Leads"
            isOpen={isOpen}
            disabled={true}
          />
        )}
        {!userHasAccessToViewAccount && (
          <SideNavBarItem
            icon={UserCogIcon}
            label="Accounts"
            isOpen={isOpen}
            disabled={true}
          />
        )}
        {!userHasAccessToViewProduct && (
          <SideNavBarItem
            icon={Store}
            label="Products"
            isOpen={isOpen}
            disabled={true}
          />
        )}
        {!userHasAccessToViewTeamManagement && (
          <SideNavBarItem
            icon={Network}
            label="Teams"
            isOpen={isOpen}
            disabled={true}
          />
        )}
        {!userHasAccessToViewMeeting && (
          <SideNavBarItem
            icon={Calendar}
            label="Meetings"
            isOpen={isOpen}
            disabled={true}
          />
        )}

        {/* CRM Settings Dropdown */}
        <SideNavBarItem
          icon={Settings}
          label="App Settings"
          isOpen={isOpen}
          children={[
            <NavLink key="company-settings" to={ROUTES_URL.COMPANY_SETTING}>
              {({ isActive }) => (
                <div
                  className={`px-2 py-1 rounded-lg hover:bg-blue-50 ${
                    isActive ? "input-label-custom-blue" : "input-label-custom"
                  }`}
                >
                  Settings
                </div>
              )}
            </NavLink>,
            <NavLink key="email-template" to={ROUTES_URL.EMAIL_TEMPLATE}>
              {({ isActive }) => (
                <div
                  className={`px-2 py-1 rounded-lg hover:bg-blue-50 text-nowrap ${
                    isActive ? "input-label-custom-blue" : "input-label-custom"
                  }`}
                >
                  Email Template
                </div>
              )}
            </NavLink>,
            <NavLink key="integrations" to={ROUTES_URL.INTEGRATIONS_SETTINGS}>
              {({ isActive }) => (
                <div
                  className={`px-2 py-1 rounded-lg hover:bg-blue-50 ${
                    isActive ? "input-label-custom-blue" : "input-label-custom"
                  }`}
                >
                  Integration
                </div>
              )}
            </NavLink>,
          ]}
        />
      </nav>
    </aside>
  );
}

export default SideNavBar;
