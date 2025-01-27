type SideNavBarItemProps =  {
    icon: React.ElementType;
    label: string;
    children?: React.ReactNode[];
    isOpen: boolean;
    onClick?: () => void;
    disabled?:boolean;
  }

  export default SideNavBarItemProps;