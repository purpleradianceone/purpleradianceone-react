/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { X } from "lucide-react";

import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { NUMBER_VALUES, STATUS_CODE } from "../../../constants/AppConstants";
import React, { useEffect, useState } from "react";
import InterestType from "../../../@types/lead-management/InterestType";
import RefreshToken from "../../../config/validations/RefreshToken";
import ROUTES_URL from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import ProductManagementLead from "./product-selection-modal/ProductManagementLead";
import { usePanel } from "../../../context/panel/usePanel";
import AssignProductToLeadType, {
  ItemData,
} from "../../../@types/lead-management/AssignProductToLeadType";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import ApiError from "../../../@types/error/ApiError";
import { LeadProductsManagementGridState } from "./product-selection-modal/ProductManagementAgGridLead";

const AssignProductToLead = ({
  selectedLeadData,
  onClose,
  isOpen,
}: {
  selectedLeadData: any;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const navigate = useNavigate();

  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

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

  const { loginStatus } = useLoggedInUserContext();
  const [interestTypeData, setInterestTypeData] = React.useState<
    InterestType[]
  >([]);

  const { position } = usePanel();
  //STATE FOR PRODUCT ID PRESERVATION
  const [preservedProductIdArray, setPreservedProductIdArray] = useState<
    number[]
  >([]);

  //this state is used for getting data
  const [itemData, setItemData] = React.useState<ItemData[]>([]);

  // API call to get lead interest data
  async function getLeadInterestData() {
    try {
      const response = await axios.get(POST_API.GET_LEAD_INTEREST_TYPE, {
        params: {
          id: null,
          name: null,
          isActive: true,
        },
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        setInterestTypeData(response.data);
      }
    } catch (error: ApiError | any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadInterestData,
        });
        if (refreshTokenStatus) {
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  }

  const handleProductAddToLead = async (
    event: React.FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const PostDataAssignProductToLead: AssignProductToLeadType = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      input_data : itemData,
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
        showMessageSnackbar({
          message: response.data.message,
          type: "success",
        });

        //delay before closing
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error: ApiError | any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleProductAddToLead,
        });
        if (refreshTokenStatus) {
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  useEffect(() => {
    if(isOpen){
      getLeadInterestData();
    }
  }, [isOpen]);

  //NOTE : THIS IS THE CODE FOR GETTING SELECTED PRODUCT
  const handleProductCheckboxChange = (
    params: LeadProductsManagementGridState,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const parsedInterest: InterestType = JSON.parse(params.interest);
    if (event.target.checked) {
      setPreservedProductIdArray((prev) => [...prev, params.id!]);
      setItemData((prev) => [
        ...prev,
        {
          company_product_id: params.id!,
          cost_expected: params.expectedCost,
          lead_interest_id: parsedInterest.id,
          quantity_required: params.requiredQuantity,
        },
      ]);
    } else if (!event.target.checked) {
      setPreservedProductIdArray((prev) =>
        prev.filter((id) => id !== params.id)
      );
      setItemData((prev) =>
        prev.filter((item) => item.company_product_id !== params.id)
      );
    }
  };

  useEffect(() => {
    console.log(itemData);
  }, [itemData]);

  if (!isOpen) return null;
  return (
    <div>
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      />

      <div
        className={` fixed inset-0 z-30 bg-black bg-opacity-40 flex items-center justify-center p-4`}
      >
        <div
          className={` ${
            position === "left" ? " inset-0 top-6 left-6 " : ""
          }bg-white rounded-2xl shadow-lg min-w-fit  max-h-[87vh] overflow-y-auto relative animate-fadeIn`}
        >
          {/* Header with Close Button */}
          <div className="flex justify-between items-center ml-4 p-1 border-b border-gray-200">
            <h3 className="text-md font-medium text-gray-800 hover:shadow-sm">
              Assign Product to Lead
            </h3>
            <div className="flex items-center gap-5">
              <button
                onClick={handleProductAddToLead}
                className="bg-blue-600 text-white px-2 rounded-xl text-md hover:bg-blue-700"
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
          </div>
          {/* NOTE : CALL TO THE MODAL COMPONENT */}
          <div className=" p-1">
            <ProductManagementLead
              handleProductCheckboxChange={handleProductCheckboxChange}
              interestTypeData={interestTypeData}
              preservedSelectedProductIdArray={preservedProductIdArray}
            />
          </div>
        </div>
      </div>

      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </div>
  );
};

export default AssignProductToLead;
