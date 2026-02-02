import FormLayout from "../../../../ui/FormLayout";
import FormHeader from "../../../../ui/FormHeader";
import { Calendar, Plus, ReceiptText, Save, X } from "lucide-react";
import React, { useState } from "react";
import TextAreaInput from "../../../../ui/TextAreaInput";
import { ControlledMuiDatePicker } from "../../../../ui/ControlledMuiDatePicker";
import { Dayjs } from "dayjs";
import Button from "../../../../ui/Button";
import { SIZE } from "../../../../../constants/AppConstants";
import { createAccountCompanyProductAmc } from "../../../../../config/apis/AccountApis";
import { handleApiError } from "../../../../../config/error/handleApiError";
import toast from "react-hot-toast";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";

type AccountCompanyProductAmcCreateDto = {
  amcCycleStartDate: string | null;
  amcCycleEndDate: string | null;
  details: string;
};

type FormErrors = Partial<
  Record<keyof AccountCompanyProductAmcCreateDto, string>
>;

type AccountCompanyProductAmcCreateProps = {
  isOpen: boolean;
  onClose: () => void;
  accountCompanyProductId : number,
  onSuccess : ()=> void;
};

export const AccountCompanyProductAmcCreate: React.FC<
  AccountCompanyProductAmcCreateProps
> = ({ isOpen, onClose , accountCompanyProductId ,onSuccess  }) => {
  const initialFormState = {
    amcCycleEndDate: null,
    amcCycleStartDate: null,
    details: "",
  };

  const {loginStatus} = useLoggedInUserContext();
  // Note : State For form data to store
  const [formData, setFormData] =
    useState<AccountCompanyProductAmcCreateDto>(initialFormState);

  // Note : state to manage errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Note : if not open then return null
  if (!isOpen) return null;

  //   Note : setter function for date values
  const handleDateCommit = (
    field: keyof AccountCompanyProductAmcCreateDto,
    date: Dayjs | null
  ) => {
    if (!date || !date.isValid) return;

    if(date.year() < 2000 ) return;


    const formattedDate = date.format("YYYY-MM-DD");
    console.log("this is the date ");
    console.log(formattedDate);

    setFormData((prev) => ({
      ...prev,
      [field]: formattedDate,
    }));
    clearFieldError(field);
  };

  //   Note : setter function for string values
  const handleOnChange = (
    field: keyof AccountCompanyProductAmcCreateDto,
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
    data: AccountCompanyProductAmcCreateDto
  ): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.amcCycleStartDate) {
      newErrors.amcCycleStartDate = "AMC start date is required";
    }

    if (!data.amcCycleEndDate) {
      newErrors.amcCycleEndDate = "AMC end date is required";
    }

    if (!data.details) {
      newErrors.details = "Details are required";
    }

    if (
      formData.amcCycleStartDate &&
      formData.amcCycleEndDate &&
      formData.amcCycleEndDate < formData.amcCycleStartDate
    ) {
      newErrors.amcCycleEndDate = "End date must be after Start Date";
    }

    return newErrors;
  };

  const AMC_CREATE_API_FIELD_MAP = {
  amcCycleStartDate: "amc_cycle_start_date",
  amcCycleEndDate: "amc_cycle_end_date",
  details: "details"
} as const;


const buildCreatePayload = (
  data: AccountCompanyProductAmcCreateDto
) => {
  const payload: Record<string, unknown> = {};

  (
    Object.keys(AMC_CREATE_API_FIELD_MAP) as Array<
      keyof AccountCompanyProductAmcCreateDto
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

    try{
        const response = await createAccountCompanyProductAmc(postData)
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
  const clearFieldError = (field: keyof AccountCompanyProductAmcCreateDto) => {
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
        preText="Add new AMC "
        description="Fill the details and create."
      />
      <form onSubmit={handleCreateFormSubmit}>
        <div className="grid grid-cols-2 gap-2 ">
          <ControlledMuiDatePicker
            label="AMC Start Date"
            value={formData.amcCycleStartDate}
            onCommit={(date) => handleDateCommit("amcCycleStartDate", date)}
            isRequired
            logo={Calendar}
            error={!!errors.amcCycleStartDate}
            helperText={errors.amcCycleStartDate}
          />
          <ControlledMuiDatePicker
            label="AMC End Date "
            value={formData.amcCycleEndDate}
            onCommit={(date) => handleDateCommit("amcCycleEndDate", date)}
            isRequired
            logo={Calendar}
            error={!!errors.amcCycleEndDate}
            helperText={errors.amcCycleEndDate}
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
          required={true}
          error={errors.details}
          
        />

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
