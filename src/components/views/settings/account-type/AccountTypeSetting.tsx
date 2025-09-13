/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { STATUS_CODE, VALIDATIONS } from "../../../../constants/AppConstants";
import AccountType from "../../../../@types/settings/AccountType";
import RefreshToken from "../../../../config/validations/RefreshToken";
import {
  ChevronDown,
  ChevronUp,
  Pen,
  Plus,
  Save,
  User,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import CompanyAccountType from "../../../../@types/settings/CompanyAccountType";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import MESSAGE from "../../../../constants/Messages";

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

  const [newTypeName, setNewTypeName] = useState("");
  const [newParentType, setNewParentType] = useState<number>(0);
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editingTypeName, setEditingTypeName] = useState("");

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
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: () => handleSaveEdit(updatedType),
        });
        if (refreshTokenResponse) {
          handleSaveEdit(updatedType);
        }
      }else{
        toast.error(error.response.data)
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

  // --- Add Functions ---
  const handleAddAccountType = async () => {
    if (!userHasAccessToAddCompanyAccountType) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS.DENIED_ADD_ACCESS);
      addFunctionStatesCleanup();
      return;
    }

    const postDataToAddNewCompanyAccountType = {
      company_id: loginStatus.companyId,
      account_type_id: newParentType,
      company_account_type_name: newTypeName,
      createdby_id: loginStatus.id,
    };

    axios
      .post(
        POST_API.CREATE_COMPANY_ACCOUNT_TYPE,
        postDataToAddNewCompanyAccountType,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        getComapnyAccountType();
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleAddAccountType,
          });
          if (refreshTokenResponse) {
            handleAddAccountType();
          }
        } else {
          toast.error(error.response.status + error.response.data);
        }
      })
      .finally(() => {
        addFunctionStatesCleanup();
      });
  };

  function addFunctionStatesCleanup() {
    setNewTypeName("");
    setNewParentType(0);
    setShowAddForm(false);
  }

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
      });
  };

  //Component render first time call 
  useEffect(() => {
    getAccountType();
    getComapnyAccountType();
  }, []);

  // --- Helpers ---
  const getParentTypeColor = (parentType: string) => {
    switch (parentType) {
      case "Reseller":
        return "bg-green-100 text-green-800";
      case "Customer":
        return "bg-red-100 text-red-800";
      case "Equity":
        return "bg-blue-100 text-blue-800";
      case "Partner":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // 👇 track which parent types are expanded
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

  return (
    <div className="min-h-screen bg-gray-50 rounded-md">
      <div className="max-w-6xl mx-auto p-1">
        <h1 className="text-2xl font-bold text-gray-700 my-3">
          Company Account Type Management
        </h1>

        {/* Add New Account Type Section */}
        <div className="bg-gray-50 rounded-lg  p-2 mb-8">
          <div
            className="flex items-center hover:scale-[1.01] 
            transition-all duration-200 ease-in-out bg-white justify-between mb-4 border py-3 px-1  rounded-md"
          >
            <h2 className="text-base font-medium text-gray-500 flex items-center gap-2">
              <UserRoundPlus size={18} /> Add company account
            </h2>
            {!showAddForm && (
              <button
                onClick={() => {
                  if (userHasAccessToAddCompanyAccountType) {
                    setShowAddForm(true);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS
                        .DENIED_ADD_ACCESS
                    );
                  }
                }}
                className="flex items-center gap-1 bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Add company account
              </button>
            )}
          </div>
        </div>
        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <h3 className="text-base flex gap-2 items-center border w-fit p-2 rounded-md shadow-md font-medium text-blue-800 mb-4">
              <UserRoundPlus size={18} /> Create New Comapny Account Type
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type Name : <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={newTypeName}
                  maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                  minLength={VALIDATIONS.MIN_NAME_LENGTH}
                  required
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Enter account type name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Account Type : <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {accountType.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center p-3 border border-gray-200 bg-white rounded-lg cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-lg transition-colors"
                    >
                      <input
                        type="radio"
                        name="parentType"
                        value={type.id!}
                        checked={newParentType === type.id}
                        onChange={(e) =>
                          setNewParentType(parseInt(e.target.value))
                        }
                        className={`mr-3  focus:ring-blue-5 `}
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          {type.name}
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${getParentTypeColor(
                            type.name!
                          )}`}
                        >
                          {type.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddAccountType}
                  disabled={!newTypeName.trim() || newParentType === 0}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-200  disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={16} />
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTypeName("");
                    setNewParentType(0);
                  }}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Available Account Types */}
        <div className="space-y-6 border p-2  rounded-md hover:scale-[1.01] transition-all duration-200 ease-in-out bg-white">
          <h4 className="font-medium text-md text-gray-900 border w-fit p-2  rounded-lg shadow-md   flex items-center gap-2">
            <User size={18} /> Company account types
          </h4>
          {companyAccountType.length === 0 ? (
            <p className="text-gray-500 italic">
              No account types available. Add one to get started.
            </p>
          ) : (
            Object.entries(groupedData).map(([parentType, children]) => {
              const isOpen = expandedParentTypes.includes(parentType); // track open/closed
              return (
                <div
                  key={parentType}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
                >
                  {/* Parent Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors"
                    onClick={() => toggleParentExpand(parentType)}
                  >
                    <h3 className="text-lg font-semibold text-slate-800">
                      {parentType}
                    </h3>
                    <button className="p-1 rounded-full hover:bg-blue-200 transition-colors">
                      {isOpen ? (
                        <ChevronUp size={20} className="text-slate-700" />
                      ) : (
                        <ChevronDown size={20} className="text-slate-700" />
                      )}
                    </button>
                  </div>

                  {/* Children List */}
                  {isOpen && (
                    <div className="p-4 grid md:grid-cols-4 sm:grid-cols-1 gap-4 bg-white">
                      {children.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 rounded-xl border border-gray-100 bg-white shadow-sm hover:bg-emerald-50 hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
                        >
                          {/* Editable Name */}
                          {editingTypeId === item.id ? (
                            <>
                            <label htmlFor="name" className="text-xs">Name: <span className="text-red-500">*</span> (mandatory field) </label>
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
                              className="w-full px-3  border border-blue-400 rounded-md focus:ring-1 focus:ring-blue-500"
                            />
                            </>
                          ) : (
                            <h4
                              title={item.companyAccountTypeName}
                              className="font-semibold hover:bg-gray-00 flex items-center gap-1 text-gray-900 text-sm   truncate md-2 cursor-pointer "
                              onClick={() => {
                                if (userHasAccessToUpdateCompanyAccountType) {
                                  setEditingTypeId(item.id);
                                  setEditingTypeName(
                                    item.companyAccountTypeName
                                  );
                                } else {
                                  toast.error(
                                    MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS
                                      .DENIED_UPDATE_ACCESS
                                  );
                                }
                              }}
                            >
                              <div className="grid items-center ">

                              <span className="text-gray-600 text-xs">Name : </span>
                              <div className="flex items-center gap-1 hover:bg-gray-100">

                              {item.companyAccountTypeName}
                              <Pen size={12} className="text-gray-500 " />
                              </div>
                              </div>
                            </h4>
                          )}

                          {/* Status Toggle */}
                          <div className="flex items-center justify-end mt-2">
                            {/* Toggle for Active/Inactive */}
                            <label className="flex  gap-3 items-center justify-end cursor-pointer">
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
                              <span className="font-normal text-xs text-gray-600">Status :  </span>
                              <div
                                className={`w-11 h-6 rounded-full relative transition-colors
      ${item.isActive ? "bg-green-500" : "bg-red-500"} 
      peer-focus:outline-none`}
                              >
                                <span
                                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform
        ${item.isActive ? "translate-x-5" : "translate-x-0"}`}
                                ></span>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
