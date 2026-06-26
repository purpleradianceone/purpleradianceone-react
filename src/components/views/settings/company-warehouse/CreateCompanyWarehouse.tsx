/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, Text, Save, X, MapPin, User, FileText } from "lucide-react";
import toast from "react-hot-toast";
import POST_API from "../../../../constants/PostApi";
import axios from "axios";
import MESSAGE from "../../../../constants/Messages";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import FormInput from "../../../ui/FormInput";
import Button from "../../../ui/Button";
import FormHeader from "../../../ui/FormHeader";
import { useState } from "react";
import { createPortal } from "react-dom";
import CustomDropdown from "../../../modals/leads/CustomDropdown";
import WarehouseType from "../../../../@types/warehouse/WarehouseType";
import CompanyWarehouseType from "../../../../@types/warehouse/CompanyWarehouse";
import { useFormChange } from "../../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../../config/hooks/useFormValidation";
import { handleApiError } from "../../../../config/error/handleApiError";

function CreateCompanyWarehouse({
  onClose,
  warehouseTypeData,
  getCompanyWarehouse,
}: {
  onClose: () => void;
  warehouseTypeData: WarehouseType[];
  getCompanyWarehouse: () => void;
}) {
  const { userHasAccessToAddSettingGeneral } = useUserAccessModules();

  const { loginStatus } = useLoggedInUserContext();

  const [intialAddCompanyWarehouseData, setInitialAddCompanyWarehouseFormData] =
    useState<CompanyWarehouseType>({
      id: 0,
      companyId: 0,
      warehouseTypeId: 0,
      warehouseTypeName: "",
      name: "",
      description: "",
      location: "",
      isactive: false,
      ceatedbyId: 0,
      updatedbyId: 0,
      requestedbyId: 0,
    });

  const {
    handleChange: handleAddCompanyWarehouseFormDataChange,
    formData: addCompanyWarehouseFormData,
  } = useFormChange(intialAddCompanyWarehouseData);

  const { errors, handleBlur } = useFormValidation(
    addCompanyWarehouseFormData,
    "registration"
  );

  const [selectedWarehouseTypeIdError, setSelectedWarehouseTypeError] =
    useState<boolean>(false);

  const [selectedWarehouseType, setSelectedWarehouseType] = useState<
    number | undefined
  >(undefined);

  const handleLeadSelectedWarehouseType = (value: number | undefined) => {
    setSelectedWarehouseType(value);
  };

  const validateDropdown = () => {
    if (selectedWarehouseType === 0 || selectedWarehouseType === undefined) {
      setSelectedWarehouseTypeError(true);
      // toast.error("Please select 'Product Type'");
    } else {
      setSelectedWarehouseTypeError(false);
    }
  };

  const handleAddCompanyWarehouse = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!userHasAccessToAddSettingGeneral) {
      toast.error(
        MESSAGE.MODULE_ACCESS.SUPPORT_TICKET_CATEGORY.DENIED_ADD_ACCESS
      );
      addFunctionStatesCleanup();
      return;
    }

    validateDropdown();

    console.log("Call is gone 1");

    if (
      selectedWarehouseType == 0 ||
      selectedWarehouseType == null ||
      selectedWarehouseType == undefined
    ) {
      return;
    }

    if (addCompanyWarehouseFormData.name == "") {
      return;
    }

    

    const postDataToAddNewCompanyWarehouse = {
      company_id: loginStatus.companyId,
      name: addCompanyWarehouseFormData.name,
      description: addCompanyWarehouseFormData.description,
      location: addCompanyWarehouseFormData.location,
      warehouse_type_id: selectedWarehouseType,
      createdby_id: loginStatus.id,
    };


    axios
      .post(
        POST_API.CREATE_COMPANY_WAREHOUSE,
        postDataToAddNewCompanyWarehouse,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          onClose();
          getCompanyWarehouse();
          addFunctionStatesCleanup();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error: any) => {
        handleApiError(error)
        // if (error.status === STATUS_CODE.UNATHORISED) {
        //   const refreshTokenResponse = await RefreshToken({
        //     callFunction: handleAddCompanyWarehouse,
        //   });
        //   if (refreshTokenResponse) {
        //     handleAddCompanyWarehouse();
        //   }
        // } else {
        //   toast.error(error.response.status + error.response.data);
        // }
      });
  };

  function addFunctionStatesCleanup() {
    setInitialAddCompanyWarehouseFormData({
      id: 0,
      companyId: 0,
      warehouseTypeId: 0,
      warehouseTypeName: "",
      name: "",
      description: "",
      location: "",
      isactive: false,
      ceatedbyId: 0,
      updatedbyId: 0,
      requestedbyId: 0,
    });
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5">
      <div className="bg-white w-full max-w-xl rounded-lg border border-blue-200 shadow-lg p-2 relative">
        <FormHeader
          icon={Edit}
          preText="Create Company Warehouse"
          onClose={() => {
            onClose();
            addFunctionStatesCleanup();
          }}
          description="Create Company Warehouse"
        />

        <form onSubmit={handleAddCompanyWarehouse}>
          <div className="space-y-3 p-2">
            <FormInput
              label="Name :"
              autoFocus={true}
              logo={User}
              maxLength={70}
              type="text"
              name="name"
              placeholder="Name: "
              required={true}
              value={addCompanyWarehouseFormData.name}
              onChange={handleAddCompanyWarehouseFormDataChange}
              onBlur={handleBlur}
              error={errors.name}
            />

            <FormInput
              label="Description: "
              logo={FileText}
              maxLength={300}
              type="text"
              name="description"
              placeholder="Description: "
              value={addCompanyWarehouseFormData.description}
              onChange={handleAddCompanyWarehouseFormDataChange}
              onBlur={handleBlur}
              // required={true}
              // error={errors.description}
            />

            <FormInput
              label="Location: "
              logo={MapPin}
              maxLength={300}
              type="text"
              name="location"
              value={addCompanyWarehouseFormData.location}
              placeholder="Enter Location: "
              onChange={handleAddCompanyWarehouseFormDataChange}
              onBlur={handleBlur}
              error={errors.location}
            />

            <div>
              <CustomDropdown
                requiredRedDot
                logo={Text}
                labelName="Warehouse Type :"
                onSelect={handleLeadSelectedWarehouseType}
                options={warehouseTypeData}
              ></CustomDropdown>

              {selectedWarehouseTypeIdError && (
                <div className="caption-custom-inactive">
                  Select WarehouseType
                </div>
              )}
            </div>

            <div className="flex items-center  justify-end gap-3 ">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <div className="flex items-center ">
                    <X size={16} />
                    Cancel
                  </div>
                </Button>
                <Button 
                type="submit">
                  <div className="flex items-center  gap-1">
                    <Save size={16} />
                    Save
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CreateCompanyWarehouse;
