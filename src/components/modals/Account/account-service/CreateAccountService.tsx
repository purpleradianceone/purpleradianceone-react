/* eslint-disable @typescript-eslint/no-explicit-any */
import FormHeader from "../../../ui/FormHeader";

import {
  BoxIcon,
  Clock,
  Plus,
  Save,
  X,
  Share2,
  Activity,
  MapPin,
  ShieldCheck,
  Calendar,
  Ban,
  MessageSquare,
  ThumbsUp,
  User,
  Trash,
} from "lucide-react";
import FormLayout from "../../../ui/FormLayout";
import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../ui/Button";
import {
  SIZE,
  STATUS_CODE,
  VALIDATIONS,
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
} from "./CustomSelectForAccountService";
import axiosClient from "../../../../axios-client/AxiosClient";
import { handleApiError } from "../../../../config/error/handleApiError";
import CustomDropdown from "../../leads/CustomDropdown";
import { useServiceStatus } from "../../../../config/hooks/useServiceStatus";
import { useServiceLocationType } from "../../../../config/hooks/useServiceLocationType";
import { useServiceBookingSource } from "../../../../config/hooks/useServiceBookingSource";
import CreateServiceDetail from "../../../../@types/account/CreateServiceDetail";
import TextAreaInput from "../../../ui/TextAreaInput";
import DatePickerInput from "../../../ui/DatePickerInput";
import FormCheckbox from "../../../ui/FormCheckbox";
import CustomerRating from "./CustomerRating";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import MESSAGE from "../../../../constants/Messages";
import CompanyUserSearchFieldInput from "../../../ui/CompanyUserSearchFieldInput";
import AddAccountServiceModalProps from "../../../../@types/modal/AddAccountServiceModalProps";
import COLORS from "../../../../constants/Colors";

interface CustomField {
  id: string;
  key: string;
  value: string;
}
const AddStock = ({
  // isUsedInProductModal = false,
  isOpen,
  onClose,
  // product,
  accountId,
  handleAddAccountService,
}: AddAccountServiceModalProps) => {
  const { loginStatus } = useLoggedInUserContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [selectedServiceBookingSource, setSelectedServiceBookingSource] =
    useState<number | undefined>(undefined);

  const [selectedServiceLocationType, setSelectedServiceLocationType] =
    useState<number | undefined>(undefined);

  const [selectedServiceStatus, setselectedServiceStatus] = useState<
    number | undefined
  >(undefined);

  const { serviceBookingSource, isLoading: isLoadingForServiceBookingSource } =
    useServiceBookingSource();

  const { serviceLocationType, isLoading: isLoadingForServiceLocationType } =
    useServiceLocationType();

  const { serviceStatus, isLoading: isLoadingForServiceStatus } =
    useServiceStatus();

  const handleSelectedServiceBookingSource = (value: number | undefined) => {
    setSelectedServiceBookingSource(value);
  };

  const handleSelectedServiceLocationType = (value: number | undefined) => {
    setSelectedServiceLocationType(value);
  };

  const handleSelectedServiceStatus = (value: number | undefined) => {
    setselectedServiceStatus(value);
  };

  const [showErrorAtServiceBookingSource, setShowErrorAtServiceBookingSource] =
    useState<boolean>(false);

  const [showErrorAtServiceLocationType, setShowErrorAtServiceLocationType] =
    useState<boolean>(false);

  const [showErrorAtServiceStatus, setShowErrorAtServiceStatus] =
    useState<boolean>(false);

  const [error, setError] = useState<{
    productId: boolean;
    service_booking_date_error: string;
    service_booking_time_error: string;
  }>({
    productId: false,
    service_booking_date_error: "",
    service_booking_time_error: "",
  });

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = useMemo(() => generateTimeOptions(), []);

  const intialCreateServiceDetailFormData: CreateServiceDetail = {
    service_booking_date: "",
    service_booking_time: `${timeOptions[0]}`,
    location_address: "",
    service_notes: "",
    cancellation_reason: "",
    customer_rating: 0,
    customer_feedback: "",
    next_service_due_date: "",
    is_follow_up_required: false,
  };

  const {
    handleChange: handleCreateServiceDetailFormChange,
    formData: addCreateServiceDetailFormData,
  } = useFormChange(intialCreateServiceDetailFormData);

  const [isFollowUpRequired, setIsFollowUpRequired] = useState<boolean>(false);

  const [customerRating, setCustomerRating] = useState<number>(0);

  function handleFollowUpRequiredChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setIsFollowUpRequired(event.target.checked);
  }

  function handleCustomerRatingChange(value: number) {
    setCustomerRating(Number(value));
  }

  const [assignedTo, setAssignedTo] = useState<CompanyUser>({
    company_id: 0,
    id: 0,
    fullname: "",
    email: "",
    mobilenumber: "",
    isactive: false,
    requestedby: "",
    createdby: "",
    generate_password: "",
  });

  // const {
  //   handleChange: handleAddStockFormDataChange,
  //   formData: addStockFormData,
  //   resetForm: resetStockCreateForm,
  // } = useFormChange(intialAddStockFormData);

  // Note : on close Clear the states
  const handleCloseForm = () => {
    // resetStockCreateForm();

    setProductSelected(null);
    setSelectedServiceBookingSource(undefined);
    setSelectedServiceLocationType(undefined);
    setselectedServiceStatus(undefined);
    setCustomerRating(0);

    setError({
      productId: false,
      service_booking_date_error: "",
      service_booking_time_error: "",
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

    if (addCreateServiceDetailFormData.service_booking_date === "") {
      setError((prev) => ({
        ...prev,
        service_booking_date_error: "Please select Service Booking Date ",
      }));
      toast.error("Please select Service Booking Date for Account Service");
      flagVariable = false;
    } else {
      setError((prev) => ({
        ...prev,
        service_booking_date_error: "",
      }));
    }

    if (addCreateServiceDetailFormData.service_booking_time === "") {
      setError((prev) => ({
        ...prev,
        service_booking_time_error: "Please select Service Booking Time ",
      }));
      toast.error("Please select Service Booking Time for Account Service");
      flagVariable = false;
    } else {
      setError((prev) => ({
        ...prev,
        service_booking_time_error: "",
      }));
    }

    if (selectedServiceBookingSource === undefined) {
      setShowErrorAtServiceBookingSource(true);
      flagVariable = false;
    } else {
      setShowErrorAtServiceBookingSource(false);
    }

    if (selectedServiceLocationType === undefined) {
      setShowErrorAtServiceLocationType(true);
      flagVariable = false;
    } else {
      setShowErrorAtServiceLocationType(false);
    }

    if (selectedServiceStatus === undefined) {
      setShowErrorAtServiceStatus(true);
      flagVariable = false;
    } else {
      setShowErrorAtServiceStatus(false);
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
    const customizationsForBackend = Object.fromEntries(
      fields.map(field => [field.key, field.value])
    );

    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      company_product_id: productSelected?.value,
      service_booking_date: addCreateServiceDetailFormData.service_booking_date,
      service_booking_time: addCreateServiceDetailFormData.service_booking_time,
      service_status_id: selectedServiceStatus,
      service_booking_source_id: selectedServiceBookingSource,
      service_location_type_id: selectedServiceLocationType,
      location_address: addCreateServiceDetailFormData.location_address,
      assignedto: assignedTo.id ?? null,
      // assignedto: null,
      service_notes: addCreateServiceDetailFormData.service_notes,
      // customizations: JSON.stringify(fields),
      customizations: JSON.stringify(customizationsForBackend),
      cancellation_reason: addCreateServiceDetailFormData.cancellation_reason,
      customer_rating: customerRating,
      customer_feedback: addCreateServiceDetailFormData.customer_feedback,
      is_follow_up_required: isFollowUpRequired,
      next_service_due_date:
        addCreateServiceDetailFormData.next_service_due_date || null,
      createdby_id: loginStatus.id,
    };
    console.log("--------------");
    console.log(JSON.stringify(postData, null, 2));
    console.log("--------------");
    alert(JSON.stringify(postData, null, 2));
    setIsSaving(true);
    await axios
      .post(POST_API.CREATE_ACCOUNT_SERVICE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleAddAccountService();
          handleCloseForm();
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
      product_type_id: 3,
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
          description="Add new Service For Account."
          preText="Add Account Service"
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

              {!isLoadingForServiceBookingSource ? (
                <div className="">
                  <CustomDropdown
                    logo={Share2}
                    preselectedOption={selectedServiceBookingSource}
                    requiredRedDot
                    labelName="Source"
                    options={serviceBookingSource!}
                    onSelect={handleSelectedServiceBookingSource}
                  />
                  {showErrorAtServiceBookingSource &&
                    !selectedServiceBookingSource && (
                      <div className="text-red-500 text-xs">
                        Please select Service Booking Source
                      </div>
                    )}
                </div>
              ) : (
                <div className="space-y-1 animate-pulse">
                  {/* Label skeleton */}
                  <div className="w-32 h-3 bg-slate-200 rounded"></div>

                  {/* Dropdown skeleton */}
                  <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                </div>
              )}
              {!isLoadingForServiceLocationType ? (
                <div className="">
                  <CustomDropdown
                    logo={MapPin}
                    preselectedOption={selectedServiceLocationType}
                    requiredRedDot
                    labelName="Location"
                    options={serviceLocationType!}
                    onSelect={handleSelectedServiceLocationType}
                  />
                  {showErrorAtServiceLocationType &&
                    !selectedServiceLocationType && (
                      <div className="text-red-500 text-xs">
                        Please select Service Location Type
                      </div>
                    )}
                </div>
              ) : (
                <div className="space-y-1 animate-pulse">
                  {/* Label skeleton */}
                  <div className="w-32 h-3 bg-slate-200 rounded"></div>

                  {/* Dropdown skeleton */}
                  <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                </div>
              )}
              {!isLoadingForServiceStatus ? (
                <div className="">
                  <CustomDropdown
                    logo={Activity}
                    preselectedOption={selectedServiceStatus}
                    requiredRedDot
                    labelName="Status"
                    options={serviceStatus!}
                    onSelect={handleSelectedServiceStatus}
                  />
                  {showErrorAtServiceStatus && !selectedServiceStatus && (
                    <div className="text-red-500 text-xs">
                      Please select Service Status
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 animate-pulse">
                  {/* Label skeleton */}
                  <div className="w-32 h-3 bg-slate-200 rounded"></div>

                  {/* Dropdown skeleton */}
                  <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                </div>
              )}

              <DatePickerInput
                label="Booking Date"
                name="service_booking_date"
                onChange={handleCreateServiceDetailFormChange}
                logo={Calendar}
                error={error.service_booking_date_error}
                required
              />

              <div className=" col-span-1">
                <label
                  htmlFor="service_booking_time"
                  className="block input-label-custom"
                >
                  <div className="flex gap-1 items-center">
                    <Clock
                      size={13}
                      className="text-blue-600  justify-center "
                    />
                    <span>Booking Time</span>
                  </div>
                </label>
                <select
                  id="service_booking_time"
                  name="service_booking_time"
                  value={addCreateServiceDetailFormData.service_booking_time}
                  className=" w-full pl-3 pr-10 py-1 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={handleCreateServiceDetailFormChange}
                  required={true}
                >
                  <option value="">Select Service Booking Time</option>
                  {timeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {error.service_booking_time_error && (
                  <div className="caption-custom-inactive">
                    {error.service_booking_time_error}
                  </div>
                )}
              </div>
              <TextAreaInput
                logo={MapPin}
                rows={1}
                cols={4}
                label="Location Address"
                name="location_address"
                placeholder="Enter Location address"
                value={addCreateServiceDetailFormData.location_address}
                maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                onChange={handleCreateServiceDetailFormChange}
              // className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <TextAreaInput
                logo={ShieldCheck}
                rows={1}
                cols={4}
                label="Note"
                name="service_notes"
                value={addCreateServiceDetailFormData.service_notes}
                onChange={handleCreateServiceDetailFormChange}
              />

              <TextAreaInput
                logo={Ban}
                cols={4}
                rows={1}
                label="Cancellation Reason"
                name="cancellation_reason"
                placeholder="Enter Cancellation Reason"
                value={addCreateServiceDetailFormData.cancellation_reason}
                maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                onChange={handleCreateServiceDetailFormChange}
              // className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <TextAreaInput
                logo={MessageSquare}
                cols={4}
                rows={1}
                label="Customer Feedback"
                name="customer_feedback"
                placeholder="Enter Customer Feedback"
                value={addCreateServiceDetailFormData.customer_feedback}
                maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                onChange={handleCreateServiceDetailFormChange}
              // className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <div className="p-2 bg-white border rounded-lg shadow-sm col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Customizations
                  </h3>


                  <Button
                    type="button"
                    onClick={addField}
                    className={COLORS.ADD_BUTTON}
                  >
                    + Add
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Customization name"
                          value={field.key}
                          onChange={(e) =>
                            handleChange(field.id, "key", e.target.value)
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Enter Value"
                          value={field.value}
                          onChange={(e) =>
                            handleChange(field.id, "value", e.target.value)
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash size={SIZE.ICON_DELETE_BUTTON_SIZE} className={COLORS.ICON_DELETE_BUTTON}></Trash>
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


              <div className="grid grid-cols-1 items-center  gap-2  mb-0">
                <div>
                  <div className="grid grid-cols-1">
                    <CompanyUserSearchFieldInput
                      logo={User}
                      label="Assign To"
                      // defaultValue={supportTicketData?.assignedToName}
                      onUserSelected={(user) => {
                        if (user && user?.id) {
                          //
                          console.log("--------------");
                          console.log(user);
                          console.log("--------------");
                          setAssignedTo(user);
                        }
                        if (user === null || user === undefined) {
                          setAssignedTo({
                            id: 0,
                            company_id: 0,
                            fullname: "",
                            email: "",
                            mobilenumber: "",
                            isactive: false,
                            requestedby: "",
                            createdby: "",
                            generate_password: "",
                          });
                        }
                        console.log("selected user:");
                        console.log(user);
                      }}
                      // isDisabled={!userHasAccessToViewUser}
                      disabledMessage={
                        MESSAGE.MODULE_ACCESS.COMPANY_USER.DENIED_VIEW_ACCESS
                      }
                    />
                  </div>
                </div>
              </div>
              <DatePickerInput
                label="Next Service Due Date"
                name="next_service_due_date"
                onChange={handleCreateServiceDetailFormChange}
                logo={Calendar}
              />

              <div className="grid grid-cols-1">
                <FormCheckbox
                  label="Is Follow Up Required"
                  name="is_follow_up_required"
                  onChange={handleFollowUpRequiredChange}
                  checked={isFollowUpRequired}
                />
              </div>
              <CustomerRating
                logo={ThumbsUp}
                label="Customer Rating"
                onChange={handleCustomerRatingChange}
                value={customerRating}
              ></CustomerRating>
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
export default AddStock;
