// src/pages/MetaIntegration.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Settings } from "lucide-react";
import ROUTES_URL from "../../../../constants/Routes";
import MetaIcon from "../../../../assets/svg/MetaIcon";

const MetaIntegration: React.FC = () => {
  const navigate = useNavigate();

  const stepItems = [
    {
      icon: <MetaIcon className="w-6 h-6 text-indigo-500" />,
      title: "Sign In Securely",
      description:
        "You will be securely redirected to Meta's login page to authenticate with your personal Facebook account. This is a one-time process that allows us to access your business assets without ever seeing or storing your password.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "Select Your Business Assets",
      description:
        "From the list provided by Meta, select the Facebook Page, Instagram account, and WhatsApp Business account you wish to connect. You are granting us permission to securely retrieve leads and manage messages on your behalf.",
    },
    {
      icon: <Settings className="w-6 h-6 text-gray-500" />,
      title: "Activate Lead Capture",
      description:
        "Once you confirm, our system will automatically configure the necessary connections. Your CRM is now ready to receive new leads and customer chats from your selected Meta accounts in real-time.",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-1 font-sans">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
        {/* Header Section */}
        <div className="text-center mb-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
            <MetaIcon className="w-12 h-12 text-indigo-500 place-self-center" />
            Integrate META with Your CRM
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Automatically capture and manage leads from your Facebook,
            Instagram, and WhatsApp accounts. This simple, one-time process
            securely links your business and allows us to centralize all your
            customer conversations into a single, powerful CRM.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 md:mb-16">
          {stepItems.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-inner"
            >
              <div className="mb-4 text-3xl font-bold text-gray-800">
                <span className="bg-white rounded-full p-2 shadow-md inline-block">
                  {index + 1}
                </span>
              </div>
              <div className="mb-3">{step.icon}</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Button Section */}
        <div className="text-center">
          <button
            className="w-full md:w-auto px-10 py-4 font-bold rounded-full shadow-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
            onClick={() => {
              navigate(ROUTES_URL.FACEBOOK_OAUTH);
            }}
          >
            <div className="flex gap-2">
              <MetaIcon className="w-6 h-6" />
              <span>Connect</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetaIntegration;
