import { EditIcon, X } from "lucide-react";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import {
  BOOLEAN_VALUES,
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
  STRING_VALUES,
  TAX_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import MessageSnackBar from "../../ui/MessageSnackbar";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import { useEffect, useState } from "react";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MESSAGE from "../../../constants/Messages";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import CreateCompanyProductTaxProps from "../../../@types/modal/CreateCompanyProductTax";
import RadioButtons from "../../ui/RadioButton";
import { ProductsRadioButtonOptions } from "../../../constants/TestData";
import DatePickerInput from "../../ui/DatePickerInput";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";

function CreateCompanyProductTax({
  isOpen,
  onClose,
  product,
  handleCreateCompanyProductTax,
}: CreateCompanyProductTaxProps) {
  const intialCreateCompanyProductFormData = {
    hsn: STRING_VALUES.EMPTY_STRING,
    sac: STRING_VALUES.EMPTY_STRING,
    taxRate: NUMBER_VALUES.ZERO,
    validFrom: STRING_VALUES.EMPTY_STRING,
  };

  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToAddProductTax } = useUserAccessModules();
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>("");

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
    type: "success" as "success" | "error",
  });

  const {
    formData: createCompanyProductTaxFormData,
    handleChange: handleCreateCompanyProductTaxChange,
  } = useFormChange(intialCreateCompanyProductFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    createCompanyProductTaxFormData,
    "registration"
  );

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    BOOLEAN_VALUES.FALSE
  );
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(BOOLEAN_VALUES.FALSE);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  };

  function handleTaxRadioButtonChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSelectedTaxCode(event.target.value);
  }

  const hanldeUpdateCompanyProductFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (
      createCompanyProductTaxFormData.taxRate !== NUMBER_VALUES.ZERO &&
      createCompanyProductTaxFormData.validFrom !==
        STRING_VALUES.EMPTY_STRING &&
      (createCompanyProductTaxFormData.hsn !== STRING_VALUES.EMPTY_STRING ||
        createCompanyProductTaxFormData.sac !== STRING_VALUES.EMPTY_STRING)
    ) {
      if (userHasAccessToAddProductTax) {
        const updateProductPostData = {
          company_id: loginStatus.companyId,
          company_product_id: product.id,
          hsn: createCompanyProductTaxFormData.hsn,
          sac: createCompanyProductTaxFormData.sac,
          tax_rate: createCompanyProductTaxFormData.taxRate,
          valid_from: createCompanyProductTaxFormData.validFrom,
          createdby: loginStatus.id,
        };
        console.log(updateProductPostData);
        await axios
          .post(POST_API.CREATE_PRODUCT_TAX, updateProductPostData, {
            withCredentials: BOOLEAN_VALUES.TRUE,
          })
          .then((response) => {
            console.log(response);
            if (
              response.data.status === BOOLEAN_VALUES.TRUE &&
              response.status === STATUS_CODE.OK
            ) {
              showMessageSnackbar({
                message: response.data.message,
                type: "success",
              });
              handleCreateCompanyProductTax(product);

              setTimeout(() => {
                onClose();
                
              }, 2000);
            }
            else if(response.status === STATUS_CODE.OK && !response.data.status){
                  showMessageSnackbar({message:response.data.message,type : "error"});
                  setIsDialogueOpen(BOOLEAN_VALUES.FALSE)
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch(async (error: ApiError | any) => {
            console.log(error);
            if (error.status === STATUS_CODE.UNATHORISED) {
              const refreshTokenResponse = await RefreshToken({
                callFunctionWithEvent: hanldeUpdateCompanyProductFormSubmit,
              });
              if(refreshTokenResponse){
                  setIsDialogueOpen(BOOLEAN_VALUES.FALSE)
              }
              else{
                setIsDialogueOpen(BOOLEAN_VALUES.TRUE)
              }
            }
            else if(error.status === STATUS_CODE.FORBIDDEN){
              setIsDialogueOpen(BOOLEAN_VALUES.TRUE)
            }
            
          });
      }
    } else {
      showMessageSnackbar({
        message: MESSAGE.ERROR.REQUIRED_FIELDS,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({
        hsn: STRING_VALUES.EMPTY_STRING,
        sac: STRING_VALUES.EMPTY_STRING,
        taxRate: STRING_VALUES.EMPTY_STRING,
        validFrom: STRING_VALUES.EMPTY_STRING,
      });
      handleCloseSnackbar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!isOpen) return null;

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className=" bg-slate-50 rounded-lg shadow-xl w-full relative animate-fadeIn px-3 ">

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Create Tax For : {product.name}
              </h2>
              <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-900 hover:text-gray-600"
          >
            <X size={SIZE.TWENTY} />
          </button>
            </div>

            <form
              className="space-y-2"
              onSubmit={hanldeUpdateCompanyProductFormSubmit}
            >
              <RadioButtons
                options={ProductsRadioButtonOptions}
                onChange={handleTaxRadioButtonChange}
              />

              {(selectedTaxCode === TAX_CODE.HSN ||
                selectedTaxCode === STRING_VALUES.EMPTY_STRING) && (
                <FormInput
                  label="HSN : "
                  type="text"
                  name="hsn"
                  value={createCompanyProductTaxFormData.hsn}
                  placeholder="Enter HSN Code"
                  onChange={handleCreateCompanyProductTaxChange}
                  onBlur={handleBlur}
                  error={errors.hsn}
                />
              )}

              {selectedTaxCode === TAX_CODE.SAC && (
                <FormInput
                  label="SAC : "
                  type="text"
                  name="sac"
                  value={createCompanyProductTaxFormData.sac}
                  placeholder="Enter SAC Code"
                  onChange={handleCreateCompanyProductTaxChange}
                  onBlur={handleBlur}
                  error={errors.sac}
                />
              )}

              <FormInput
                label="Tax Rate : "
                type="text"
                name="taxRate"
                placeholder="Enter Product Cost"
                value={createCompanyProductTaxFormData.taxRate.toString()}
                onChange={handleCreateCompanyProductTaxChange}
                onBlur={handleBlur}
                error={errors.taxRate}
              />

              <DatePickerInput
                label="Valid From :"
                name="validFrom"
                value={createCompanyProductTaxFormData.validFrom}
                placeholder="Select Date"
                onChange={handleCreateCompanyProductTaxChange}
                onBlur={handleBlur}
                error={errors.validFrom}
              />
              <div className="flex justify-center">
                <div className="max-w-80 min-w-72">
                <Button type="submit">Create Product Tax</Button>
                </div>
              </div>
            </form>
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
       <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(BOOLEAN_VALUES.FALSE)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      /> 
    </>
  );
}

export default CreateCompanyProductTax;
