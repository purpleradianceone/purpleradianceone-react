/* eslint-disable react-hooks/exhaustive-deps */
import { ClipboardPlus, EditIcon, X } from "lucide-react";
import EditCompanyProductModalProps from "../../../@types/modal/EditCompanyProductModal";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
// import MessageSnackBar from "../../ui/MessageSnackbar";
import TextAreaInput from "../../ui/TextAreaInput";
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
import CreateCompanyProductTaxModal from "./CreateCompanyProductTaxModal";
import { CLASS_NAMES } from "../../../constants/ClassNames";
import ProductTaxManagementAgGrid from "../../ag-grid/ProductTaxManagementAgGrrid";
import ProductTax from "../../../@types/products/ProductTaxManagementProps";
import { Product } from "../../../@types/products/ProductsManagementProps";
import useScreenSize from "../../../config/hooks/useScreenSize";
import CreateCompanyProductCompanyUserModal from "./CreateCompanyProductCompanyUserModal";
import toast from "react-hot-toast";
import CustomDropdown from "../leads/CustomDropdown";
import { useIntervalType } from "../../../config/hooks/useIntervalType";
import { useProductType } from "../../../config/hooks/useProductTypes";
import { Item, range } from "../../../constants/NumberList";

function EditCompanyProductModal({
  isOpen,
  onClose,
  product,
  handleCompanyProductChange,
  handleCreateCompanyProductTaxAdd,
}: EditCompanyProductModalProps) {
  const { intervalTypeData } = useIntervalType();
  const { productTypeData } = useProductType();
    const rangeOfNumber: Item[] = range(1, 365);
  

  const intialEditCompanyProductFormData = {
    company_id: product.companyId,
    id: product.id,
    product_type_id: product.productTypeId,
    default_warranty_interval_type_id: product.defaultWarrantyIntervalTypeId,
    default_warranty: product.defaultWarranty,
    default_amc_cycle_interval_type_id: product.defaultAmcCycleIntervalTypeId,
    default_amc_cycle: product.defaultAmcCycle,
    name: product.name,
    cost: product.cost,
    code: product.code,
    description: product.description,
    version: product.version,
    url: product.url,
    isActive: product.isActive,
  };

  const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>(0);

  const [selectedWarrantyIntervalTypeId, setWarrantyIntervalTypeId] =
    useState<number>(0);

  const [selectedDefaultWarranty, setDefaultWarranty] = useState<number>(0);

  const [selectedAmcIntervalTypeId, setAmcIntervalTypeId] = useState<number>(0);

  const [selectedDefaultAmc, setDefaultAmc] = useState<number>(0);

  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateProduct } = useUserAccessModules();

  const { isSmallScreen } = useScreenSize();

  const [companyProductTax, setCompanyProductTax] = useState<ProductTax[]>([]);
  const [companyProductTaxChangeCount, setCompanyProductTaxChangeCount] =
    useState<number>(0);

  const [
    isCreateCompanyProductTaxModalOpen,
    setIsCreateCompanyProductTaxModalOpen,
  ] = useState<boolean>(false);

  const [
    isCreateCompanyProductCompanyUserModalOpen,
    setIsCreateCompanyProductCompanyUserModalOpen,
  ] = useState<boolean>(false);

  // const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
  //   open: false,
  //   message: "",
  //   type: "success" as "success" | "error",
  // });



  const handleCreateCompanyProductTaxModalOpen = (status: boolean) => {
    setIsCreateCompanyProductTaxModalOpen(status);
  };

  const {
    formData: updateCompanyProductFormData,
    handleChange: handleEditCompanyProductFormDataChange,
  } = useFormChange(intialEditCompanyProductFormData);

    const [productIsActive, setProductIsActive] = useState<boolean>(product.isActive);
  

    useEffect(()=>{
      if(isOpen){
      setProductIsActive(product.isActive);
      }
    },[isOpen])

  const handleProductToggle = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // handleCloseSnackbar();
    const { checked } = event.target;

    if (userHasAccessToUpdateProduct) {
          const updateProductPostData = {
            company_id: loginStatus.companyId,
            id: product.id,
            isactive: checked,
            updatedby_id: loginStatus.id,
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
                
                toast.success(response.data.message);
                setProductIsActive(checked);
                handleCompanyProductChange(product);
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async (error: ApiError | any) => {
              if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenResponse = await RefreshToken({
                  callFunctionWithEvent: handleProductToggle,
                });
                if (refreshTokenResponse) {
                  handleProductToggle(event);
                }
              }
            });
          handleCompanyProductChange(product);
        } else {
          toast.error(
            MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT.DENIED_UPDATE_ACCESS
          );
        }
  };

  const { errors, handleBlur, setErrors } = useFormValidation(
    updateCompanyProductFormData,
    "registration"
  );
  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleMessageSnackbarClose = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };

  const handleCompanyProductTaxChange = (status: boolean) => {
    if (status) {
      setCompanyProductTaxChangeCount((prev) => prev + 1);
    }
  };

  const handleCreateCompanyProductTax = (product: Product) => {
    handleCreateCompanyProductTaxAdd(product);
    setCompanyProductTaxChangeCount((prev) => prev + 1);
  };

  const hanldeUpdateCompanyProductFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (updateCompanyProductFormData.name !== "") {
      if (
        updateCompanyProductFormData.code !==
          intialEditCompanyProductFormData.code ||
        updateCompanyProductFormData.name !==
          intialEditCompanyProductFormData.name ||
        updateCompanyProductFormData.description !==
          intialEditCompanyProductFormData.description ||
        updateCompanyProductFormData.cost !==
          intialEditCompanyProductFormData.cost ||
        
        (selectedProductTypeId !== 0 &&
          selectedProductTypeId !==
            intialEditCompanyProductFormData.product_type_id) ||
        (selectedWarrantyIntervalTypeId !== 0 &&
          selectedWarrantyIntervalTypeId !==
            intialEditCompanyProductFormData.default_warranty_interval_type_id) ||
        (selectedDefaultWarranty !== 0 &&
          selectedDefaultWarranty !==
            intialEditCompanyProductFormData.default_warranty) ||
        (selectedAmcIntervalTypeId !== 0 &&
          selectedAmcIntervalTypeId !==
            intialEditCompanyProductFormData.default_amc_cycle_interval_type_id) ||
        (selectedDefaultAmc !== 0 &&
          selectedDefaultAmc !==
            intialEditCompanyProductFormData.default_amc_cycle) ||
        updateCompanyProductFormData.version !==
          intialEditCompanyProductFormData.version ||
        updateCompanyProductFormData.url !==
          intialEditCompanyProductFormData.url
      ) {
        if (userHasAccessToUpdateProduct) {
          const updateProductPostData = {
            company_id: loginStatus.companyId,
            id: product.id,
            product_type_id:
              selectedProductTypeId !== 0
                ? selectedProductTypeId
                : updateCompanyProductFormData.product_type_id,
            default_warranty_interval_type_id:
              selectedWarrantyIntervalTypeId !== 0
                ? selectedWarrantyIntervalTypeId
                : updateCompanyProductFormData.default_amc_cycle_interval_type_id,
            default_warranty:
              selectedDefaultWarranty !== 0
                ? selectedDefaultWarranty
                : updateCompanyProductFormData.default_warranty,
            default_amc_cycle_interval_type_id:
              selectedAmcIntervalTypeId != 0
                ? selectedAmcIntervalTypeId
                : updateCompanyProductFormData.default_amc_cycle_interval_type_id,
            default_amc_cycle:
              selectedDefaultAmc !== 0
                ? selectedDefaultAmc
                : updateCompanyProductFormData.default_amc_cycle,
            name: updateCompanyProductFormData.name,
            code: updateCompanyProductFormData.code,
            cost: updateCompanyProductFormData.cost,
            description: updateCompanyProductFormData.description,
            version: updateCompanyProductFormData.version,
            url: updateCompanyProductFormData.url,
            updatedby_id: loginStatus.id,
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
                // showMessageSnackbar({
                //   message: response.data.message,
                //   type: "success",
                // });
                toast.success(response.data.message);
                handleCompanyProductChange(product);
                setTimeout(() => {
                  onClose();
                  setIsCreateCompanyProductTaxModalOpen(false);
                }, 500);
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
          handleCompanyProductChange(product);
        } else {
          toast.error(
            MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT.DENIED_UPDATE_ACCESS
          );
        }
      } else {
        // showMessageSnackbar({
        //   message: MESSAGE.ERROR.NO_CHANGES,
        //   type: "error",
        // });
        toast.error(MESSAGE.ERROR.NO_CHANGES);
      }
    } else {
      // showMessageSnackbar({
      //   message: MESSAGE.ERROR.REQUIRED_FIELDS,
      //   type: "error",
      // });
      toast.error(MESSAGE.ERROR.REQUIRED_FIELDS);
    }
  };

  const fetchCompanyroductTax = async () => {
    if (isOpen) {
      const getProductTaxPostData = {
        company_id: loginStatus.companyId,
        company_product_id: product.id,
        requestedby: loginStatus.id,
      };

      await axios
        .post(POST_API.GET_PRODUCT_TAX, getProductTaxPostData, {
          withCredentials: true,
        })
        .then((response) => {
          setCompanyProductTax([]);
          if (response.data && response.status === STATUS_CODE.OK) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.data.map((res: any) =>
              setCompanyProductTax((prev) => [
                ...prev,
                {
                  id: res.id,
                  companyProductId: res.company_product_id,
                  hsn: res.hsn,
                  sac: res.sac,
                  taxRate: res.tax_rate,
                  validFrom: res.valid_from,
                  createdBy: res.createdby,
                  createdOn: res.createdon,
                  updatedBy: res.updatedby,
                  updatedOn: res.updatedon,
                },
              ])
            );
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: fetchCompanyroductTax,
            });
            if (refreshTokenResponse) {
              fetchCompanyroductTax();
            }
          }
        });
    }
  };

  useEffect(() => {
    console.log(intialEditCompanyProductFormData);
    if (isOpen) {
      setErrors({
        code: "",
        description: "",
        name: "",
      });
      // handleMessageSnackbarClose();
      fetchCompanyroductTax();
    } else {
      setCompanyProductTax([]);
    }
  }, [companyProductTaxChangeCount, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pl-20 pt-10 overflow-hidden bg-black bg-opacity-45"
          : "fixed inset-0 z-50 p-10 overflow-hidden bg-black bg-opacity-45"
      }
    >
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-4">
            <div className="flex items-center border-b gap-3 mb-2 sticky bg-white z-10 ">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Edit {product.name}
              </h2>
              <button
                onClick={() => {
                  onClose();
                  setIsCreateCompanyProductTaxModalOpen(false);
                }}
                className="absolute right-1 top-2 text-gray-400 hover:text-gray-600 z-10"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>

            <form
              className="space-y-2"
              onSubmit={hanldeUpdateCompanyProductFormSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid col-span-1 ">
                  <FormInput
                    label="Product Name : "
                    type="text"
                    name="name"
                    required={true}
                    value={updateCompanyProductFormData.name}
                    placeholder="Enter Product Name"
                    defaultValue={intialEditCompanyProductFormData.name}
                    maxLength={256}
                    onChange={handleEditCompanyProductFormDataChange}
                    error={errors.name}
                    onBlur={handleBlur}
                  />
                  <FormInput
                    label="URL : "
                    type="text"
                    name="url"
                    required={false}
                    defaultValue={intialEditCompanyProductFormData.url}
                    value={intialEditCompanyProductFormData.url}
                    placeholder="Product URL"
                    onChange={handleEditCompanyProductFormDataChange}
                    onBlur={handleBlur}
                    error={errors.url}
                  />

                  <FormInput
                    label="Version : "
                    type="text"
                    name="version"
                    max={20}
                    required={false}
                    defaultValue={intialEditCompanyProductFormData.version}
                    value={intialEditCompanyProductFormData.version}
                    placeholder="Product Version"
                    onChange={handleEditCompanyProductFormDataChange}
                    onBlur={handleBlur}
                  />
                  <TextAreaInput
                    label="Description : "
                    cols={5}
                    rows={2}
                    name="description"
                    required={false}
                    placeholder="Enter Product Description"
                    defaultValue={intialEditCompanyProductFormData.description}
                    onChange={handleEditCompanyProductFormDataChange}
                    onBlur={handleBlur}
                    // error={errors.description}
                  />
                </div>

                <div className="grid col-span-1 gap-1">
                  <div className="grid col-span-1 gap-1">
                    <FormInput
                      label="Cost : "
                      type="text"
                      name="cost"
                      placeholder="Enter Product Cost"
                      defaultValue={intialEditCompanyProductFormData.cost}
                      onChange={handleEditCompanyProductFormDataChange}
                    />
                    <FormInput
                      label="Item Code : "
                      type="text"
                      name="code"
                      required={true}
                      placeholder="Enter Item Code"
                      onChange={handleEditCompanyProductFormDataChange}
                      defaultValue={intialEditCompanyProductFormData.code}
                      onBlur={handleBlur}
                      error={errors.code}
                    />
                    <CustomDropdown
                      labelName="Product Type"
                      preselectedOption={
                        intialEditCompanyProductFormData.product_type_id
                      }
                      onSelect={(e) => {
                        if (e) {
                          setSelectedProductTypeId(e);
                        }
                      }}
                      options={productTypeData}
                      requiredRedDot={true}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <CustomDropdown
                      labelName="Warranty Duration"
                      preselectedOption={
                        intialEditCompanyProductFormData.default_warranty
                      }
                      onSelect={(e) => {
                        if (e) {
                          setDefaultWarranty(e);
                        }
                      }}
                      options={rangeOfNumber}
                      requiredRedDot={true}
                    />
                    <CustomDropdown
                      labelName="Warranty Time Unit"
                      preselectedOption={
                        intialEditCompanyProductFormData.default_warranty_interval_type_id
                      }
                      onSelect={(e) => {
                        if (e) {
                          setWarrantyIntervalTypeId(e);
                        }
                      }}
                      options={intervalTypeData}
                      requiredRedDot={true}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <CustomDropdown
                      labelName="AMC Cycle Duration"
                      preselectedOption={
                        intialEditCompanyProductFormData.default_amc_cycle
                      }
                      onSelect={(e) => {
                        if (e) {
                          setDefaultAmc(e);
                        }
                      }}
                      options={rangeOfNumber}
                      requiredRedDot={true}
                    />
                    <CustomDropdown
                      labelName="AMC Time Unit"
                      preselectedOption={
                        intialEditCompanyProductFormData.default_amc_cycle_interval_type_id
                      }
                      onSelect={(e) => {
                        if (e) {
                          setAmcIntervalTypeId(e);
                        }
                      }}
                      options={intervalTypeData}
                      requiredRedDot={true}
                    />
                  </div>
                </div>
              </div>
              <div className="flex col-span-2 justify-start">
                <div className="flex items-center gap-4 justify-start">
                  <label
                    htmlFor="isActive"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status : {productIsActive?"Active":"Inactive"}
                  </label>
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={productIsActive}
                      id="isActive"
                      name="isActive"
                      onChange={handleProductToggle}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
                  </label>
                </div>
              </div>

              <div className="flex justify-self-center m-2 min-w-70 gap-2">
                <Button type="submit">Update Product</Button>
              </div>
            </form>

            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-full h-1 mx-auto my-4 border-0 rounded-sm md:my-10 bg-gray-700" />
              <span className="absolute px-3 text-xl font-semibold text-gray-800 -translate-x-1/2 bg-white left-1/2">
                Product Tax
              </span>
            </div>
            <div
              className={
                isSmallScreen
                  ? "flex justify-self-end max-w-full px-2 mb-2"
                  : "flex justify-self-end max-w-36 m-3"
              }
            >
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
              <div
                className={
                  isSmallScreen
                    ? "flex justify-center items-center min-w-full"
                    : "flex justify-center items-center min-w-fit"
                }
              >
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
              onClose={() => {
                setIsCreateCompanyProductCompanyUserModalOpen(false);
              }}
              product={product}
            />

            <div className="bg-white overflow-y-auto rounded-lg shadow-sm pb-6">
              <div
                className="ag-theme-alpine w-full"
                style={{ height: "440px", width: "100%" }}
              >
                <ProductTaxManagementAgGrid
                  productTax={companyProductTax}
                  handleCompanyProductTaxChange={handleCompanyProductTaxChange}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        /> */}
      </div>
    </div>
  );
}

export default EditCompanyProductModal;
