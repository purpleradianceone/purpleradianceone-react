/* eslint-disable react-hooks/exhaustive-deps */
import { ClipboardPlus, EditIcon, X } from "lucide-react";
import EditCompanyProductModalProps from "../../../@types/modal/EditCompanyProductModal";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import {
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import MessageSnackBar from "../../ui/MessageSnackbar";
// import { DialogueBox } from "../../dialogue-box/Dialogue";
import TextAreaInput from "../../ui/TextAreaInput";
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
import RadioButtons from "../../ui/RadioButton";
import CreateCompanyProductTaxModal from "./CreateCompanyProductTaxModal";
import { CLASS_NAMES } from "../../../constants/ClassNames";
import ProductTaxManagementAgGrid from "../../ag-grid/ProductTaxManagementAgGrrid";
import ProductTax from "../../../@types/products/ProductTaxManagementProps";
import { Product } from "../../../@types/products/ProductsManagementProps";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import useScreenSize from "../../../config/hooks/useScreenSize";
import CreateCompanyProductCompanyUserModal from "./CreateCompanyProductCompanyUserModal";

function EditCompanyProductModal({
  isOpen,
  onClose,
  product,
  handleCompanyProductChange,
  handleCreateCompanyProductTaxAdd,
}: EditCompanyProductModalProps) {
  const intialEditCompanyProductFormData = {
    name: product.name,
    description: product.description,
    cost: product.cost,
    code: product.code,
    isActive: product.isActive,
  };

  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateProduct } = useUserAccessModules();

  const {isSmallScreen} = useScreenSize();

  const [companyProductTax,setCompanyProductTax] = useState<ProductTax[]>([]);
  const [companyProductTaxChangeCount,setCompanyProductTaxChangeCount] = useState<number>(0);

  const [
    isCreateCompanyProductTaxModalOpen,
    setIsCreateCompanyProductTaxModalOpen,
  ] = useState<boolean>(false);

  const [isCreateCompanyProductCompanyUserModalOpen,setIsCreateCompanyProductCompanyUserModalOpen] = useState<boolean>(false);


  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const CompanyProductIsActiveRadioButtonOptions = [
    {
      label: "Active",
      value: "true",
      id: "active",
      name: "isActive",
      checked: intialEditCompanyProductFormData.isActive,
    },
    {
      label: "Inactive",
      value: "false",
      id: "inActive",
      name: "isActive",
      checked: !intialEditCompanyProductFormData.isActive,
    },
  ];

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    false
  );
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const handleCreateCompanyProductTaxModalOpen = (status: boolean) => {
    setIsCreateCompanyProductTaxModalOpen(status);
  };

  const {
    formData: updateCompanyProductFormData,
    handleChange: handleEditCompanyProductFormDataChange,
  } = useFormChange(intialEditCompanyProductFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    updateCompanyProductFormData,
    "registration"
  );
  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCompanyProductTaxChange = (status : boolean) => {
    if(status){
      setCompanyProductTaxChangeCount((prev) => prev + 1);
    }
  }

  const handleCreateCompanyProductTax = (product : Product) => {
    handleCreateCompanyProductTaxAdd(product)
    setCompanyProductTaxChangeCount((prev) => prev + 1);
  }


  const hanldeUpdateCompanyProductFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      updateCompanyProductFormData.name !== "" &&
      updateCompanyProductFormData.description !== "" &&
      updateCompanyProductFormData.code !== ""
    ) {
      if (
        updateCompanyProductFormData.code !==
          intialEditCompanyProductFormData.code ||
        updateCompanyProductFormData.name !==
          intialEditCompanyProductFormData.name ||
        updateCompanyProductFormData.description !==
          intialEditCompanyProductFormData.description ||
        updateCompanyProductFormData.cost !==
          intialEditCompanyProductFormData.cost ||
          updateCompanyProductFormData.isActive !== 
          product.isActive
      ) {
        if (userHasAccessToUpdateProduct) {
          const updateProductPostData = {
            company_id: loginStatus.companyId,
            id: product.id,
            name: updateCompanyProductFormData.name,
            code: updateCompanyProductFormData.code,
            cost: updateCompanyProductFormData.cost,
            description: updateCompanyProductFormData.description,
            isactive: updateCompanyProductFormData.isActive,
            updatedby: loginStatus.id,
          };
          await axios
            .put(POST_API.UPDATE_PRODUCT, updateProductPostData, {
              withCredentials: true,
            })
            .then((response) => {
              if (
                response.data.status === true &&
                response.status === STATUS_CODE.OK
              ) {
                showMessageSnackbar({
                  message: response.data.message,
                  type: "success",
                });
                handleCompanyProductChange(product);
                setIsDialogueOpen(false);
                setTimeout(() => {
                  onClose();
                  setIsCreateCompanyProductTaxModalOpen(false)
                }, 2000);
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async (error: ApiError | any) => {
              if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenResponse = await RefreshToken({
                  callFunctionWithEvent: hanldeUpdateCompanyProductFormSubmit,
                });
                if(refreshTokenResponse){
                  setIsDialogueOpen(false)
                }
                else{
                  setIsDialogueOpen(  true)
                }
              }
              else if(error.status === STATUS_CODE.FORBIDDEN){
                setIsDialogueOpen(true)
              }
            });
        }

        handleCompanyProductChange(product);
      } else {
        showMessageSnackbar({
          message: MESSAGE.ERROR.NO_CHANGES,
          type: "error",
        });
      }
    } else {
      showMessageSnackbar({
        message: MESSAGE.ERROR.REQUIRED_FIELDS,
        type: "error",
      });
    }
  };

  const fetchCompanyroductTax = async () => {
    if(isOpen){
      const getProductTaxPostData = {
        company_id : loginStatus.companyId,
        company_product_id : product.id,
        requestedby : loginStatus.id,
      }

      await axios.post(POST_API.GET_PRODUCT_TAX,getProductTaxPostData , {
        withCredentials : true
      })
      .then((response) => {
        setCompanyProductTax([]);
        if(response.data &&
          response.status === STATUS_CODE.OK){
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           response.data.map((res : any) => (
            
            setCompanyProductTax(
              (prev) => [...prev, {
                id : res.id,
                companyProductId:res.company_product_id,
                hsn : res.hsn,
                sac : res.sac,
                taxRate : res.tax_rate,
                validFrom : res.valid_from,
                createdBy : res.createdby,
                createdOn : res.createdon,
                updatedBy : res.updatedby,
                updatedOn : res.updatedon, 
              }]
            )
          )
        )
          }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error : ApiError | any) => {
        if(error.status === STATUS_CODE.UNATHORISED){
          const refreshTokenResponse = await RefreshToken({callFunction :fetchCompanyroductTax})
          if(refreshTokenResponse){
            setIsDialogueOpen(false)
          }
          else{
            setIsDialogueOpen(true)
          }
        }
        else if(error.status === STATUS_CODE.FORBIDDEN){
          setIsDialogueOpen(true)
        }
      });
    }
  }  

  useEffect(() => {
    if (isOpen) {
      setErrors({
        code: "",
        description: "",
        name: "",
      });
      handleMessageSnackbarClose();
      fetchCompanyroductTax();
    }
    else{
      setCompanyProductTax([]);
    }
  }, [companyProductTaxChangeCount,isOpen]);

  if (!isOpen) return null;

  return (
    <div className={isSmallScreen ? "fixed inset-0 z-50 pl-20 pt-10 overflow-hidden bg-black bg-opacity-45" : "fixed inset-0 z-50 p-16 overflow-hidden bg-black bg-opacity-45"}>
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
         

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 sticky bg-white z-10 py-2">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Edit {product.name}
              </h2>
              <button
            onClick={() => {
              onClose();
              setIsCreateCompanyProductTaxModalOpen(false)
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X size={SIZE.TWENTY} />
          </button>
            </div>

            <form
              className="space-y-2"
              onSubmit={hanldeUpdateCompanyProductFormSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Product Name : "
                  type="text"
                  name="name"
                  value={updateCompanyProductFormData.name}
                  placeholder="Enter Product Name"
                  defaultValue={intialEditCompanyProductFormData.name}
                  maxLength={256}
                  onChange={handleEditCompanyProductFormDataChange}
                  error={errors.name}
                  onBlur={handleBlur}
                />
                <FormInput
                  label="Item Code : "
                  type="text"
                  name="code"
                  placeholder="Enter Item Code"
                  onChange={handleEditCompanyProductFormDataChange}
                  defaultValue={intialEditCompanyProductFormData.code}
                  onBlur={handleBlur}
                  error={errors.code}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Cost : "
                  type="text"
                  name="cost"
                  placeholder="Enter Product Cost"
                  defaultValue={intialEditCompanyProductFormData.cost}
                  onChange={handleEditCompanyProductFormDataChange}
                />

                <RadioButtons
                  label="IsActive : "
                  onChange={handleEditCompanyProductFormDataChange}
                  options={CompanyProductIsActiveRadioButtonOptions}
                />
              </div>

              <div className="grid gap-4">
              <TextAreaInput
                label="Description : "
                cols={5}
                rows={3}
                name="description"
                placeholder="Enter Product Description"
                defaultValue={intialEditCompanyProductFormData.description}
                onChange={handleEditCompanyProductFormDataChange}
                onBlur={handleBlur}
                error={errors.description}
              />
              </div>

              <div className="flex justify-self-center m-2 min-w-80 gap-2">
                <Button type="submit">Update Product</Button>
               
              </div>
            </form>

            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-full h-1 mx-auto my-4 border-0 rounded-sm md:my-10 bg-gray-700" />
              <span className="absolute px-3 text-xl font-semibold text-gray-800 -translate-x-1/2 bg-white left-1/2">
                Product Tax
              </span>
            </div>
            <div className={isSmallScreen ? "flex justify-self-end max-w-full px-2 mb-2" : "flex justify-self-end max-w-36 m-3"}>
              <Button
                type="button"
                onClick={() => {
                  handleCreateCompanyProductTaxModalOpen(true);
                }}
              >
                <ClipboardPlus
                  className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                ></ClipboardPlus>
                Add TAX
              </Button>
              
            </div>

            

            {isCreateCompanyProductTaxModalOpen && (
              <div className={isSmallScreen ? "flex justify-center items-center min-w-full" : "flex justify-center items-center min-w-fit"}>
                <CreateCompanyProductTaxModal
                  isOpen={isCreateCompanyProductTaxModalOpen}
                  handleCreateCompanyProductTax={handleCreateCompanyProductTax}
                  onClose={() => {
                    setIsCreateCompanyProductTaxModalOpen(false);
                  }}
                  product={product}
                />
              </div>
            )}

            <CreateCompanyProductCompanyUserModal
            isOpen={isCreateCompanyProductCompanyUserModalOpen}
            onClose={()=> {
              setIsCreateCompanyProductCompanyUserModalOpen(false)
              
            }}
            product={product}
            />


<div className="bg-white overflow-y-auto rounded-lg shadow-sm pb-6">
          <div
            className="ag-theme-alpine w-full"
            style={{ height: "440px", width: "100%" }}
          >
            <ProductTaxManagementAgGrid productTax={companyProductTax} 
              handleCompanyProductTaxChange={handleCompanyProductTaxChange}
            />
          </div>
        </div>
          </div>
        </div>
        <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        />
      </div>
      <DialogueBox
              isOpen={isDialogueOpen}
              onClose={() => setIsDialogueOpen(false)}
              onConfirm={handleDialogueConfirm}
              title="Session Expired !"
              message="Session Expired. Please login again."
            /> 
    </div>
  );
}

export default EditCompanyProductModal;
