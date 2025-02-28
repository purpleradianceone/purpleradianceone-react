import { Building2, Handshake, Home, Menu, Settings, Store, X } from "lucide-react";
import SideBarProps from "../../../../@types/home/navbar/SideBarProps";
import SideNavBarItem from "./SideNavBarItem";
import { Link } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import { BOOLEAN_VALUES, } from "../../../../constants/AppConstants";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";


function SideNavBar({isOpen,onToggle} : SideBarProps){

  const {userHasAccessToViewUser,userHasAccessToViewLead} = useUserAccessModules()


    return(
      <aside
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

             {userHasAccessToViewUser && 
                <Link to={ROUTES_URL.GET_COMPANY_USERS} onClick={() => {window.location.href = ROUTES_URL.GET_COMPANY_USERS}}>
                <SideNavBarItem 
                  icon={Building2} 
                  label="Company Users" 
                  isOpen={isOpen}
                /></Link>
            }

            {!userHasAccessToViewUser &&
            <Link to={ROUTES_URL.GET_COMPANY_USERS}>
            <SideNavBarItem 
              icon={Building2} 
              label="Company Users" 
              isOpen={isOpen}
              disabled={BOOLEAN_VALUES.TRUE}
            />
            </Link>}
            
            
            {userHasAccessToViewLead && 
            <Link to={ROUTES_URL.GET_LEAD_MANAGEMENT}>
            <SideNavBarItem 
              icon={Handshake} 
              label="Lead" 
              isOpen={isOpen}
            />
            </Link>
            }

            {!userHasAccessToViewLead &&
                <Link to={ROUTES_URL.GET_LEAD_MANAGEMENT}>
                <SideNavBarItem 
                  icon={Handshake} 
                  label="Lead" 
                  isOpen={isOpen}
                  disabled={BOOLEAN_VALUES.TRUE}
                />
                </Link>
            }

            <Link to={ROUTES_URL.PRODUCT_MANAGEMENT}>
              <SideNavBarItem
              icon={Store}
              label="Products"
              isOpen={isOpen}
              />
            </Link>

            
            <SideNavBarItem
            icon={Settings}
            label="Crm Settings"
            isOpen={isOpen}
            children={[<Link to={ROUTES_URL.LEAD_SETTINGS}>Lead</Link>,"Product"]}
            ></SideNavBarItem>


          </nav>
        </aside>
  );
   

};

export default SideNavBar;