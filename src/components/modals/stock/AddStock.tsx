import AddStockModalProps from "../../../@types/stock/AddStockModalProps";
import FormHeader from "../../ui/FormHeader";
import {
  ArrowLeft,
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
import {  useState } from "react";
import Button from "../../ui/Button";
import { SIZE } from "../../../constants/AppConstants";
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

const AddStock = ({ isOpen, onClose }: AddStockModalProps) => {
  const { loginStatus } = useLoggedInUserContext();
  const { companyWarehouse, loading: companyWarehouseLoading } =
    useCompanyWarehouse();
  const [selectedCompanyWarehouse, setSelectedCompanyWarehouse] =
    useState<Warehouse>();
  const [showWarehouseSelectionModule, setShowWarehouseSelectionModule] =
    useState<boolean>(false);
  
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
    // resetForm: resetStockCreateForm,
  } = useFormChange(intialAddStockFormData);

  const { errors, handleBlur
    // , setErrors 
} = useFormValidation(
    addStockFormData,
    "registration"
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [showInputForm, setShowInputForm] = useState<boolean>(false);
  function onRowSelectProductForStock(product: Product) {
    console.log(product);
    setSelectedProduct(null);
    if (product !== null && product !== undefined) {
      setSelectedProduct(product);
      setShowInputForm(true);
    }
  }

  function handleSelectedWarehouse(selectedWarehouse: Warehouse) {
    console.log(selectedWarehouse);

    setSelectedCompanyWarehouse(selectedWarehouse);
    if (selectedWarehouse.id > 0) {
      setShowWarehouseSelectionModule(false);
      setShowInputForm(true);
    }
  }
  function handleGoBackToProductSelection() {
    setSelectedProduct(null);
    setShowInputForm(false);
  }
  const handleCloseForm = () => {};

  // submit api call
  const handleCreateStockAdjustment = () => {};
  if (!isOpen) return null;
  if (companyWarehouseLoading)
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
          onClose={onClose}
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
            </div>

            <form
              onSubmit={handleCreateStockAdjustment}
              className="grid grid-cols-2 gap-2 px-2"
            >
              <div className="grid grid-cols-2 gap-3 ">
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
              </div>
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
              {/* Warranty terms */}
              <div className="col-span-2">
                <TextAreaInput
                  logo={ShieldCheck}
                  cols={4}
                  label="Description: "
                  name="description"
                  rows={3}
                  defaultValue={addStockFormData.description}
                  onChange={handleAddStockFormDataChange}
                  // onBlur={handleBlur}
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
