import React from "react";

const OutlookCalendarIcon: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
> = (props) => {
  return (
    <img
      src="https://img.icons8.com/color/48/microsoft-outlook-2019.png"
      alt="Outlook Calendar"
      {...props}
    />
  );
};

export default OutlookCalendarIcon;
