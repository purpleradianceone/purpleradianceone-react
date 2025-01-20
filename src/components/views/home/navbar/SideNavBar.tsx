import { Building2, Calendar, FileText, Home, LayoutDashboard, Mail, Menu, MessageSquare, Settings, X } from "lucide-react";
import SideBarProps from "../../../../@types/home/navbar/SideBarProps";
import SideNavBarItem from "./SideNavBarItem";
import { Link } from "react-router-dom";


const SideNavBar = ({isOpen,onToggle} : SideBarProps) => {
  
    return(
        <aside className={`fixed top-0 left-0 h-full bg-white border-r transition-all duration-300 z-30
            ${isOpen ? 'w-64' : 'w-20'}`}
          >
            <div className="flex items-center border-b justify-between px-4 h-16">
              {isOpen && <span className="text-xl font-bold">Elstar</span>}
              <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg">
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
            <nav className="p-3 space-y-1">
              <SideNavBarItem icon={Home} label="Home" isOpen={isOpen} />
              <SideNavBarItem 
                icon={LayoutDashboard} 
                label="Dashboards" 
                isOpen={isOpen}
                children={[<>Default</>, <>Analytics</>, <>Sales</>, <>CRM</>]}
              />
              <SideNavBarItem 
                icon={Building2} 
                label="Manage Users" 
                isOpen={isOpen}
                children={[
                <Link to="/home/manage-users/add-user">Add User</Link>, 
                <Link to="/home/manage-users/users">Manage Company Users</Link>, <>Customers</>]}
              />
              <SideNavBarItem 
                icon={FileText} 
                label="Pages" 
                isOpen={isOpen}
                children={[<>Profile</>, <>Settings</>, <>Invoice</>]}
              />
              <SideNavBarItem icon={Mail} label="Mail" isOpen={isOpen} />
              <SideNavBarItem icon={MessageSquare} label="Chat" isOpen={isOpen} />
              <SideNavBarItem icon={Calendar} label="Calendar" isOpen={isOpen} />
              <SideNavBarItem icon={Settings} label="Settings" isOpen={isOpen} />
            </nav>
          </aside>
    );

};

export default SideNavBar;