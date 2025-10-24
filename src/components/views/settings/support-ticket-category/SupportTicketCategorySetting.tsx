/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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
import SupportTicketCategoryType from "../../../../@types/support-ticket-category/SupportTicketCategoryType";
import Button from "../../../ui/Button";
import CreateSupportTicketCategory from "./CreateSupportTicketCategory";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import ToggleButton from "../../../ui/ToggleButton";

const SupportTicketCategorySetting: React.FC = () => {
  const {
    userHasAccessToAddSettingGeneral,
    userHasAccessToUpdateSettingGeneral,
  } = useUserAccessModules();

  const { loginStatus } = useLoggedInUserContext();
  const [showAddForm, setShowAddForm] = useState(false);

  const [supportTicketCategory, setSupportTicketCategory] = useState<
    SupportTicketCategoryType[]
  >([]);

  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editingTypeName, setEditingTypeName] = useState("");
  const [editingTypeDescription, setEditingTypeDescription] = useState("");
  const [editingStatus, setEditingStatus] = useState<boolean | null>(null);

  const [editingField, setEditingField] = useState<
    "name" | "description" | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSupportTicketCategory = async () => {
    const postDataToGetSupportTicketCategory = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: null,
      requestedby: loginStatus.id,
    };

    axios
      .post(
        POST_API.GET_SUPPORT_TICKET_CATEGORY,
        postDataToGetSupportTicketCategory,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;

          const supportTicketCategoryData: SupportTicketCategoryType[] =
            responseData.map((item: any) => ({
              id: item.id,
              companyId: item.company_id,
              name: item.name,
              description: item.description,
              isActive: item.isactive,
            }));

          setSupportTicketCategory(supportTicketCategoryData);
        }
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getSupportTicketCategory,
          });
          if (refreshTokenResponse) {
            getSupportTicketCategory();
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
    isactive?: boolean | null;
  }) => {
    const postDataToUpdateSupportTicketCategory = {
      company_id: loginStatus.companyId,
      id: updatedType?.id ?? editingTypeId,
      name: updatedType?.name ?? editingTypeName,
      description: updatedType?.description ?? editingTypeDescription,
      isactive: updatedType?.isactive ?? editingStatus,
      updatedby_id: loginStatus.id,
    };

    
    try {
      const response = await axios.post(
        POST_API.UPDATE_SUPPORT_TICKET_CATEGORY,
        postDataToUpdateSupportTicketCategory,
        { withCredentials: true }
      );

      if (response.data.status === true) {
        toast.success(response.data.message);
        getSupportTicketCategory();
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
      setEditingStatus(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTypeId(null);
    setEditingTypeName("");
    setEditingTypeDescription("");
    setEditingStatus(null);
  };

  useEffect(() => {
    getSupportTicketCategory();
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
          <h1 className="table-header-custom my-3">Support Ticket Category</h1>
          {!showAddForm && (
            <div>
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  if (userHasAccessToAddSettingGeneral) {
                    setShowAddForm(true);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.SUPPORT_TICKET_CATEGORY
                        .DENIED_ADD_ACCESS
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
          <CreateSupportTicketCategory
            onClose={() => {
              setShowAddForm(!showAddForm);
              
            }}
            getSupportTicketCategory ={() => {getSupportTicketCategory();}}
          ></CreateSupportTicketCategory>
        )}

        <div className="space-y-6 border p-2  rounded-md hover:scale-[1.01] transition-all duration-200 ease-in-out bg-white">
          {supportTicketCategory.length === 0 ? (
            <p className="flex items-center justify-center caption-custom h-56 text-center ">
              No Support Ticket Category is Available.
            </p>
          ) : (
            supportTicketCategory.map((item) => (
              <div
                key={item.id}
                className="p-2 grid grid-col rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-emerald-50 hover:shadow-md hover:scale-[1.01] transition-all duration-300"
              >
                {editingTypeId === item.id && editingField === "name" ? (
                  <>
                    <input
                      id="name"
                      type="text"
                      value={editingTypeName}
                      onChange={(e) => setEditingTypeName(e.target.value)}
                      onBlur={() => {
                        if (editingTypeName.trim() !== item.name.trim()) {
                          setEditingStatus(item.isActive); // keep current status
                          handleSaveEdit({
                            ...item,
                            id: item.id,
                            name: editingTypeName,
                            description: item.description,
                            isactive: item.isActive,
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
                      if (userHasAccessToUpdateSettingGeneral) {
                        setEditingTypeId(item.id);
                        setEditingTypeName(item.name);
                        setEditingField("name");
                      } else {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.SUPPORT_TICKET_CATEGORY.DENIED_UPDATE_ACCESS
                        );
                      }
                    }}
                  >
                    <div className="grid items-center pl-2  w-full">
                      {/* <span className="text-gray-600 text-xs">Name : </span> */}
                      <div className="flex items-center justify-between  w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-50">
                        {item.name}
                        <Pen size={10} className="text-blue-500 " />
                      </div>
                    </div>
                  </h4>
                )}

                {editingTypeId === item.id && editingField === "description" ? (
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
                          item.description.trim()
                        ) {
                          setEditingStatus(item.isActive); // keep current status
                          handleSaveEdit({
                             ...item,
                            id: item.id,
                            name: item.name,
                            description: editingTypeDescription,
                            isactive: item.isActive,
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
                      if (userHasAccessToUpdateSettingGeneral) {
                        setEditingTypeId(item.id);
                        setEditingTypeDescription(item.description);
                        setEditingField("description");
                      } else {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.SUPPORT_TICKET_CATEGORY
                            .DENIED_UPDATE_ACCESS
                        );
                      }
                    }}
                  >
                    <div className="grid items-center pl-2  w-full">
                      {/* <span className="text-gray-600 text-xs">Name : </span> */}
                      <div className="flex items-center justify-between  w-full gap-1  hover:border border-blue-300 hover:rounded px-1 hover:bg-gray-50">
                        {item.description}
                        <Pen size={10} className="text-blue-500 " />
                      </div>
                    </div>
                  </h4>
                )}

                <div className="flex  items-center justify-end mt-2">
                  <ToggleButton
                    checked={item.isActive}
                    onToggle={async () => {
                      handleSaveEdit({
                        ...item,
                        name: item.name,
                        description: item.description,
                        isactive: !item.isActive,
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

export default SupportTicketCategorySetting;
