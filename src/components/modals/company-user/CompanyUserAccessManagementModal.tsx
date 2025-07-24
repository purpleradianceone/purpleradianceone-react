/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";
import AccessRightsModalProps from "../../../@types/company-users/AccessRightsModalProps";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import MessageSnackBar from "../../ui/MessageSnackbar";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import POST_API from "../../../constants/PostApi";
import { AccessManagementType } from "../../../@types/company-users/AccessManagementContextType";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import {
  NUMBER_VALUES,
  STATUS_CODE,
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
  const [dataStatus, setDataStatus] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  const { userHasAccessToUpdateAccess } = useUserAccessModules();

  const [changedAccessModules, setChangedAccessModules] = useState<AccessManagementType[]>([]);
  const initialModulesRef = useRef<AccessManagementType[]>([]);
  const [spinnerAnimation, setSpinnerAnimation] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);

  const [modules, setModules] = React.useState<AccessManagementType[]>([
    {
      add: false,
      company_user_id: 0,
      createdon: "",
      crm_module_id: 0,
      id: 0,
      module_name: "",
      update: false,
      updatedby: 0,
      updatedby_user: "",
      view: false,
      company_id: 0,
      createdby: 0,
      updatedon: "",
    },
  ]);

  const { loginStatus } = useLoggedInUserContext();

  const fetchUserAccessModules = async () => {
    if (isOpen) {
      setDataStatus(true);
      const getCrmModuleAccessData = {
        company_id: loginStatus.companyId,
        company_user_id: users.id,
        requestedby: loginStatus.id,
      };

      axios
        .post(POST_API.GET_CRM_MODULE_ACCESS, getCrmModuleAccessData, {
          withCredentials: true,
        })
        .then((response) => {
          setModules(response.data);
          setDataStatus(false);
          initialModulesRef.current = response.data;
          setChangedAccessModules([]);
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({ callFunction: fetchUserAccessModules });
            if (refreshTokenStatus) {
              setIsDialogueOpen(false);
            } else {
              setIsDialogueOpen(true);
            }
          } else if (error.status === STATUS_CODE.FORBIDDEN) {
            setIsDialogueOpen(true);
          }
        });
    } else {
      setModules([]);
      setChangedAccessModules([]);
      setMessageSnackbar((prev) => ({ ...prev, open: false }));
    }
  };

  useEffect(() => {
    fetchUserAccessModules();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (moduleId: number, field: "add" | "view" | "update") => {
    setModules((prevModules) => {
      const updatedModules = prevModules.map((module) =>
        module.id === moduleId ? { ...module, [field]: !module[field] } : module
      );

      const initialModule = initialModulesRef.current.find((m) => m.id === moduleId);
      const updatedModule = updatedModules.find((m) => m.id === moduleId);

      if (!updatedModule || !initialModule) return updatedModules;

      const hasChanged =
        initialModule.add !== updatedModule.add ||
        initialModule.view !== updatedModule.view ||
        initialModule.update !== updatedModule.update;

      setChangedAccessModules((prevChanges) => {
        const filteredChanges = prevChanges.filter((m) => m.id !== moduleId);
        return hasChanged ? [...filteredChanges, updatedModule] : filteredChanges;
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
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSaveAccessModule = async () => {
    if (changedAccessModules.length === 0) {
      showMessageSnackbar({ message: MESSAGE.ERROR.NO_CHANGES, type: "error" });
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
      .put(POST_API.UPDATE_CRM_MODULE_ACCESS, saveCrmModuleAccessData, {
        withCredentials: true,
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

        setChangedAccessModules([]);
        initialModulesRef.current = modules;

        setTimeout(() => {
          setSpinnerAnimation({
            status: "idle",
            message: "",
          });
        }, 1000);

        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({ callFunction: handleSaveAccessModule });
          if (refreshTokenStatus) {
            setIsDialogueOpen(false);
          } else {
            setIsDialogueOpen(true);
          }
        } else if (error.status === STATUS_CODE.FORBIDDEN) {
          setIsDialogueOpen(true);
        } else {
          showMessageSnackbar({
            message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
            type: "error",
          });
        }
      });
  };

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const isColumnSelected = (field: "add" | "view" | "update") =>
    modules.every((module) => module[field]);

  const columnClasses = {
    srNo: "w-[10%]",
    moduleName: "w-[40%]",
    checkbox: "w-[16.67%]",
  };

  return (
    <>
      <div className="fixed inset-0 z-10 p-4 overflow-hidden bg-black bg-opacity-45">
        <div className="flex min-h-screen items-center justify-center">
          <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-lg shadow-xl animate-fadeIn flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
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

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {dataStatus ? (
                <div className="flex w-full h-full justify-center items-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Fixed Header */}
                  <div className="bg-white border-b">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col className={columnClasses.srNo} />
                        <col className={columnClasses.moduleName} />
                        <col className={columnClasses.checkbox} />
                        <col className={columnClasses.checkbox} />
                        <col className={columnClasses.checkbox} />
                      </colgroup>
                      <thead>
                        <tr className="text-left">
                          <th className="p-4">Sr. No.</th>
                          <th className="p-4">Module Name</th>
                          <th className="p-4">
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
                          <th className="p-4">
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
                          <th className="p-4">
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
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col className={columnClasses.srNo} />
                        <col className={columnClasses.moduleName} />
                        <col className={columnClasses.checkbox} />
                        <col className={columnClasses.checkbox} />
                        <col className={columnClasses.checkbox} />
                      </colgroup>
                      <tbody>
                        {modules
                          .sort((a, b) => a.id - b.id)
                          .map((module) => (
                            <tr key={module.id} className="border-t hover:bg-gray-50">
                              <td className="p-4">{module.crm_module_id}</td>
                              <td className="p-4">{module.module_name}</td>
                              <td className="p-4">
                                <div className="flex flex-col ml-2 items-center">
                                  <input
                                    type="checkbox"
                                    checked={module.add}
                                    onChange={() => handleCheckboxChange(module.id, "add")}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col ml-2 items-center">
                                  <input
                                    type="checkbox"
                                    checked={module.view}
                                    onChange={() => handleCheckboxChange(module.id, "view")}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col ml-3 items-center">
                                  <input
                                    type="checkbox"
                                    checked={module.update}
                                    onChange={() => handleCheckboxChange(module.id, "update")}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-white">
              <div className="flex justify-self-end min-w-36 max-w-44">
                {userHasAccessToUpdateAccess ? (
                  users.id === loginStatus.id ? (
                    <Button disabled={true}>Save</Button>
                  ) : (
                    <Button onClick={handleSaveAccessModule} spinner={spinnerAnimation}>
                      Save
                    </Button>
                  )
                ) : (
                  <Button disabled={true}>Save</Button>
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
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired!"
        message="Session Expired. Please login again."
      />
    </>
  );
}

export default CompanyUserAccessManagementModal;