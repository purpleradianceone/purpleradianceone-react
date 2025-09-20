import { EditIcon, Save, X } from "lucide-react";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import {
  SIZE,
  STATUS_CODE,
  TAX_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
// import {
//   MessageSnackbarState,
//   ShowMessageSnackbarProps,
// } from "../../../@types/ui/MessageSnackbarProps";
import MESSAGE from "../../../constants/Messages";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import CreateCompanyProductTaxModalProps from "../../../@types/modal/CreateCompanyProductTaxModalProps";
import RadioButtons from "../../ui/RadioButton";
import { ProductsRadioButtonOptions } from "../../../constants/TestData";
import DatePickerInput from "../../ui/DatePickerInput";
import useScreenSize from "../../../config/hooks/useScreenSize";
import toast from "react-hot-toast";

function CreateCompanyProductTaxModal({
  isOpen,
  onClose,
  product,
  handleCreateCompanyProductTax,
}: CreateCompanyProductTaxModalProps) {
  const intialCreateCompanyProductFormData = {
    hsn: "",
    sac: "",
    taxRate: 0,
    validFrom: "",
  };

  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToAddProductTax } = useUserAccessModules();
  const { isSmallScreen } = useScreenSize();

  const [selectedTaxCode, setSelectedTaxCode] = useState<string>("");

  // const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
  //   open: false,
  //   message: "",
  //   type: "success" as "success" | "error",
  // });

  const {
    formData: createCompanyProductTaxFormData,
    handleChange: handleCreateCompanyProductTaxChange,
  } = useFormChange(intialCreateCompanyProductFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    createCompanyProductTaxFormData,
    "registration"
  );

  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleCloseSnackbar = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };

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
      createCompanyProductTaxFormData.taxRate !== 0 &&
      createCompanyProductTaxFormData.validFrom !== "" &&
      (createCompanyProductTaxFormData.hsn !== "" ||
        createCompanyProductTaxFormData.sac !== "")
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
        await axios
          .post(POST_API.CREATE_PRODUCT_TAX, updateProductPostData, {
            withCredentials: true,
          })
          .then((response) => {
            if (
              response.data.status === true &&
              response.status === STATUS_CODE.OK
            ) {
              toast.success(response.data.message);
              handleCreateCompanyProductTax(product);
              setTimeout(() => {
                onClose();
              }, 2000);
            } else if (
              response.status === STATUS_CODE.OK &&
              !response.data.status
            ) {
              toast.error(response.data.message);
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch(async (error: ApiError | any) => {
            if (error.status === STATUS_CODE.UNATHORISED) {
              const refreshTokenResponse = await RefreshToken({
                callFunctionWithEvent: hanldeUpdateCompanyProductFormSubmit,
              });
              if (refreshTokenResponse) {
                hanldeUpdateCompanyProductFormSubmit(event);
              }
            }
          });
      }
    } else {
      toast.error(MESSAGE.ERROR.REQUIRED_FIELDS)
    }
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({
        hsn: "",
        sac: "",
        taxRate: "",
        validFrom: "",
      });
      // handleCloseSnackbar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!isOpen) return null;

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div
          className={
            isSmallScreen
              ? "bg-slate-50 rounded-lg shadow-xl w-full relative animate-fadeIn "
              : "bg-slate-50 rounded-lg shadow-xl w-full relative animate-fadeIn px-3 "
          }
        >
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
              {(selectedTaxCode === TAX_CODE.HSN || selectedTaxCode === "") && (
                <FormInput
                  label="HSN : "
                  type="text"
                  name="hsn"
                  value={createCompanyProductTaxFormData.hsn}
                  placeholder="Enter HSN Code"
                  onChange={handleCreateCompanyProductTaxChange}
                  onBlur={handleBlur}
                  required={true}
                  error={errors.hsn}
                />
              )}

              {selectedTaxCode === TAX_CODE.SAC && (
                <FormInput
                  label="SAC : "
                  type="text"
                  name="sac"
                  required={true}
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
                required={true}
                placeholder="Enter Product Cost"
                value={createCompanyProductTaxFormData.taxRate.toString()}
                onChange={handleCreateCompanyProductTaxChange}
                onBlur={handleBlur}
                error={errors.taxRate}
              />

              <DatePickerInput
                label="Valid From :"
                name="validFrom"
                required={true}
                value={createCompanyProductTaxFormData.validFrom}
                placeholder="Select Date"
                onChange={handleCreateCompanyProductTaxChange}
                onBlur={handleBlur}
                error={errors.validFrom}
              />
              <div className="flex justify-end gap-2">
                <div >
                  <Button
                  onClick={onClose}
                  >
                  
                  <div className="flex items-center justify-center gap-1">
                    <X size={16} />
                    Close
                  </div>
                  </Button>
                </div>
                <div >
                  <Button type="submit">
                    
                  <div className="flex items-center justify-center gap-1">
                    <Save size={16} />
                    Save
                  </div>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateCompanyProductTaxModal;
