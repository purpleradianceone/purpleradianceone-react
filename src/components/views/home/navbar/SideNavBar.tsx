import {
  Building2,
  Calendar,
  Handshake,
  Headset,
  Home,
  Layers,
  ListChecks,
  LucideFileArchive,
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
import { SIZE } from "../../../../constants/AppConstants";
import { LiaFileInvoiceSolid } from "react-icons/lia";

function SideNavBar({ isOpen, onToggle }: SideBarProps) {
  const {
    userHasAccessToViewUser,
    userHasAccessToViewLead,
    userHasAccessToViewAccount,
    userHasAccessToViewProduct,
    userHasAccessToViewTeamManagement,
    userHasAccessToViewMeeting,
    userHasAccessToViewStock,
    userHasAccessToViewSupportTicket,
    userHasAccessToViewTasks,
    userHasAccessToViewCompanyInvoice,
    userHasAccessToViewCompanyQuotation,
  } = useUserAccessModules();

  return (
    <aside
      id="left-side-navbar"
      className={`fixed  top-0 left-0 h-full bg-white border-r transition-all duration-300 z-30
          ${isOpen ? "w-64 overflow-y-auto" : "w-12"}`}
    >
      <div
        className={`flex items-center border-b justify-center ${SIZE.NAVBAR.TOP_HEIGHT_USER_PREF_LEFT}`}
      >
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
      <nav className="p-1 space-y-1">
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
        <NavLink to={ROUTES_URL.GET_COMPANY_USERS}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Building2}
              label="Manage Users"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewUser}
            />
          )}
        </NavLink>
        <NavLink to={ROUTES_URL.TASKS_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={ListChecks}
              label="Tasks"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewTasks}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.GET_LEAD_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Handshake}
              label="Leads"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewLead}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.QUOTATION_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={LucideFileArchive}
              label="Quotation"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewCompanyQuotation}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.ACCOUNT_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={UserCogIcon}
              label="Accounts"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewAccount}
            />
          )}
        </NavLink>
        <NavLink to={ROUTES_URL.INVOICE_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={LiaFileInvoiceSolid}
              label="Invoices"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewCompanyInvoice}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.PRODUCT_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Store}
              label="Products"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewProduct}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.STOCK_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Layers}
              label="Stock"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewStock}
            />
          )}
        </NavLink>
        <NavLink to={ROUTES_URL.SUPPORT_TICKET_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Headset}
              label="Support"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewSupportTicket}
            />
          )}
        </NavLink>
        <NavLink to={ROUTES_URL.TEAM_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Network}
              label="Teams"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewTeamManagement}
            />
          )}
        </NavLink>
        <NavLink to={ROUTES_URL.MEETINGS}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Calendar}
              label="Meetings"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewMeeting}
            />
          )}
        </NavLink>

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
            <NavLink key="quotations" to={ROUTES_URL.QUOTATION_SETTINGS}>
              {({ isActive }) => (
                <div
                  className={`px-2 py-1 rounded-lg hover:bg-blue-50 ${
                    isActive ? "input-label-custom-blue" : "input-label-custom"
                  }`}
                >
                  Quotation Template
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
