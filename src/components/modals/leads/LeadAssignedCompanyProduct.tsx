import React, { useEffect, useRef, useState } from "react";
import LeadAssignedCompanyProduct from "../../../@types/lead-management/LeadAssignedCompanyProduct";
import InterestType from "../../../@types/lead-management/InterestType";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { NUMBER_VALUES, STATUS_CODE } from "../../../constants/AppConstants";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import ROUTES_URL from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";

interface LeadAssignedProductsTableProps {
  data: LeadAssignedCompanyProduct[];
  interestTypeData: InterestType[];
  handleLeadProductStatusUpdate: (product: LeadAssignedCompanyProduct) => void;
  handleLeadProductUpdate: (product: LeadAssignedCompanyProduct) => void;
}

const LeadAssignedCompanyProducts: React.FC<LeadAssignedProductsTableProps> = ({
  data,
  handleLeadProductStatusUpdate,
  interestTypeData,
  handleLeadProductUpdate,
}) => {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<{
    quantityRequired: string;
    costExpected: string;
    leadInterestId: number | null;
    isActive: boolean;
    interestName: string;
  }>({
    quantityRequired: "",
    costExpected: "",
    leadInterestId: null,
    isActive: false,
    interestName: "",
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { userHasAccessToUpdateLead } = useUserAccessModules();
  //note : Message Snackbar
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const handleUpdateLeadCompanyProductStatus = async (
    product: LeadAssignedCompanyProduct
  ) => {
    const updatedStatus = !product.isActive;

    const postData = {
      company_id: loginStatus.companyId,
      id: product.id,
      lead_interest_id: null,
      quantity_required: null,
      cost_expected: null,
      isactive: updatedStatus,
      updatedby: loginStatus.id,
    };

    try {
      const response = await axios.put(
        POST_API.UPDATE_LEAD_ASSINGED_PRODUCT,
        postData,
        {
          withCredentials: true,
        }
      );
      if (response) {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            showMessageSnackbar({
              message: response.data.message,
              type: "success",
            });
            handleLeadProductStatusUpdate(product);
          } else {
            showMessageSnackbar({
              message: response.data.message,
              type: "error",
            });
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleUpdateLeadCompanyProductStatus,
        });

        if (refreshTokenStatus) {
          setIsDialogueOpen(false);
          handleUpdateLeadCompanyProductStatus(product);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setEditingProductId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = (product: LeadAssignedCompanyProduct) => {
    setEditingProductId(product.id);
    setEditedValues({
      quantityRequired: String(product.quantityRequired),
      costExpected: String(product.costExpected),
      leadInterestId: product.leadInterestId!,
      isActive: product.isActive,
      interestName: product.leadInterestName,
    });
  };

  const handleQuantityChange = (value: string) => {
    const regex = /^[1-9]\d*$/; // Only positive non-zero integers
    if (regex.test(value) || value === "") {
      setEditedValues((prev) => ({ ...prev, quantityRequired: value }));
    }
  };

  const handleCostChange = (value: string) => {
    const regex = /^\d*\.?\d*$/; // Only numbers and decimals
    if (regex.test(value) || value === "") {
      setEditedValues((prev) => ({ ...prev, costExpected: value }));
    }
  };

  const handleSaveClick = async (product: LeadAssignedCompanyProduct) => {
    if (editingProductId === product.id) {
      const parsedQuantity = parseInt(editedValues.quantityRequired, 10);
      const parsedCost = parseFloat(editedValues.costExpected);

      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        showMessageSnackbar({
          message: "Quantity Required must be greater than 0.",
          type: "error",
        });
        return;
      }

      if (isNaN(parsedCost)) {
        showMessageSnackbar({
          message: "Expected Cost must be a valid number.",
          type: "error",
        });
        return;
      }

      const updatedProductPostData = {
        company_id: loginStatus.companyId,
        id: product.id,
        quantity_required: parsedQuantity,
        cost_expected: parsedCost,
        lead_interest_id: editedValues.leadInterestId,
        isactive: product.isActive,
        updatedby: loginStatus.id,
      };

      const updatedProduct: LeadAssignedCompanyProduct = {
        ...product,
        quantityRequired: parsedQuantity,
        costExpected: parsedCost,
        leadInterestId: editedValues.leadInterestId!,
        leadInterestName: editedValues.interestName,
      };

      try {
        const response = await axios.put(
          POST_API.UPDATE_LEAD_ASSINGED_PRODUCT,
          updatedProductPostData,
          {
            withCredentials: true,
          }
        );
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            showMessageSnackbar({
              message: response.data.message,
              type: "success",
            });
            handleLeadProductUpdate(updatedProduct);
            console.log("this is the updated product");
            console.log(updatedProduct);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: handleSaveClick,
          });

          if (refreshTokenStatus) {
            setIsDialogueOpen(false);
            handleSaveClick(product);
          } else {
            setIsDialogueOpen(true);
          }
        } else if (error.status === STATUS_CODE.FORBIDDEN) {
          setIsDialogueOpen(true);
        }
      }
      setEditingProductId(null);
    }
  };

  return (
    <div className=" h-auto w-full overflow-auto  bg-gray-0 ">
      {/* Header row */}
      <div className=" sm:text-xs md:text-[12px] md:grid grid-cols-[2fr_1fr_1fr_0.8fr_0.7fr] gap-4 font-semibold h-5 bg-gray-200 text-gray-900 text-sm mb-2  px-2">
        <div>Product Name</div>
        <div className="text-center">Req. Quantity</div>
        <div className="text-center">Exp. Cost</div>
        <div>Interest</div>
        <div className="text-center">Status</div>
      </div>
      {data.length == 0 && (
        <div className="flex w-full h-28 bg-green50 text-xs text-gray-400 justify-center items-center ">
          Product is not assigned to lead.
        </div>
      )}
      {/* Data rows */}
      {data.map(
        (
          product,
          index // Added 'index' to the map function
        ) => (
          <form key={product.id} className="px-1">
            <div
              key={index}
              ref={editingProductId === product.id ? wrapperRef : null}
              title={product.companyProductName}
              className="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.7fr] gap-4 bg-slate-50  border shadow-sm  border-gray-100 rounded-md p-1 mb-2 text-[13px]  hover:shadow-md items-center " // Added 'animate-fade-in' removed this function of animation
            >
              <div className="text-[13px] font-medium text-gray-800 truncate">
                {product.companyProductName}
              </div>

              {product.isActive &&
              editingProductId === product.id &&
              userHasAccessToUpdateLead ? (
                <>
                  <input
                    type="text"
                    disabled={!userHasAccessToUpdateLead}
                    value={editedValues.quantityRequired}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="border py-0.5 px-1 rounded w-16 "
                  />
                  <input
                    type="text"
                    disabled={!userHasAccessToUpdateLead}
                    value={editedValues.costExpected}
                    onChange={(e) => handleCostChange(e.target.value)}
                    className="border px-1 rounded w-16 "
                  />
                  <select
                    disabled={!userHasAccessToUpdateLead}
                    value={editedValues.leadInterestId ?? ""}
                    onChange={(e) =>
                      setEditedValues((prev) => ({
                        ...prev,
                        leadInterestId:
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value),
                        interestName: e.target.selectedOptions[0].text,
                      }))
                    }
                    className="border rounded w-16"
                  >
                    <option value="">Select</option>
                    {interestTypeData.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs"
                      onClick={() => {
                        if (userHasAccessToUpdateLead) {
                          handleSaveClick(product);
                        } else {
                          showMessageSnackbar({
                            message:
                              MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                .UPDATE_LEAD_ACCESS_DENIED_message,
                            type: "error",
                          });
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="cursor-pointer text-center"
                    onClick={() => product.isActive && handleEditClick(product)}
                  >
                    {product.quantityRequired}
                  </div>
                  <div
                    className="cursor-pointer text-center"
                    onClick={() => product.isActive && handleEditClick(product)}
                  >
                    ₹{product.costExpected}
                  </div>
                  <div
                    className="truncate cursor-pointer"
                    onClick={() => product.isActive && handleEditClick(product)}
                  >
                    {/* {interestTypeData.map((value) => {
                if (value.id === product.leadInterestId) {
                  return value.name;
                }
              })} */}
                    {product.leadInterestName}
                  </div>
                  <div className="flex items-center justify-start sm:justify-center">
                    <button
                      type="submit"
                      id={product.companyProductName}
                      title={product.isActive ? "Active" : "Inactive"}
                      className={`w-7 h-3 rounded-full flex items-center transition-colors duration-300 ${
                        product.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (userHasAccessToUpdateLead) {
                          handleUpdateLeadCompanyProductStatus(product);
                        } else {
                          showMessageSnackbar({
                            message:
                              MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                .UPDATE_LEAD_ACCESS_DENIED_message,
                            type: "error",
                          });
                        }
                      }}
                    >
                      <div
                        className={`bg-white w-2.5 h-2.5 rounded-full  transform transition-transform ${
                          product.isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        )
      )}

      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      />
    </div>
  );
};

export default LeadAssignedCompanyProducts;
