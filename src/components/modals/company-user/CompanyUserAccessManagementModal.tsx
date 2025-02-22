import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";
import AccessRightsModalProps from "../../../@types/company-users/AccessRightsModalProps";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
// import AccessDeniedPage from "../views/not-found/AccessDeniedPage";
import MessageSnackBar from "../../ui/MessageSnackbar";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import POST_API from "../../../constants/PostApi";
import { AccessManagementType } from "../../../@types/company-users/AccessManagementContextType";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import {
  BOOLEAN_VALUES,
  NUMBER_VALUES,
  STATUS_CODE,
  STRING_VALUES,
} from "../../../constants/AppConstants";
import MESSAGE from "../../../constants/Messages";
import ApiError from "../../../@types/error/ApiError";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";

function CompanyUserAccessManagementModal({
  isOpen,
  onClose,
  users,
}: AccessRightsModalProps) {

  const [dataStatus, setDataStatus] = useState(BOOLEAN_VALUES.FALSE);
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
    type: "success",
  });

  const {userHasAccessToUpdateAccess} = useUserAccessModules();

  const [changedAccessModules, setChangedAccessModules] = useState<
    AccessManagementType[]
  >([]);
  const initialModulesRef = useRef<AccessManagementType[]>([]);
  const [spinnerAnimation, setSpinnerAnimation] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: STRING_VALUES.EMPTY_STRING,
  });

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    BOOLEAN_VALUES.FALSE
  );

  const [modules, setModules] = React.useState<AccessManagementType[]>([
    {
      add: BOOLEAN_VALUES.FALSE,
      company_user_id: NUMBER_VALUES.ZERO,
      createdon: STRING_VALUES.EMPTY_STRING,
      crm_module_id: NUMBER_VALUES.ZERO,
      id: NUMBER_VALUES.ZERO,
      module_name: STRING_VALUES.EMPTY_STRING,
      update: BOOLEAN_VALUES.FALSE,
      updatedby: NUMBER_VALUES.ZERO,
      updatedby_user: STRING_VALUES.EMPTY_STRING,
      view: BOOLEAN_VALUES.FALSE,
      company_id: NUMBER_VALUES.ZERO,
      createdby: NUMBER_VALUES.ZERO,
      updatedon: STRING_VALUES.EMPTY_STRING,
    },
  ]);

  const { loginStatus } = useLoggedInUserContext();

  const fetchUserAccessModules = async () => {
    if (isOpen) {
      setDataStatus(BOOLEAN_VALUES.TRUE);
      const getCrmModuleAccessData = {
        company_id: loginStatus.companyId,
        company_user_id: users.id,
        requestedby: loginStatus.id,
      };

      axios
        .post(POST_API.GET_CRM_MODULE_ACCESS, getCrmModuleAccessData, {
          withCredentials: BOOLEAN_VALUES.TRUE,
        })
        .then((response) => {
          setModules(response.data);
          setDataStatus(BOOLEAN_VALUES.FALSE);
          initialModulesRef.current = response.data;
          setChangedAccessModules([]);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch( async (error : ApiError|any) => {
          console.error(error);
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus =  await RefreshToken({ callFunction: fetchUserAccessModules });
            if (  refreshTokenStatus) {
              setIsDialogueOpen(BOOLEAN_VALUES.FALSE);
            }
            else{
              setIsDialogueOpen(BOOLEAN_VALUES.TRUE);
            }
          }
        });
    } else {
      setModules([]);
      setChangedAccessModules([]);
      setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
    }
  }

  useEffect(() => {
    fetchUserAccessModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (
    moduleId: number,
    field: "add" | "view" | "update"
  ) => {
    setModules((prevModules) => {
      const updatedModules = prevModules.map((module) =>
        module.id === moduleId ? { ...module, [field]: !module[field] } : module
      );

      // Find initial state
      const initialModule = initialModulesRef.current.find(
        (m) => m.id === moduleId
      );
      const updatedModule = updatedModules.find((m) => m.id === moduleId);

      if (!updatedModule || !initialModule) return updatedModules;

      // Check if the module state is different from its initial state
      const hasChanged =
        initialModule.add !== updatedModule.add ||
        initialModule.view !== updatedModule.view ||
        initialModule.update !== updatedModule.update;

      setChangedAccessModules((prevChanges) => {
        // Remove if unchanged, add if changed
        const filteredChanges = prevChanges.filter((m) => m.id !== moduleId);
        return hasChanged
          ? [...filteredChanges, updatedModule]
          : filteredChanges;
      });

      return updatedModules;
    });
  };

  const handleColumnSelectAll = (field: "add" | "view" | "update") => {
    setModules((prevModules) => {
      const isAllChecked = prevModules.every((module) => module[field]);

      const updatedModules = prevModules.map((module) => ({
        ...module,
        [field]: !isAllChecked,
      }));

      setChangedAccessModules(() => {
        return updatedModules.filter((updatedModule) => {
          const initialModule = initialModulesRef.current.find(
            (m) => m.id === updatedModule.id
          );
          return (
            initialModule &&
            (initialModule.add !== updatedModule.add ||
              initialModule.view !== updatedModule.view ||
              initialModule.update !== updatedModule.update)
          );
        });
      });

      return updatedModules;
    });
  };

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  };

  const handleSaveAccessModule = async () => {
    if (changedAccessModules.length === NUMBER_VALUES.ZERO) {
      showMessageSnackbar({ message: MESSAGE.ERROR.NO_CHANGES, type: "error" }); // Updated message for clarity
      return;
    }

    setSpinnerAnimation({
      status: "loading",
      message: MESSAGE.INPROCESS.SAVING,
    });

    const saveCrmModuleAccessData = changedAccessModules.map((module) => ({
      company_id: loginStatus.companyId,
      id: module.id,
      add: module.add,
      view: module.view,
      update: module.update,
      updatedby: loginStatus.id,
    }));

    axios
      .post(POST_API.UPDATE_CRM_MODULE_ACCESS, saveCrmModuleAccessData, {
        withCredentials: BOOLEAN_VALUES.TRUE,
      })
      .then((response) => {
        showMessageSnackbar({
          message: response.data.message,
          type: "success",
        });

        setSpinnerAnimation({
          status: "success",
          message: MESSAGE.SUCCESS.SAVED,
        });

        // Reset tracking of changes
        setChangedAccessModules([]);
        initialModulesRef.current = modules; // Update reference state

        setTimeout(() => {
          setSpinnerAnimation({
            status: "idle",
            message: STRING_VALUES.EMPTY_STRING,
          });
        }, 1000);

        setTimeout(() => {
          onClose();
        }, 2000);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        console.error(error);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({callFunction : handleSaveAccessModule });
          if(refreshTokenStatus){
            setIsDialogueOpen(BOOLEAN_VALUES.FALSE)
          }
          else{
            setIsDialogueOpen(BOOLEAN_VALUES.TRUE);
          }
        } else {
          showMessageSnackbar({
            message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
            type: "error",
          });
        }
      });
  };

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(BOOLEAN_VALUES.FALSE);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const isColumnSelected = (field: "add" | "view" | "update") =>
    modules.every((module) => module[field]);

      return (
        <>
          <div className="fixed inset-0 z-10 p-2 overflow-hidden bg-black bg-opacity-45">
          <div className="flex min-h-screen items-center justify-center">
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-medium text-gray-700">
                  Update Access rights of {users.fullname}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              {dataStatus ? (
                <div className="flex w-full h-48 justify-center items-center">
                  <LoadingSpinner></LoadingSpinner>
                </div>
              ) : (
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-4 w-16">Sr. No.</th>
                        <th className="pb-4">Module Name</th>
                        <th className="pb-4 text-center">
                          <div className="flex flex-col items-center">
                            <span>Add</span>
                            <input
                              type="checkbox"
                              checked={isColumnSelected("add")}
                              onChange={() => handleColumnSelectAll("add")}
                              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                        <th className="pb-4 text-center">
                          <div className="flex flex-col items-center">
                            <span>View</span>
                            <input
                              type="checkbox"
                              checked={isColumnSelected("view")}
                              onChange={() => handleColumnSelectAll("view")}
                              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                        <th className="pb-4 text-center">
                          <div className="flex flex-col items-center">
                            <span>Update</span>
                            <input
                              type="checkbox"
                              checked={isColumnSelected("update")}
                              onChange={() => handleColumnSelectAll("update")}
                              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules
                        .sort((a, b) => a.id - b.id)
                        .map((module) => (
                          <tr key={module.id} className="border-t">
                            <td className="py-3">{module.crm_module_id}</td>
                            <td className="py-3">{module.module_name}</td>
                            <td className="py-3 text-center">
                              <input
                                type="checkbox"
                                checked={module.add}
                                onChange={() =>
                                  handleCheckboxChange(module.id, "add")
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="py-3 text-center">
                              <input
                                type="checkbox"
                                checked={module.view}
                                onChange={() =>
                                  handleCheckboxChange(module.id, "view")
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="py-3 text-center">
                              <input
                                type="checkbox"
                                checked={module.update}
                                onChange={() =>
                                  handleCheckboxChange(module.id, "update")
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end p-2 pb-10 border-t gap-3">
                <div className="min-w-24">
                  {userHasAccessToUpdateAccess ? (
                    users.id === loginStatus.id ? (
                      <Button disabled={BOOLEAN_VALUES.TRUE}>Save</Button>
                    ) : (
                      <Button
                        onClick={handleSaveAccessModule}
                        spinner={spinnerAnimation}
                      >
                        Save
                      </Button>
                    )
                  ) : (
                    <Button disabled={BOOLEAN_VALUES.TRUE}>Save</Button>
                  )}
                </div>
              </div>
            </div>
            <MessageSnackBar
              isOpen={messageSnackbar.open}
              message={messageSnackbar.message}
              type={messageSnackbar.type}
              onClose={handleMessageSnackbarClose}
              duration={NUMBER_VALUES.SNACKBAR_DURATION}
            />
            </div>
          </div>
          <DialogueBox
            isOpen={isDialogueOpen}
            onClose={() => setIsDialogueOpen(BOOLEAN_VALUES.FALSE)}
            onConfirm={handleDialogueConfirm}
            title="Session Expired !"
            message="Session Expired. Please login again."
          />
        </>
      );
}

export default CompanyUserAccessManagementModal;
