/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CompanyUserDashboardProps from "../../../@types/company-users/CompanyUserDashboardProps";
import { useEffect, useState } from "react";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ApiError from "../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import MESSAGE from "../../../constants/Messages";
import Button from "../../ui/Button";
import { Grid, Save, X } from "lucide-react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";

import FormHeader from "../../ui/FormHeader";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";

interface CompanyUserDashboard {
  id: number;
  company_user_id: number;
  dashboard_id: number;
  dashboard_name: string;
  isactive: boolean;
  createdby: string;
  updatedby: string;
  createdon: string;
  updatedon: string;
  updatedby_id: number;
}

function CompanyUserDashboardModal({
  isOpen,
  onClose,
  users,
}: CompanyUserDashboardProps) {
  const { userHasAccessToUpdateDashboard } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const [companyUserDashboard, setCompanyUserDashboard] = useState<
    CompanyUserDashboard[]
  >([]);

  const [companyUserDashboardChange, setCompanyUserDashboardChange] = useState<
    CompanyUserDashboard[]
  >([]);

  const [spinnerAnimation, setSpinnerAnimation] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  // const { userHasAccessToUpdateAccess } = useUserAccessModules();

  const handleSave = async () => {
    try {
      setSpinnerAnimation({
        status: "loading",
        message: MESSAGE.INPROCESS.SAVING,
      });

      const postDataForUpdateCompanyUserDashboard =
        companyUserDashboardChange.map((d) => ({
          company_id: loginStatus.companyId,
          id: d.id,
          company_user_id: users.id,
          isactive: d.isactive,
          updatedby_id: loginStatus.id,
        }));

      await axios
        .post(
          POST_API.UPDATE_COMPANY_USER_DASHBOARD,
          postDataForUpdateCompanyUserDashboard,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.status) {
            // toast.success(response.data.message);

            toast.success(response.data.message);
            setSpinnerAnimation({
              status: "success",
              message: MESSAGE.SUCCESS.SAVED,
            });

            setTimeout(() => {
              setSpinnerAnimation({
                status: "idle",
                message: "",
              });
            }, 1000);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: handleSave,
            });
            if (refreshTokenResponse) {
              handleSave();
            }
          }
        });
    } catch (e) {
      alert(e);
    } finally {
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  const fetchCompanyUserDashboard = async () => {
    if (isOpen) {
      try {
        const getCompanyUserDashboardPostData = {
          company_id: loginStatus.companyId,
          company_user_id: users.id,
          isactive: null,
          requestedby_id: loginStatus.id,
        };

        await axios
          .post(
            POST_API.GET_COMPANY_USER_DASHBOARD,
            getCompanyUserDashboardPostData,
            { withCredentials: true }
          )
          .then((response) => {
            if (response.data != null) {
              const companyUserDashboard: CompanyUserDashboard[] =
                response.data.sort(
                  (a: CompanyUserDashboard, b: CompanyUserDashboard) =>
                    a.dashboard_id - b.dashboard_id
                );

              setCompanyUserDashboard(companyUserDashboard);

              // setCompanyUserDashboard(response.data);
            }
          })
          .catch(async (error: ApiError | any) => {
            if (error.status === STATUS_CODE.UNATHORISED) {
              const refreshTokenStatus = await RefreshToken({
                callFunction: fetchCompanyUserDashboard,
              });
              if (refreshTokenStatus) {
                fetchCompanyUserDashboard();
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      //
    }
  };

  // fetchCompanyUserDashboard();
  // Open/Close dialog based on `isOpen` prop
  useEffect(() => {
    if (isOpen) {
      fetchCompanyUserDashboard();
    }
    if(!isOpen){
      setCompanyUserDashboard([]);
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-5">
      <div className="flex min-h-screen items-center justify-center">
        <div id="company-user-dashboard-modal" className="relative p-4 w-full max-w-lg h-[50vh] bg-white rounded-lg shadow-xl animate-fadeIn flex flex-col gap-1">
            <FormHeader
              icon={Grid}
              onClose={onClose}
              postText="dashboard"
              description="Modify who can view the dashboard based on roles and responsibilities."
              userName={users.fullname}
            />
         

          {companyUserDashboard.length === 0 && (
            <div className="flex w-full h-full justify-center items-center">
              <LoadingSpinner />
            </div>
          )}
          {companyUserDashboard.length !== 0 && (
            <ul className="space-y-2">
              {companyUserDashboard.map((dashboard) => (
                <li
                  key={dashboard.id}
                  className={`p-1 border rounded bg-gray-50`}
                >
                  <div className="flex justify-between items-center">
                    <span className="table-data-custom">
                      {dashboard.dashboard_name}
                    </span>

                    <input
                      type="checkbox"
                      checked={dashboard.isactive}
                      onChange={(e) => {
                        const updateDashboard = companyUserDashboard.map((d) =>
                          d.id == dashboard.id
                            ? { ...d, isactive: e.target.checked }
                            : d
                        );

                        setCompanyUserDashboard(updateDashboard);
                        setCompanyUserDashboardChange(updateDashboard);
                      }}
                      className="w-4 h-4 cursor-pointer"
                    ></input>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="p-3 border-t bg-white">
            <div className="flex gap-1 justify-self-end min-w-36 max-w-56">
              <Button type="button" onClick={onClose}>
                <div className="flex gap-0.5 items-center">
                  <X size={16} />
                  Cancel
                </div>
              </Button>
              <Button
                type="submit"
                disabled={!userHasAccessToUpdateDashboard}
                onClick={(e) => {
                  e.preventDefault();
                  if (userHasAccessToUpdateDashboard) {
                    handleSave();
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.DASHBOARD
                        .DENIED_UPDATE_ACCESS_DASHBOARD
                    );
                  }
                }}
                spinner={spinnerAnimation}
              >
                <div className="flex gap-1 items-center">
                  <Save size={16} />
                  Save
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyUserDashboardModal;
