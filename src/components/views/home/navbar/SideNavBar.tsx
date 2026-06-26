
import {
  Building,
  Calendar,
  CircleUser,
  FileBarChart,
  FileText,
  Handshake,
  Headset,
  Home,
  Layers,
  ListChecks,
  LucideFileArchive,
  Menu,
  Network,
  PackageCheck,
  PanelLeftClose,
  PanelRightClose,
  Settings,
  Store,
  Users,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import {  FaRegFileArchive } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import SideBarProps from "../../../../@types/home/navbar/SideBarProps";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import { SIZE } from "../../../../constants/AppConstants";
import MESSAGE from "../../../../constants/Messages";
import ROUTES_URL from "../../../../constants/Routes";
import SideNavBarItem from "./SideNavBarItem";
import { menuColors } from "../../../../constants/Colors";

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
    userHasAccessToViewAccountProformaInvoice,
    userHasAccessToViewCompanyQuotation,
    userHasAccessToViewCompanyProductSale,
    userHasAccessToViewSettingGeneral,
    userHasAccessToViewCompanyUserReportType,
  } = useUserAccessModules();

const location = useLocation();

const isSettingsActive = [
  ROUTES_URL.COMPANY_SETTING,
  ROUTES_URL.EMAIL_TEMPLATE,
  ROUTES_URL.QUOTATION_SETTINGS,
  ROUTES_URL.INTEGRATIONS_SETTINGS,
].some((route) => location.pathname.startsWith(route));
  
  const SectionHeader = ({ title }: { title: string }) => (
  <div className="px-4 mt-3 mb-1 caption-custom !text-[11px] !font-bold tracking-wider uppercase !text-[#585da2]">
    {title}
  </div>
);

  return (
    <aside
      id="left-side-navbar"
      className={`fixed  top-0 left-0 h-full  bg-white border-r transition-all duration-300 z-30
          ${isOpen ? "w-64 custom-scrollbar " : "w-12 "}`}
    >
      <div
        className={`flex items-center border-b  justify-center ${SIZE.NAVBAR.TOP_HEIGHT_USER_PREF_LEFT}`}
      >
        {isOpen && (
          <span className="section-header-custom-blue !text-gray-800">PurpleRadiance 
          <span className="section-header-custom-blue !text-violet-700"> One</span> </span>
        )}
        <button
          onClick={onToggle}
          className="section-header-custom hover:text-blue-800 rounded-lg "
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav className="p-1 space-y-1  bg-pink-00 overflow-auto max-h-[520px] custom-scrollbar border-b">
       
        {isOpen && <SectionHeader title="Overview" />}
        <NavLink to={ROUTES_URL.HOME}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Home}
              label="Home"
              isOpen={isOpen}
              isActive={isActive}
               iconColor={menuColors.home.icon}
               bgColor={menuColors.home.bg}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.REPORT_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={FileBarChart}
              label="Report"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewCompanyUserReportType}
              // iconColor="#7C3AED"
              // bgColor="#EDE9FE"
               iconColor={menuColors.reports.icon}
                bgColor={menuColors.reports.bg}
              
            />
          )}
        </NavLink>

        {isOpen && <SectionHeader title="CRM & CUSTOMER MANAGEMENT"  />}

        {/* Enabled Nav Links */}
        <NavLink to={ROUTES_URL.GET_COMPANY_USERS}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Users}
              label="Manage Users"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewUser}
               iconColor={menuColors.users.icon}
               bgColor={menuColors.users.bg}
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
              iconColor={menuColors.leads.icon}
               bgColor={menuColors.leads.bg}
            />
          )}
        </NavLink>

         <NavLink to={ROUTES_URL.ACCOUNT_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Building}
              label="Accounts"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewAccount}
              // iconColor="#0891B2"
              // bgColor="#CFFAFE"
               iconColor={menuColors.accounts.icon}
                 bgColor={menuColors.accounts.bg}
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
               iconColor={menuColors.tasks.icon}
               bgColor={menuColors.tasks.bg}
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
               iconColor={menuColors.meetings.icon}
              bgColor={menuColors.meetings.bg}
            />
          )}
        </NavLink>

      {isOpen && <SectionHeader title="SALES & BILLING" />}

        <NavLink to={ROUTES_URL.QUOTATION_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={LucideFileArchive}
              label="Quotation"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewCompanyQuotation}
              iconColor={menuColors.quotation.icon}
               bgColor={menuColors.quotation.bg}
            />
          )}
        </NavLink>

       
        <NavLink to={ROUTES_URL.INVOICE_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={FileText}
              label="Invoices"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewCompanyInvoice}
               iconColor={menuColors.invoice.icon}
                bgColor={menuColors.invoice.bg}
            />
          )}
        </NavLink>
        <NavLink to={ROUTES_URL.ACCOUNT_PROFORMA_INVOICE_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={FaRegFileArchive}
              label="Proforma Invoices"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewAccountProformaInvoice}
               iconColor={menuColors.proformaInvoice.icon}
               bgColor={menuColors.proformaInvoice.bg}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.COMPANY_PRODUCT_SALE_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={PackageCheck}
              label="Sales"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewCompanyProductSale}
               iconColor={menuColors.sales.icon}
              bgColor={menuColors.sales.bg}
            />
          )}
        </NavLink>


        {isOpen && <SectionHeader title="INVENTORY" />}

        <NavLink to={ROUTES_URL.PRODUCT_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Store}
              label="Products"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewProduct}
               iconColor={menuColors.products.icon}
               bgColor={menuColors.products.bg}
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
               iconColor={menuColors.stock.icon}
              bgColor={menuColors.stock.bg}
            />
          )}
        </NavLink>

        {isOpen && <SectionHeader title="SUPPORT & COLLABORATION"/>}
        <NavLink to={ROUTES_URL.SUPPORT_TICKET_MANAGEMENT}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Headset}
              label="Support"
              isOpen={isOpen}
              isActive={isActive}
              disabled={!userHasAccessToViewSupportTicket}
              iconColor={menuColors.support.icon}
              bgColor={menuColors.support.bg}
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
               iconColor={menuColors.teams.icon}
                bgColor={menuColors.teams.bg}
            />
          )}
        </NavLink>
       
      </nav>
      {/* CRM Settings Dropdown */}
      <SideNavBarItem
        icon={Settings}
        label="App Settings"
        isOpen={isOpen}
         isActive={isSettingsActive}
          iconColor={menuColors.settings.icon}
            bgColor={menuColors.settings.bg}
            
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
      {/* alksd */}
      <div className={`flex items-center justify-center `}>
        {/* {isOpen && (
          <span className="section-header-custom-blue">PurpleRadiance One</span>
        )} */}
        <div className="flex justify-between bg-[#EDE9FE] h-8 rounded w-full">
          <button
            onClick={onToggle}
            title="Open Sidebar"
            className="table-header-custom hover:text-violet-700 pl-4 w-full bg-pink-00"
          >
            {isOpen ? (
              <div className="  flex gap-1 items-center w-full ">
                {" "}
                <PanelLeftClose size={20} /> Close
              </div>
            ) : (
              <PanelRightClose size={20} />
            )}
          </button>

          {isOpen && (
            <Link
              to={
                userHasAccessToViewSettingGeneral
                  ? ROUTES_URL.USER_PROFILE_SETTING
                  : "#"
              }
              onClick={(e) => {
                if (!userHasAccessToViewSettingGeneral) {
                  e.preventDefault();
                  toast.error(
                    MESSAGE.MODULE_ACCESS.SETTING.GENERAL_USER_SETTING
                      .DENIED_VIEW_ACCESS,
                  );
                  return;
                }
              }}
              className={`table-header-custom pl-4 w-full flex items-center justify-center gap-1
    ${!userHasAccessToViewSettingGeneral ? "opacity-50 cursor-not-allowed" : "hover:text-violet-800"}`}
            >
              <CircleUser size={20} />
              Profile
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

export default SideNavBar;