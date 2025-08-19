/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import SupportDashboard from "../dashboards/SupportDashboard";
import InventoryDashboard from "../dashboards/InventoryDashboard";
import FinanceDashboard from "../dashboards/FinanceDashboard";
import HRMSDashboard from "../dashboards/HRMSDashboard";
import CompanyUserDropdown, {
  UserResponse,
} from "../custom_company_user_dropdown/CustomCompanyUserDropdown";
import { useUserPreference } from "../../../../context/user/UserPreference";

// ======= Dashboard Components =======
const CRM: React.FC<{companyUserId:number|null}> = ({companyUserId}) => <Dashboard companyUserId={companyUserId} />;
const Support: React.FC = () => <SupportDashboard />;
const Inventory: React.FC = () => <InventoryDashboard />;
const Finance: React.FC = () => <FinanceDashboard />;
const HRMS: React.FC = () => <HRMSDashboard />;

// ======= Types =======
type DashboardType = {
  id: number;
  company_user_id: number;
  dashboard_id: number;
  dashboard_name: string;
  isactive: boolean;
};

const Home: React.FC = () => {
  const { loginStatus } = useLoggedInUserContext();
  const [modules, setModules] = useState<DashboardType[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const { userPreference } = useUserPreference();

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <CRM companyUserId={(selectedUser??loginStatus).id} />;
      case 2:
        return <Support />;
      case 3:
        return <Inventory />;
      case 4:
        return <Finance />;
      case 5:
        return <HRMS />;
      default:
        return <div>No content available for this dashboard.</div>;
    }
  };

  const fetchCompanyUserDashboardAssigned = async () => {
    // setLoading(true);
    try {
      const getCompanyUserDashboardPostData = {
        company_id: loginStatus.companyId,
        company_user_id: (selectedUser ?? loginStatus).id,
        isactive: true,
        requestedby_id: loginStatus.id,
      };

      await axios
        .post(
          POST_API.GET_COMPANY_USER_DASHBOARD_ASSIGNED,
          getCompanyUserDashboardPostData,
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data != null) {
            let fetchedModules: DashboardType[] = response.data;
            fetchedModules = fetchedModules
              .filter((m) => m.isactive)
              .sort((a, b) => a.dashboard_id - b.dashboard_id);
            setModules(
              fetchedModules
                .filter((m) => m.isactive)
                .sort((a, b) => a.dashboard_id - b.dashboard_id)
            );

            if (fetchedModules.length > 0) {
              setActiveTab(fetchedModules[0].dashboard_id);
            }
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunction: fetchCompanyUserDashboardAssigned,
            });
            if (refreshTokenStatus) {
              fetchCompanyUserDashboardAssigned();
            }
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyUserDashboardAssigned();
  }, [selectedUser]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100 text-gray-500">
        {/* Simple loading spinner */}
        <svg
          className="animate-spin h-8 w-8 text-blue-500"
          // xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
          />
        </svg>
        <span className="ml-3">Loading dashboards...</span>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {loginStatus.isSuperUser && (
        <div className="">
          <CompanyUserDropdown
            limit={userPreference.rowsInGrid}
            companyId={loginStatus.companyId}
            requestedBy={loginStatus.id}
            onChange={(option) => {
              if (option) {
                setSelectedUser({
                  id: option.value,
                  company_id: loginStatus.companyId,
                  fullname: option.label,
                  email: option.email,
                  mobilenumber: option.mobilenumber,
                  isactive: option.isActive,
                  createdby: "",
                  createdon: "",
                });
              } else {
                setSelectedUser(null);
              }
            }}
          />
        </div>
      )}
      {/* Horizontal Tabs */}
      {modules.length === 0 && (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100 text-gray-500">
          No Dashboard available
        </div>
      )}{" "}
      {modules.length !== 0 && (
        <div>
          <div className="bg-white border-b border-gray-300">
            <div className="flex justify-start">
              {modules.map((module) => (
                <button
                  key={module.dashboard_id}
                  onClick={() => setActiveTab(module.dashboard_id)}
                  className={`px-6 py-1 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === module.dashboard_id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-700 hover:text-blue-500"
                }`}
                >
                  {module.dashboard_name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1  overflow-y-auto bg-gray-50">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
