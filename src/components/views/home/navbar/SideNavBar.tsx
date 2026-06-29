
import {
  Building,
  Calendar,

  FileBarChart,
  FileCheck,
  FileText,
  Handshake,
  Headset,
  Home,
  Layers,
  ListChecks,
  LucideFileArchive,
  Mail,
  Menu,
  Network,
  PackageCheck,
  Settings,
  Store,
  Users,
  Waypoints,
  
} from "lucide-react";

import {  FaRegFileArchive } from "react-icons/fa";
import {  NavLink, } from "react-router-dom";
import SideBarProps from "../../../../@types/home/navbar/SideBarProps";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import { SIZE } from "../../../../constants/AppConstants";
import ROUTES_URL from "../../../../constants/Routes";
import SideNavBarItem from "./SideNavBarItem";
import COLORS, { menuColors } from "../../../../constants/Colors";

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
    userHasAccessToViewCompanyUserReportType,
  } = useUserAccessModules();


  const SectionHeader = ({ title }: { title: string }) => (
  <div className="px-4 mt-3 mb-1 caption-custom !text-[11px] !font-bold tracking-wider uppercase !text-[#585da2]">
    {title}
  </div>
);

  return (
    <aside
      id="left-side-navbar"
      className={`fixed top-0 left-0 h-screen bg-white border-r flex flex-col pb-1
          ${isOpen ? "w-64 custom-scrollbar " : "w-12 "}`}
    >
      <div
        className={`flex items-center border-b gap-1 justify-center ${SIZE.NAVBAR.TOP_HEIGHT_USER_PREF_LEFT}`}
      ><button
          onClick={onToggle}
          className="section-header-custom hover:text-violet-600 rounded-lg "
        >
          {isOpen ? <Menu size={20}/> : <Menu size={20} />}
        </button>
        {isOpen && (
          <span className="section-header-custom-blue !text-gray-800 px-1.5">PurpleRadiance 
          <span className={`section-header-custom-blue ${COLORS.PRIMARY_PURPLE}`}>One</span> </span>
        )}
        
      </div>
    <nav className="flex-1 p-1 space-y-1 overflow-y-auto overflow-x-visible custom-scrollbar">
       
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

           {isOpen && <SectionHeader title="SETTINGS & MORE" />}

        <NavLink to={ROUTES_URL.COMPANY_SETTING}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Settings}
              label="Settings"
              isOpen={isOpen}
              isActive={isActive}
              iconColor={menuColors.settings.icon}
              bgColor={menuColors.settings.bg}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.EMAIL_TEMPLATE}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={ Mail}
              label="Email Template"
              isOpen={isOpen}
              isActive={isActive}
              iconColor={menuColors.emailTemplate.icon}
              bgColor={menuColors.emailTemplate.bg}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.QUOTATION_SETTINGS}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={FileCheck}
              label="Quotation Template"
              isOpen={isOpen}
              isActive={isActive}
              iconColor={menuColors.quotationTemplate.icon}
              bgColor={menuColors.quotationTemplate.bg}
            />
          )}
        </NavLink>

        <NavLink to={ROUTES_URL.INTEGRATIONS_SETTINGS}>
          {({ isActive }) => (
            <SideNavBarItem
              icon={Waypoints}
              label="Integration"
              isOpen={isOpen}
              isActive={isActive}
              iconColor={menuColors.integration.icon}
              bgColor={menuColors.integration.bg}
            />
          )}
        </NavLink> 
      </nav>
      
      {/* alksd */}
      
    </aside>
  );
}

export default SideNavBar;