type SideNavBarItemProps =  {
    icon: React.ElementType;
    label: string;
    children?: string[];
    isOpen: boolean;
    onClick?: () => void;
  }

  export default SideNavBarItemProps;