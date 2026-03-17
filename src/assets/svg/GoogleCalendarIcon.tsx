import React from "react";

const GoogleCalendarIcon: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
> = (props) => {
  const day = new Date().getDate();

  const iconUrl = `https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${day}_2x.png`;

  return <img src={iconUrl} alt="Google Calendar" {...props} />;
};

export default GoogleCalendarIcon;
