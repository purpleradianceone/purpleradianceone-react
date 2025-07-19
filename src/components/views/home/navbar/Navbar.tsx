import { useEffect, useState, useRef } from "react";
import {
  Bell,
  BoxesIcon,
  Building2,
  Calendar,
  Handshake,
  Home,
  LayoutPanelLeft,
  LogOut,
  LucideSettings,
  Menu,
  MessageCircle,
  Network,
  Settings,
  SettingsIcon,
  Store,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SideNavBar from "./SideNavBar";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import ROUTES_URL from "../../../../constants/Routes";
import useScreenSize from "../../../../config/hooks/useScreenSize";
import { IMAGE_SOURCE } from "../../../../constants/ImageSource";
import Button from "../../../ui/Button";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../../not-found/AccessDeniedPage";
import { SIZE } from "../../../../constants/AppConstants";
import NavItem from "./Component/NavItem";
import { usePanel } from "../../../../context/panel/usePanel";

function Navbar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { loginStatus, setLoginStatus } = useLoggedInUserContext();

  const {
    userHasAccessToViewLead,
    userHasAccessToViewProduct,
    userHasAccessToViewProductTeam,
    userHasAccessToViewTeamManagement,
    userHasAccessToViewUser,
    userHasAccessToViewMeeting,
  } = useUserAccessModules();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessDeniedPopUpView, setAccessDeniedPopUpView] =
    useState<boolean>(false);
  const { isSmallScreen } = useScreenSize();
  const Navigate = useNavigate();
  const { position } = usePanel();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const position = localStorage.getItem('panel_position');

  const { userHasAccessToViewSubscription } = useUserAccessModules();

  const [isCardVisible, setIsCardVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Toggle visibility of the profile card
  const toggleCard = () => {
    setIsCardVisible((prev) => !prev);
  };

  // Close the card when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setIsCardVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Navigate(ROUTES_URL.SIGN_IN);
    setLoginStatus({
      id: 0,
      companyId: 0,
      message: "",
      token: "",
      status: false,
      email: "",
      fullName: "",
      companyName: "",
      createdOn: "",
      mobileNumber: "",
      activeUsersInCompany: 0,
      isActiveSubscription: false,
      subscriptionAllowedUsers: 0,
      endDateSubscription: "",
      startDateSubscription: "",
      subscriptionId: 0,
    });
  };

  //WRITE SUBSCRIPTION LOGIC HERE
  const handleSubscription = () => {
    Navigate(ROUTES_URL.GET_SUBSCRIPTION);
  };

  const handleClickOnUserProfile = () => {
    Navigate(ROUTES_URL.USER_PROFILE_SETTING);
  };

  if (!loginStatus.status) {
    return (
      <div>
        <header>
          <nav className=" relative w-full bg-white shadow-sm z-50 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-10">
                <div className="flex items-center">
                  <div className="w-32 h-auto">
                    <img src={IMAGE_SOURCE.PR_LOGO} alt="Logo" />
                  </div>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                  <a
                    href="#features"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Features
                  </a>
                  <a
                    href="#solutions"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Solutions
                  </a>
                  <a
                    href="#pricing"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Products
                  </a>
                  <Link to={ROUTES_URL.SIGN_UP}>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                      Get Started
                    </button>
                  </Link>
                  <Link to={ROUTES_URL.SIGN_IN}>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                      Login
                    </button>
                  </Link>
                </div>

                <div className="md:hidden flex justify-center">
                  <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {isOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  <a
                    href="#features"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Features
                  </a>
                  <a
                    href="#solutions"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Solutions
                  </a>
                  <a
                    href="#pricing"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Pricing
                  </a>
                  <Link to={ROUTES_URL.SIGN_UP}>
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full text-center">
                      Get Started
                    </Button>
                  </Link>
                  <Link to={ROUTES_URL.SIGN_IN}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full text-center">
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </header>
        <main className="min-h-screen overflow-x-hidden">{children}</main>
      </div>
    );
  } else {
    return (
      <div>
        <header>
          <nav className="z-20 bg-white border-b border-gray-200 fixed w-full  top-0 h-12">
            <div className="px-4 lg:px-6">
              <div
                className={`flex ${
                  position === "left" ? "ml-10" : ""
                }  items-center justify-between`}
              >
                <div className="flex items-center justify-between text-sm   font-bold text-blue-700 cursor-pointer">
                  <Link to={ROUTES_URL.HOME}>
                    <h2 className="font-sora ">{loginStatus.companyName}</h2>
                  </Link>
                </div>
                {position === "left" && (
                  <>
                    <div className="flex justify-between ">
                      <SideNavBar
                        isOpen={sidebarOpen}
                        onToggle={() => setSidebarOpen(!sidebarOpen)}
                        onNextTab={() => {
                          setSidebarOpen(false);
                        }}
                      />
                    </div>
                  </>
                )}
                {position === "top" && (
                  <>
                    <div className="flex-1 max-w-6xl hidden lg:block">
                      {/* Navbar Icons */}
                      <div className="flex flex-wrap bg-slate-00 justify-around items-center mx-11  ">
                        {/* note : NavItem id created component in navbar/Component folder */}
                        <NavItem
                          to={ROUTES_URL.HOME}
                          icon={<Home size={SIZE.TWENTY} />}
                          label="Home"
                        />
                        {userHasAccessToViewUser && (
                          <NavItem
                            to={ROUTES_URL.GET_COMPANY_USERS}
                            icon={<Building2 size={SIZE.TWENTY} />}
                            label="Manage Users"
                          />
                        )}
                        {!userHasAccessToViewUser && (
                          <NavItem
                            to={ROUTES_URL.GET_COMPANY_USERS}
                            icon={<Building2 size={SIZE.TWENTY} />}
                            label="Manage Users"
                          />
                        )}

                        {userHasAccessToViewLead && (
                          <NavItem
                            to={ROUTES_URL.GET_LEAD_MANAGEMENT}
                            icon={<Handshake size={SIZE.TWENTY} />}
                            label="Lead"
                          />
                        )}
                        {userHasAccessToViewProduct && (
                          <NavItem
                            to={ROUTES_URL.PRODUCT_MANAGEMENT}
                            icon={<Store size={SIZE.TWENTY} />}
                            label="Products"
                          />
                        )}
                        {userHasAccessToViewTeamManagement && (
                          <NavItem
                            to={ROUTES_URL.TEAM_MANAGEMENT}
                            icon={<Network size={SIZE.TWENTY} />}
                            label="Team"
                          />
                        )}
                        {userHasAccessToViewProductTeam && (
                          <NavItem
                            to={ROUTES_URL.PRODUCT_TEAM_MANAGEMENT}
                            icon={<BoxesIcon size={SIZE.TWENTY} />}
                            label="Prd Team/users"
                          />
                        )}

                        <NavItem
                          icon={<Settings />}
                          label="Crm Settings"
                          dropdownItems={[
                            {
                              icon: <Handshake size={SIZE.TWENTY} />,
                              to: ROUTES_URL.LEAD_SETTINGS,
                              label: "Lead",
                            },
                            {
                              icon: <MessageCircle size={SIZE.TWENTY} />,
                              to: ROUTES_URL.EMAIL_TEMPLATE,
                              label: "Email Template",
                            },
                            {
                              icon: <LucideSettings size={SIZE.TWENTY} />,
                              to: ROUTES_URL.EMAIL_SETTING,
                              label: "Email Setting",
                            },
                          ]}
                        />
                      </div>
                    </div>
                    {/* Mobile View */}
                    <div className="lg:hidden xl:hidden  px-4 py-2">
                      <button
                        onMouseEnter={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-gray-700"
                      >
                        <Menu size={20} />
                      </button>
                      {isDropdownOpen && (
                        // <div className=" absolute top-full  bg-white  rounded-md py-2 px-3  z-50">
                        <div className="absolute top-full bg-white shadow-lg rounded-md py-2 px-4 z-50 flex flex-col gap-2">
                          <NavItem
                            to={ROUTES_URL.HOME}
                            icon={<Home size={SIZE.TWENTY} />}
                            label=""
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <NavItem
                            to={ROUTES_URL.GET_COMPANY_USERS}
                            icon={<Building2 size={SIZE.TWENTY} />}
                            label=""
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          {userHasAccessToViewLead && (
                            <NavItem
                              to={ROUTES_URL.GET_LEAD_MANAGEMENT}
                              icon={<Handshake size={SIZE.TWENTY} />}
                              label=""
                              onClick={() => setIsDropdownOpen(false)}
                            />
                          )}
                          {userHasAccessToViewProduct && (
                            <NavItem
                              to={ROUTES_URL.PRODUCT_MANAGEMENT}
                              icon={<Store size={SIZE.TWENTY} />}
                              label=""
                              onClick={() => setIsDropdownOpen(false)}
                            />
                          )}
                          {userHasAccessToViewTeamManagement && (
                            <NavItem
                              to={ROUTES_URL.TEAM_MANAGEMENT}
                              icon={<Network size={SIZE.TWENTY} />}
                              label=""
                              onClick={() => setIsDropdownOpen(false)}
                            />
                          )}
                          {userHasAccessToViewProductTeam && (
                            <NavItem
                              to={ROUTES_URL.PRODUCT_TEAM_MANAGEMENT}
                              icon={<BoxesIcon size={SIZE.TWENTY} />}
                              label=""
                              onClick={() => setIsDropdownOpen(false)}
                            />
                          )}

                          {userHasAccessToViewMeeting && (
                            <NavItem
                              to={ROUTES_URL.MEETINGS}
                              icon={<Calendar size={SIZE.TWENTY} />}
                              label=""
                              onClick={() => setIsDropdownOpen(false)}
                            />
                          )}

                          <NavItem
                            to={ROUTES_URL.COMPANY_SETTING}
                            icon={<SettingsIcon size={SIZE.TWENTY} />}
                            label=""
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <NavItem
                            to={ROUTES_URL.EMAIL_TEMPLATE}
                            icon={<MessageCircle size={SIZE.TWENTY} />}
                            onClick={() => setIsDropdownOpen(false)}
                            label=""
                          />
                          <NavItem
                            to={ROUTES_URL.EMAIL_SETTING}
                            icon={<LucideSettings size={SIZE.TWENTY} />}
                            onClick={() => setIsDropdownOpen(false)}
                            label=""
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className=" flex items-center space-x-4">
                  {!isSmallScreen && (
                    <>
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <Bell className="h-5 w-5" />
                      </button>
                      <Link to={ROUTES_URL.PANEL_CUSTOMIZER}>
                        <button className="p-2 rounded-lg hover:bg-gray-100">
                          <LayoutPanelLeft className="h-5 w-5" />
                        </button>
                      </Link>
                    </>
                  )}
                  {/* paste code here */}
                  <div
                    className="flex items-center cursor-pointer relative"
                    onClick={toggleCard}
                  >
                    {/* Profile Image */}
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Profile"
                      className="h-9 w-9 rounded-full border border-gray-300"
                    />

                    {/* Name & Email */}
                    <div className="ml-3 min-w-0">
                      <span className="text-sm font-semibold text-gray-800 block truncate w-40">
                        {loginStatus?.fullName || "User Name"}
                      </span>
                      <span className="text-xs text-gray-500 block truncate w-40">
                        {loginStatus?.email || "user@example.com"}
                      </span>
                    </div>

                    {/* Dropdown Card */}
                    {isCardVisible && (
                      <div
                        ref={cardRef}
                        className="absolute -right-2.5 mt-72 w-64 bg-white shadow-xl rounded-lg border border-gray-200 animate-slide-down"
                      >
                        {/* Profile Section */}
                        <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="User"
                            className="rounded-full w-12 h-12 border border-gray-300"
                          />
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-gray-800 block truncate w-40">
                              {loginStatus?.fullName || "User Name"}
                            </span>
                            <span className="text-xs text-gray-500 block truncate w-40">
                              {loginStatus?.email || "user@example.com"}
                            </span>
                          </div>
                        </div>

                        {/* Menu Options */}
                        <div className="flex flex-col">
                          {userHasAccessToViewUser ? (
                            <button
                              onClick={handleClickOnUserProfile}
                              className="px-4 py-2 hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-2 my-1"
                            >
                              👤 Profile
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setAccessDeniedPopUpView(true);
                              }}
                              className="px-4 py-2 hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-2 my-1"
                            >
                              👤 Profile
                            </button>
                          )}
                          <button className="px-4 py-2 hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-2 my-1">
                            ⚙️ Account Setting
                          </button>

                          {userHasAccessToViewSubscription ? (
                            <button
                              onClick={handleSubscription}
                              className="px-4 py-2 text-left flex items-center gap-2 transition hover:bg-gray-200 rounded-md mx-2 my-1"
                            >
                              💳 Subscription
                            </button>
                          ) : (
                            <button
                              onClick={() => setAccessDeniedPopUpView(true)}
                              className="px-4 py-2 text-left flex items-center gap-2 transition bg-gray-50 text-gray-400 cursor-not-allowed hover:bg-gray-100 rounded-md mx-2 my-1"
                            >
                              💳 Subscription
                            </button>
                          )}

                          {/* Divider */}
                          <div className="border-t border-gray-300 my-1.5 mx-2"></div>

                          <button
                            onClick={handleLogout}
                            className="px-4 py-2 hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-3"
                          >
                            <LogOut className="w-4 h-4 text-gray-500" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main
          className={
            position === "left"
              ? sidebarOpen && !isSmallScreen
                ? "mt-16 ml-60 flex justify-center items-center"
                : "mt-12 ml-10 flex justify-center items-center"
              : "mt-12 ml-0 flex justify-center items-center"
          }
        >
          {children}
        </main>
        {accessDeniedPopUpView && (
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpView}
            message="You do not have the necessary permissions to view this subscription."
            onClose={() => {
              setAccessDeniedPopUpView(false);
            }}
          />
        )}
      </div>
    );
  }
}

export default Navbar;
