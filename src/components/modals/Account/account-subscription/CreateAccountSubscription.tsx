/* eslint-disable @typescript-eslint/no-explicit-any */
import FormHeader from "../../../ui/FormHeader";

import { BoxIcon, Plus, Save, X, Calendar } from "lucide-react";
import FormLayout from "../../../ui/FormLayout";
import React, { useEffect, useState } from "react";
import Button from "../../../ui/Button";
import {
  SIZE,
  STATUS_CODE,
  //   VALIDATIONS,
} from "../../../../constants/AppConstants";
// import FormInput from "../../../ui/FormInput";
import { useFormChange } from "../../../../config/hooks/useFormChange";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";
// import CustomSelect, { SelectOption } from "../../../ui/CustomSelect";
import CustomSelectForAccountService, {
  SelectOption,
} from "../account-service/CustomSelectForAccountService";

import axiosClient from "../../../../axios-client/AxiosClient";
import { handleApiError } from "../../../../config/error/handleApiError";

// import TextAreaInput from "../../../ui/TextAreaInput";
import DatePickerInput from "../../../ui/DatePickerInput";
// import FormCheckbox from "../../../ui/FormCheckbox";

// import MESSAGE from "../../../../constants/Messages";
// import CompanyUserSearchFieldInput from "../../../ui/CompanyUserSearchFieldInput";
import AddAccountSubscriptionModalProps from "../../../../@types/modal/AddAccountSubscriptionModalProps";
import CreateAccountSubscriptionProps from "../../../../@types/account/CreateAccountSubscriptionProps";

interface CustomField {
  id: string;
  key: string;
  value: string;
}
const CreateAccountSubscription = ({
  // isUsedInProductModal = false,
  isOpen,
  onClose,
  // product,
  accountId,
  handleAddAccountSubscritption
  
}: AddAccountSubscriptionModalProps) => {
  const { loginStatus } = useLoggedInUserContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [error, setError] = useState<{
    productId: boolean;
    start_date_error: string;
    end_date_error: string;
  }>({
    productId: false,
    start_date_error: "",
    end_date_error: "",
  });

  const intialCreateAccountSubscriptionFormData: CreateAccountSubscriptionProps =
    {
      start_date: "",
      end_date: "",
    };

  const {
    handleChange: handleCreateServiceDetailFormChange,
    formData: addCreateAccountSubscriptionFormData,
  } = useFormChange(intialCreateAccountSubscriptionFormData);

  //   const [isRenewal, setisRenewal] = useState<boolean>(false);

  //   function handleIsRenewalRequiredChange(
  //     event: React.ChangeEvent<HTMLInputElement>,
  //   ) {
  //     setisRenewal(event.target.checked);
  //   }

  // const {
  //   handleChange: handleAddStockFormDataChange,
  //   formData: addStockFormData,
  //   resetForm: resetStockCreateForm,
  // } = useFormChange(intialAddStockFormData);

  // Note : on close Clear the states
  const handleCloseForm = () => {
    // resetStockCreateForm();

    // here we are setting dropdown
    setProductSelected(null);

    // setCustomerRating(0);

    setError({
      productId: false,
      start_date_error: "",
      end_date_error: "",
    });
    onClose();
  };

  const validateForm = (): boolean => {
    let flagVariable: boolean = true;
    if (productSelected === undefined || productSelected === null) {
      setError((prev) => ({
        ...prev,
        productId: true,
      }));
      flagVariable = false;
    } else {
      setError((prev) => ({
        ...prev,
        productId: false,
      }));
    }

    if (addCreateAccountSubscriptionFormData.start_date === "") {
      setError((prev) => ({
        ...prev,
        start_date_error: "Please Start Date ",
      }));
      toast.error("Please select Start Date  for Account Subsription");
      flagVariable = false;
    } else {
      setError((prev) => ({
        ...prev,
        start_date_error: "",
      }));
    }

    if (addCreateAccountSubscriptionFormData.end_date === "") {
      setError((prev) => ({
        ...prev,
        end_date_error: "Please Select End Date ",
      }));
      toast.error("Please select End Date for Account Subsription");
      flagVariable = false;
    } else {
      setError((prev) => ({
        ...prev,
        end_date_error: "",
      }));
    }

    if (
      addCreateAccountSubscriptionFormData.start_date &&
      addCreateAccountSubscriptionFormData.end_date &&
      addCreateAccountSubscriptionFormData.start_date >
        addCreateAccountSubscriptionFormData.end_date
    ) {
      setError((prev) => ({
        ...prev,
        end_date_error: "End date cannot be before Start date ",
      }));
      toast.error(
        "Please select End Date after Start Date for Account Subsription",
      );
      flagVariable = false;
    } else {
      setError((prev) => ({
        ...prev,
        end_date_error: "",
      }));
    }

    return flagVariable;
  };

  const handleCreateAccountService = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (isSaving) return;

    // const customizationsForBackend = fields.map((field) => ({
    //   key: field.key,
    //   value: field.value,
    // }));

    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      company_product_id: productSelected?.value,
      start_date: addCreateAccountSubscriptionFormData.start_date,
      end_date: addCreateAccountSubscriptionFormData.end_date,
      packagedetail: null,
      is_renewal: false,
      renewal_account_subscription_id: null,
      createdby_id: loginStatus.id,
    };
    console.log("--------------");
    console.log(JSON.stringify(postData, null, 2));
    console.log("--------------");
    alert(JSON.stringify(postData, null, 2));
    setIsSaving(true);
    await axios
      .post(POST_API.CREATE_ACCOUNT_SUBSCRIPTION, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleCloseForm();
          onClose();
          handleAddAccountSubscritption();
        } else {
          toast.error(response.data.message);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleCreateAccountService,
          });
          if (refreshTokenResponse) {
            handleCreateAccountService(event);
          }
        } else {
          toast.error(error.response.data);
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const PAGE_SIZE = 25;

  const [productOptions, setProductOptions] = useState<SelectOption[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchProducts = async (
    search: string,
    currentOffset: number,
    append = false,
  ) => {
    if (isLoading || (!hasMore && append)) return;

    setIsLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      isactive: true,
      product_type_id: 4,
      search_parameter: search || null,
      offset: currentOffset,
      limit: PAGE_SIZE,
      requestedby: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.GET_LOOKUP_COMPANY_PRODUCT_BY_PRODUCT_TYPE,
        postData,
        { withCredentials: true },
      );

      if (response.status === 200) {
        const mapped: SelectOption[] = response.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }));

        setProductOptions((prev) => (append ? [...prev, ...mapped] : mapped));

        setHasMore(mapped.length === PAGE_SIZE);
        setOffset(currentOffset + PAGE_SIZE);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuOpen = () => {
    if (productOptions.length === 0) {
      setOffset(0);
      setHasMore(true);
      fetchProducts("", 0, false);
    }
  };

  const handleMenuScrollToBottom = () => {
    if (hasMore) {
      fetchProducts(searchText, offset, true);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchText(value);
    setOffset(0);
    setHasMore(true);

    // debounce-friendly approach
    fetchProducts(value, 0, false);
  };

  // Note: Need to work on this
  const [productSelected, setProductSelected] = useState<
    SelectOption | undefined | null
  >(null);

  useEffect(() => {
    console.log(productSelected);
  }, [productSelected]);

  const [fields, setFields] = useState<CustomField[]>([]);

  // 2. Add a new field with a unique ID
  const addField = () => {
    const newField: CustomField = {
      id: crypto.randomUUID(), // Standard way to get unique IDs
      key: "",
      value: "",
    };
    setFields((prev) => [...prev, newField]);
  };

  // 3. Remove a field by ID
  const removeField = (idToRemove: string) => {
    // Functional update ensures we are filtering the latest state
    setFields((prev) => prev.filter((field) => field.id !== idToRemove));
  };

  // 4. Update specific field values
  const handleChange = (id: string, name: "key" | "value", val: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [name]: val } : field,
      ),
    );
  };

  // const productOptions = toSelectOptions(productList, 'id', 'name');
  // if isOpen is false then return null
  if (!isOpen) return null;

  return (
    <FormLayout width={5} padding={2}>
      <>
        <FormHeader
          icon={Plus}
          onClose={handleCloseForm}
          description="Add new Subscription For Account."
          preText="Add Account Subscription"
        />
        <>
          <div className="flex flex-col sm:flex-row sm:items-center  gap-2 mt-3 px-2 ">
            {productSelected && (
              <div className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-md">
                <span className="text-gray-500">Product:</span>{" "}
                {productSelected.label}
              </div>
            )}
          </div>

          <form onSubmit={handleCreateAccountService} className="space-y-2 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* select the product when used from the stock creation button from stock module */}
              <div className="flex flex-col gap-2">
                {
                  <div className="">
                    <CustomSelectForAccountService
                      icon={BoxIcon}
                      label="Product"
                      // onChange={(value) => {
                      //   if (!value) return;
                      //   setProductSelected(value);

                      //   setError((prev) => ({
                      //     ...prev,
                      //     productId: false,
                      //   }));
                      // }}

                      onChange={(
                        option: number | SelectOption | undefined | null,
                      ) => {
                        if (!option) return;

                        if (typeof option === "number") {
                          console.log("Selected ID:", option);
                          return;
                        }
                        console.log("------option-----------");
                        console.log(option);
                        console.log("-----------------");
                        // set the full option as selected
                        setProductSelected(option);

                        // clear any validation error
                        setError((prev) => ({
                          ...prev,
                          productId: false,
                        }));

                        // // now you can access details directly:
                        console.log("Selected ID:", option.value);
                        console.log("Selected Name:", option.label);
                      }}
                      options={productOptions}
                      isRequired={true}
                      placeholder="Select Product"
                      value={productSelected || 0}
                      onMenuOpen={handleMenuOpen}
                      onMenuScrollToBottom={handleMenuScrollToBottom}
                      onInputChange={handleInputChange}
                      isLoading={isLoading}
                      isClearable={false}
                    />
                    {error.productId && (
                      <div className="caption-custom-inactive">
                        Product is required
                      </div>
                    )}
                  </div>
                }

                <DatePickerInput
                  label="Start Date"
                  name="start_date"
                  onChange={handleCreateServiceDetailFormChange}
                  logo={Calendar}
                  error={error.start_date_error}
                  required
                />

                <DatePickerInput
                  label="End Date"
                  name="end_date"
                  onChange={handleCreateServiceDetailFormChange}
                  logo={Calendar}
                  error={error.end_date_error}
                  required
                />
              </div>

              <div className="p-6 bg-white border rounded-lg shadow-sm max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Package Details
                  </h3>
                  <button
                    type="button"
                    onClick={addField}
                    className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Key"
                          value={field.key}
                          onChange={(e) =>
                            handleChange(field.id, "key", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) =>
                            handleChange(field.id, "value", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <p className="text-center text-gray-400 py-4 italic">
                      No customization fields added yet.
                    </p>
                  )}
                </div>
              </div>
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
      </>
      {isSaving && <LoadingPopUpAnimation show={isSaving} />}
    </FormLayout>
  );
};
export default CreateAccountSubscription;
