import { ChangeEvent, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { AccountCompanyProductWarranty } from "../../../../../@types/account/AccountCompanyProductWarranty";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import { Dayjs } from "dayjs";
import POST_API from "../../../../../constants/PostApi";
import axiosClient from "../../../../../axios-client/AxiosClient";
import { handleApiError } from "../../../../../config/error/handleApiError";
import FormLayout from "../../../../ui/FormLayout";
import FormHeader from "../../../../ui/FormHeader";
import { Calendar, Edit, ReceiptText } from "lucide-react";
import { ControlledMuiDatePicker } from "../../../../ui/ControlledMuiDatePicker";
import TextAreaInput from "../../../../ui/TextAreaInput";
import ToggleButton from "../../../../ui/ToggleButton";

type UpdateAccountCompanyProductWarrantyPayload = {
  id: number;
  company_id: number;
  updatedby_id: number;

  warranty_start_date: string;
  warranty_end_date: string;
  warranty_terms: string;
  details: string;
  isactive: boolean;
};
export const AccountCompanyProductWarrantyUpdate = ({
  handleCloseForm,
  selectedAmcForUpdate,
  onSuccess,
}: {
  handleCloseForm: () => void;
  selectedAmcForUpdate: Readonly<AccountCompanyProductWarranty>;
  onSuccess: () => void;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  // Local state that will store the data
  const [formData, setFormData] =
    useState<AccountCompanyProductWarranty>(selectedAmcForUpdate);

  const [
    originalAccountProductWarrantyData,
    setOriginalAccountProductWarrantyData,
  ] = useState<AccountCompanyProductWarranty | null>(selectedAmcForUpdate);

  //  Fix: Update formdata and originalAccountProductAndData whenever selectedAmcForUpdate changes
  // Note : sync the data when AmcForUpdate Changes
  useEffect(() => {
    if (selectedAmcForUpdate) {
      setFormData({ ...selectedAmcForUpdate });
      setOriginalAccountProductWarrantyData({ ...selectedAmcForUpdate });
    }
  }, [selectedAmcForUpdate]);

  // Note : handle change function that will locally update the text data
  const handleOnChange = <K extends keyof AccountCompanyProductWarranty>(
    fieldName: K,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    setFormData((prev) => {
      if (!prev) return prev; // keep null as null

      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  // Note : handle change function that will locally update the date data
  const handleDateCommit = <K extends keyof AccountCompanyProductWarranty>(
    fieldName: K,
    date: Dayjs | null
  ) => {
    if (!date) return;

    const formattedDate = date.format("YYYY-MM-DD");

    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [fieldName]: formattedDate,
      };
    });
  };

  const handleAccountCompanyProductWarrantyStatusChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const status = event.target.checked;

    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        isActive: status,
      };
    });
  };

  // Note : Api call
  // const updateAccountCompanyProductAmc = async <K extends keyof AccountCompanyProductWarranty>(
  //   field: K,
  //   value: AccountCompanyProductWarranty[K]
  // ) => {
  //   if (!formData || !originalAccountProductWarrantyData) return;

  //   const apiField = ACCOUNT_PRODUCT_API_FIELD_MAP[field] ?? field;

  //   try {
  //     const postData = {

  //       id: selectedAmcForUpdate.id,
  //       company_id: loginStatus.companyId,
  //       updatedby_id: loginStatus.id,
  //       [apiField]: value,
  //     };

  //     const response = await axiosClient.post(
  //       POST_API.UPDATE_ACCOUNT_COMPANY_PRODUCT_AMC,
  //       postData,
  //       { withCredentials: true }
  //     );

  //     if (response.data.status) {
  //       toast.success(response.data.message);
  //       setOriginalAccountProductWarrantyData((prev) =>
  //         prev ? { ...prev, [field]: value } : prev
  //       );
  //     } else {
  //       toast.error(response.data.message);
  //       //   throw new Error(response.data.message);
  //       // rollback only the failed field
  //       setFormData((prev) =>
  //         prev ? { ...prev, [field]: originalAccountProductWarrantyData[field] } : prev
  //       );
  //     }
  //   } catch (error) {
  //     handleApiError(error);

  //     // rollback only the failed field
  //     setFormData((prev) =>
  //       prev ? { ...prev, [field]: originalAccountProductWarrantyData[field] } : prev
  //     );
  //   }
  // };

  const mapWarrantyToUpdatePayload = (
    data: AccountCompanyProductWarranty,
    companyId: number,
    userId: number
  ): UpdateAccountCompanyProductWarrantyPayload => {
    return {
      id: data.id,
      company_id: companyId,
      updatedby_id: userId,

      warranty_start_date: data.warrantyStartDate,
      warranty_end_date: data.warrantyEndDate,
      warranty_terms: data.warrantyTerms,
      details: data.details,
      isactive: data.isActive,
    };
  };
  const updateAccountCompanyProductAmc = async () => {
    if (!formData || !originalAccountProductWarrantyData) return;

    try {
      const postData = mapWarrantyToUpdatePayload(
        formData,
        loginStatus.companyId,
        loginStatus.id
      );

      console.log(postData);

      const response = await axiosClient.post(
        POST_API.UPDATE_ACCOUNT_COMPANY_PRODUCT_WARRANTY,
        postData,
        { withCredentials: true }
      );

      if (response.data.status) {
        toast.success(response.data.message);

        setOriginalAccountProductWarrantyData({ ...formData });
        // Note : trigger the refresh call
        onSuccess();
      } else {
        toast.error(response.data.message);
        //   throw new Error(response.data.message);
        // rollback only the failed field
        setFormData({ ...originalAccountProductWarrantyData });
      }
    } catch (error) {
      handleApiError(error);

      // rollback only the failed field
      setFormData({ ...originalAccountProductWarrantyData });
    }
  };

  useEffect(() => {
    if (!formData || !originalAccountProductWarrantyData) return;

    // const changedFields = API_UPDATABLE_FIELDS.filter(
    //   (key) => formData[key] !== originalAccountProductWarrantyData[key]
    // );

    // if (!changedFields.length) return;

    const hasChanges = Object.keys(formData).some(
      (key) =>
        formData[key as keyof AccountCompanyProductWarranty] !==
        originalAccountProductWarrantyData[
          key as keyof AccountCompanyProductWarranty
        ]
    );

    if (!hasChanges) return;

    const timer = setTimeout(() => {
      updateAccountCompanyProductAmc();
    }, 1000);
    // const timer = setTimeout(() => {
    //   changedFields.forEach((field)=>{
    //     updateAccountCompanyProductAmc(field, formData[field]);
    //   })
    // }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  return (
    <FormLayout padding={2} width={3}>
      <FormHeader
        icon={Edit}
        onClose={handleCloseForm}
        preText="Update Warranty"
        description="Update Warranty Details"
      />

      <div className="grid grid-cols-2 gap-2 ">
        <ControlledMuiDatePicker
          label="Warranty Start Date"
          value={formData.warrantyStartDate}
          onCommit={(date) => handleDateCommit("warrantyStartDate", date)}
          isRequired
          logo={Calendar}
        />
        <ControlledMuiDatePicker
          label="Warranty End Date"
          value={formData.warrantyEndDate}
          onCommit={(date) => handleDateCommit("warrantyEndDate", date)}
          isRequired
          logo={Calendar}
        />
      </div>

      <TextAreaInput
        // readonly={!}
        placeholder="Enter Details"
        cols={2}
        label="Details"
        value={formData?.details}
        rows={4}
        onChange={(event) => {
          handleOnChange("details", event);
        }}
        logo={ReceiptText}
      />

      <TextAreaInput
        // readonly={!}
        placeholder="Enter Warranty terms"
        cols={2}
        label="Warranty terms"
        value={formData?.warrantyTerms}
        rows={4}
        onChange={(event) => {
          handleOnChange("warrantyTerms", event);
        }}
        logo={ReceiptText}
      />
      <div className="flex items-center justify-end mt-2">
        <ToggleButton
          label="Status"
          wantLabel
          checked={formData.isActive}
          name={formData.id.toString()}
          onToggle={(event) => {
            handleAccountCompanyProductWarrantyStatusChange(event);
          }}
        />
      </div>
    </FormLayout>
  );
};
