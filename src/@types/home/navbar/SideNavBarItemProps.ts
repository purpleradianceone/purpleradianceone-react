type SideNavBarItemProps =  {
    icon: React.ElementType;
    label: string;
    children?: React.ReactNode[];
    isOpen: boolean;
    onClick?: () => void;
    disabled?:boolean;
    isActive?: boolean;
    iconColor?: string;
    bgColor?: string;
  }

  export default SideNavBarItemProps;