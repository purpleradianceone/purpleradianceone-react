import React, { useEffect, useRef, useState } from "react";
import LeadAssignedCompanyProduct from "../../../@types/lead-management/LeadAssignedCompanyProduct";
import InterestType from "../../../@types/lead-management/InterestType";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import {  STATUS_CODE } from "../../../constants/AppConstants";

import RefreshToken from "../../../config/validations/RefreshToken";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
import toast from "react-hot-toast";
import { Edit2, Package, Save } from "lucide-react";
import COLORS from "../../../constants/Colors";
import Button from "../../ui/Button";
import axiosClient from "../../../axios-client/AxiosClient";
// import AccessDeniedMessagePage from "../../views/not-found/AccessDeniedMessagePage";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import { taskPriorityStyles } from "../../../utils/colourSpecifierForNameInAggrid";

interface LeadAssignedProductsTableProps {
  data: LeadAssignedCompanyProduct[];
  interestTypeData: InterestType[];
  handleLeadProductStatusUpdate: (product: LeadAssignedCompanyProduct) => void;
  handleLeadProductUpdate: (product: LeadAssignedCompanyProduct) => void;
  setIsAddProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeadAssignedCompanyProducts: React.FC<LeadAssignedProductsTableProps> = ({
  data,
  handleLeadProductStatusUpdate,
  interestTypeData,
  handleLeadProductUpdate,
  setIsAddProductModalOpen,
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(()=>{
    if(data){
      setIsLoading(false)
    }
  },[data])
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
  const {
    userHasAccessToViewLeadProduct,
    userHasAccessToAddLeadProduct,
    userHasAccessToUpdateLeadProduct,
  } = useUserAccessModules();

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
      const response = await axiosClient.put(
        POST_API.UPDATE_LEAD_ASSINGED_PRODUCT,
        postData,
        {
          withCredentials: true,
        }
      );
      if (response) {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
            handleLeadProductStatusUpdate(product);
          } else {
            toast.error(response.data.message);
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
          handleUpdateLeadCompanyProductStatus(product);
        }
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
        toast.error("Quantity Required must be greater than 0.");
        return;
      }

      if (isNaN(parsedCost)) {
        toast.error("Expected Cost must be a valid number.");
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
        const response = await axiosClient.put(
          POST_API.UPDATE_LEAD_ASSINGED_PRODUCT,
          updatedProductPostData,
          {
            withCredentials: true,
          }
        );
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
            handleLeadProductUpdate(updatedProduct);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: handleSaveClick,
          });

          if (refreshTokenStatus) {
            handleSaveClick(product);
          }
        }
      }
      setEditingProductId(null);
    }
  };

  const handleShowToasterAboutProductIsInactive = () => {
    toast.error("Inactive products cannot be updated.");
  };
  const handleAddProductToLeadButtonClick = () => {
    setIsAddProductModalOpen(true);
  };

  if(isLoading && userHasAccessToViewLeadProduct){
    return (
      <>
        <div className="w-full h-full  flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }
  
  return (
    <div className="  w-full  h-[205px] border rounded-lg bg-gray-0 ">
      <div >
        <div className="border-b px-1 my-1 flex justify-between">
        
        <span className="table-header-custom text-black whitespace-nowrap pl-1 py-1 ">Products/Requirements</span>

        {userHasAccessToViewLeadProduct && data.length>0 && (
        <div className="flex justify-end items-center gap-x-2 p-1 input-label-custom">
          <Button
            disabled={!userHasAccessToAddLeadProduct}
            onClick={() => {
              if (userHasAccessToAddLeadProduct) {
                handleAddProductToLeadButtonClick();
              } else {
                toast.error(
                  MESSAGE.MODULE_ACCESS.LEAD_PRODUCT.DENIED_ADD_ACCESS
                );
              }
            }}
            className={COLORS.ADD_BUTTON}
          >
            +Add
          </Button>
        </div>
      )}
        </div>

        
      {/* Header row */}
      <div className="border rounded-lg m-2 ">
      <div className="grid grid-cols-[2.3fr_1.2fr_1fr_1fr_0.5fr] border-b rounded-t-md px-1 py-1.5 bg-slate-100 ">
        <div className="table-header-custom">Product Name</div>
        <div className="table-header-custom">Req. Quantity</div>
        <div className="table-header-custom">Exp. Cost</div>
        <div className="table-header-custom">Interest</div>
        <div className="table-header-custom">Status</div>


        
      </div>
      
      
      {/* Data rows */}
     
      <div
      className="
        max-h-[110px] overflow-y-auto
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-50
        [&::-webkit-scrollbar-thumb]:bg-gray-50
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-track]:rounded-full
      "
    >
      {userHasAccessToViewLeadProduct &&
        data.length > 0 &&
        data.map(
          (
            product,
            index // Added 'index' to the map function
          ) => (
            <>
              <form key={product.id} className="px-1">
                <div
                  key={index}
                  ref={editingProductId === product.id ? wrapperRef : null}
                  title={product.companyProductName}
                  className="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.7fr] gap-4 p-1 my-2 text-[13px]  hover:shadow-md items-center " // Added 'animate-fade-in' removed this function of animation
                >
                  <div
                    className={`flex items-center gap-2 input-label-custom rounded-lg min-w-0 ${
                      !product.isActive ? "opacity-50" : ""
                    }`}
                    onClick={() => {
                      if (!product.isActive) {
                        handleShowToasterAboutProductIsInactive();
                        return;
                      }
                    }}
                  >
                    <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
                      <Package size={14} className="text-blue-600 flex-shrink-0" />
                    </div>


                    <span className="truncate w-full">
                      {product.companyProductName}
                    </span>
                  </div>

                  {product.isActive &&
                  editingProductId === product.id &&
                  userHasAccessToUpdateLeadProduct ? (
                    <>
                      <input
                        type="text"
                        disabled={!userHasAccessToUpdateLeadProduct}
                        value={editedValues.quantityRequired}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        className="border py-0.5 px-1 rounded w-16 input-label-custom "
                      />
                      <input
                        type="text"
                        disabled={!userHasAccessToUpdateLeadProduct}
                        value={editedValues.costExpected}
                        onChange={(e) => handleCostChange(e.target.value)}
                        className="border px-1 rounded w-16 input-label-custom"
                      />
                      <select
                        disabled={!userHasAccessToUpdateLeadProduct}
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
                        className="border rounded w-20 input-label-custom"
                      >
                        {/* <option value="">Select</option> */}
                        {interestTypeData.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          className="bg-blue-600 caption-custom white-text px-2 py-0.5 rounded"
                          onClick={() => {
                            if (userHasAccessToUpdateLeadProduct) {
                              handleSaveClick(product);
                            } else {
                              toast.error(
                                MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                  .UPDATE_LEAD_ACCESS_DENIED_message
                              );
                            }
                          }}
                        >
                          <div className="flex items-center gap-0.5">
                            <Save size={12} /> Save
                          </div>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`input-label-custom flex justify-center gap-2 items-center cursor-pointer  border rounded-lg ${
                          !product.isActive
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (!product.isActive) {
                            handleShowToasterAboutProductIsInactive();
                            return;
                          }
                          handleEditClick(product);
                        }}
                      >
                        {product.quantityRequired}
                        <span>
                          <Edit2 size={9} />
                        </span>
                      </div>
                      <div
                        className={`input-label-custom cursor-pointer flex items-center justify-center gap-2 border rounded-lg ${
                          !product.isActive
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (!product.isActive) {
                            handleShowToasterAboutProductIsInactive();
                            return;
                          }
                          handleEditClick(product);
                        }}
                      >
                        ₹{product.costExpected}
                        <span>
                          <Edit2 size={9} />
                        </span>
                      </div>
                      <div
                        className={`
                          input-label-custom cursor-pointer flex items-center justify-center gap-1 
                          rounded-lg px-2  border 
                          ${
                            taskPriorityStyles[product.leadInterestName] ||
                            "bg-slate-100 text-slate-700 border-slate-200"
                          }
                          ${
                            !product.isActive
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        `}
                        onClick={() => {
                          if (!product.isActive) {
                            handleShowToasterAboutProductIsInactive();
                            return;
                          }
                          handleEditClick(product);
                        }}
                      >
                        {product.leadInterestName}
                        <span>
                          <Edit2 size={9} />
                        </span>
                      </div>
                      <div className="flex items-center justify-start sm:justify-center">
                        <button
                          type="submit"
                          id={product.companyProductName}
                          title={product.isActive ? "Active" : "Inactive"}
                          className={`w-7 h-3 rounded-full flex items-center transition-colors duration-300 ${
                            product.isActive ? "bg-green-500" : "bg-gray-400"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (userHasAccessToUpdateLeadProduct) {
                              handleUpdateLeadCompanyProductStatus(product);
                            } else {
                              toast.error(
                                MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                  .UPDATE_LEAD_ACCESS_DENIED_message
                              );
                            }
                          }}
                        >
                          <div
                            className={`bg-white w-2.5 h-2.5 rounded-full  transform transition-transform ${
                              product.isActive
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </>
          )
        )}
        </div>

      {/* {userHasAccessToViewLeadProduct && data.length === 0 && (
        <p className="caption-custom italic text-center p-3">
          No product assigned
        </p>
      )} */}
      </div>
    </div>
    </div>
  );
};

export default LeadAssignedCompanyProducts;
