import { ReactNode } from "react";
import { useUserPreference } from "../../context/user/UserPreference";

export const PageLayout = ({
  children,
  bgColor = "bg-white",
  onScrollChange,
  scrollTopValue = 40
}: {
  children: ReactNode;
  bgColor?: string;
  onScrollChange?: (isScrolled: boolean) => void;
  scrollTopValue? : number
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
      className={`fixed top-8 inset-0 z-10 ${bgColor} ${
        userPreference.isLeftMenu ? "ml-[50px] mr-0 mt-3" : "mt-4"
      } overflow-auto`}
    >
      {children}
    </div>
  );
};

