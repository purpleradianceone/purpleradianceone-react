/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { STATUS_CODE, VALIDATIONS } from "../../../../constants/AppConstants";
import AccountType from "../../../../@types/settings/AccountType";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { Edit3, Plus, Save, X } from "lucide-react";
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

  //note : to get the account type

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  useEffect(() => {
    getAccountType();
  }, []);

  const handleEditType = (type: CompanyAccountType) => {
    setEditingTypeId(type.id);
    setEditingTypeName(type.companyAccountTypeName);
  };

  const handleSaveEdit = async () => {
    const postDataToUpdateCompanyAccountType = {
      company_id: loginStatus.companyId,
      id: editingTypeId,
      account_type_name: editingTypeName,
      isactive: editingStatus,
      updatedby_id: loginStatus.id,
    };

    axios
      .post(
        POST_API.UPDATE_COMPANY_ACCOUNT_TYPE,
        postDataToUpdateCompanyAccountType,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.status === true) {
          toast.success(response.data.message);
          getComapnyAccountType();
        }
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleSaveEdit,
          });
          if (refreshTokenResponse) {
            handleSaveEdit();
          }
        }
      })
      .finally(() => {
        setEditingTypeId(null);
        setEditingTypeName("");
        setEditingStatus(null);
      });
    console.log(postDataToUpdateCompanyAccountType);
  };

  const handleCancelEdit = () => {
    setEditingTypeId(null);
    setEditingTypeName("");
    setEditingStatus(null);
  };

  const handleAddAccountType = async () => {
    if (!userHasAccessToAddCompanyAccountType) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS.DENIED_ADD_ACCESS);
      addFunctionStatesCleanup();
      return;
    }
    // if (!newTypeName.trim() || newParentType === 0) {
    //   toast.error("post data is wrong");
    //   return;
    // }
    const postDataToAddNewAccountType = {
      company_id: loginStatus.companyId,
      account_type_id: newParentType,
      account_type_name: newTypeName,
      createdby_id: loginStatus.id,
    };

    axios
      .post(POST_API.CREATE_COMPANY_ACCOUNT_TYPE, postDataToAddNewAccountType, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        getComapnyAccountType();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  useEffect(() => {
    getComapnyAccountType();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 rounded-md  ">
      <div className="max-w-6xl mx-auto p-1 ">
        <h1 className="text-2xl font-bold text-gray-700 my-3">
          Company Account Type Management
        </h1>

        {/* Add New Account Type Section */}
        <div className="bg-gray-50 rounded-lg  p-2 mb-8">
          <div
            className="flex items-center hover:scale-[1.01] 
            transition-all duration-200 ease-in-out bg-white justify-between mb-4 border py-3 px-1  rounded-md"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Add company account
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

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Create New Account Type
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type Name
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
                    Account Type :
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
                          className="mr-3 text-blue-600 focus:ring-blue-500"
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
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save size={16} />
                    Save Account Type
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTypeName("");
                      setNewParentType(0);
                    }}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Available Account Types */}
          <div className="space-y-3 border p-3 bg-white rounded-md">
            <h3 className="text-lg font-medium text-gray-700">
              Available Company Accounts :
            </h3>
            {companyAccountType.length === 0 ? (
              <p className="text-gray-500 italic">
                No account types available. Add one to get started.
              </p>
            ) : (
              <div className="grid md:grid-cols-2  sm:grid-cols-1 gap-2">
                {companyAccountType.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between  rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {editingTypeId === type.id ? (
                      <div className="flex-1 space-y-4 p-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Type Name
                          </label>
                          <input
                            type="text"
                            minLength={VALIDATIONS.MIN_NAME_LENGTH}
                            maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                            value={editingTypeName}
                            onChange={(e) => setEditingTypeName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSaveEdit()
                            }
                            autoFocus
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status :
                          </label>

                          <div className="grid grid-cols-2 gap-2">
                            {[
                              {
                                id: "active",
                                label: "Active",
                                value: true,
                              },
                              {
                                id: "inactive",
                                label: "Inactive",
                                value: false,
                              },
                            ].map((option) => (
                              <label
                                key={option.id}
                                htmlFor={option.id}
                                className="flex items-center gap-2 cursor-pointer text-sm font-medium"
                              >
                                <input
                                  type="radio"
                                  name="accountStatus"
                                  id={option.id}
                                  value={String(option.value)}
                                  checked={
                                    (editingStatus ?? type.isActive) ===
                                    option.value
                                  }
                                  onChange={() =>
                                    setEditingStatus(option.value)
                                  } // update state
                                  className="cursor-pointer"
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-1 border text-blue-600 hover:text-white  hover:border-blue-700 bg-blue-50 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors"
                          >
                            <Save size={16} />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 border  text-gray-500 hover:text-gray-800 hover:bg-white bg-gray-50  px-3 py-1 rounded-md transition-colors"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-full p-2  
  rounded-xl shadow-md hover:shadow-sm hover:scale-[1.01] 
  transition-all duration-200 ease-in-out"
                      >
                        {/* Header row (companyAccountTypeName only) */}
                        <div>
                          <span
                            title={type.companyAccountTypeName}
                            className="font-semibold text-gray-900 text-lg  transition-colors"
                          >
                            {type.companyAccountTypeName.length > 60
                              ? type.companyAccountTypeName.substring(0, 59) +
                                "..."
                              : type.companyAccountTypeName}
                          </span>
                        </div>

                        {/* Row 2: Status + Account Type + Edit Button */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
                          <div className="flex items-center gap-3">
                            {/* Account Type */}
                            <span
                              className={`px-3 py-1 text-sm rounded-full font-medium shadow-sm transition-colors duration-200 ${getParentTypeColor(
                                type.accountTypeName
                              )}`}
                            >
                              {type.accountTypeName}
                            </span>
                            {/* Status badge */}
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-semibold border transition-all duration-200 ${
                                type.isActive
                                  ? "bg-green-100 text-green-700 border-green-400 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 border-red-400 hover:bg-red-200"
                              }`}
                            >
                              {type.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>

                          {/* Edit button */}
                          <button
                            onClick={() => {
                              if(userHasAccessToUpdateCompanyAccountType){
                                handleEditType(type)
                              }else{
                                toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_TYPE_ACCESS.DENIED_UPDATE_ACCESS)
                              }
                            }
                            }
                            className="flex items-center gap-1 text-blue-600 hover:text-white 
        bg-blue-50 hover:bg-blue-600 px-2 py-1 rounded-lg 
        transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Edit3 size={14} />
                            <span className="hidden md:inline text-sm">
                              Edit
                            </span>
                          </button>
                        </div>

                        {/* Meta info */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                          <p>
                            <span className="font-medium">Created:</span>{" "}
                            {type.createdOn}
                          </p>
                          <p>
                            <span className="font-medium">Created By:</span>{" "}
                            {type.createdBy}
                          </p>
                          <p>
                            <span className="font-medium">Updated:</span>{" "}
                            {type.updatedOn}
                          </p>
                          <p>
                            <span className="font-medium">Updated By:</span>{" "}
                            {type.updatedBy}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSetting;
