import  { useEffect, useState } from 'react';
import { Bell, Menu, Search, Settings, X } from 'lucide-react';
import { Link} from 'react-router-dom';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isloggedIn,setIsLoggedIn]= useState<boolean>(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('loginStatus');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  },[]);

 if (!isloggedIn) {
  return (
    
    <nav className="fixed w-full bg-white shadow-sm z-50 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-10">
          <div className="flex items-center">
            <div className='w-32 h-auto'><img src="/images/logo/logo.png" alt="" /></div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
            <a href="#solutions" className="text-gray-700 hover:text-blue-600">Solutions</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600">Products</a>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
              <Link to="/signup">Get Started</Link>
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
              <Link to="/signin">Login</Link>
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Features</a>
            <a href="#solutions" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Solutions</a>
            <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Pricing</a>
            <button className="w-full mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
            <Link to="/signup">Get Started</Link>
            </button>
          </div>
        </div>
      )}
    </nav>
  );}
  else{
   return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
    <div className="px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4">
            <span className="text-xl font-semibold">Elstar</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl ml-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
   );
  }
};

export default Navbar;