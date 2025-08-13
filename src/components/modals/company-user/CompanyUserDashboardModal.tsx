import axios from "axios";
import CompanyUserDashboardProps from "../../../@types/company-users/CompanyUserDashboardProps";
import { useEffect, useRef, useState } from "react";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ApiError from "../../../@types/error/ApiError";
import { NUMBER_VALUES, STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MESSAGE from "../../../constants/Messages";
import Button from "../../ui/Button";
import MessageSnackBar from "../../ui/MessageSnackbar";
// import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { X } from "lucide-react";

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
  const { loginStatus } = useLoggedInUserContext();

  const [companyUserDashboard, setCompanyUserDashboard] = useState<
    CompanyUserDashboard[]
  >([]);

  const [companyUserDashboardChange, setCompanyUserDashboardChange] = useState<
    CompanyUserDashboard[]
  >([]);

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const initialDataRef = useRef<CompanyUserDashboard[]>([]);

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const [spinnerAnimation, setSpinnerAnimation] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

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
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });

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

          setTimeout(() => {
            onClose();
          }, 2000);
        });

      console.log("---------------------------");
      console.log(POST_API.UPDATE_COMPANY_USER_DASHBOARD);
      console.log("---------------------------");

      // Update original data to match new state
      initialDataRef.current = [...companyUserDashboard];

      await fetchCompanyUserDashboard();
    } catch (e) {
      alert(e);
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

              const companyUserDashboard : CompanyUserDashboard[] = response.data.sort((a:CompanyUserDashboard , b:CompanyUserDashboard)=>a.dashboard_id - b.dashboard_id);

              setCompanyUserDashboard(companyUserDashboard);

              // setCompanyUserDashboard(response.data);

            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    fetchCompanyUserDashboard();
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // fetchCompanyUserDashboard();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-[600px] p-6 rounded-lg shadow-lg border border-gray-300 bg-white"
    >
      <div className="flex justify-between items-center p-6 border-6">
        <h2 className="text-xl font-semibold mb-4">
          {users.fullname}'s Dashboard{" "}
        </h2>

        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={20}></X>
        </button>
      </div>

      <ul className="mb-4 space-y-2">
        {companyUserDashboard.map((dashboard) => (
          <li
            key={dashboard.id}
            className={`p-3 border rounded ${
              dashboard.isactive ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{dashboard.dashboard_name}</span>

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

      <div className="p-6 border-t bg-white">
        <div className="flex justify-end">

          {/* {userHasAccessToUpdateAccess ? (
            users.id === loginStatus.id ? (
              <Button disabled={true}>Save</Button>
            ) : (
              <Button onClick={handleSave} spinner={spinnerAnimation}>
                Save
              </Button>
            )
          ) : (
            <Button disabled={true}>Save</Button>
          )} */}

          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
            spinner={spinnerAnimation}
          >
            Save
          </Button>

        </div>
      </div>

      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </dialog>
  );
}

export default CompanyUserDashboardModal;
