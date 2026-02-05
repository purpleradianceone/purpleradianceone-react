

import React, { useState } from "react";

import { Dayjs } from "dayjs";
import Button from "../../../../ui/Button";
import { SIZE } from "../../../../../constants/AppConstants";
import {  createAccountCompanyProductWarranty } from "../../../../../config/apis/AccountApis";
import { handleApiError } from "../../../../../config/error/handleApiError";
import toast from "react-hot-toast";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import FormLayout from "../../../../ui/FormLayout";
import FormHeader from "../../../../ui/FormHeader";
import { Calendar, Plus, ReceiptText, Save, X } from "lucide-react";
import { ControlledMuiDatePicker } from "../../../../ui/ControlledMuiDatePicker";
import TextAreaInput from "../../../../ui/TextAreaInput";

type AccountCompanyProductWarrantyCreateDto = {
  warrantyCycleStartDate: string | null;
  warrantyCycleEndDate: string | null;
  details: string;
  warrantyTerms: string 
};

type FormErrors = Partial<
  Record<keyof AccountCompanyProductWarrantyCreateDto, string>
>;

type AccountCompanyProductAmcCreateProps = {
  isOpen: boolean;
  onClose: () => void;
  accountCompanyProductId : number,
  onSuccess : () => void;
};

export const AccountCompanyProductWarrantyCreate: React.FC<
  AccountCompanyProductAmcCreateProps
> = ({ isOpen, onClose , accountCompanyProductId , onSuccess }) => {
  const initialFormState : AccountCompanyProductWarrantyCreateDto= {
    
    warrantyCycleStartDate: null,
  warrantyCycleEndDate:null,
    details: "",
    warrantyTerms : ""
  };

  const {loginStatus} = useLoggedInUserContext();
  // Note : State For form data to store
  const [formData, setFormData] =
    useState<AccountCompanyProductWarrantyCreateDto>(initialFormState);

  // Note : state to manage errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Note : if not open then return null
  if (!isOpen) return null;

  //   Note : setter function for date values
  const handleDateCommit = (
    field: keyof AccountCompanyProductWarrantyCreateDto,
    date: Dayjs | null
  ) => {
    if (!date) return;

    const formattedDate = date.format("YYYY-MM-DD");
    console.log(formattedDate);

    setFormData((prev) => ({
      ...prev,
      [field]: formattedDate,
    }));
    clearFieldError(field);
  };

  //   Note : setter function for string values
  const handleOnChange = (
    field: keyof AccountCompanyProductWarrantyCreateDto,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    clearFieldError(field);
  };

  //   Note : validation  fincotpn
  const validateForm = (
    data: AccountCompanyProductWarrantyCreateDto
  ): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.warrantyCycleStartDate) {
      newErrors.warrantyCycleStartDate = "Warranty start date is required";
    }

    if (!data.warrantyCycleEndDate) {
      newErrors.warrantyCycleEndDate = "Warranty end date is required";
    }

    if (!data.details) {
      newErrors.details = "Details are required";
    }

    //  if (!data.warrantyTerms) {
    //   newErrors = "Warranty terms are required";
    // }

    if (
      formData.warrantyCycleEndDate &&
      formData.warrantyCycleStartDate &&
      formData.warrantyCycleEndDate < formData.warrantyCycleStartDate
    ) {
      newErrors.warrantyCycleEndDate = "End date must be after Start Date";
    }

    return newErrors;
  };

  const AMC_CREATE_API_FIELD_MAP = {
  warrantyCycleStartDate: "warranty_start_date",
  warrantyCycleEndDate: "warranty_end_date",
  details: "details",
  warrantyTerms : "warranty_terms"
} as const;


const buildCreatePayload = (
  data: AccountCompanyProductWarrantyCreateDto
) => {
  const payload: Record<string, unknown> = {};

  (
    Object.keys(AMC_CREATE_API_FIELD_MAP) as Array<
      keyof AccountCompanyProductWarrantyCreateDto
    >
  ).forEach((key) => {
    const apiKey = AMC_CREATE_API_FIELD_MAP[key];
    payload[apiKey] = data[key];
  });

  return payload;
};

  //   Note : api call function
  const handleCreateFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validatationErrors = validateForm(formData);

    if (Object.keys(validatationErrors).length > 0) {
      setErrors(validatationErrors);
      return;
    }

    // Note : clears the Errors state if valid 
    setErrors({})
    
    // Note : creating the post data 
    const data = buildCreatePayload(formData);
    const postData = {
        account_company_product_id : accountCompanyProductId,
        createdby_id : loginStatus.id,
        company_id : loginStatus.companyId,
        ...data
    }

    console.log(

      postData
    );
    try{
        const response = await createAccountCompanyProductWarranty(postData)
        if(response.data.status){
            toast.success(response.data.message);
            onClose();
            onSuccess();
            setFormData(initialFormState);
        }else{
            toast.error(response.data.message);
        }
    }catch (err){
        handleApiError(err);
    }

  };

  //   Note : when value given clears the error.
  const clearFieldError = (field: keyof AccountCompanyProductWarrantyCreateDto) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

//   Note : form clost function
  function handleClose(){
      setFormData(initialFormState)
    onClose()
  }
  return (
    <FormLayout width={3} padding={3}>
      <FormHeader
        icon={Plus}
        onClose={handleClose}
        preText="Add new Warranty "
        description="Fill the details and create."
      />
      <form onSubmit={handleCreateFormSubmit}>
        <div className="grid grid-cols-2 gap-2 ">
          <ControlledMuiDatePicker
            label="Warranty Start Date"
            value={formData.warrantyCycleStartDate}
            onCommit={(date) => handleDateCommit("warrantyCycleStartDate", date)}
            isRequired
            logo={Calendar}
            error={!!errors.warrantyCycleStartDate}
            helperText={errors.warrantyCycleStartDate}
          />
          <ControlledMuiDatePicker
            label="Warranty End Date "
            value={formData.warrantyCycleEndDate}
            onCommit={(date) => handleDateCommit("warrantyCycleEndDate", date)}
            isRequired
            logo={Calendar}
            error={!!errors.warrantyCycleEndDate}
            helperText={errors.warrantyCycleEndDate}
          />

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
          required={true}
          error={errors.details}
        />
        <TextAreaInput
          // readonly={!}
          placeholder="Enter Warranty Terms"
          cols={2}
          label="Warranty terms"
          value={formData?.warrantyTerms}
          rows={4}
          onChange={(event) => {
            handleOnChange("warrantyTerms", event);
          }}
          logo={ReceiptText}
          // required={true}
          // error={errors.warrantyTerms}
        />
          </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-4 mt-3 ">
          <div className="flex gap-2">
            <Button onClick={handleClose} type="button">
              <div className="flex items-center gap-0.5">
                <X size={SIZE.SIXTEEN} />
                Cancel
              </div>
            </Button>
            <Button type="submit" onClick={handleCreateFormSubmit}>
              <div className="flex items-center gap-1">
                <Save size={SIZE.SIXTEEN} />
                Save
              </div>
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
};
