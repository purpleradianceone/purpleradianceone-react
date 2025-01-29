import { useEffect, useState, useRef } from "react";
import { Bell, Menu, Search, Settings, X } from "lucide-react";
import { Link ,useNavigate } from "react-router-dom";
import SideNavBar from "./SideNavBar";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

const Navbar = ({children} : {children : React.ReactNode}) => {
  const [isOpen, setIsOpen] = useState<boolean>();
   const {loginStatus,setLoginStatus} = useLoggedInUserContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const Navigate = useNavigate();


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

  const handleLogout=()=>{
    Navigate("/signin");
    setLoginStatus({
      userId : 0,
    companyId : 0,
    message : "",
    token : "",
    status : false,
    email : "",
    fullname : "",
    });
  }

  if (!loginStatus.status) {
    return (
      <div>
        <header>
      <nav className="fixed w-full bg-white shadow-sm z-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-10">
            <div className="flex items-center">
              <div className="w-32 h-auto">
                <img src="/images/logo/logo.png" alt="" />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600">
                Features
              </a>
              <a
                href="#solutions"
                className="text-gray-700 hover:text-blue-600"
              >
                Solutions
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600">
                Products
              </a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                <Link to="/signup">Get Started</Link>
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                <Link to="/signin">Login</Link>
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
              <button className="w-full mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                <Link to="/signup">Get Started</Link>
              </button>
            </div>
          </div>
        )}
      </nav>
      </header>
      <main>
        {children}
      </main>
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
            <div className="flex justify-between lg:text-xl sm:hidden">
              <h1>CRM</h1>
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
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
              <div
                className="flex  items-center cursor-pointer "
                onClick={toggleCard}
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="h-8 w-8 rounded-full hover:bg-gray-100"
                />

                <div className=" ml-2 cursor-default grid gap-y-0.5">
                  <span className="font-semibold text-sm text-gray-700 ">{loginStatus.fullname}</span>
                  <span className="text-sm text-gray-500 break-all">{loginStatus.email}</span>
                  {/* Profile Card */}
                  {isCardVisible && (
                    <div
                      ref={cardRef}
                      className="absolute right-0 mt-4  mr-3 w-64 bg-white shadow-2xl rounded-lg"
                    >
                      <div className="p-4  border-b border-gray-200 flex items-center">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="User"
                          className="rounded-full w-10 h-10 text-xs text-gray-300"
                        />
                        <div className="ml-3">
                        
                          <span className="text-sm">{loginStatus.fullname}</span>
                          <span className="grid text-xs break-all text-gray-500">
                            {loginStatus.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <button className="px-4 py-2 hover:bg-gray-100 text-left flex items-center gap-2">
                          👤 Profile
                        </button>
                        <button className="px-4 py-2 hover:bg-gray-100 text-left flex items-center gap-2">
                          ⚙️ Account Setting
                        </button>
                        <button className="px-4 py-2 hover:bg-gray-100 text-left flex items-center gap-2">
                          📈 Activity Log
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 text-left flex items-center gap-2">
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      </header>
      <main className={sidebarOpen?  "mt-16 ml-60 flex justify-center items-center" : "mt-16 ml-16 flex justify-center items-center"}>
          {children}
      </main>
      </div>
    );
  }
};

export default Navbar;
