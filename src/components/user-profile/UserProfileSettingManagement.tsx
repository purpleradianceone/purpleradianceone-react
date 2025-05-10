import React from "react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

type UserProfileProps = {

  gmail: string;
  timezone: string;
};

const UserProfileSettingManagement: React.FC<UserProfileProps> = ({
  gmail,
  timezone,
}) => {

    const {loginStatus} = useLoggedInUserContext();
  return (
    <div className="w-full min-h-screen  ">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">User Profile</h2>
          <div className="text-lg text-gray-800">
            <p>
              <span className="font-semibold">Name:</span> {loginStatus.fullName}
            </p>
            <p>
              <span className="font-semibold">Company:</span> {loginStatus.companyName}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {loginStatus.email}
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Other Details</h3>
          <div className="text-lg text-gray-800">
            <p>
              <span className="font-semibold">Gmail:</span> {gmail}
            </p>
            <p>
              <span className="font-semibold">Time Zone:</span> {timezone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettingManagement;
