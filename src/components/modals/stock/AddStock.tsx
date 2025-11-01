/* eslint-disable @typescript-eslint/no-explicit-any */
import AddStockModalProps from "../../../@types/stock/AddStockModalProps";
import FormHeader from "../../ui/FormHeader";
import {
  ArrowLeft,
  ClipboardPen,
  ListOrdered,
  LucideIndianRupee,
  Plus,
  Save,
  ShieldCheck,
  WarehouseIcon,
  X,
} from "lucide-react";
import FormLayout from "../../ui/FormLayout";
import ProductManagement from "../../views/product-Management/ProductsManagement";
import { Product } from "../../../@types/products/ProductsManagementProps";
import { useState } from "react";
import Button from "../../ui/Button";
import {  SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import TextAreaInput from "../../ui/TextAreaInput";
import {
  useCompanyWarehouse,
  Warehouse,
} from "../../../config/hooks/useCompanyWarehouse";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import CompanyWarehouseAgGrid from "../../ag-grid/CompanyWarehouseAgGrid";
import useAdjustmentReason from "../../../config/hooks/useAdjustmentReason";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";

const AddStock = ({ isOpen, onClose }: AddStockModalProps) => {
  const { loginStatus } = useLoggedInUserContext();
  const { companyWarehouse, loading: companyWarehouseLoading } =
    useCompanyWarehouse();

  const { adjustmentReason, loading: adjustmentReasonLoading } =
    useAdjustmentReason();
  const [selectedCompanyWarehouse, setSelectedCompanyWarehouse] =
    useState<Warehouse | null>(null);
  const [showWarehouseSelectionModule, setShowWarehouseSelectionModule] =
    useState<boolean>(false);

  const [selectedAdjustmentReasonId, setSelectedAdjustmentReasonId] = useState<
    number | null
  >(null);
  const intialAddStockFormData = {
    companyId: loginStatus.companyId,
    companyProductId: 0,
    companyWarehouseId: 0,
    serial_number: "",
    quantity: 0,
    other_id: 0,
    description: "",
    createdby: loginStatus.id,
  };

  const {
    handleChange: handleAddStockFormDataChange,
    formData: addStockFormData,
    resetForm: resetStockCreateForm,
  } = useFormChange(intialAddStockFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    addStockFormData,
    "registration"
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [showInputForm, setShowInputForm] = useState<boolean>(false);
  function onRowSelectProductForStock(product: Product) {
    setSelectedProduct(null);
    if (product !== null && product !== undefined) {
      setSelectedProduct(product);
      setShowInputForm(true);
    }
  }

  function handleSelectedWarehouse(selectedWarehouse: Warehouse) {
      setSelectedCompanyWarehouse(selectedWarehouse);
    if (selectedWarehouse.id > 0 && selectedCompanyWarehouse?.id !== null) {
      setShowWarehouseSelectionModule(false);
      setShowInputForm(true);
    }
  }
  function handleGoBackToProductSelection() {
    setSelectedProduct(null);
    setShowInputForm(false);
  }

  function handleAdjustmentReasonChange(option: number) {
    setSelectedAdjustmentReasonId(option);
  }
  const handleCloseForm = () => {
    resetStockCreateForm()

    setErrors({
        quantity : "",
        description : ""
    })
    setSelectedAdjustmentReasonId(null);
    setSelectedCompanyWarehouse(null);
    setSelectedProduct(null);
    onClose()
  };

  const  validateForm =() : boolean =>{
    if(addStockFormData.quantity ===0) {
        toast.error("Quantity is required")
        return false;
    }

    if(selectedAdjustmentReasonId === 0 || selectedAdjustmentReasonId === null || selectedAdjustmentReasonId === undefined)
    {
        toast.error("Adjustment reason is required.")
        return false;
    }
    if(selectedCompanyWarehouse?.id ===null ||selectedCompanyWarehouse?.id ===0 ||selectedCompanyWarehouse?.id ===undefined ){
        toast.error("Warehouse is required.")
        return false;
    }
    return true;
  }
  // submit api call
  const handleCreateStockAdjustment =async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
   const isValid = validateForm();
   if(!isValid){
    return;
   }

    const postData ={
        company_id : loginStatus.companyId,
        company_product_id: selectedProduct?.id,
        company_warehouse_id: selectedCompanyWarehouse?.id,
        serial_number: addStockFormData.serial_number,
        quantity : addStockFormData.quantity,
        other_id : selectedAdjustmentReasonId,
        description : addStockFormData.description,
        createdby_id : loginStatus.id
    }

    await axios.post(POST_API.CREATE_ADJUSTMENT_STOCK, postData , {
        withCredentials: true,
    })
    .then((response) =>{
        console.log(response);
        
        if(response.data.status){
            toast.success(response.data.message)
            handleCloseForm()
        }else{
            toast.error(response.data.message)
        }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleCreateStockAdjustment,
          });
          if (refreshTokenResponse) {
            handleCreateStockAdjustment(event);
          }
        } else {
          toast.error(error.response.data);
        }
      });    
  };

  
  if (!isOpen) return null;
  if (companyWarehouseLoading || adjustmentReasonLoading)
    return (
      <FormLayout>
        <LoadingSpinner />
      </FormLayout>
    );
  return (
    <FormLayout>
      <>
        <FormHeader
          icon={Plus}
          onClose={handleCloseForm}
          description="Add new stock details to the inventory."
          preText="Add stock"
        />

        {!showInputForm && !showWarehouseSelectionModule && (
          <ProductManagement
            isGridForAccountProduct={true}
            onRowSelect={onRowSelectProductForStock}
          />
        )}
        {showInputForm && !showWarehouseSelectionModule && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center  gap-2 mt-3 px-2 ">
              <Button
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-1 py-1.5 border border-blue-200 bg-blue-50 rounded-md transition-all"
                onClick={handleGoBackToProductSelection}
              >
                <ArrowLeft size={14} />
                Change Product
              </Button>

              {selectedProduct && (
                <div className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-md">
                  <span className="text-gray-500">Product:</span>{" "}
                  {selectedProduct.name}
                </div>
              )}
              {selectedProduct && (
                <div className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-md">
                  <span className="text-gray-500">Product Barcode:</span>{" "}
                  {selectedProduct.barcode}
                </div>
              )}
            </div>

            <form
              onSubmit={handleCreateStockAdjustment}
              className="grid grid-cols-2 gap-2 px-2"
            >
              <div className="col-span-2 grid grid-cols-2 gap-3 ">
                {/* Quantity */}
                <div className="mt-1.5">
                  <FormInput
                    label="Quantity : "
                    logo={LucideIndianRupee}
                    required
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity here"
                    // value={addProductToAccountFormData.quantity}
                    defaultValue={
                      addStockFormData.quantity === 0
                        ? ""
                        : addStockFormData.quantity
                    }
                    onChange={handleAddStockFormDataChange}
                    onBlur={handleBlur}
                    error={errors.quantity}
                  />
                </div>
                {/* serial number */}
                <div className="mt-1.5">
                  <FormInput
                    label="Serial Number : "
                    logo={ListOrdered}
                    type="text"
                    name="serial_number"
                    placeholder="Enter serial number here"
                    // value={addProductToAccountFormData.quantity}
                    defaultValue={addStockFormData.serial_number}
                    onChange={handleAddStockFormDataChange}
                    // error={errors.serial_number}
                  />
                </div>
              </div>
              {/* adjustment reason */}
              <div className="mt-2">
                <h1 className="input-label-custom  mb-1 gap-1 flex items-center ">
                  <ClipboardPen className="text-blue-500" size={15} />{" "}
                  Adjustment Reason :
                </h1>
                <div className="flex flex-wrap gap-3">
                  {adjustmentReason.length > 0 &&
                    adjustmentReason.map((option: any) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-2 px-2 py-1.5 border rounded cursor-pointer transition ${
                          selectedAdjustmentReasonId === option.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name="adjustmentReason"
                          value={option.id}
                          checked={selectedAdjustmentReasonId === option.id}
                          onChange={() =>
                            handleAdjustmentReasonChange(option.id)
                          }
                          className="accent-blue-600 cursor-pointer"
                        />

                        <span className="caption-custom">{option.name}</span>
                      </label>
                    ))}
                </div>
              </div>
              {/* warehouse */}
              <div className="flex items-center justify-end mt-2">
                <div className="w-full">
                  <label className=" input-label-custom text-sm   flex items-center gap-1 text-gray-700 mb-1 ">
                    <WarehouseIcon className="text-blue-500" size={15} />
                    <div>
                      Warehouse :<span className="ml-0 text-red-400">*</span>
                    </div>
                  </label>

                  <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-1.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="text-gray-800">
                      {selectedCompanyWarehouse ? (
                        <>
                          {selectedCompanyWarehouse?.name}{" "}
                          <span className="text-sm">
                            ({selectedCompanyWarehouse.warehouseTypeName})
                          </span>
                        </>
                      ) : (
                        "No Warehouse selected"
                      )}
                    </span>

                    <Button
                      type="button"
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                      onClick={() => {
                        setShowWarehouseSelectionModule(true);
                        setShowInputForm(false);
                      }}
                    >
                      {selectedCompanyWarehouse ? "Change" : "Select"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* description */}
              <div className="col-span-2 ">
                <TextAreaInput
                  logo={ShieldCheck}
                  cols={4}
                  label="Description: "
                  name="description"
                  rows={3}
                  defaultValue={addStockFormData.description}
                  onChange={handleAddStockFormDataChange}
                />
              </div>

              <div className="flex items-center justify-end bg-pink-00 col-span-2">
                <div className="flex gap-1">
                  <Button onClick={handleCloseForm} type="button">
                    <div className="flex items-center gap-0.5">
                      <X size={SIZE.SIXTEEN} />
                      Cancel
                    </div>
                  </Button>
                  <Button type="submit">
                    <div className="flex items-center gap-1">
                      <Save size={SIZE.SIXTEEN} />
                      Save
                    </div>
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}

        {showWarehouseSelectionModule && !showInputForm && (
          <div className="ag-theme-balham w-full h-[calc(100vh-120px)] p-2">
            <CompanyWarehouseAgGrid
              data={companyWarehouse}
              onRowSelect={handleSelectedWarehouse}
            />
          </div>
        )}
      </>
    </FormLayout>
  );
};
export default AddStock;
