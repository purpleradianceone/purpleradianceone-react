import {
  ArrowLeft,
  Edit2,
  LucideCalendar,
  LucideClock,
  LucideIndianRupee,
  LucideTimer,
} from "lucide-react";
import FormHeader from "../../../ui/FormHeader";
import FormInput from "../../../ui/FormInput";
import TextAreaInput from "../../../ui/TextAreaInput";
import { useMemo, useState } from "react";
import ProductManagement from "../../../views/product-Management/ProductsManagement";
import { Product } from "../../../../@types/products/ProductsManagementProps";
import Button from "../../../ui/Button";
import DatePickerInput from "../../../ui/DatePickerInput";
import AccountProduct from "../../../../@types/account/AccountProduct";
import { useFormChange } from "../../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../../config/hooks/useFormValidation";
import { useIntervalType } from "../../../../config/hooks/useIntervalType";
import CustomDropdown from "../../leads/CustomDropdown";
import { Item, range } from "../../../../constants/NumberList";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";

const CreateAccountCompanyProduct = ({
  onClose,
  accountId,
}: {
  onClose: () => void;
  accountId: number;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRowSelectForAssingingToAccount = (data: Product | any) => {
    console.log(data);
    setSelectedProduct(null);
    if (data !== null && data !== undefined) {
      setSelectedProduct(data);
      setShowGrid(!showGrid);
    }
  };

  const handleGoBackToProductSelection = () => {
    setSelectedProduct(null);
    setShowGrid(!showGrid);
  };

  // reset add the states before closing the form
  const handleCloseForm = () => {
    setSelectedProduct(null);
    setInitialAddProductToAccountFormData({
      accountId: 0,
      amcCycle: 0,
      amcCycleEndDate: "",
      amcCycleIntervalTypeId: 0,
      amcCycleStartDate: "",
      billingAddress: "",
      companyId: 0,
      companyProductId: 0,
      createdby: 0,
      deliveryAddress: "",
      deliveryDate: "",
      installationDate: "",
      installedBy: 0,
      purchaseDate: "",
      quantity: 0,
      warranty: 0,
      warrantyEndDate: "",
      warrantyIntervalTypeId: 0,
      warrantyStartDate: "",
      warrantyTerms: "",
    });
    setWarrantyIntervalTypeId(0);
    setAmcIntervalTypeId(0);
    setSelectedWarranty(0);
    setSelectedAmc(0);
    setErrors({
      quantity: "",
      purchaseDate: "",
      installationDate: "",
      deliveryDate: "",
      warrantyStartDate: "",
    });
    setErrorsData({
      AmcIntervalTypeId: false,
      SelectedAmc: false,
      Warranty: false,
      WarrantyIntervalTypeId: false,
    });
    onClose();
  };
  const { intervalTypeData } = useIntervalType();

  const rangeOfNumber: Item[] = useMemo(() => {
    return range(1, 365);
  }, []);
  const [
    intialAddProductToAccountFormData,
    setInitialAddProductToAccountFormData,
  ] = useState<AccountProduct>({
    accountId: 0,
    amcCycle: 0,
    amcCycleEndDate: "",
    amcCycleIntervalTypeId: 0,
    amcCycleStartDate: "",
    billingAddress: "",
    companyId: 0,
    companyProductId: 0,
    createdby: 0,
    deliveryAddress: "",
    deliveryDate: "",
    installationDate: "",
    installedBy: 0,
    purchaseDate: "",
    quantity: 0,
    warranty: 0,
    warrantyEndDate: "",
    warrantyIntervalTypeId: 0,
    warrantyStartDate: "",
    warrantyTerms: "",
  });

  const {
    handleChange: handleAddProductToAccountFormDataChange,
    formData: addProductToAccountFormData,
  } = useFormChange(intialAddProductToAccountFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    addProductToAccountFormData,
    "registration"
  );

  const [selectedWarrantyIntervalTypeId, setWarrantyIntervalTypeId] = useState<
    number | undefined
  >(0);

  const [selectedAmcIntervalTypeId, setAmcIntervalTypeId] = useState<
    number | undefined
  >(0);
  const [SelectedWarranty, setSelectedWarranty] = useState<number | undefined>(
    0
  );
  const [selectedAmc, setSelectedAmc] = useState<number | undefined>(0);
  const [errorsData, setErrorsData] = useState<{
    WarrantyIntervalTypeId: boolean;
    Warranty: boolean;
    AmcIntervalTypeId: boolean;
    SelectedAmc: boolean;
  }>({
    WarrantyIntervalTypeId: false,
    Warranty: false,
    AmcIntervalTypeId: false,
    SelectedAmc: false,
  });

  const validateFormData = () => {
    if (
      selectedProduct?.id === null ||
      selectedProduct?.id === undefined ||
      selectedProduct?.id === 0
    ) {
      toast.error("Product is required.");
      return;
    }
    if (
      addProductToAccountFormData.quantity === 0 ||
      addProductToAccountFormData.quantity === null ||
      addProductToAccountFormData.quantity === undefined
    ) {
      toast.error("Quantity is required.");
      return;
    }
    if (
      selectedWarrantyIntervalTypeId === 0 ||
      selectedWarrantyIntervalTypeId === null ||
      selectedWarrantyIntervalTypeId === undefined
    ) {
      setErrorsData((prev) => ({
        ...prev,
        WarrantyIntervalTypeId: true,
      }));
      return;
    }
    if (
      SelectedWarranty === 0 ||
      SelectedWarranty === null ||
      SelectedWarranty === undefined
    ) {
      setErrorsData((prev) => ({
        ...prev,
        Warranty: true,
      }));
      return;
    }
    if (
      selectedAmcIntervalTypeId === 0 ||
      selectedAmcIntervalTypeId === null ||
      selectedAmcIntervalTypeId === undefined
    ) {
      setErrorsData((prev) => ({
        ...prev,
        AmcIntervalTypeId: true,
      }));
      return;
    }
    if (
      selectedAmc === 0 ||
      selectedAmc === null ||
      selectedAmc === undefined
    ) {
      setErrorsData((prev) => ({
        ...prev,
        SelectedAmc: true,
      }));
      return;
    }
  };

  const formattedDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj
      .toLocaleString("defalut", { month: "short" })
      .toLowerCase();
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Give call to the api
  const handleCreateAccountCompanyProduct = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    validateFormData();
    const purchaseDate = formattedDate(
      addProductToAccountFormData.purchaseDate
    );
    const deliveryDate = formattedDate(
      addProductToAccountFormData.deliveryDate
    );

    const installationDate = formattedDate(
     addProductToAccountFormData.installationDate
    );

    const warrentyStartDate = formattedDate(
      addProductToAccountFormData.warrantyStartDate
    );

    const warrrentyEndDate = formattedDate(
      addProductToAccountFormData.warrantyEndDate
    );

    const amcCycleStartDate = formattedDate(
      addProductToAccountFormData.amcCycleStartDate
    );
    const AmcCycleEndDate = formattedDate(
       addProductToAccountFormData.amcCycleEndDate
    );

    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      company_product_id: selectedProduct?.id,
      quantity: addProductToAccountFormData.quantity,
      purchase_date: purchaseDate,
      delivery_date: deliveryDate,
      delivery_address: addProductToAccountFormData.deliveryAddress,
      billing_address: addProductToAccountFormData.billingAddress,
      installation_date: installationDate,
      installed_by: loginStatus.id,
      warranty_interval_type_id: selectedWarrantyIntervalTypeId,
      warranty: SelectedWarranty,
      warranty_start_date: warrentyStartDate,
      warranty_end_date: warrrentyEndDate,
      warranty_terms: addProductToAccountFormData.warrantyTerms,
      amc_cycle_interval_type_id: selectedAmcIntervalTypeId,
      amc_cycle: selectedAmc,
      amc_cycle_start_date: amcCycleStartDate,
      amc_cycle_end_date:AmcCycleEndDate,
      createdby_id: loginStatus.id,
    };
    await axios.post(POST_API.CREATE_ACCOUNT_COMPANY_PRODUCT, postData, {withCredentials : true})
    .then((response)=>{
        console.log(response);
        
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleCreateAccountCompanyProduct,
          });
          if (refreshTokenResponse) {
            handleCreateAccountCompanyProduct(e);
          }
        }else{
            toast.error(error.response.data)
        }
      })
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-5   flex justify-center items-center  p-2 sm:p-2">
      <div className="bg-white w-full max-w-6xl h-full   rounded  p-2 relative overflow-auto">
        {/* Header */}
        <FormHeader
          icon={Edit2}
          onClose={handleCloseForm}
          preText="Assign Product to account"
          description="Assign the new product to this Account."
        />
        {!showGrid && (
          <>
            <ProductManagement
              isGridForAccountProduct={true}
              onRowSelect={onRowSelectForAssingingToAccount}
            />
          </>
        )}

        {showGrid && (
          <>
            <Button
              className="bg-pink-00 flex gap-1 items-center table-header-custom"
              onClick={handleGoBackToProductSelection}
            >
              <ArrowLeft size={16} />
              Go Back to product selection
            </Button>
            {selectedProduct && (
              <span className="table-header-custom">
                <span>Product :</span> {selectedProduct.name}
              </span>
            )}
            <form
              onSubmit={handleCreateAccountCompanyProduct}
              className="grid grid-cols-2 gap-2"
            >
              {/* Quantity */}
              <FormInput
                label="Quantity: "
                logo={LucideIndianRupee}
                required
                type="number"
                name="quantity"
                min={0}
                placeholder="Enter quantity here"
                value={addProductToAccountFormData.quantity}
                onChange={handleAddProductToAccountFormDataChange}
                onBlur={handleBlur}
                error={errors.quantity}
              />
              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* purchase date */}
                <DatePickerInput
                  label="Purchase Date :"
                  required
                  logo={LucideCalendar}
                  name="purchaseDate"
                  value={addProductToAccountFormData.purchaseDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                  onBlur={handleBlur}
                  error={errors.purchaseDate}
                />
                {/* Delivery date */}
                <DatePickerInput
                  label="Delivery Date :"
                  logo={LucideCalendar}
                  name="deliveryDate"
                  value={addProductToAccountFormData.deliveryDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                />
              </div>
              {/* installation date */}
              <DatePickerInput
                label="Installation Date :"
                // required
                logo={LucideCalendar}
                name="installationDate"
                value={addProductToAccountFormData.installationDate}
                placeholder="Select Date"
                onChange={handleAddProductToAccountFormDataChange}
              />
              {/* Delivery address */}
              <TextAreaInput
                cols={4}
                label="Delivery Address"
                name="deliveryAddress"
                value={addProductToAccountFormData.deliveryAddress}
                onChange={handleAddProductToAccountFormDataChange}
                // onBlur={handleBlur}
                rows={3}
              />
              {/* Billing address */}
              <TextAreaInput
                cols={4}
                label="Billing Address"
                rows={3}
                name="billingAddress"
                value={addProductToAccountFormData.billingAddress}
                onChange={handleAddProductToAccountFormDataChange}
                // onBlur={handleBlur}
              />
              {/* Warranty terms */}
              <TextAreaInput
                cols={4}
                label="Warranty terms"
                name="warrantyTerms"
                rows={3}
                value={addProductToAccountFormData.warrantyTerms}
                onChange={handleAddProductToAccountFormDataChange}
                // onBlur={handleBlur}
              />
              {/* Warranty & warranty time unit */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* Warranty time unit */}
                <div>
                  <CustomDropdown
                    labelName="Warranty Time Unit"
                    logo={LucideTimer}
                    preselectedOption={0}
                    onSelect={(selectedValue) => {
                      console.log(selectedValue);
                      if (selectedValue) {
                        setErrorsData((prev) => ({
                          ...prev,
                          WarrantyIntervalTypeId: false,
                        }));
                        setWarrantyIntervalTypeId(selectedValue);
                      } else {
                        setErrorsData((prev) => ({
                          ...prev,
                          WarrantyIntervalTypeId: true,
                        }));
                        setWarrantyIntervalTypeId(undefined);
                      }
                    }}
                    options={intervalTypeData}
                    requiredRedDot={true}
                  />
                  {errorsData.WarrantyIntervalTypeId && (
                    <div className="caption-custom-inactive">
                      Warranty Time Unit is required
                    </div>
                  )}
                </div>

                {/* Warranty */}
                <div>
                  <CustomDropdown
                    labelName="Warranty :"
                    logo={LucideClock}
                    preselectedOption={0}
                    onSelect={(data) => {
                      if (data) {
                        setErrorsData((prev) => ({
                          ...prev,
                          Warranty: false,
                        }));
                        setSelectedWarranty(data);
                      } else {
                        setErrorsData((prev) => ({
                          ...prev,
                          Warranty: true,
                        }));
                        setSelectedWarranty(undefined);
                      }
                    }}
                    options={rangeOfNumber}
                    requiredRedDot={true}
                  />
                  {errorsData.Warranty && (
                    <div className="caption-custom-inactive">
                      Warranty duration is required
                    </div>
                  )}
                </div>
              </div>
              {/* Warranty start date  & Warranty end date*/}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* Warranty start date */}
                <DatePickerInput
                  label="Warranty Start Date :"
                  logo={LucideCalendar}
                  name="warrantyStartDate"
                  value={addProductToAccountFormData.warrantyStartDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                />

                {/* Warranty end date */}
                <DatePickerInput
                  label="Warranty End Date :"
                  logo={LucideCalendar}
                  name="warrantyEndDate"
                  value={addProductToAccountFormData.warrantyEndDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                />
              </div>

              {/* amc cycle duration &&  Amc time unit */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* amc cycle duration */}
                <div>
                  <CustomDropdown
                    labelName="AMC Cycle Duration"
                    logo={LucideClock}
                    preselectedOption={0}
                    onSelect={(selectedValue) => {
                      if (selectedValue) {
                        setErrorsData((prev) => ({
                          ...prev,
                          SelectedAmc: false,
                        }));
                        setSelectedAmc(selectedValue);
                      } else {
                        setErrorsData((prev) => ({
                          ...prev,
                          SelectedAmc: true,
                        }));
                        setSelectedAmc(undefined);
                      }
                    }}
                    options={rangeOfNumber}
                    requiredRedDot={true}
                  />
                  {errorsData.SelectedAmc && (
                    <div className="caption-custom-inactive">
                      AMC Cycle Duration is required
                    </div>
                  )}
                </div>

                {/* Amc time unit */}
                <div>
                  <CustomDropdown
                    labelName="AMC Time Unit"
                    logo={LucideTimer}
                    preselectedOption={0}
                    onSelect={(selectedValue) => {
                      console.log(selectedValue);
                      if (selectedValue) {
                        setErrorsData((prev) => ({
                          ...prev,
                          AmcIntervalTypeId: false,
                        }));
                        setAmcIntervalTypeId(selectedValue);
                      } else {
                        setErrorsData((prev) => ({
                          ...prev,
                          AmcIntervalTypeId: true,
                        }));
                        setAmcIntervalTypeId(undefined);
                      }
                    }}
                    options={intervalTypeData}
                    requiredRedDot={true}
                  />
                  {errorsData.AmcIntervalTypeId && (
                    <div className="caption-custom-inactive">
                      Amc Time Unit is required
                    </div>
                  )}
                </div>
              </div>

              {/* Amc start date & Amc End date */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* AMc start date */}
                <DatePickerInput
                  label="Amc Start Date :"
                  // required
                  logo={LucideCalendar}
                  name="amcCycleStartDate"
                  value={addProductToAccountFormData.amcCycleStartDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                />
                {/*Amc End date  */}
                <DatePickerInput
                  label="Amc End Date :"
                  logo={LucideCalendar}
                  name="amcCycleEndDate"
                  value={addProductToAccountFormData.amcCycleEndDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                />
              </div>

              <div className="flex items-center justify-end bg-pink-00 col-span-2">
                <div className="flex gap-1">
                  <Button onClick={handleCloseForm}  type="button">Cancel</Button>
                  <Button type="submit">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateAccountCompanyProduct;
