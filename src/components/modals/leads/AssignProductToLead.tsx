import { Package, Save } from "lucide-react";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import React, { useEffect, useState } from "react";
import InterestType from "../../../@types/lead-management/InterestType";
import RefreshToken from "../../../config/validations/RefreshToken";
import ProductManagementLead from "./product-selection-modal/ProductManagementLead";
import { usePanel } from "../../../context/panel/usePanel";
import AssignProductToLeadType, {
  ItemData,
} from "../../../@types/lead-management/AssignProductToLeadType";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import LeadAssignedCompanyProduct from "../../../@types/lead-management/LeadAssignedCompanyProduct";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";
import Button from "../../ui/Button";

const AssignProductToLead = ({
  selectedLeadData,
  onClose,
  isOpen,
  leadAssignedComponyProduct,
  fetchLeadCompanyProduct,
  interestTypeData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedLeadData: any;
  onClose: () => void;
  isOpen: boolean;
  leadAssignedComponyProduct: LeadAssignedCompanyProduct[];
  fetchLeadCompanyProduct: () => void;
  interestTypeData: InterestType[];
}) => {
  const { position } = usePanel();
  const { loginStatus } = useLoggedInUserContext();

  const [showSaveButton, SetShowSaveButton] = useState<boolean>(false);

  //this state is used for getting data
  const [itemData, setItemData] = React.useState<ItemData[]>([]);

  const handleProductAddToLead = async (
    event: React.FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const PostDataAssignProductToLead: AssignProductToLeadType = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      input_data: itemData,
      createdby: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.ASSIGN_PRODUCT_TO_LEAD,
        PostDataAssignProductToLead,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          toast.success(response.data.message);
          fetchLeadCompanyProduct();
        }
        if (response.data.status === false) {
          toast.error(response.data.message);
        }
        //delay before closing
        setTimeout(() => {
          onClose();
        }, 1000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleProductAddToLead,
        });
        if (refreshTokenStatus) {
          handleProductAddToLead(event);
        }
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setItemData([]);
    }
  }, [isOpen]);

  //NOTE : THIS IS THE CODE FOR GETTING SELECTED PRODUCT
  const handleProductCheckboxChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setItemData((prev) => [
        ...prev,
        {
          company_product_id: params.id!,
          cost_expected: params.expectedCost,
          lead_interest_id: params.interest ?? 2,
          quantity_required: params.requiredQuantity,
        },
      ]);
    } else if (!event.target.checked) {
      setItemData((prev) =>
        prev.filter((item) => item.company_product_id !== params.id)
      );
    }
  };
  useEffect(() => {
    if (itemData.length > 0) {
      SetShowSaveButton(true);
    } else {
      SetShowSaveButton(false);
    }
  }, [itemData]);

  if (!isOpen) return null;
  return (
    <div>
      <div
        className={`${
          position === "top" ? "top-12" : ""
        } fixed inset-0 z-30 bg-black bg-opacity-5 flex items-center justify-center p-4`}
      >
        <div
          className={` ${
            position === "left" ? " inset-0 top-6 left-6 " : ""
          }bg-white rounded-2xl shadow-lg p-3 min-w-fit  max-h-[87vh] overflow-y-auto relative animate-fadeIn`}
        >
          {/* Header with Close Button */}
          {/* <div className="flex justify-between items-center ml-4 p-1 border-b border-gray-200">
            <h3 className="text-md font-medium text-gray-800 hover:shadow-sm">
              Assign Product to Lead
            </h3>
            <div className="flex items-center gap-5">
              <button
                onClick={handleProductAddToLead}
                className={`${
                  showSaveButton ? "bg-blue-700" : "bg-blue-400"
                }  text-white px-2 rounded-xl text-md `}
                disabled={!showSaveButton}
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div> */}
          <FormHeader
            icon={Package}
            onClose={onClose}
            preText="Assign Product to lead"
            description="Link a product with this lead for better tracking and management."
          />
          {/* NOTE : CALL TO THE MODAL COMPONENT */}
          <div className="    w-full bg">
            <div className=" flex   justify-end">
              <div className="p-1">
                {showSaveButton && (
                  <Button
                    onClick={handleProductAddToLead}
                    disabled={!showSaveButton}
                  >
                    <div className="flex items-center gap-1">
                      <Save size={16} /> Add
                    </div>
                  </Button>
                )}
              </div>
            </div>
            <ProductManagementLead
              AssignLeadId={selectedLeadData.id}
              handleProductCheckboxChange={handleProductCheckboxChange}
              interestTypeData={interestTypeData}
              alreadyAssignedCompanyProduct={leadAssignedComponyProduct}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignProductToLead;
