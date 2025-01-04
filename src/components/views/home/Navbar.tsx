import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

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
  );
};

export default Navbar;