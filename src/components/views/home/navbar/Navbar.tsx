/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import {
  Aperture,
  Bell,
  Building2,
  Calendar,
  CreditCard,
  Handshake,
  Headset,
  Home,
  Layers,
  LayoutPanelLeft,
  ListChecks,
  LogOut,
  LucideFileArchive,
  LucideSettings,
  Menu,
  MessageCircle,
  Network,
  Settings,
  SettingsIcon,
  Store,
  User2,
  UserCogIcon,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import SideNavBar from "./SideNavBar";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import ROUTES_URL from "../../../../constants/Routes";
import useScreenSize from "../../../../config/hooks/useScreenSize";
import { IMAGE_SOURCE } from "../../../../constants/ImageSource";
import Button from "../../../ui/Button";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../../not-found/AccessDeniedPage";
import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import NavItem from "./Component/NavItem";
import { usePanel } from "../../../../context/panel/usePanel";
import NotificationPopup from "../../notification/NotificationManagement";
import { useNotificationCountContext } from "../../../../context/notification/NotificationCountContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { alphabets, backgroundColors } from "../../../../constants/Colors";
import MESSAGE from "../../../../constants/Messages";
import AppTutorailManager from "../../tutorails/AppTutorailManager";
import { NavbarSteps } from "../../../../constants/AppTutorailsSteps";
import { useTutorailDataContext } from "../../../../context/tutorail/useTutorailDataContext";
import { TutorailColumnName } from "../../../../constants/Tutorail";
import { cancelAllRequests } from "../../../../axios-client/AxiosClient";
import { LocalStorageKeys } from "../../../../enums/LocalStorageKeys";
import { AppVersionViewCard } from "../../card/AppVersionViewCard";
import { useUserPreference } from "../../../../context/user/UserPreference";
import QuotationIconSvg from "../../../quotation-builder/svg/QuotationIconSvg";
import { FaRegFileAlt } from "react-icons/fa";

function Navbar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { loginStatus, setLoginStatus } = useLoggedInUserContext();
  const [isDashboardRendered, setIsDashboardRendered] =
    useState<boolean>(false);
  const { tutorailData, setTutorailData } = useTutorailDataContext();
  const [istourFinished, setIsTourFinished] = useState<boolean>(false);

  const {
    userHasAccessToViewLead,
    userHasAccessToViewAccount,
    userHasAccessToViewProduct,
    userHasAccessToViewTeamManagement,
    userHasAccessToViewUser,
    userHasAccessToViewMeeting,
    userHasAccessToUpdateSettingGeneral,
    userHasAccessToViewStock,
    userHasAccessToViewSupportTicket,
    userHasAccessToViewTasks,
    userHasAccessToViewCompanyInvoice,
    userHasAccessToViewCompanyQuotation,
  } = useUserAccessModules();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessDeniedPopUpView, setAccessDeniedPopUpView] =
    useState<boolean>(false);
  const { isSmallScreen } = useScreenSize();
  const Navigate = useNavigate();
  const { position } = usePanel();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userPreference, setUserPreference } = useUserPreference();

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

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [location]);

  useEffect(() => {
    setUserPreference({
      ...userPreference,
      sidebarOpen: sidebarOpen,
    });
  }, [sidebarOpen]);

  useEffect(() => {
    const element = location.pathname;
    if (element === ROUTES_URL.HOME) {
      setIsDashboardRendered(true);
      setIsTourFinished(tutorailData.isNavbarSeen);
    } else {
      setIsDashboardRendered(false);
      setIsTourFinished(tutorailData.isNavbarSeen);
    }
  }, [location]);

  const handleLogout = async () => {
    await cancelAllRequests();
    await axios
      .post(POST_API.LOGOUT, {}, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem(
            LocalStorageKeys.SUPPORT_TICKET_MANAGEMENT_FILTERS,
          );
          localStorage.removeItem(
            LocalStorageKeys.ACCOUNT_COMPANY_PRODUCT_FOR_SUPPORT_TICKET,
          );
          toast.success(response.data);
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
            isSuperUser: false,
          });

          setNotificationCount(0);
          localStorage.clear();
          Navigate(ROUTES_URL.SIGN_IN);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleLogout,
          });
          if (refreshTokenResponse) {
            handleLogout();
          }
        }
      });
  };

  //WRITE SUBSCRIPTION LOGIC HERE
  const handleSubscription = () => {
    Navigate(ROUTES_URL.GET_SUBSCRIPTION);
  };

  const handleClickOnUserProfile = () => {
    Navigate(ROUTES_URL.USER_PROFILE_SETTING);
  };

  const handleClickOnSettings = () => {
    Navigate(ROUTES_URL.COMPANY_SETTING);
  };

  // const notifications = useNotifications();

  const { notificationCount, setNotificationCount } =
    useNotificationCountContext();

  // useEffect(() => {
  //   console.log("something happened");
  //   console.log(notificationCount);
  //   console.log(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT)!));

  //   if (notifications!.length >= 1) {
  //     setNotificationCount(notifications!.length);
  //   }
  // }, [notifications]);

  const resetNotificationCount = () => {
    setNotificationCount(0);
  };

  // let unreadCount = notifications?.length || 0;

  const [isOpenPopUpOfNotification, setIsOpenPopUpOfNotification] =
    useState<boolean>(false);

  const handleNavbarTutorailFinish = async () => {
    console.log(tutorailData);
    const updateTutorailPostData = {
      company_id: loginStatus.companyId,
      id: tutorailData.id,
      column_name: TutorailColumnName.IS_NAVBAR_SEEN,
      status: true,
      updatedby_id: loginStatus.id,
    };
    axios
      .post(POST_API.UPDATE_COMPANY_USER_TUTORAIL, updateTutorailPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          setIsTourFinished(true);
          setTutorailData({
            id: tutorailData.id,
            companyUserId: tutorailData.companyUserId,
            isNavbarSeen: true,
            isDashboardSeen: tutorailData.isDashboardSeen,
            isCrmDashboardSeen: tutorailData.isCrmDashboardSeen,
            isCompanyUserSeen: tutorailData.isCompanyUserSeen,
            isCompanyUserActionsSeen: tutorailData.isCompanyUserActionsSeen,
            isLeadSeen: tutorailData.isLeadSeen,
            isAccountSeen: tutorailData.isAccountSeen,
            isProductSeen: tutorailData.isProductSeen,
            isTeamSeen: tutorailData.isTeamSeen,
            isSettingCompanySeen: tutorailData.isSettingCompanySeen,
            isSettingEmailTemplateSeen: tutorailData.isSettingEmailTemplateSeen,
            isSettingIntegrationSeen: tutorailData.isSettingIntegrationSeen,
            createdBy: tutorailData.createdOn,
            updatedBy: tutorailData.updatedBy,
            createdOn: tutorailData.createdOn,
            updatedOn: tutorailData.updatedOn,
          });
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleNavbarTutorailFinish,
          });
          if (refreshTokenResponse) {
            handleNavbarTutorailFinish();
          }
        }
      });
  };

  // useEffect(() => {
  //   console.log("navbar condition : " + !loginStatus.status && loginStatus.isActiveSubscription && (loginStatus.activeUsersInCompany > loginStatus.subscriptionAllowedUsers));
  //   console.log("loginstatus : " + loginStatus.status);
  //   console.log("Active subscription: " + !loginStatus.isActiveSubscription);
  //   console.log("Active users in company: " + loginStatus.activeUsersInCompany);
  //   console.log("Subscription allowed users: " + loginStatus.subscriptionAllowedUsers);
  //   console.log("users consdition  : " + (loginStatus.activeUsersInCompany > loginStatus.subscriptionAllowedUsers));
  // },[loginStatus])

  const getColor = (email: string) => {
    if (!email) return backgroundColors[0];
    const emailChar = email.charAt(0);
    const index = alphabets.indexOf(emailChar.toLowerCase());
    return backgroundColors[index];
  };

  if (
    !loginStatus.status ||
    loginStatus.activeUsersInCompany > loginStatus.subscriptionAllowedUsers
  ) {
    return (
      <div>
        {/* <header className="fixed bg-white w-full shadow-sm z-50 py-5"> */}
        <header className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50 py-4">
          <nav className=" font-dm text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-10">
                <div className="flex items-center">
                  <div className=" justify-self-start">
                    <Link to={ROUTES_URL.LANDING_PAGE}>
                      <img
                        height={28}
                        width={100}
                        src={IMAGE_SOURCE.PR_ONE_LOGO}
                        alt="Logo"
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      />
                    </Link>
                  </div>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                  <NavLink
                    to={ROUTES_URL.LANDING_PAGE}
                    // href={ROUTES_URL.FEATURES}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={({ isActive }) =>
                      isActive
                        ? "text-purple font-semibold border-b-2 border-purple "
                        : "text-gray-700 hover:text-purple"
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to={ROUTES_URL.FEATURES}
                    // href={ROUTES_URL.FEATURES}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={({ isActive }) =>
                      isActive
                        ? "text-purple font-semibold border-b-2 border-purple "
                        : "text-gray-700 hover:text-purple"
                    }
                  >
                    Features
                  </NavLink>
                  <NavLink
                    to={ROUTES_URL.PRICING}
                    // href={ROUTES_URL.PRICING}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={({ isActive }) =>
                      isActive
                        ? "text-purple font-semibold border-b-2 border-purple "
                        : "text-gray-700 hover:text-purple"
                    }
                  >
                    Pricing
                  </NavLink>
                  <NavLink
                    to={ROUTES_URL.ABOUT_US}
                    // href={ROUTES_URL.ABOUT_US}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    // className="text-gray-700 hover:text-blue-600"
                    className={({ isActive }) =>
                      isActive
                        ? "text-purple font-semibold border-b-2 border-purple "
                        : "text-gray-700 hover:text-purple"
                    }
                  >
                    About Us
                  </NavLink>
                  <NavLink
                    to={ROUTES_URL.CONTACT_US}
                    // href={ROUTES_URL.CONTACT_US}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={({ isActive }) =>
                      isActive
                        ? "text-purple font-semibold border-b-2 border-purple "
                        : "text-gray-700 hover:text-purple"
                    }
                  >
                    Contact Us
                  </NavLink>
                  {/* <a
                    href={ROUTES_URL.CAREERS}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Careers
                  </a> */}
                </div>
                <div className="hidden md:flex gap-4">
                  <Link to={ROUTES_URL.SIGN_IN}>
                    <button className="border border-purple text-purple px-6 py-2  rounded-full w-full hover:bg-purple-light">
                      Login
                    </button>
                  </Link>
                  <Link to={ROUTES_URL.SIGN_UP}>
                    <button className="bg-purple text-white px-6 py-2 rounded-full w-full hover:bg-purpleHover">
                      Get Started
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
              <div className="md:hidden font-dm text-sm">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {/* <a
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
                  </a> */}
                  <NavLink
                    to={ROUTES_URL.LANDING_PAGE}
                    // href={ROUTES_URL.LANDING_PAGE}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-blue-50 text-purple font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-purple"
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to={ROUTES_URL.FEATURES}
                    // href={ROUTES_URL.FEATURES}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-blue-50 text-purple font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-purple"
                      }`
                    }
                  >
                    Features
                  </NavLink>
                  <NavLink
                    to={ROUTES_URL.PRICING}
                    // href={ROUTES_URL.PRICING}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-blue-50 text-purple font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-purple"
                      }`
                    }
                  >
                    Pricing
                  </NavLink>
                  <NavLink
                    to={ROUTES_URL.ABOUT_US}
                    // href={ROUTES_URL.ABOUT_US}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-blue-50 text-purple font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-purple"
                      }`
                    }
                  >
                    About Us
                  </NavLink>
                  <NavLink
                    to={ROUTES_URL.CONTACT_US}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    // href={ROUTES_URL.CONTACT_US}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition ${
                        isActive
                          ? "bg-blue-50 text-purple font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-purple"
                      }`
                    }
                  >
                    Contact Us
                  </NavLink>
                  <Link to={ROUTES_URL.SIGN_IN}>
                    <Button className="border border-purple text-purple px-6 py-2 rounded-full w-full hover:bg-purple-light ">
                      Login
                    </Button>
                  </Link>
                  <Link to={ROUTES_URL.SIGN_UP}>
                    <Button className="bg-purple text-white px-6 py-2 rounded-full mt-1 w-full hover:bg-purpleHover">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </header>
        <main
          className="min-h-screen overflow-y-scroll border border-gray-400
            [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-transparent"
        >
          {children}
        </main>
      </div>
    );
  } else {
    return (
      <div>
        {istourFinished
          ? null
          : isDashboardRendered && (
              <AppTutorailManager
                steps={NavbarSteps}
                handleTourEnd={handleNavbarTutorailFinish}
              />
            )}

        <header>
          <nav
            className={`z-20 bg-white border-b border-gray-200 fixed w-full    top-0 ${
              position === "left"
                ? `${SIZE.NAVBAR.TOP_HEIGHT_USER_PREF_LEFT} pt-0.5`
                : `${SIZE.NAVBAR.TOP_HEIGHT_USER_PREF_RIGHT}`
            }`}
          >
            <div className="px-2 lg:px-6 ">
              <div
                className={`flex ${
                  position === "left" ? "ml-7" : "ml-0"
                }  items-center justify-between`}
              >
                <div
                  title={loginStatus.companyName}
                  id="company-name-navbar"
                  className="flex items-center justify-between text-lg main-title-custom cursor-pointer"
                >
                  <Link to={ROUTES_URL.HOME}>
                    <h2
                      className={`section-header-custom ${
                        sidebarOpen ? "ml-52" : ""
                      }`}
                    >
                      {loginStatus.companyName.length > 20 && position === "top"
                        ? loginStatus.companyName.substring(0, 19).concat("...")
                        : loginStatus.companyName}
                    </h2>
                  </Link>
                </div>
                {position === "left" && (
                  <>
                    <div className="flex justify-between ">
                      <SideNavBar
                        isOpen={sidebarOpen}
                        onToggle={() => setSidebarOpen(!sidebarOpen)}
                      />
                    </div>
                  </>
                )}
                {position === "top" && (
                  <>
                    <div className="flex-1 max-w-6xl hidden lg:block">
                      {/* Navbar Icons */}
                      <div className="flex flex-wrap bg-slate-00 justify-around items-center mx-1  ">
                        {/* note : NavItem id created component in navbar/Component folder */}
                        <NavItem
                          to={ROUTES_URL.HOME}
                          icon={<Home size={SIZE.TWENTY} />}
                          label="Home"
                        />
                        {/* {userHasAccessToViewUser && ( */}
                        <NavItem
                          disable={!userHasAccessToViewUser}
                          to={ROUTES_URL.GET_COMPANY_USERS}
                          icon={<Building2 size={SIZE.TWENTY} />}
                          label="Manage Users"
                        />
                        <NavItem
                          disable={!userHasAccessToViewTasks}
                          to={ROUTES_URL.TASKS_MANAGEMENT}
                          icon={<ListChecks size={SIZE.TWENTY} />}
                          label="Tasks"
                        />
                        {/* {userHasAccessToViewLead && ( */}
                        <NavItem
                          disable={!userHasAccessToViewLead}
                          to={ROUTES_URL.GET_LEAD_MANAGEMENT}
                          icon={<Handshake size={SIZE.TWENTY} />}
                          label="Lead"
                        />

                        <NavItem
                          disable={!userHasAccessToViewCompanyQuotation}
                          to={ROUTES_URL.QUOTATION_MANAGEMENT}
                          icon={<LucideFileArchive size={SIZE.TWENTY} />}
                          label="Quotation"
                        />

                        {/* )} */}
                        {/* {!userHasAccessToViewLead && (
                          <NavItem
                            to={ROUTES_URL.GET_LEAD_MANAGEMENT}
                            icon={<Handshake size={SIZE.TWENTY} />}
                            label="Lead"
                          />
                        )} */}

                        {/* {userHasAccessToViewAccount && ( */}
                        <NavItem
                          disable={!userHasAccessToViewAccount}
                          to={ROUTES_URL.ACCOUNT_MANAGEMENT}
                          icon={<UserCogIcon size={SIZE.TWENTY} />}
                          label="Accounts"
                        />
                        <NavItem
                          disable={!userHasAccessToViewCompanyInvoice}
                          to={ROUTES_URL.INVOICE_MANAGEMENT}
                          icon={<FaRegFileAlt size={SIZE.TWENTY} />}
                          label="Invoices"
                        />

                        {/* )} */}
                        {/* {!userHasAccessToViewAccount && (
                          <NavItem
                            to={ROUTES_URL.ACCOUNT_MANAGEMENT}
                            icon={<UserCogIcon size={SIZE.TWENTY} />}
                            label="Accounts"
                          />
                        )} */}
                        {/* {userHasAccessToViewProduct && ( */}
                        <NavItem
                          disable={!userHasAccessToViewProduct}
                          to={ROUTES_URL.PRODUCT_MANAGEMENT}
                          icon={<Store size={SIZE.TWENTY} />}
                          label="Products"
                        />
                        <NavItem
                          disable={!userHasAccessToViewStock}
                          to={ROUTES_URL.STOCK_MANAGEMENT}
                          icon={<Layers size={SIZE.TWENTY} />}
                          label="Stock"
                        />

                        <NavItem
                          disable={!userHasAccessToViewSupportTicket}
                          to={ROUTES_URL.SUPPORT_TICKET_MANAGEMENT}
                          icon={<Headset size={SIZE.TWENTY} />}
                          label="Support"
                        />

                        {/* )} */}
                        <NavItem
                          disable={!userHasAccessToViewTeamManagement}
                          to={ROUTES_URL.TEAM_MANAGEMENT}
                          icon={<Network size={SIZE.TWENTY} />}
                          label="Team"
                        />
                        {/* )} */}
                        {/* {userHasAccessToViewProductTeam && ( */}
                        {/* <NavItem
                          disable={!userHasAccessToViewProductTeam}
                            to={ROUTES_URL.PRODUCT_TEAM_MANAGEMENT}
                            icon={<BoxesIcon size={SIZE.TWENTY} />}
                            label="Prd Team/users"
                          /> */}
                        {/* )} */}

                        {/* {userHasAccessToViewMeeting && ( */}
                        <NavItem
                          disable={!userHasAccessToViewMeeting}
                          to={ROUTES_URL.MEETINGS}
                          icon={<Calendar size={SIZE.TWENTY} />}
                          label="Meetings"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        {/* )} */}

                        <NavItem
                          icon={<Settings />}
                          label="Crm Settings"
                          dropdownItems={[
                            {
                              icon: <Settings size={SIZE.TWENTY} />,
                              to: ROUTES_URL.COMPANY_SETTING,
                              label: "Settings",
                            },
                            {
                              icon: <Aperture size={SIZE.TWENTY} />,
                              to: ROUTES_URL.EMAIL_TEMPLATE,
                              label: "Email Template",
                            },
                            {
                              icon: (
                                <QuotationIconSvg
                                  strokeWidth={2}
                                  size={SIZE.TWENTY + 1}
                                  showCurrency={true}
                                />
                              ),
                              to: ROUTES_URL.QUOTATION_SETTINGS,
                              label: "Quotation Template",
                            },
                            {
                              icon: <Layers size={SIZE.TWENTY} />,
                              to: ROUTES_URL.INTEGRATIONS_SETTINGS,
                              label: "Integrations",
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

                          {userHasAccessToViewCompanyQuotation && (
                            <NavItem
                              to={ROUTES_URL.QUOTATION_MANAGEMENT}
                              icon={<LucideFileArchive size={SIZE.TWENTY} />}
                              label=""
                              onClick={() => setIsDropdownOpen(false)}
                            />
                          )}

                          {userHasAccessToViewAccount && (
                            <NavItem
                              disable={!userHasAccessToViewAccount}
                              to={ROUTES_URL.ACCOUNT_MANAGEMENT}
                              icon={<UserCogIcon size={SIZE.TWENTY} />}
                              label="Accounts"
                            />
                          )}
                          {userHasAccessToViewSupportTicket && (
                            <NavItem
                              disable={!userHasAccessToViewSupportTicket}
                              to={ROUTES_URL.SUPPORT_TICKET_MANAGEMENT}
                              icon={<Headset size={SIZE.TWENTY} />}
                              label="Support"
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
                          {/* {userHasAccessToViewProductTeam && (
                            <NavItem
                              to={ROUTES_URL.PRODUCT_TEAM_MANAGEMENT}
                              icon={<BoxesIcon size={SIZE.TWENTY} />}
                              label=""
                              onClick={() => setIsDropdownOpen(false)}
                            />
                          )} */}

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
                            to={ROUTES_URL.QUOTATION_SETTINGS}
                            icon={
                              <QuotationIconSvg
                                strokeWidth={2}
                                size={26}
                                className="text-blue-600"
                                showCurrency={true}
                              />
                            }
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
                      {/* <Link to={ROUTES_URL.NOTIFICATION} className="relative">
                        <button
                          onClick={() => setIsOpenPopUpOfNotification(true)}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <Bell className="h-5 w-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                        {isOpenPopUpOfNotification && (
                          <NotificationPopup
                            // notifications={notifications}
                            onClose={() => setIsOpenPopUpOfNotification(false)}
                          />
                        )}
                      </Link> */}
                      <div className="relative">
                        <button
                          id="notifications-navbar"
                          title="Show Notification"
                          onClick={() => {
                            resetNotificationCount();
                            setIsOpenPopUpOfNotification(
                              !isOpenPopUpOfNotification,
                            );
                            // unreadCount=0;
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <Bell className=" table-header-custom" />
                          {notificationCount > 0 && (
                            <span className="absolute -top-0.5 -right-1 bg-red-500 caption-custom white-text px-1.5 py-0.5 rounded-full">
                              {notificationCount > 9 ? "9+" : notificationCount}
                            </span>
                          )}
                        </button>

                        {isOpenPopUpOfNotification && (
                          <NotificationPopup
                            // notifications={notifications}
                            onClose={() => setIsOpenPopUpOfNotification(false)}
                          />
                        )}
                      </div>

                      {userHasAccessToUpdateSettingGeneral ? (
                        <Link to={ROUTES_URL.PANEL_CUSTOMIZER}>
                          <button
                            id="panel-layout-navbar"
                            title="Panel Layout"
                            className="p-2 rounded-lg hover:bg-gray-100"
                          >
                            <LayoutPanelLeft className="table-header-custom" />
                          </button>
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            toast.error(
                              MESSAGE.MODULE_ACCESS.GENERAL_SETTING
                                .DENIED_UPDATE_ACCESS,
                            );
                          }}
                          id="panel-layout-navbar"
                          title="Panel Layout"
                          className="p-2 rounded-lg opacity-50 cursor-not-allowed hover:bg-gray-100"
                        >
                          <LayoutPanelLeft className="table-header-custom" />
                        </button>
                      )}
                    </>
                  )}
                  <div
                    className="flex items-center cursor-pointer relative"
                    onClick={toggleCard}
                    id="profile-actions-navbar"
                  >
                    <div
                      className={`w-9 h-9 rounded-full grid place-content-center section-header-custom-white border border-gray-300 ${getColor(
                        loginStatus.email,
                      )}`}
                    >
                      {loginStatus.fullName
                        ? loginStatus.fullName.charAt(0)
                        : ""}
                    </div>

                    {/* Name & Email */}
                    <div className="ml-3 min-w-0">
                      <span className="table-header-custom block truncate w-40">
                        {loginStatus?.fullName || "User Name"}
                      </span>
                      <span className="caption-custom block truncate w-40">
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
                        <div className="p-3 border-b border-gray-200 flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-full grid place-content-center section-header-custom-white border border-gray-300 ${getColor(
                              loginStatus.email,
                            )}`}
                          >
                            {loginStatus.fullName
                              ? loginStatus.fullName.charAt(0)
                              : ""}
                          </div>
                          <div className="min-w-0">
                            <span className="table-header-custom  block truncate w-40">
                              {loginStatus?.fullName || "User Name"}
                            </span>
                            <span
                              title={loginStatus?.email || "User email"}
                              className="caption-custom block truncate w-40"
                            >
                              {loginStatus?.email || "User email"}
                            </span>
                          </div>
                        </div>

                        {/* Menu Options */}
                        <div className="flex flex-col">
                          {/* {userHasAccessToViewUser ? ( */}

                          <button
                            onClick={handleClickOnUserProfile}
                            className="px-4 py-2 input-label-custom hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-2 my-1"
                          >
                            <div className="flex gap-2">
                              <User2 className="input-label-custom" />
                              <span className="input-label-custom mt-1">
                                Profile
                              </span>
                            </div>
                            {/* 👤 Profile */}
                          </button>
                          <button
                            onClick={handleClickOnSettings}
                            className="px-4 py-2 input-label-custom hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-2 my-1"
                          >
                            {/* ⚙️ Settings */}
                            <div className="flex gap-2">
                              <Settings className="input-label-custom" />
                              <span className="input-label-custom mt-1">
                                Settings
                              </span>
                            </div>
                          </button>

                          {userHasAccessToViewSubscription ? (
                            <button
                              onClick={handleSubscription}
                              className="px-4 py-2 input-label-custom hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-2 my-1"
                            >
                              <div className="flex gap-2">
                                <CreditCard className="input-label-custom" />
                                <span className="input-label-custom mt-1">
                                  Subscription
                                </span>
                              </div>
                              {/* 💳 Subscription */}
                            </button>
                          ) : (
                            <button
                              onClick={() => setAccessDeniedPopUpView(true)}
                              className="px-4 py-2 input-label-custom text-left flex items-center gap-2 transition bg-gray-50 cursor-not-allowed hover:bg-gray-100 rounded-md mx-2 my-1"
                            >
                              <div className="flex gap-2">
                                <CreditCard className="input-label-custom" />
                                <span className="input-label-custom mt-1">
                                  Subscription
                                </span>
                              </div>
                            </button>
                          )}

                          {/* Divider */}
                          <div className="border-t border-gray-300 my-1.5 mx-2"></div>

                          <button
                            onClick={handleLogout}
                            className="px-4 py-2 input-label-custom hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-2 "
                          >
                            {/* <LogOut className="input-label-custom" />
                            Sign Out */}
                            <div className="flex gap-2">
                              <LogOut className="input-label-custom" />
                              <span className="input-label-custom mt-1">
                                Sign Out
                              </span>
                            </div>
                          </button>

                          <AppVersionViewCard />
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
              ? sidebarOpen
                ? "mt-12 ml-60 flex justify-center items-center"
                : "mt-10 ml-7 flex justify-center items-center"
              : "mt-11 ml-0 flex justify-center items-center"
          }
        >
          {istourFinished && children}
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
