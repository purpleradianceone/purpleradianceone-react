/* eslint-disable react-hooks/exhaustive-deps */
import {
  CheckCircle2,
  ClipboardPlus,
  EditIcon,
  ListOrdered,
  LucideAirplay,
  LucideClock,
  LucideGroup,
  LucideIndianRupee,
  LucideLink,
  LucidePresentation,
  LucideTimer,
  LucideVerified,
  Save,
  Text,
  X,
  XCircle,
} from "lucide-react";
import EditCompanyProductModalProps from "../../../@types/modal/EditCompanyProductModal";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { STATUS_CODE, VALIDATIONS } from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import TextAreaInput from "../../ui/TextAreaInput";
import React, { useEffect, useState } from "react";
import MESSAGE from "../../../constants/Messages";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import CreateCompanyProductTaxModal from "./CreateCompanyProductTaxModal";
import ProductTaxManagementAgGrid from "../../ag-grid/ProductTaxManagementAgGrrid";
import ProductTax from "../../../@types/products/ProductTaxManagementProps";
import useScreenSize from "../../../config/hooks/useScreenSize";
import CreateCompanyProductCompanyUserModal from "./CreateCompanyProductCompanyUserModal";
import toast from "react-hot-toast";
import CustomDropdown from "../leads/CustomDropdown";
import { useIntervalType } from "../../../config/hooks/useIntervalType";
import { useProductType } from "../../../config/hooks/useProductTypes";
import { Item, range } from "../../../constants/NumberList";
import FormHeader from "../../ui/FormHeader";
import ToggleButton from "../../ui/ToggleButton";
import FormCheckbox from "../../ui/FormCheckbox";
import { useCompanyProductSla } from "../../../config/hooks/useGetCompanyProductSla";
import FormSkeleton from "../Account/FormSkeleton";
import FormLayout from "../../ui/FormLayout";
import { CompanyProductSlaComponent } from "./CompanyProductSla";
import useUnit from "../../../config/hooks/useUnit";
import axiosClient from "../../../axios-client/AxiosClient";

function EditCompanyProductModal({
  isOpen,
  onClose,
  product,
  handleCompanyProductChange,
  handleCreateCompanyProductTaxAdd,
}: EditCompanyProductModalProps) {
  const { intervalTypeData, loading: intervalTypeDataLoading } =
    useIntervalType();
  const { productTypeData, loading: productTypeLoading } = useProductType();
  const { loading: unitDataLoading, unit: unitData } = useUnit();
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
    barcode: product.barcode,
    description: product.description,
    version: product.version,
    url: product.url,
    isActive: product.isActive,
    isSerialNumber: product.isSerialNumber,
    unitId: product.unitId,
    minimumStock: product.minimumStock,
  };

  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | undefined
  >(0);

  const [selectedWarrantyIntervalTypeId, setWarrantyIntervalTypeId] = useState<
    number | undefined
  >(0);

  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(0);

  useEffect(() => {
    setSelectedUnitId(product.unitId);
  }, [product]);

  const [selectedDefaultWarranty, setDefaultWarranty] = useState<
    number | undefined
  >(0);

  const [selectedAmcIntervalTypeId, setAmcIntervalTypeId] = useState<
    number | undefined
  >(0);

  const [selectedDefaultAmc, setDefaultAmc] = useState<number | undefined>(0);

  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateProduct } = useUserAccessModules();

  const { isSmallScreen } = useScreenSize();

  const {
    companyProductSla: companyProductSlaData,
    refetch: refreshCompanyProductSlaData,
  } = useCompanyProductSla(product.id!);

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

  const handleCreateCompanyProductTaxModalOpen = (status: boolean) => {
    setIsCreateCompanyProductTaxModalOpen(status);
  };

  const {
    formData: updateCompanyProductFormData,
    handleChange: handleEditCompanyProductFormDataChange,
  } = useFormChange(intialEditCompanyProductFormData);

  const [productIsActive, setProductIsActive] = useState<boolean>(
    product.isActive,
  );

  useEffect(() => {
    if (isOpen) {
      setProductIsActive(product.isActive);
    }
  }, [isOpen]);

  const handleProductToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
            handleCompanyProductChange();
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
    } else {
      toast.error(
        MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT.DENIED_UPDATE_ACCESS,
      );
    }
  };

  const { errors, handleBlur, setErrors } = useFormValidation(
    updateCompanyProductFormData,
    "registration",
  );

  const [selectedProductTypeIdError, setSelectedProductTypeIdError] =
    useState<boolean>(false);

  const [selectedUnitIdError, setSelectedUnitIdError] =
    useState<boolean>(false);

  const [isSerialNumberChecked, setIsSerialNumberChecked] = useState<boolean>(
    product.isSerialNumber!,
  );

  const validateDropdown = (): boolean => {
    const isProductTypeInvalid =
      selectedProductTypeId === 0 || selectedProductTypeId === undefined;

    const isUnitInvalid = selectedUnitId === 0 || selectedUnitId === undefined;

    setSelectedProductTypeIdError(isProductTypeInvalid);
    setSelectedUnitIdError(isUnitInvalid);

    return !isProductTypeInvalid && !isUnitInvalid;
  };

  const handleCompanyProductTaxChange = () => {
    handleCompanyProductChange();
    setCompanyProductTaxChangeCount((prev) => prev + 1);
  };

  const handleCreateCompanyProductTax = () => {
    handleCreateCompanyProductTaxAdd();
    setCompanyProductTaxChangeCount((prev) => prev + 1);
  };

  function validate() {
    // Validation the minimum stock field here also before the api call
    if (
      updateCompanyProductFormData.minimumStock == 0 ||
      updateCompanyProductFormData.minimumStock == null ||
      updateCompanyProductFormData.minimumStock === undefined
    ) {
      setErrors((prev) => ({
        ...prev,
        mininumStock: "minimum stock is required.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        mininumStock: "",
      }));
    }
    if (errors.url) {
      toast.error(MESSAGE.ERROR.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }
  const hanldeUpdateCompanyProductFormSubmit = async () => {
    // event.preventDefault();
    const isvalid = validate();
    // alert(JSON.stringify(updateCompanyProductFormData, null, 2));
    if (!isvalid) return;
    if (!validateDropdown()) return;
    if (
      updateCompanyProductFormData.name !== "" &&
      updateCompanyProductFormData.name !== null &&
      updateCompanyProductFormData.name !== undefined &&
      updateCompanyProductFormData.version !== "" &&
      updateCompanyProductFormData.version !== null &&
      updateCompanyProductFormData.version !== undefined &&
      selectedProductTypeId !== 0 &&
      selectedProductTypeId !== undefined &&
      updateCompanyProductFormData.minimumStock !== null &&
      updateCompanyProductFormData.minimumStock !== undefined &&
      updateCompanyProductFormData.minimumStock != 0
      // selectedWarrantyIntervalTypeId !== 0 &&
      // selectedWarrantyIntervalTypeId !== undefined &&
      // selectedDefaultWarranty !== 0 &&
      // selectedDefaultWarranty !== undefined &&
      // selectedAmcIntervalTypeId !== 0 &&
      // selectedAmcIntervalTypeId !== undefined &&
      // selectedDefaultAmc !== 0 &&
      // selectedDefaultAmc !== undefined
    ) {
      if (
        updateCompanyProductFormData.barcode !==
        intialEditCompanyProductFormData.barcode ||
        updateCompanyProductFormData.name !==
        intialEditCompanyProductFormData.name ||
        updateCompanyProductFormData.description !==
        intialEditCompanyProductFormData.description ||
        updateCompanyProductFormData.cost !==
        intialEditCompanyProductFormData.cost ||
        selectedProductTypeId !==
        intialEditCompanyProductFormData.product_type_id ||
        selectedWarrantyIntervalTypeId !==
        intialEditCompanyProductFormData.default_warranty_interval_type_id ||
        selectedDefaultWarranty !==
        intialEditCompanyProductFormData.default_warranty ||
        selectedAmcIntervalTypeId !==
        intialEditCompanyProductFormData.default_amc_cycle_interval_type_id ||
        selectedDefaultAmc !==
        intialEditCompanyProductFormData.default_amc_cycle ||
        updateCompanyProductFormData.version !==
        intialEditCompanyProductFormData.version ||
        updateCompanyProductFormData.url !==
        intialEditCompanyProductFormData.url ||
        updateCompanyProductFormData.isSerialNumber !== isSerialNumberChecked ||
        selectedUnitId !== intialEditCompanyProductFormData.unitId ||
        updateCompanyProductFormData.minimumStock !==
        Number(intialEditCompanyProductFormData.minimumStock)
      ) {
        if (userHasAccessToUpdateProduct) {
          const updateProductPostData = {
            company_id: loginStatus.companyId,
            id: product.id,
            product_type_id:
              selectedProductTypeId !== 0
                ? selectedProductTypeId
                : updateCompanyProductFormData.product_type_id,
            unit_id:
              selectedUnitId !== 0
                ? selectedUnitId
                : updateCompanyProductFormData.unitId,
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
            barcode: updateCompanyProductFormData.barcode,
            is_serial_number: isSerialNumberChecked,
            cost: updateCompanyProductFormData.cost,
            description: updateCompanyProductFormData.description,
            version: updateCompanyProductFormData.version,
            minimum_stock: Number(updateCompanyProductFormData.minimumStock),
            url: updateCompanyProductFormData.url,
            updatedby_id: loginStatus.id,
          };
          await axiosClient
            .put(POST_API.UPDATE_PRODUCT, updateProductPostData, {
              withCredentials: true,
            })
            .then((response) => {
              if (
                response.data.status === true &&
                response.status === STATUS_CODE.OK
              ) {
                toast.success(response.data.message);
                handleCompanyProductChange();
                setTimeout(() => {
                  onClose();
                  setIsCreateCompanyProductTaxModalOpen(false);
                }, 500);
              } else {
                toast.error(response.data.messge);
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async (error: ApiError | any) => {
              if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenResponse = await RefreshToken({
                  callFunctionWithEvent: hanldeUpdateCompanyProductFormSubmit,
                });
                if (refreshTokenResponse) {
                  hanldeUpdateCompanyProductFormSubmit();
                }
              }
            })
            .finally(() => { });
        } else {
          toast.error(
            MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT.DENIED_UPDATE_ACCESS,
          );
        }
      } else {
        toast.error(MESSAGE.ERROR.NO_CHANGES);
      }
    } else {
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
                  cess: res.cess,
                  validFrom: res.valid_from,
                  createdBy: res.createdby,
                  createdOn: res.createdon,
                  updatedBy: res.updatedby,
                  updatedOn: res.updatedon,
                },
              ]),
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
    if (isOpen) {
      setErrors({
        barcode: "",
        description: "",
        name: "",
        version: "",
      });
      fetchCompanyroductTax();
    } else {
      setCompanyProductTax([]);
    }
  }, [companyProductTaxChangeCount, isOpen]);

  const updateAccountCompanyProductSla = async (
    id: number,
    data: {
      isActive?: boolean;
      expectedResolutionTimeHours?: number;
    },
  ) => {
    const postData = {
      company_id: loginStatus.companyId,
      id: id,
      expected_resolution_time_hours: data.expectedResolutionTimeHours ?? null,
      isactive: data.isActive ?? null,
      updatedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.UPDATE_COMPANY_PRODUCT_SLA, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        refreshCompanyProductSlaData();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithTwoParamsNotEvent: updateAccountCompanyProductSla,
          });
          if (refreshTokenResponse) {
            updateAccountCompanyProductSla(id, data);
          }
        }
      });
  };

  if (!isOpen) return null;

  if (productTypeLoading || intervalTypeDataLoading || unitDataLoading) {
    return (
      <FormLayout width={6}>
        <FormSkeleton></FormSkeleton>
      </FormLayout>
    );
  }
  return (
    <FormLayout width={6}>
      <div className=" grid grid-cols-1 space-y-1">
        <FormHeader
          icon={EditIcon}
          onClose={onClose}
          preText="Edit - "
          userName={product.name || "Name not given"}
          description="Modify product details to keep information accurate and up to date."
        />
        {/* Edit Company product  */}
        <form
          className="space-y-2  border  rounded-md p-1 "
          onSubmit={(e) => {
            e.preventDefault();
            hanldeUpdateCompanyProductFormSubmit();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              label="Product Name : "
              logo={LucidePresentation}
              type="text"
              name="name"
              required={true}
              value={updateCompanyProductFormData.name}
              placeholder="Enter Product Name"
              defaultValue={intialEditCompanyProductFormData.name}
              minLength={VALIDATIONS.MIN_NAME_LENGTH}
              maxLength={VALIDATIONS.MAX_NAME_LENGTH}
              onChange={handleEditCompanyProductFormDataChange}
              error={errors.name}
              onBlur={handleBlur}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="">
                <CustomDropdown
                  logo={LucideClock}
                  labelName="Unit :"
                  preselectedOption={intialEditCompanyProductFormData.unitId}
                  onSelect={(e) => {
                    if (e) {
                      setSelectedUnitIdError(false);
                    }
                    setSelectedUnitId(e);
                  }}
                  options={unitData}
                  readOnly={
                    updateCompanyProductFormData.product_type_id === 3 ||
                    updateCompanyProductFormData.product_type_id === 4
                  }
                />
                {selectedUnitIdError && (
                  <div className="caption-custom-inactive">
                    Unit is required
                  </div>
                )}
              </div>
              <div className="">
                <CustomDropdown
                  labelName="Product Type"
                  logo={LucideGroup}
                  preselectedOption={
                    intialEditCompanyProductFormData.product_type_id
                  }
                  onSelect={(e) => {
                    if (e) {
                      setSelectedProductTypeIdError(false);
                    }

                    setSelectedProductTypeId(e);
                  }}
                  options={productTypeData}
                  requiredRedDot={true}
                  readOnly={
                    updateCompanyProductFormData.product_type_id === 1 ||
                    updateCompanyProductFormData.product_type_id === 2 ||
                    updateCompanyProductFormData.product_type_id === 3 ||
                    updateCompanyProductFormData.product_type_id === 4
                  }
                />
                {selectedProductTypeIdError && (
                  <div className="caption-custom-inactive">
                    Product Type is required
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                logo={LucideIndianRupee}
                label="Cost :"
                type="number"
                min={0}
                name="cost"
                placeholder="Enter Product Cost"
                defaultValue={intialEditCompanyProductFormData.cost}
                onChange={handleEditCompanyProductFormDataChange}
                  step={'0.0001'}  
              />
              {/* Minimum Stock */}
              <FormInput
                label="Minimum Stock : "
                logo={ListOrdered}
                type="number"
                name="minimumStock"
                defaultValue={
                  intialEditCompanyProductFormData.minimumStock == 0
                    ? ""
                    : intialEditCompanyProductFormData.minimumStock
                }
                // value={addProductFormData.minimumStock ===0 ? "" : addProductFormData.minimumStock}
                placeholder="Enter Mininum Stock"
                onChange={handleEditCompanyProductFormDataChange}
                error={errors.mininumStock}
                min={0}
                required={true}
                disabled={
                  updateCompanyProductFormData.product_type_id === 3 ||
                  updateCompanyProductFormData.product_type_id === 4
                }
              />
              <FormInput
                label="Version :"
                logo={LucideVerified}
                type="text"
                name="version"
                max={20}
                defaultValue={intialEditCompanyProductFormData.version}
                // value={intialEditCompanyProductFormData.version}
                placeholder="Product Version"
                onChange={handleEditCompanyProductFormDataChange}
                onBlur={handleBlur}
                required={true}
                error={errors.version}
                disabled={
                  updateCompanyProductFormData.product_type_id === 3 ||
                  updateCompanyProductFormData.product_type_id === 4
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormInput
                label="Barcode :"
                logo={LucideAirplay}
                type="text"
                name="barcode"
                placeholder="Enter Bar Code"
                onChange={handleEditCompanyProductFormDataChange}
                defaultValue={intialEditCompanyProductFormData.barcode}
                onBlur={handleBlur}
              />
              <div className="mt-5">
                <FormCheckbox
                  label="Has Serial number"
                  name="is_serial_number"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setIsSerialNumberChecked(event.target.checked);
                  }}
                  checked={isSerialNumberChecked}
                  disabled={
                    updateCompanyProductFormData.product_type_id === 3 ||
                    updateCompanyProductFormData.product_type_id === 4
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 ">
              <div>
                <CustomDropdown
                  logo={LucideClock}
                  labelName="Warranty Duration :"
                  preselectedOption={
                    intialEditCompanyProductFormData.default_warranty
                  }
                  onSelect={(e) => {
                    setDefaultWarranty(e);
                  }}
                  options={rangeOfNumber}
                  readOnly={
                    updateCompanyProductFormData.product_type_id === 3 ||
                    updateCompanyProductFormData.product_type_id === 4
                  }
                />
              </div>

              <div>
                <CustomDropdown
                  logo={LucideTimer}
                  labelName="Warranty Time Unit :"
                  preselectedOption={
                    intialEditCompanyProductFormData.default_warranty_interval_type_id
                  }
                  onSelect={(e) => {
                    setWarrantyIntervalTypeId(e);
                  }}
                  options={intervalTypeData}
                  // requiredRedDot={true}
                  readOnly={
                    updateCompanyProductFormData.product_type_id === 3 ||
                    updateCompanyProductFormData.product_type_id === 4
                  }
                />
                {/* {selectedWarrantyIntervalTypeIdError && (
                    <div className="caption-custom-inactive">
                      Warranty Time Unit is required
                    </div>
                  )} */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 ">
              <div>
                <CustomDropdown
                  logo={LucideClock}
                  labelName="AMC Cycle Duration :"
                  preselectedOption={
                    intialEditCompanyProductFormData.default_amc_cycle
                  }
                  onSelect={(e) => {
                    // if (e) {
                    //   setSelectedDefaultAmcError(false);
                    // }
                    setDefaultAmc(e);
                  }}
                  options={rangeOfNumber}
                  // requiredRedDot={true}
                  readOnly={
                    updateCompanyProductFormData.product_type_id === 3 ||
                    updateCompanyProductFormData.product_type_id === 4
                  }
                />
                {/* {selectedDefaultAmcError && (
                    <div className="caption-custom-inactive">
                      AMC Cycle Duration is required
                    </div>
                  )} */}
              </div>

              <div>
                <CustomDropdown
                  logo={LucideTimer}
                  labelName="AMC Time Unit :"
                  preselectedOption={
                    intialEditCompanyProductFormData.default_amc_cycle_interval_type_id
                  }
                  onSelect={(e) => {
                    // if (e) {
                    //   setSelectedAmcIntervalTypeIdError(false);
                    // }
                    setAmcIntervalTypeId(e);
                  }}
                  options={intervalTypeData}
                  // requiredRedDot={true}
                  readOnly={
                    updateCompanyProductFormData.product_type_id === 3 ||
                    updateCompanyProductFormData.product_type_id === 4
                  }
                />
                {/* {selectedAmcIntervalTypeIdError && (
                    <div className="caption-custom-inactive">
                      AMC Time Unit is required
                    </div>
                  )} */}
              </div>
            </div>
            <div className="mt-0.5">
              <FormInput
                label="URL : "
                logo={LucideLink}
                type="text"
                name="url"
                // required={false}
                defaultValue={intialEditCompanyProductFormData.url}
                // value={intialEditCompanyProductFormData.url}
                placeholder="Product URL"
                onChange={handleEditCompanyProductFormDataChange}
                onBlur={handleBlur}
                error={errors.url}
              />
            </div>
            <div className="col-span-1">
              <TextAreaInput
                logo={Text}
                label="Description :"
                cols={5}
                rows={3}
                name="description"
                maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                required={false}
                placeholder="Enter Product Description"
                defaultValue={intialEditCompanyProductFormData.description}
                onChange={handleEditCompanyProductFormDataChange}
                onBlur={handleBlur}
              />
            </div>
            {/* </div> */}
          </div>

          <div className="flex justify-between items-center m-2  gap-2 ">
            {/* active toggle button */}
            <div className="flex items-center justify-center  w-fit  gap-4 ">
              <label
                htmlFor="isActive"
                className="block text-sm mt-3 font-medium text-gray-700"
              >
                {productIsActive ? (
                  <div>
                    <CheckCircle2 className=" text-green-500 w-4 h-4 inline-block" />{" "}
                    <span className="input-label-custom">Active</span>
                  </div>
                ) : (
                  <div>
                    <XCircle className="text-gray-300 w-4 h-4 inline-block" />{" "}
                    <span className="input-label-custom">Inactive</span>
                  </div>
                )}
              </label>
              <ToggleButton
                checked={productIsActive}
                name="isActive"
                onToggle={handleProductToggle}
              />
            </div>

            {/* cancel and save button */}
            <div className="flex items-center gap-1">
              <Button type="button" onClick={onClose}>
                <div className="flex items-center justify-center gap-0.5">
                  <X size={16} />
                  Cancel
                </div>
              </Button>
              <Button type="submit">
                <div className="flex items-center justify-center gap-1">
                  <Save size={16} />
                  Save
                </div>
              </Button>
            </div>
          </div>
        </form>

        {/* Service level agreement */}
        <div className="w-full ">
          <CompanyProductSlaComponent
            companyProductSlaData={companyProductSlaData}
            onUpdateSla={updateAccountCompanyProductSla}
          />
        </div>

        {/* Product Tax */}
        {/* <div className="inline-flex items-center justify-center w-full">
          <hr className="w-full h-0.5 mx-auto my-0.5 border-0 rounded-sm  bg-gray-700" />
          <span className="absolute px-3 table-header-custom -translate-x-1/2 bg-white left-1/2">
            Product Tax
          </span>
        </div> */}
        <div
          className={
            isSmallScreen
              ? "flex justify-self-end max-w-full px-2 mb-2"
              : "flex justify-self-end max-w-36 m-1"
          }
        >
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleCreateCompanyProductTaxModalOpen(true);
            }}
          >
            <div className="flex items-center justify-center gap-1">
              <ClipboardPlus size={16} />
              Add Tax
            </div>
          </Button>
        </div>

        {isCreateCompanyProductTaxModalOpen && (
          <CreateCompanyProductTaxModal
            isOpen={isCreateCompanyProductTaxModalOpen}
            handleCreateCompanyProductTax={handleCreateCompanyProductTax}
            onClose={() => {
              setIsCreateCompanyProductTaxModalOpen(false);
            }}
            product={product}
          />
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
            className="ag-theme-balham w-full"
            style={{ height: "300px", width: "100%" }}
          >
            <ProductTaxManagementAgGrid
              productTax={companyProductTax}
              handleCompanyProductTaxChange={handleCompanyProductTaxChange}
            />
          </div>
        </div>
      </div>
    </FormLayout>
  );
}

export default EditCompanyProductModal;
