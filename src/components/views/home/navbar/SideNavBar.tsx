import {
  BoxesIcon,
  Building2,
  Handshake,
  Home,
  Menu,
  Network,
  Settings,
  Store,
  X,
} from "lucide-react";
import SideBarProps from "../../../../@types/home/navbar/SideBarProps";
import SideNavBarItem from "./SideNavBarItem";
import { Link } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import useScreenSize from "../../../../config/hooks/useScreenSize";

function SideNavBar({ isOpen, onToggle, onNextTab }: SideBarProps) {
  const {
    userHasAccessToViewUser,
    userHasAccessToViewLead,
    userHasAccessToViewProduct,
    userHasAccessToViewTeamManagement,
    userHasAccessToViewProductTeam,
  } = useUserAccessModules();
  const { isSmallScreen } = useScreenSize();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white border-r transition-all duration-300 z-30
          ${isOpen ? "w-64" : "w-14"}`}
    >
      <div className="flex items-center border-b justify-between px-4 h-12">
        {isOpen && <span className="text-xl font-bold">Purple CRM</span>}
        <button onClick={onToggle} className="hover:bg-gray-100 rounded-lg">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav className="p-3 space-y-1">
        <Link to={ROUTES_URL.HOME}>
          <SideNavBarItem  icon={Home} label="Home" isOpen={isOpen} />
        </Link>

        {userHasAccessToViewUser && (
          <Link
            to={ROUTES_URL.GET_COMPANY_USERS}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem
              icon={Building2}
              label="Manage Users"
              isOpen={isOpen}
            />
          </Link>
        )}

        {!userHasAccessToViewUser && (
          <Link
            to={ROUTES_URL.GET_COMPANY_USERS}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem
              icon={Building2}
              label="Manage Users"
              isOpen={isOpen}
              disabled={true}
            />
          </Link>
        )}

        {userHasAccessToViewLead && (
          <Link
            to={ROUTES_URL.GET_LEAD_MANAGEMENT}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem icon={Handshake} label="Leads" isOpen={isOpen} />
          </Link>
        )}

        {!userHasAccessToViewLead && (
          <Link
            to={ROUTES_URL.GET_LEAD_MANAGEMENT}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem
              icon={Handshake}
              label="Leads"
              isOpen={isOpen}
              disabled={true}
            />
          </Link>
        )}

        {userHasAccessToViewProduct && (
          <Link
            to={ROUTES_URL.PRODUCT_MANAGEMENT}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem icon={Store} label="Products" isOpen={isOpen} />
          </Link>
        )}

        {!userHasAccessToViewProduct && (
          <Link
            to={ROUTES_URL.PRODUCT_MANAGEMENT}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem
              icon={Store}
              label="Products"
              isOpen={isOpen}
              disabled={true}
            />
          </Link>
        )}

        {userHasAccessToViewTeamManagement && (
          <Link
            to={ROUTES_URL.TEAM_MANAGEMENT}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem icon={Network} isOpen={isOpen} label="Teams" />
          </Link>
        )}
        {!userHasAccessToViewTeamManagement && (
          <Link
            to={ROUTES_URL.TEAM_MANAGEMENT}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem
              icon={Network}
              isOpen={isOpen}
              label="Teams"
              disabled={true}
            />
          </Link>
        )}

        {userHasAccessToViewProductTeam && (
          <Link
            to={ROUTES_URL.PRODUCT_TEAM_MANAGEMENT}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem
              icon={BoxesIcon}
              isOpen={isOpen}
              label=" Product Teams/Users"
            ></SideNavBarItem>
          </Link>
        )}
        {!userHasAccessToViewProductTeam && (
          <Link
            to={ROUTES_URL.PRODUCT_TEAM_MANAGEMENT}
            onClick={() => {
              if (isSmallScreen) {
                onNextTab();
              }
            }}
          >
            <SideNavBarItem
              icon={BoxesIcon}
              isOpen={isOpen}
              label=" Product Teams/Users"
              disabled={true}
            ></SideNavBarItem>
          </Link>
        )}

        <SideNavBarItem
          icon={Settings}
          label="Crm Settings"
          isOpen={isOpen}
          children={[
            <Link
              to={ROUTES_URL.LEAD_SETTINGS}
              onClick={() => {
                if (isSmallScreen) {
                  onNextTab();
                }
              }}
            >
              Lead
            </Link>,
            <Link
            to= {ROUTES_URL.EMAIL_TEMPLATE}
            >
            Email Template
            </Link>, 
              <Link
            to= {ROUTES_URL.USER_PROFILE_SETTING}
            >
            User Setting
            </Link>            
          ]}
        ></SideNavBarItem>
      </nav>
    </aside>
  );
}

export default SideNavBar;
