import axios from "axios";
import CompanyUserDashboardProps from "../../../@types/company-users/CompanyUserDashboardProps";
import { useEffect, useRef, useState } from "react";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ApiError from "../../../@types/error/ApiError";
import { NUMBER_VALUES, STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import MESSAGE from "../../../constants/Messages";
import Button from "../../ui/Button";
import { Grid, Save, X } from "lucide-react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import FormHeader from "../../ui/FormHeader";

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
          if (response.data.status) {
            // toast.success(response.data.message);
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
          } else {
            // toast.error(response.data.message);
            showMessageSnackbar({
              message: response.data.message,
              type: "error",
            });
          }
        });

      console.log("---------------------------");
      console.log(POST_API.UPDATE_COMPANY_USER_DASHBOARD);
      console.log("---------------------------");

      // Update original data to match new state
      initialDataRef.current = [...companyUserDashboard];

      await fetchCompanyUserDashboard();
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
      className="w-[600px] p-4 rounded-lg    bg-white"
    >
      {/* <div className="flex justify-between border-gray-300 border-b pb-1 mb-3 items-center ">
        <h2 className="text-xl items-center gap-1 flex text-blue-600 font-semibold ">
          <Grid size={20}/> {users.fullname}'s <span className="text-gray-800"> dashboard </span>
        </h2>

        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={20}></X>
        </button>
      </div> */}
      <FormHeader
        icon={Grid}
        onClose={onClose}
        postText="'s dashboard"
        userName={users.fullname}
      />

      <ul className="mb-4  space-y-2">
        {companyUserDashboard.map((dashboard) => (
          <li
            key={dashboard.id}
            className={`p-3 border rounded bg-gray-50`}
          >
            <div className="flex justify-between items-center">
              <span className="table-data-custom">{dashboard.dashboard_name}</span>

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

      <div className="p-3 border-t bg-white">
        <div className="flex gap-1 justify-self-end min-w-36 max-w-56">
          <Button onClick={onClose}>
            <div className="flex gap-0.5 items-center">
              <X size={16} />
              Cancel
            </div>
          </Button>
          <Button
            onClick={() => {
              if (userHasAccessToUpdateDashboard) {
                handleSave();
              } else {
                showMessageSnackbar({
                  message:
                    MESSAGE.MODULE_ACCESS.DASHBOARD
                      .DENIED_UPDATE_ACCESS_DASHBOARD,
                  type: "error",
                });
                return;
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
