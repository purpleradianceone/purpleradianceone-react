import { Link } from "react-router-dom";

const NavItem = ({ to, icon, label , onClick} : {
    to: string,
    icon: React.ReactNode,
    label: string,
    onClick?: () => void 
}) => (
    <div className="rounded-2xl   transition-all py-1 ">
      <Link to={to} onClick={onClick}>
        <div className="flex flex-col items-center hover:text-blue-700">
          {icon}
          <span className="text-xs text-gray-600  font-medium text-center hover:text-blue-700">{label}</span>
        </div>
      </Link>
    </div>
  );
export default NavItem;  