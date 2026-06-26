import { ReactNode } from "react";
import { useUserPreference } from "../../context/user/UserPreference";

// Use this when showing the any details
// wrap the component in the page layout , so it will take care of the padding and the margin
// on scroll of want to show any data then onScrollChange is usefull
export const PageLayout = ({
  children,
  bgColor = "bg-white",
  onScrollChange,
  scrollTopValue = 40,
}: {
  children: ReactNode;
  bgColor?: string;
  onScrollChange?: (isScrolled: boolean) => void;
  scrollTopValue?: number;
}) => {
  const { userPreference } = useUserPreference();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onScrollChange) return;
    const target = e.currentTarget;
    onScrollChange(target.scrollTop > scrollTopValue);
  };

  return (
    <div
      onScroll={handleScroll}
      className={`fixed  custom-scrollbar-black top-8 inset-0 z-10 ${bgColor} ${
        userPreference.isLeftMenu
          ? userPreference.sidebarOpen
            ? "ml-64 mr-0 mt-3"
            : "ml-[50px] mr-0 mt-3"
          : "mt-4"
      } overflow-auto`}
    >
      {children}
    </div>
  );
};
