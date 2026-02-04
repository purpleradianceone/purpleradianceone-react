/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Save, ShieldCheck, X } from "lucide-react";
import Button from "../../ui/Button";
import AccessRightsModalProps from "../../../@types/company-users/AccessRightsModalProps";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import POST_API from "../../../constants/PostApi";
import { AccessManagementType } from "../../../@types/company-users/AccessManagementContextType";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import MESSAGE from "../../../constants/Messages";
import ApiError from "../../../@types/error/ApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";
import { createPortal } from "react-dom";

function CompanyUserAccessManagementModalNew({
  isOpen,
  onClose,
  users,
}: AccessRightsModalProps) {
  const [dataStatus, setDataStatus] = useState(false);

  const { userHasAccessToUpdateAccess } = useUserAccessModules();

  const [changedAccessModules, setChangedAccessModules] = useState<
    AccessManagementType[]
  >([]);
  const initialModulesRef = useRef<AccessManagementType[]>([]);
  const [spinnerAnimation, setSpinnerAnimation] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const [modules, setModules] = React.useState<AccessManagementType[]>([
    {
      add: false,
      company_user_id: 0,
      createdon: "",
      crm_module_id: 0,
      id: 0,
      module_name: "",
      is_base_module: false,
      parent_module_id: 0,
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

  const clearAndClose = () => {
    onClose();
    setExpandedBaseModules([]);
    setModules([]);
    setRowClicked(-1);
  };

  //for grouping
  const [expandedBaseModules, setExpandedBaseModules] = useState<number[]>([]);
  const toggleBaseModule = (baseId: number) => {
    setExpandedBaseModules((prev) =>
      prev.includes(baseId)
        ? prev.filter((id) => id !== baseId)
        : [...prev, baseId],
    );
  };

  const [rowClicked, setRowClicked] = useState<number>();

  const baseModuleBgColor = "bg-white";
  const baseModuleHoverColor = " hover:bg-gray-300 ";
  const baseModuleExpandedColor = " bg-gray-300 border border-gray-600 ";
  const previouslySelectedBaseModuleColor = " bg-gray-200 ";
  const childModuleBgColor = " bg-gray-200 ";
  const childModuleHoverColor = " hover:bg-gray-300 ";

  const baseModules = modules
    .filter((m) => m.is_base_module)
    .sort((a, b) => a.id - b.id);

  const getChildModules = (parentId: number) => {
    return modules.filter(
      (childModule) => childModule.parent_module_id === parentId,
    );
  };

   const isColumnSelected = (field: "add" | "view" | "update") =>
    modules.every((module) => module[field]);

  const isAllChildModuleSelected = (
    parentModuleId: number,
    field: "add" | "view" | "update",
  ) =>
    getChildModules(parentModuleId).every((childModule) => childModule[field]);

  const handleBaseModuleSelectAll = (
    parentModuleId: number,
    field: "add" | "view" | "update",
  ) => {
    const isAllChildModulesSelected = isAllChildModuleSelected(
      parentModuleId,
      field,
    );

    setModules((prevModules) => {
      const updatedModules = prevModules.map((module) =>
        module.parent_module_id === parentModuleId
          ? { ...module, [field]: !isAllChildModulesSelected }
          : module,
      );

      //collect ALL changed child modules
      const changedChildren = updatedModules.filter((updatedModule) => {
        if (updatedModule.parent_module_id !== parentModuleId) return false;

        const initialModule = initialModulesRef.current.find(
          (m) => m.id === updatedModule.id,
        );

        return (
          initialModule &&
          (initialModule.add !== updatedModule.add ||
            initialModule.view !== updatedModule.view ||
            initialModule.update !== updatedModule.update)
        );
      });

      setChangedAccessModules((prevChanges) => {
        // remove previous entries of this parent
        const filtered = prevChanges.filter(
          (m) => m.parent_module_id !== parentModuleId,
        );
        return [...filtered, ...changedChildren];
      });

      return updatedModules;
    });
  };

  //grouping ends

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
            const refreshTokenStatus = await RefreshToken({
              callFunction: fetchUserAccessModules,
            });
            if (refreshTokenStatus) {
              fetchUserAccessModules();
            }
          }
        });
    } else {
      setModules([]);
      setChangedAccessModules([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserAccessModules();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (
    moduleId: number,
    field: "add" | "view" | "update",
  ) => {
    setModules((prevModules) => {
      const updatedModules = prevModules.map((module) =>
        module.id === moduleId
          ? { ...module, [field]: !module[field] }
          : module,
      );

      const initialModule = initialModulesRef.current.find(
        (m) => m.id === moduleId,
      );
      const updatedModule = updatedModules.find((m) => m.id === moduleId);

      if (!updatedModule || !initialModule) return updatedModules;

      const hasChanged =
        initialModule.add !== updatedModule.add ||
        initialModule.view !== updatedModule.view ||
        initialModule.update !== updatedModule.update;

      setChangedAccessModules((prevChanges) => {
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
            (m) => m.id === updatedModule.id,
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

  const handleSaveAccessModule = async () => {
    if (changedAccessModules.length === 0) {
      toast.error(MESSAGE.ERROR.NO_CHANGES);
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
        toast.success(response.data.message);

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
          clearAndClose();
        }, 2000);
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: handleSaveAccessModule,
          });
          if (refreshTokenStatus) {
            handleSaveAccessModule();
          }
        } else {
          toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
        }
      });
  };

 

  const columnClasses = {
    srNo: "w-[10%] table-header-custom",
    moduleName: "w-[40%] table-header-custom",
    checkbox: "w-[16.67%] table-header-custom",
    icon: "w-[10%] table-header-custom",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 p-4 overflow-hidden bg-black bg-opacity-5">
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative p-4 w-full max-w-7xl h-[85vh] bg-white rounded-lg shadow-xl animate-fadeIn flex flex-col">
          {/* Header */}
          <FormHeader
            icon={ShieldCheck}
            preText="Update Access rights of User - "
            userName={users.fullname}
            onClose={() => {
              clearAndClose();
            }}
            description="Manage who can view, edit, or control modules by updating access rights to align with user responsibilities."
          />

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
                      <col className={columnClasses.icon} />
                    </colgroup>
                    <thead>
                      <tr className="text-left">
                        <th className="p-2">Sr. No.</th>
                        <th className="p-2">Module Name</th>
                        <th className="p-2">
                          <div className="flex flex-col items-center pr-14">
                            <span>Add</span>
                            <input
                              type="checkbox"
                              checked={isColumnSelected("add")}
                              onChange={() => handleColumnSelectAll("add")}
                              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                        <th className="p-2">
                          <div className="flex flex-col items-center pr-5">
                            <span>View</span>
                            <input
                              type="checkbox"
                              checked={isColumnSelected("view")}
                              onChange={() => handleColumnSelectAll("view")}
                              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                        <th className="p-2">
                          <div className="flex flex-col items-center pl-5">
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
                <div
                  id="company-user-access-management-modal"
                  className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full no-scrollbar"
                >
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className={columnClasses.srNo} />
                      <col className={columnClasses.moduleName} />
                      <col className={columnClasses.checkbox} />
                      <col className={columnClasses.checkbox} />
                      <col className={columnClasses.checkbox} />
                    </colgroup>
                    <tbody>
                      {baseModules.map((baseModule, baseIndex) => {
                        const isExpanded = expandedBaseModules.includes(
                          baseModule.id,
                        );
                        const childMOdulesOfBaseModule = getChildModules(
                          baseModule.crm_module_id,
                        );

                        return (
                          <React.Fragment key={baseModule.id}>
                            {/* Base Module Row */}
                            <tr
                              className={`border-t cursor-pointer ${baseModuleHoverColor}  ${isExpanded ? baseModuleExpandedColor : `${rowClicked === baseIndex ? previouslySelectedBaseModuleColor : baseModuleBgColor}`}`}
                              onClick={() => setRowClicked(baseIndex)}
                            >
                              <td className="p-2 table-data-custom font-semibold">
                                {baseIndex + 1}
                              </td>

                              <td
                                className="table-data-custom font-semibold flex items-center gap-2"
                                onClick={() => toggleBaseModule(baseModule.id)}
                              >
                                <span className="text-gray-600">
                                  {isExpanded ? (
                                    <ChevronDown />
                                  ) : (
                                    <ChevronRight />
                                  )}
                                </span>
                                {baseModule.module_name + " Access"}
                              </td>

                              <td className="table-data-custom">
                                <input
                                  type="checkbox"
                                  checked={isAllChildModuleSelected(
                                    baseModule.crm_module_id,
                                    "add",
                                  )}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleBaseModuleSelectAll(
                                      baseModule.parent_module_id,
                                      "add",
                                    );
                                  }}
                                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </td>

                              <td className="table-data-custom">
                                <input
                                  type="checkbox"
                                  checked={isAllChildModuleSelected(
                                    baseModule.crm_module_id,
                                    "view",
                                  )}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleBaseModuleSelectAll(
                                      baseModule.parent_module_id,
                                      "view",
                                    );
                                  }}
                                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </td>

                              <td className="table-data-custom">
                                <input
                                  type="checkbox"
                                  checked={isAllChildModuleSelected(
                                    baseModule.crm_module_id,
                                    "update",
                                  )}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleBaseModuleSelectAll(
                                      baseModule.parent_module_id,
                                      "update",
                                    );
                                  }}
                                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </td>
                            </tr>

                            {/* Child Modules */}
                            {isExpanded &&
                              childMOdulesOfBaseModule.map(
                                (child, childIndex) => (
                                  <tr
                                    key={child.id + "child"}
                                    className={`border-t ${childModuleBgColor} ${childModuleHoverColor} `}
                                  >
                                    <td className="p-2 pl-5 table-data-custom text-gray-500">
                                      {baseIndex + 1}.{childIndex + 1}
                                    </td>

                                    <td className="table-data-custom pl-8 text-gray-700">
                                      └ {child.module_name}
                                    </td>

                                    <td className="table-data-custom">
                                      <input
                                        type="checkbox"
                                        checked={child.add}
                                        onChange={() =>
                                          handleCheckboxChange(child.id, "add")
                                        }
                                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                      />
                                    </td>

                                    <td className="table-data-custom">
                                      <input
                                        type="checkbox"
                                        checked={child.view}
                                        onChange={() =>
                                          handleCheckboxChange(child.id, "view")
                                        }
                                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                      />
                                    </td>

                                    <td className="table-data-custom">
                                      <input
                                        type="checkbox"
                                        checked={child.update}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            child.id,
                                            "update",
                                          )
                                        }
                                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                      />
                                    </td>
                                  </tr>
                                ),
                              )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-1 border-t  bg-white">
            <div className="flex gap-1 justify-self-end min-w-36 max-w-56">
              <Button
                type="button"
                onClick={() => {
                  clearAndClose();
                }}
              >
                <div className="flex gap-0.5 items-center">
                  <X size={SIZE.SIXTEEN} />
                  Cancel
                </div>
              </Button>
              <Button
                type="submit"
                onClick={
                  userHasAccessToUpdateAccess && users.id !== loginStatus.id
                    ? (e) => {
                        e.preventDefault();
                        handleSaveAccessModule();
                      }
                    : (e) => {
                        e.preventDefault();
                        if (users.id === loginStatus.id) {
                          toast.error(
                            "For security reasons, users are unable to update their own Access Module.",
                          );
                        } else if (!userHasAccessToUpdateAccess) {
                          toast.error(
                            "You do not have permission to Update the access modules of Another user.",
                          );
                        }
                      }
                }
                disabled={
                  !userHasAccessToUpdateAccess || users.id === loginStatus.id
                }
                spinner={
                  userHasAccessToUpdateAccess && users.id !== loginStatus.id
                    ? spinnerAnimation
                    : undefined
                }
              >
                <div className="flex gap-1 items-center">
                  <Save size={SIZE.SIXTEEN} />
                  Save
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CompanyUserAccessManagementModalNew;
