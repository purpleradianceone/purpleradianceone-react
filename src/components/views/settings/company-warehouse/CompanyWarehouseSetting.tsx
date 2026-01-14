/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
// import { ChevronDown, ChevronUp, Pen, Plus, UserRoundPlus } from "lucide-react";
import { Plus, Pen } from "lucide-react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import MESSAGE from "../../../../constants/Messages";
import Button from "../../../ui/Button";
import CreateCompanyWarehouse from "./CreateCompanyWarehouse";
import ToggleButton from "../../../ui/ToggleButton";
import { useWarehouseType } from "../../../../config/hooks/useWarehouseType";
import CompanyWarehouseType from "../../../../@types/warehouse/CompanyWarehouse";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import validateName from "../../../../config/validations/ValidateName";
import validateDescription from "../../../../config/validations/ValidateDescription";
import validateLocation from "../../../../config/validations/ValidateLocation";

const CompanyWarehouseSetting: React.FC = () => {
  const { warehouseTypeData } = useWarehouseType();

  const {
    userHasAccessToUpdateSettingCompanyWarehouse,
    userHasAccessToAddSettingCompanyWarehouse
  } = useUserAccessModules();

  const { loginStatus } = useLoggedInUserContext();
  const [showAddForm, setShowAddForm] = useState(false);

  const [companyWarehouse, setCompanyWarehouse] = useState<
    CompanyWarehouseType[]
  >([]);

  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editingTypeName, setEditingTypeName] = useState("");
  const [editingTypeDescription, setEditingTypeDescription] = useState("");
  const [editingTypeLocation, setEditingTypeLocation] = useState("");
  const [editingStatus, setEditingStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [editingField, setEditingField] = useState<
    "name" | "description" | "location" | null
  >(null);

  const getCompanyWarehouse = async () => {
    console.log(isLoading);

    const postDataToCompanyWarehouse = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: null,
      requestedby_id: loginStatus.id,
    };

    axios
      .post(POST_API.GET_COMPANY_WAREHOUSE, postDataToCompanyWarehouse, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;

          const companyWarehouseData: CompanyWarehouseType[] = responseData.map(
            (item: any) => ({
              id: item.id,
              companyId: item.company_id,
              warehouseTypeId: item.warehouse_type_id,
              warehouseTypeName: item.warehouse_type_name,
              name: item.name,
              description: item.description,
              location: item.location,
              isactive: item.isactive,
            })
          );

          setCompanyWarehouse(companyWarehouseData);
        }
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getCompanyWarehouse,
          });
          if (refreshTokenResponse) {
            getCompanyWarehouse();
          }
        } else {
          toast.error(error.response.status + error.response.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSaveEdit = async (updatedType?: {
    id?: number | null;
    name?: string;
    description?: string;
    location?: string | null;
    isactive?: boolean | null;
  }) => {
  

    if(!userHasAccessToUpdateSettingCompanyWarehouse){
      toast.error(MESSAGE.MODULE_ACCESS.SETTING.COMPANY_WAREHOUSE_SETTING.DENIED_UPDATE_ACCESS)
      return;
    }
    if (!validateName(editingTypeName)) {
      toast.error(
        "Invalid warehouse name. Only letters, numbers, spaces, '.', '&', and '-' are allowed."
      );
      return;
    }

    if (!validateDescription(editingTypeDescription)) {
      toast.error(
        "Invalid description. Only letters, numbers, spaces, and limited punctuation are allowed."
      );
      return;
    }

    if (!validateLocation(editingTypeLocation)) {
      toast.error(
        "Invalid location. Only letters, numbers, spaces, and common address punctuation (,.'#-/()&@°:;) are allowed."
      );
      return;
    }

      const postDataToUpdateCompanyWarehouse = {
      company_id: loginStatus.companyId,
      id: updatedType?.id ?? editingTypeId,
      name: updatedType?.name ?? editingTypeName,
      description: updatedType?.description ?? editingTypeDescription,
      location: updatedType?.location ?? editingTypeLocation,
      isactive: updatedType?.isactive ?? editingStatus,
      updatedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.UPDATE_COMPANY_WAREHOUSE,
        postDataToUpdateCompanyWarehouse,
        { withCredentials: true }
      );

      if (response.data.status === true) {
        toast.success(response.data.message);
        getCompanyWarehouse();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: () => handleSaveEdit(updatedType),
        });
        if (refreshTokenResponse) {
          handleSaveEdit(updatedType);
        }
      } else {
        toast.error(error.response.data);
      }
    } finally {
      setEditingTypeId(null);
      setEditingTypeName("");
      setEditingTypeDescription("");
      setEditingTypeLocation("");
      setEditingStatus(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTypeId(null);
    setEditingTypeName("");
    setEditingTypeDescription("");
    setEditingStatus(null);
    console.log(editingStatus);
  };

  useEffect(() => {
    getCompanyWarehouse();
  }, []);

  if (isLoading) {
    return (
      <div className="h-56 flex items-center justify-center">
        <div className="flex items-center justify-between gap-3">
          <span>Loading...</span> <LoadingSpinner />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 rounded-md">
      <div className="max-w-6xl mx-auto p-1">
        <div className="flex justify-between">
          <h1 className="table-header-custom my-3">Company Warehouse</h1>
          {!showAddForm && (
            <div>
              <Button
                type="submit"
                disabled={!userHasAccessToAddSettingCompanyWarehouse}
                onClick={(e) => {
                  e.preventDefault();
                  // remove above line after code is done
                  if (userHasAccessToAddSettingCompanyWarehouse) {
                    setShowAddForm(true);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.SETTING.COMPANY_WAREHOUSE_SETTING.DENIED_ADD_ACCESS
                    );
                  }
                }}
              >
                <div className="flex items-center ">
                  <Plus size={16} className="action-btn-custom" />
                  Create
                </div>
              </Button>
            </div>
          )}
        </div>

        {showAddForm && (
          <CreateCompanyWarehouse
            onClose={() => {
              setShowAddForm(!showAddForm);
            }}
            warehouseTypeData={warehouseTypeData}
            getCompanyWarehouse={() => {
              getCompanyWarehouse();
            }}
          ></CreateCompanyWarehouse>
        )}

        <div className="p-4 grid md:grid-cols-4 sm:grid-cols-2 gap-4 bg-white">
          {companyWarehouse.length === 0 ? (
            <p className="flex items-center justify-center caption-custom h-56 text-center ">
              No Company Warehouse is Available.
            </p>
          ) : (
            companyWarehouse.map((item) => (
              <div
                key={item.id}
                className="p-2 grid grid-col rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-emerald-50 hover:shadow-md hover:scale-[1.01] transition-all duration-300"
              >
                <div className="mb-1">
                  <label className="text-xs text-gray-500 font-medium pl-2">
                    Name:
                  </label>
                  {editingTypeId === item.id && editingField === "name" ? (
                    <>
                      <input
                        id="name"
                        type="text"
                        value={editingTypeName}
                        onChange={(e) => setEditingTypeName(e.target.value)}
                        onBlur={() => {
                          if (editingTypeName.trim() !== item.name.trim()) {
                            setEditingStatus(item.isactive); // keep current status
                            handleSaveEdit({
                              ...item,
                              id: item.id,
                              name: editingTypeName,
                              description: item.description,

                              isactive: item.isactive,
                            });
                          } else {
                            handleCancelEdit();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        autoFocus
                        className="w-full px-2  border border-blue-400 rounded-md focus:ring-1 focus:ring-blue-500"
                      />
                    </>
                  ) : (
                    <h4
                      title={item.name}
                      className="hover:bg-gray-00 flex items-center gap-1 table-data-custom md-2 cursor-pointer "
                      onClick={() => {
                        if (userHasAccessToUpdateSettingCompanyWarehouse) {
                          setEditingTypeId(item.id);
                          setEditingTypeName(item.name);
                          setEditingField("name");
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.SETTING.COMPANY_WAREHOUSE_SETTING.DENIED_UPDATE_ACCESS
                          );
                        }
                      }}
                    >
                      <div className="grid items-center pl-2  w-full">
                        {/* <span className="text-gray-600 text-xs">Name : </span> */}
                        {/* <div className="flex items-center justify-between  w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-50"> */}
                        <div
                          className={`flex items-center ${
                            item.name ? "justify-between" : "justify-end"
                          }  w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-50`}
                        >
                          {item.name}
                          <Pen size={10} className="text-blue-500 " />
                        </div>
                      </div>
                    </h4>
                  )}
                </div>

                <div className="mb-1">
                  <label className="text-xs text-gray-500 font-medium pl-2">
                    Description:
                  </label>
                  {editingTypeId === item.id &&
                  editingField === "description" ? (
                    <>
                      <input
                        id="description"
                        type="text"
                        value={editingTypeDescription}
                        onChange={(e) =>
                          setEditingTypeDescription(e.target.value)
                        }
                        onBlur={() => {
                          if (
                            editingTypeDescription.trim() !==
                            item.description?.trim()
                          ) {
                            setEditingStatus(item.isactive); // keep current status
                            handleSaveEdit({
                              ...item,
                              id: item.id,
                              name: item.name,
                              description: editingTypeDescription,
                              isactive: item.isactive,
                            });
                          } else {
                            handleCancelEdit();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        autoFocus
                        className="w-full px-2  border border-blue-400 rounded-md focus:ring-1 focus:ring-blue-500"
                      />
                    </>
                  ) : (
                    <h4
                      title={item.description}
                      className="hover:bg-gray-00 flex items-center gap-1 table-data-custom md-2 cursor-pointer "
                      onClick={() => {
                        if (userHasAccessToUpdateSettingCompanyWarehouse) {
                          setEditingTypeId(item.id);
                          setEditingTypeDescription(item.description ?? "");
                          setEditingField("description");
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.SETTING.COMPANY_WAREHOUSE_SETTING.DENIED_UPDATE_ACCESS
                          );
                        }
                      }}
                    >
                      <div className="grid items-center pl-2  w-full">
                        {/* <span className="text-gray-600 text-xs">Name : </span> */}
                        {/* <div className="flex items-center justify-between  w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-50"> */}
                        <div
                          className={`flex items-center ${
                            item.description ? "justify-between" : "justify-end"
                          }  w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-50`}
                        >
                          {item.description}
                          <Pen size={10} className="text-blue-500 " />
                        </div>
                      </div>
                    </h4>
                  )}
                </div>

                <div className="mb-2">
                  <label className="text-xs text-gray-500 font-medium pl-2">
                    Location:
                  </label>

                  {editingTypeId === item.id && editingField === "location" ? (
                    <>
                      <input
                        id="location"
                        type="text"
                        value={editingTypeLocation}
                        onChange={(e) => setEditingTypeLocation(e.target.value)}
                        onBlur={() => {
                          if (
                            editingTypeLocation.trim() !== item.location?.trim()
                          ) {
                            setEditingStatus(item.isactive); // keep current status
                            handleSaveEdit({
                              ...item,
                              id: item.id,
                              name: item.name,
                              description: editingTypeDescription,
                              location: editingTypeLocation,
                              isactive: item.isactive,
                            });
                          } else {
                            handleCancelEdit();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        autoFocus
                        className="w-full px-2  border border-blue-400 rounded-md focus:ring-1 focus:ring-blue-500"
                      />
                    </>
                  ) : (
                    <h4
                      title={item.location}
                      className="hover:bg-gray-00 flex items-center gap-1 table-data-custom md-2 cursor-pointer "
                      onClick={() => {
                        if (userHasAccessToUpdateSettingCompanyWarehouse) {
                          setEditingTypeId(item.id);
                          setEditingTypeDescription(item.description ?? "");
                          setEditingTypeLocation(item.location ?? "");
                          setEditingField("location");
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.SETTING.COMPANY_WAREHOUSE_SETTING.DENIED_UPDATE_ACCESS
                          );
                        }
                      }}
                    >
                      <div className="grid items-center pl-2  w-full">
                        {/* <span className="text-gray-600 text-xs">Name : </span> */}
                        {/* <div className="flex items-center justify-between  w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-50"> */}
                        <div
                          className={`flex items-center ${
                            item.location ? "justify-between" : "justify-end"
                          }  w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-50`}
                        >
                          {item.location}
                          <Pen size={10} className="text-blue-500 " />
                        </div>
                      </div>
                    </h4>
                  )}
                </div>

                <div className="flex  items-center justify-end mt-2">
                  <ToggleButton
                    checked={item.isactive}
                    onToggle={async () => {
                      handleSaveEdit({
                        ...item,
                        name: item.name,
                        description: item.description,
                        location: item.location,
                        isactive: !item.isactive,
                      });
                    }}
                    name="isActive"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyWarehouseSetting;
