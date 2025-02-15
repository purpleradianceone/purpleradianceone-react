import { Building2, Calendar, Handshake, Home, LayoutDashboard, Mail, Menu, MessageSquare, Settings, X } from "lucide-react";
import SideBarProps from "../../../../@types/home/navbar/SideBarProps";
import SideNavBarItem from "./SideNavBarItem";
import { Link } from "react-router-dom";
import { useAccessManagementContext } from "../../../../context/user/AccessManagementContext";
import ROUTES_URL from "../../../../constants/Routes";
import { BOOLEAN_VALUES, NUMBER_VALUES } from "../../../../constants/AppConstants";


function SideNavBar({isOpen,onToggle} : SideBarProps){

  const {accessModules} = useAccessManagementContext();
  
  return accessModules.map((module) => {


    return(
      <aside key={module.id}
       className={`fixed top-0 left-0 h-full bg-white border-r transition-all duration-300 z-30
          ${isOpen ? 'w-64' : 'w-20'}`}
        >
          <div className="flex items-center border-b justify-between px-4 h-16">
            {isOpen && <span className="text-xl font-bold">Purple CRM</span>}
            <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <nav className="p-3 space-y-1">
            <Link to= {ROUTES_URL.HOME}>
            <SideNavBarItem icon={Home} label="Home" isOpen={isOpen}/>
            </Link>
            <SideNavBarItem 
           
              icon={LayoutDashboard} 
              label="Dashboards" 
              isOpen={isOpen}
              children={[<>Default</>, <>Analytics</>, <>Sales</>, <>CRM</>]}
            />

            {module.crm_module_id === NUMBER_VALUES.ONE ?
             module.view ? (
                <Link to={ROUTES_URL.GET_COMPANY_USERS} onClick={() => {window.location.href = ROUTES_URL.GET_COMPANY_USERS}}>
                <SideNavBarItem 
                  icon={Building2} 
                  label="Company Users" 
                  isOpen={isOpen}
                /></Link>
            ) : (
            <Link to={ROUTES_URL.GET_COMPANY_USERS}>
            <SideNavBarItem 
              icon={Building2} 
              label="Company Users" 
              isOpen={isOpen}
              disabled={BOOLEAN_VALUES.TRUE}
            />
            </Link>
            ) : (
              <Link to={ROUTES_URL.GET_COMPANY_USERS}>
              <SideNavBarItem 
                icon={Building2} 
                label="Company Users" 
                isOpen={isOpen}
                onClick={() => {window.location.href = ROUTES_URL.GET_COMPANY_USERS }}

              /></Link>
            )
            }
            
            <Link to={ROUTES_URL.GET_LEAD_MANAGEMENT}>
            <SideNavBarItem 
              icon={Handshake} 
              label="Lead" 
              isOpen={isOpen}
            />
            </Link>


            <SideNavBarItem icon={Mail} label="Mail" isOpen={isOpen} />

            <SideNavBarItem icon={MessageSquare} label="Chat" isOpen={isOpen} />

            <SideNavBarItem icon={Calendar} label="Calendar" isOpen={isOpen} />
            
            <SideNavBarItem icon={Settings} label="Settings" isOpen={isOpen} />
          </nav>
        </aside>
  );
  })
   

};

export default SideNavBar;