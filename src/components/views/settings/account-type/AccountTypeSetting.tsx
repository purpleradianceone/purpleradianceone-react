/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import AccountType from "../../../../@types/settings/AccountType";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { ChevronDown, ChevronUp, Pen, Plus, UserRoundPlus } from "lucide-react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import CompanyAccountType from "../../../../@types/settings/CompanyAccountType";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import MESSAGE from "../../../../constants/Messages";
import CreateAccountType from "./CreateAccountType";
import Button from "../../../ui/Button";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import ToggleButton from "../../../ui/ToggleButton";

const AccountTypeSetting: React.FC = () => {
  const {
    userHasAccessToAddCompanyAccountType,
    userHasAccessToUpdateCompanyAccountType,    
  } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [accountType, setAccountType] = useState<AccountType[]>([]);
  const [companyAccountType, setCompanyAccountType] = useState<
    CompanyAccountType[]
  >([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<boolean | null>(null);

  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editingTypeName, setEditingTypeName] = useState("");
  const [loading, setIsLoading] = useState<boolean>(true);
  // --- Fetch Account Types ---
  const getAccountType = async () => {
    const PostDataToGetAccountType: AccountType = {
      id: null,
      name: null,
      isactive: null,
    };

    await axios
      .post(POST_API.GET_ACCOUNT_TYPE, PostDataToGetAccountType, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setAccountType(response.data);
        }
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getAccountType,
          });
          if (refreshTokenResponse) {
            getAccountType();
          }
        } else {
          toast.error("Something went wrong. Please refresh the page.");
        }
      });
  };

  const handleSaveEdit = async (updatedType?: {
    id?: number | null;
    company_account_type_name?: string;
    isactive?: boolean | null;
  }) => {
    const postDataToUpdateCompanyAccountType = {
      company_id: loginStatus.companyId,
      id: updatedType?.id ?? editingTypeId,
      company_account_type_name:
        updatedType?.company_account_type_name ?? editingTypeName,
      isactive: updatedType?.isactive ?? editingStatus,
      updatedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.UPDATE_COMPANY_ACCOUNT_TYPE,
        postDataToUpdateCompanyAccountType,
        { withCredentials: true }
      );

      if (response.data.status === true) {
        toast.success(response.data.message);
        getComapnyAccountType();
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
      setEditingStatus(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTypeId(null);
    setEditingTypeName("");
    setEditingStatus(null);
  };

  // --- Fetch Company Account Types ---
  const getComapnyAccountType = async () => {
    const PostDataToGetCompanyAccountType = {
      company_id: loginStatus.companyId,
      account_type_id: null,
      id: null,
      isactive: null,
      requestedby_id: loginStatus.id,
    };
    axios
      .post(
        POST_API.GET_COMPANY_ACCOUNT_TYPE,
        PostDataToGetCompanyAccountType,
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;

          const companyAccountData: CompanyAccountType[] = responseData.map(
            (item: any) => ({
              id: item.id,
              companyId: item.company_id,
              accountTypeId: item.account_type_id,
              companyAccountTypeName: item.company_account_type_name,
              accountTypeName: item.account_type_name,
              isActive: item.isactive,
              createdBy: item.createdby,
              createdOn: item.createdon,
              updatedBy: item.updatedby,
              updatedOn: item.updatedon,
            })
          );
          setCompanyAccountType(companyAccountData);
        }
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getComapnyAccountType,
          });
          if (refreshTokenResponse) {
            getComapnyAccountType();
          }
        } else {
          toast.error(error.response.status + error.response.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //Component render first time call
  useEffect(() => {
    

      getAccountType();
      getComapnyAccountType();
  
  }, []);

  //  track which parent types are expanded
  const [expandedParentTypes, setExpandedParentTypes] = useState<string[]>([]);

  const toggleParentExpand = (parentType: string) => {
    setExpandedParentTypes(
      (prev) =>
        prev.includes(parentType)
          ? prev.filter((p) => p !== parentType) // collapse if open
          : [...prev, parentType] // expand if closed
    );
  };

  // --- Group companyAccountType by parent ---
  const groupedData = companyAccountType.reduce((acc, item) => {
    if (!acc[item.accountTypeName]) {
      acc[item.accountTypeName] = [];
    }
    acc[item.accountTypeName].push(item);
    return acc;
  }, {} as Record<string, CompanyAccountType[]>);

  if (loading) {
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
          <h1 className="section-header-custom my-3">
            Company Account Type 
          </h1>
          {!showAddForm && (
            <div>
              <Button
              disabled={!userHasAccessToAddCompanyAccountType}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  if (userHasAccessToAddCompanyAccountType) {
                    setShowAddForm(true);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS
                        .DENIED_ADD_ACCESS
                    );
                  }
                }}
                // className="flex items-center m-3 bg-blue-600 px-2 rounded-md action-btn-custom hover:bg-blue-700 transition-colors"
              >
                <div className="flex items-center ">
                  <Plus size={16} className="action-btn-custom" />
                  Create
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Add New Account Type Section */}
        <div className="hidden bg-gray-50 rounded-lg  p-2 mb-8">
          <div
            className="flex items-center hover:scale-[1.01] 
            transition-all duration-200 ease-in-out bg-white text-gray-800 hover:text-blue-700 justify-between mb-4 border py-3 px-1  rounded-md"
          >
            <h2 className="text-base font-medium   px-2  flex items-center gap-2">
              <UserRoundPlus size={18} /> Company account type
            </h2>
          </div>
        </div>
        {/* Add Form */}
        {showAddForm && (
          <CreateAccountType
            onClose={() => {
              setShowAddForm(!showAddForm);
            }}
            accountType={accountType}
            getComapnyAccountType={getComapnyAccountType}
          />
        )}

        {/* Available Account Types */}

        <div className="space-y-6 border p-2  rounded-md  bg-white">
          {/* <h4 className="font-medium text-md text-gray-900  w-fit p-1  rounded-lg    flex items-center gap-2">
            
          </h4> */}
          {companyAccountType.length === 0 ? (
            <p className="flex items-center justify-center caption-custom h-56 text-center ">
              No company account types available. Add one to get started.
            </p>
          ) : (
            Object.entries(groupedData).map(([parentType, children]) => {
              const isOpen = expandedParentTypes.includes(parentType); // track open/closed
              return (
                <div
                  key={parentType}
                  className="bg-white border  border-gray-200 rounded-2xl shadow-md overflow-hidden"
                >
                  {/* Parent Header */}
                  <div className="grid ">
                    <div
                      className="flex items-center justify-between p-1  bg-gradient-to-r from-blue-100 to-blue-200  "
                      onClick={() => toggleParentExpand(parentType)}
                    >
                      <h3 className="table-header-custom pl-3">{parentType}</h3>
                      <button className=" hidden p-1 rounded-full hover:bg-blue-200 transition-colors">
                        {isOpen ? (
                          <ChevronUp size={20} className="text-slate-700" />
                        ) : (
                          <ChevronDown size={20} className="text-slate-700" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Children List */}
                  {/* {isOpen && ( */}
                  <div className="p-4 grid md:grid-cols-4 sm:grid-cols-2 gap-4 bg-white">
                    {children.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 grid grid-col rounded-xl border border-gray-00 bg-white shadow-sm hover:bg-emerald-0 hover:shadow-md "
                      >
                        {/* Editable Name */}
                        {editingTypeId === item.id ? (
                          <>
                            <input
                              id="name"
                              type="text"
                              value={editingTypeName}
                              onChange={(e) =>
                                setEditingTypeName(e.target.value)
                              }
                              onBlur={() => {
                                if (
                                  editingTypeName.trim() !==
                                  item.companyAccountTypeName.trim()
                                ) {
                                  setEditingStatus(item.isActive); // keep current status
                                  handleSaveEdit();
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
                              className="w-full px-2  border border-blue-400 bg-white rounded-md focus:ring-1 focus:ring-blue-500"
                            />
                          </>
                        ) : (
                          <h4
                            title={item.companyAccountTypeName}
                            className="hover:bg-gray-00 flex items-center gap-1 table-data-custom md-2 cursor-pointer "
                            onClick={() => {
                              if (userHasAccessToUpdateCompanyAccountType) {
                                setEditingTypeId(item.id);
                                setEditingTypeName(item.companyAccountTypeName);
                              } else {
                                toast.error(
                                  MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS
                                    .DENIED_UPDATE_ACCESS
                                );
                              }
                            }}
                          >
                            <div className="grid items-center   w-full">
                              {/* <span className="text-gray-600 text-xs">Name : </span> */}
                              <div className="flex items-center   w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-0">
                                {item.companyAccountTypeName}
                                <Pen size={10} className="text-blue-500 " />
                              </div>
                            </div>
                          </h4>
                        )}

                        {/* Status Toggle */}
                        <div className="flex  items-center justify-end mt-2">
                          {/* Toggle for Active/Inactive */}
                          {/* <label className="inline-flex items-center cursor-pointer relative self-end">
                             <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={item.isActive}
                                onChange={async () => {
                                  handleSaveEdit({
                                    ...item,
                                    company_account_type_name:
                                      item.companyAccountTypeName,
                                    isactive: !item.isActive,
                                  });
                                }}
                              />
                            <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />{" "}
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />{" "}
                          </label> */}
                          <ToggleButton
                            checked={item.isActive}
                            onToggle={async () => {
                              handleSaveEdit({
                                ...item,
                                company_account_type_name:
                                  item.companyAccountTypeName,
                                isactive: !item.isActive,
                              });
                            }}
                            name="isActive"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* )} */}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSetting;
