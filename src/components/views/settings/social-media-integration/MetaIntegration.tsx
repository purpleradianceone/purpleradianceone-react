// src/pages/MetaIntegration.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Settings } from "lucide-react";
import ROUTES_URL from "../../../../constants/Routes";
import MetaIcon from "../../../../assets/svg/MetaIcon";
import Button from "../../../ui/Button";
import PageIdIntegration from "./PageIdIntegration";

const MetaIntegration: React.FC = () => {
  const navigate = useNavigate();

  const stepItems = [
    {
      icon: <MetaIcon className="w-6 h-6 table-header-custom-blue" />,
      title: "Sign In Securely",
      description:
        "You will be securely redirected to Meta's login page to authenticate with your personal Facebook account. This is a one-time process that allows us to access your business assets without ever seeing or storing your password.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 table-header-custom-green" />,
      title: "Select Your Business Assets",
      description:
        "From the list provided by Meta, select the Facebook Page, Instagram account, and WhatsApp Business account you wish to connect. You are granting us permission to securely retrieve leads and manage messages on your behalf.",
    },
    {
      icon: <Settings className="w-6 h-6 table-header-custom" />,
      title: "Activate Lead Capture",
      description:
        "Once you confirm, our system will automatically configure the necessary connections. Your CRM is now ready to receive new leads and customer chats from your selected Meta accounts in real-time.",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50  font-sans">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
        {/* Header Section */}
        <div className="text-center mb-1">
          <h1 className="main-title-custom tracking-tight">
            <MetaIcon className="w-12 h-12 main-title-custom-blue place-self-center" />
            Integrate META with Your CRM
          </h1>
          <p className="input-label-custom mx-auto">
            Automatically capture and manage leads from your Facebook,
            Instagram, and WhatsApp accounts. This simple, one-time process
            securely links your business and allows us to centralize all your
            customer conversations into a single, powerful CRM.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8  md:mb-4">
          {stepItems.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-inner"
            >
              <div className="mb-4 section-header-custom">
                <span className="bg-white rounded-full p-2 shadow-md inline-block min-w-8">
                  {index + 1}
                </span>
              </div>
              <div className="mb-3">{step.icon}</div>
              <h3 className="section-header-custom mb-2">
                {step.title}
              </h3>
              <p className="input-label-custom">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Button Section */}
        <div className="text-center">
          <div className="max-w-32 justify-self-center">
            <Button
          type="submit"
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES_URL.FACEBOOK_OAUTH);
            }}
          >
            <div className="flex gap-2">
              <MetaIcon className="w-6 h-6" />
              <span>Connect</span>
            </div>
          </Button>
          </div>
        </div>
      </div>
      <PageIdIntegration  />    
    </div>
  );
};

export default MetaIntegration;
