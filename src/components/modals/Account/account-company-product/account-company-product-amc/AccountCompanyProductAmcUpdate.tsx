import { ChangeEvent, useEffect, useState } from "react";

import { Calendar, Edit, ReceiptText } from "lucide-react";
import { Dayjs } from "dayjs";
import { AccountCompanyProductAmc } from "../../../../../@types/account/AccountCompanyProductAmc";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import axiosClient from "../../../../../axios-client/AxiosClient";
import POST_API from "../../../../../constants/PostApi";
import toast from "react-hot-toast";
import { handleApiError } from "../../../../../config/error/handleApiError";
import FormLayout from "../../../../ui/FormLayout";
import FormHeader from "../../../../ui/FormHeader";
import { ControlledMuiDatePicker } from "../../../../ui/ControlledMuiDatePicker";
import TextAreaInput from "../../../../ui/TextAreaInput";
import ToggleButton from "../../../../ui/ToggleButton";

type UpdateAccountCompanyProductAmcPayload = {
  id: number;
  company_id: number;
  updatedby_id: number;
  amc_cycle_start_date: string;
  amc_cycle_end_date: string;
  details: string;
  isactive: boolean;
};

export const AccountCompanyProductAmcUpdate = ({
  handleCloseForm,
  selectedAmcForUpdate,
  onSuccess,
}: {
  handleCloseForm: () => void;
  selectedAmcForUpdate: Readonly<AccountCompanyProductAmc>;
  onSuccess: () => void;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  // Local state that will store the data
  const [formData, setFormData] =
    useState<AccountCompanyProductAmc>(selectedAmcForUpdate);

  const [originalAccountProductAmcData, setOriginalAccountProductAmcData] =
    useState<AccountCompanyProductAmc | null>(selectedAmcForUpdate);

  //  Fix: Update formdata and originalAccountProductAndData whenever selectedAmcForUpdate changes
  // Note : sync the data when AmcForUpdate Changes
  useEffect(() => {
    if (selectedAmcForUpdate) {
      setFormData({ ...selectedAmcForUpdate });
      setOriginalAccountProductAmcData({ ...selectedAmcForUpdate });
    }
  }, [selectedAmcForUpdate]);

  // Note : handle change function that will locally update the text data
  const handleOnChange = <K extends keyof AccountCompanyProductAmc>(
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
  const handleDateCommit = <K extends keyof AccountCompanyProductAmc>(
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

  const handleAccountCompanyProductStatusChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const status = event.target.checked;

    console.log(status);

    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        isActive: status,
      };
    });
  };

  // Note : Api call
  // const updateAccountCompanyProductAmc = async <K extends keyof AccountCompanyProductAmc>(
  //   field: K,
  //   value: AccountCompanyProductAmc[K]
  // ) => {
  //   if (!formData || !originalAccountProductAmcData) return;

  //   const apiField = ACCOUNT_PRODUCT_API_FIELD_MAP[field] ?? field;

  //   try {
  //     const postData = {

  //       id: selectedAmcForUpdate.id,
  //       company_id: loginStatus.companyId,
  //       updatedby_id: loginStatus.id,
  //       // [apiField]: value,
  //       formData
  //     };

  //     console.log(postData);
  //     return;

  //     const response = await axiosClient.post(
  //       POST_API.UPDATE_ACCOUNT_COMPANY_PRODUCT_AMC,
  //       postData,
  //       { withCredentials: true }
  //     );

  //     if (response.data.status) {
  //       toast.success(response.data.message);
  //       setOriginalAccountProductAmcData((prev) =>
  //         prev ? { ...prev, [field]: value } : prev
  //       );
  //     } else {
  //       toast.error(response.data.message);
  //       //   throw new Error(response.data.message);
  //       // rollback only the failed field
  //       setFormData((prev) =>
  //         prev ? { ...prev, [field]: originalAccountProductAmcData[field] } : prev
  //       );
  //     }
  //   } catch (error) {
  //     handleApiError(error);

  //     // rollback only the failed field
  //     setFormData((prev) =>
  //       prev ? { ...prev, [field]: originalAccountProductAmcData[field] } : prev
  //     );
  //   }
  // };

  const mapAmcToUpdatePayload = (
    data: AccountCompanyProductAmc,
    companyId: number,
    userId: number
  ): UpdateAccountCompanyProductAmcPayload => {
    return {
      id: data.id,
      company_id: companyId,
      updatedby_id: userId,

      amc_cycle_start_date: data.amcCycleStartDate,
      amc_cycle_end_date: data.amcCycleEndDate,
      details: data.details,
      isactive: data.isActive,
    };
  };

  const updateAccountCompanyProductAmc = async () => {
    if (!formData || !originalAccountProductAmcData) return;

    try {
      const postData = mapAmcToUpdatePayload(
        formData,
        loginStatus.companyId,
        loginStatus.id
      );

      const response = await axiosClient.post(
        POST_API.UPDATE_ACCOUNT_COMPANY_PRODUCT_AMC,
        postData,
        { withCredentials: true }
      );

      if (response.data.status) {
        toast.success(response.data.message);

        // sync original data after successful save
        setOriginalAccountProductAmcData({ ...formData });
        onSuccess();
      } else {
        toast.error(response.data.message);

        // rollback entire form
        setFormData({ ...originalAccountProductAmcData });
      }
    } catch (error) {
      handleApiError(error);

      // rollback entire form
      setFormData({ ...originalAccountProductAmcData });
    }
  };

  useEffect(() => {
    if (!formData || !originalAccountProductAmcData) return;

    const hasChanges = Object.keys(formData).some(
      (key) =>
        formData[key as keyof AccountCompanyProductAmc] !==
        originalAccountProductAmcData[key as keyof AccountCompanyProductAmc]
    );

    if (!hasChanges) return;

    const timer = setTimeout(() => {
      updateAccountCompanyProductAmc();
    }, 1000); // debounce

    return () => clearTimeout(timer);
  }, [formData]);

  // useEffect(() => {
  //   if (!formData || !originalAccountProductAmcData) return;

  //   const changedFields = API_UPDATABLE_FIELDS.filter(
  //     (key) => formData[key] !== originalAccountProductAmcData[key]
  //   );

  //   if (!changedFields.length) return;

  //   const timer = setTimeout(() => {
  //     changedFields.forEach((field)=>{
  //       updateAccountCompanyProductAmc(field, formData[field]);
  //     })
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [formData]);

  return (
    <FormLayout padding={2} width={3}>
      <FormHeader
        icon={Edit}
        onClose={handleCloseForm}
        preText="Update Amc"
        description="Update Amc Details"
      />

      <div className="grid grid-cols-2 gap-2 ">
        <ControlledMuiDatePicker
          label="AMC Start Date"
          value={formData.amcCycleStartDate}
          onCommit={(date) => handleDateCommit("amcCycleStartDate", date)}
          isRequired
          logo={Calendar}
        />
        <ControlledMuiDatePicker
          label="AMC End Date"
          value={formData.amcCycleEndDate}
          onCommit={(date) => handleDateCommit("amcCycleEndDate", date)}
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
      <div className="flex items-center justify-end mt-2">
        <ToggleButton
          label="Status"
          wantLabel
          checked={formData.isActive}
          name={formData.id.toString()}
          onToggle={(event) => {
            handleAccountCompanyProductStatusChange(event);
          }}
        />
      </div>
    </FormLayout>
  );
};
