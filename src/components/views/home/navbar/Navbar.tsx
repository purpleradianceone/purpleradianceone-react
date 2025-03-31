import { useEffect, useState, useRef } from "react";
import { Bell, LogOut, Menu, Search, Settings, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SideNavBar from "./SideNavBar";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import ROUTES_URL from "../../../../constants/Routes";
import useScreenSize from "../../../../config/hooks/useScreenSize";
import { IMAGE_SOURCE } from "../../../../constants/ImageSource";
import Button from "../../../ui/Button";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../../not-found/AccessDeniedPage";

function Navbar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>();
  const { loginStatus, setLoginStatus } = useLoggedInUserContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessDeniedPopUpView, setAccessDeniedPopUpView] =
    useState<boolean>(false);
  const { isSmallScreen } = useScreenSize();

  const Navigate = useNavigate();

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

  // const handleModuleSearch = (event : React.ChangeEvent<HTMLInputElement>) => {
  // const query = event.target.value.toLowerCase();
  // setSearchQuery(query);
  // setIsSearching(query.length > 0);

  // if (query.length > 0) {
  //   const filtered = APP_MODULES.filter(module =>
  //     module.name.toLowerCase().includes(query) ||
  //     module.description.toLowerCase().includes(query)
  //   );
  //   setSearchResults(filtered);
  // } else {
  //   setSearchResults([]);
  // }
  // }

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
    });
  };

  //WRITE SUBSCRIPTION LOGIC HERE
  const handleSubscription = () => {
    Navigate(ROUTES_URL.GET_SUBSCRIPTION);
  };

  if (!loginStatus.status) {
    return (
      <div>
        <header>
          <nav className="fixed w-full bg-white shadow-sm z-50 py-3">
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
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                    <Link to={ROUTES_URL.SIGN_UP}>Get Started</Link>
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                    <Link to={ROUTES_URL.SIGN_IN}>Login</Link>
                  </button>
                </div>

                <div className="md:hidden flex items-center">
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
                  <Button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full text-center">
                    <Link to={ROUTES_URL.SIGN_UP}>Get Started</Link>
                  </Button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full text-center">
                    <Link to={ROUTES_URL.SIGN_IN}>Login</Link>
                  </button>
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
          <nav className="z-20 bg-white border-b border-gray-200 fixed w-full  top-0 h-16">
            <div className="px-4 py-3 lg:px-6">
              <div className="flex items-center justify-between">
                <div className="flex justify-between">
                  <SideNavBar
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                  />
                  <div className="ml-4">
                    <span className="text-xl font-semibold"></span>
                  </div>
                </div>
                <div className="flex ml-11 justify-between text-xl font-bold text-blue-700 cursor-pointer">
                  <Link to={ROUTES_URL.HOME}>{loginStatus.companyName}</Link>
                </div>

                <div className="flex-1 max-w-xl ml-28 hidden lg:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      // onChange={handleModuleSearch}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className=" flex items-center space-x-4">
                  {!isSmallScreen && (
                    <>
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <Bell className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <Settings className="h-5 w-5" />
                      </button>
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
                          <button className="px-4 py-2 hover:bg-gray-200 text-left flex items-center gap-2 transition rounded-md mx-2 my-1">
                            👤 Profile
                          </button>
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
            sidebarOpen
              ? "mt-16 ml-60 flex justify-center items-center"
              : "mt-16 ml-16 flex justify-center items-center"
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
