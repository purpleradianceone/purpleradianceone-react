/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Clock,
  Share2,
  MapPin,
  Activity,
  Calendar,
  Ban,
  MessageSquare,
  ThumbsUp,
  User,
  ShieldCheck,
  Trash,
  IndianRupee,
  CalendarClock,
  FileCode,
  Save,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Button from "../../../ui/Button";
import TextAreaInput from "../../../ui/TextAreaInput";
import DatePickerInput from "../../../ui/DatePickerInput";
import FormCheckbox from "../../../ui/FormCheckbox";
import CustomerRating from "./CustomerRating";
import CompanyUserSearchFieldInput from "../../../ui/CompanyUserSearchFieldInput";
// import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";

import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { SIZE, VALIDATIONS } from "../../../../constants/AppConstants";
import { handleApiError } from "../../../../config/error/handleApiError";
import { useServiceStatus } from "../../../../config/hooks/useServiceStatus";
import { useServiceLocationType } from "../../../../config/hooks/useServiceLocationType";
import { useServiceBookingSource } from "../../../../config/hooks/useServiceBookingSource";
import axiosClient from "../../../../axios-client/AxiosClient";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import AccountServiceDetailProps from "../../../../@types/account/AccountServiceDetailProps";
import ShimmerEffect from "./ShimerEffect";
import ToggleButton from "../../../ui/ToggleButton";
import COLORS from "../../../../constants/Colors";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import FormInput from "../../../ui/FormInput";
import { DisplayComponent } from "../account-company-product/account-company-product-details/AccountCompanyProductDetailsCard";
import CustomSelect from "../../../ui/CustomSelect";
import { toSelectOptions } from "../../../../utils/toSelectOption";

interface CustomField {
  id: string;
  key: string;
  value: string;
}

const AccountServiceDetails = () => {
  const { accountServiceId } = useParams<{ accountServiceId: string }>();
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateAccountService } = useUserAccessModules();

  const [isSaving, setIsSaving] = useState(false);

  // for fetching data account service detail
  const [loading, setLoading] = useState(false);
  const [selectedServiceStatus, setSelectedServiceStatus] = useState<
    number | undefined
  >(undefined);
  const [selectedServiceBookingSource, setSelectedServiceBookingSource] =
    useState<number | undefined>(undefined);
  const [selectedServiceLocationType, setSelectedServiceLocationType] =
    useState<number | undefined>(undefined);
  const [isFollowUpRequired, setIsFollowUpRequired] = useState(false);
  const [customerRating, setCustomerRating] = useState(0);
  const [totalCost, setTotalCost] = useState<number | "">("");
  const [assignedTo, setAssignedTo] = useState<CompanyUser | null>({
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

  const [fields, setFields] = useState<CustomField[]>([]);

  const [showErrorAtServiceStatus, setShowErrorAtServiceStatus] =
    useState(false);
  const [showErrorAtServiceBookingSource, setShowErrorAtServiceBookingSource] =
    useState(false);
  const [showErrorAtServiceLocationType, setShowErrorAtServiceLocationType] =
    useState(false);
  const [
    showErrorAtServiceBookingDateError,
    setShowErrorAtServiceBookingDateError,
  ] = useState(false);
  const [
    showErrorAtServiceBookingTimeError,
    setShowErrorAtServiceBookingTimeError,
  ] = useState(false);
  const [totalCostError, setTotalCostError] = useState<string>("");

  const { serviceStatus, isLoading: isLoadingForServiceStatus } =
    useServiceStatus();
  const { serviceLocationType, isLoading: isLoadingForServiceLocationType } =
    useServiceLocationType();
  const { serviceBookingSource, isLoading: isLoadingForServiceBookingSource } =
    useServiceBookingSource();

  const [accountServiceDetail, setAccountServiceDetail] =
    useState<AccountServiceDetailProps | null>(null);

  const intialFormData = {
    service_booking_date: "",
    service_booking_time: "",
    location_address: "",
    service_notes: "",
    cancellation_reason: "",
    customer_feedback: "",
    next_service_due_date: "",
    is_active: false,
  };

  const [formData, setFormData] = useState(intialFormData);

  // Time options
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        options.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        );
      }
    }
    return options;
  };
  
  const timeOptions = useMemo(
    () =>
      generateTimeOptions().map((time, index) => ({
        id: index,
        name: time,
      })),
    [],
  );

  const bookingTimeOptions = toSelectOptions(timeOptions, "id", "name");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFollowUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFollowUpRequired(e.target.checked);
  };

  const handleCustomerRatingChange = (value: number) => {
    setCustomerRating(value);
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setTotalCost("");
      return;
    }

    if (!VALIDATIONS.NUMBER_WITH_DECIMAL.test(value)) {
      return;
    }

    setTotalCost(Number(value));
  };

 const handleBookingTimeChange = (val: number | undefined) => {
  const selectedTime =
    timeOptions.find((t) => t.id === val)?.name || "";

  setFormData((prev) => ({
    ...prev,
    service_booking_time: selectedTime,
  }));
};

  // Fetch existing account service details
  const getAccountServiceDetail = async () => {
    try {
      console.log(loading);
      setLoading(true);
      const postDataToGetAccountServiceDetail = {
        company_id: loginStatus.companyId,
        account_service_id: Number(accountServiceId),
        requestedby_id: loginStatus.id
      };
      const response = await axiosClient.post(
        POST_API.GET_ACCOUNT_SERVICE_DETAIL,
        postDataToGetAccountServiceDetail,
        { withCredentials: true }
      );
      if (response.status === 200 && response.data) {
        const data = response.data[0];

        const formattedData: AccountServiceDetailProps = {
          id: data.id,
          company_id: data.company_id,
          account_service_code: data.account_service_code,
          account_id: data.account_id,
          account_name: data.account_name,
          company_product_id: data.company_product_id,
          company_product_name: data.company_product_name,
          service_booking_date: data.service_booking_date,
          service_date_time: data.service_date_time,
          service_booking_time: data.service_booking_time?.slice(0, 5),
          service_status_id: data.service_status_id,
          service_status: data.service_status,
          service_booking_source_id: data.service_booking_source_id,
          service_booking_source: data.service_booking_source,
          service_location_type_id: data.service_location_type_id,
          service_location_type: data.service_location_type,
          location_address: data.location_address,
          assignedto: data.assignedto,
          assignedto_name: data.assignedto_name,
          service_notes: data.service_notes,
          customizations: data.customizations,
          cancellation_reason: data.cancellation_reason,
          customer_rating: data.customer_rating,
          customer_feedback: data.customer_feedback,
          next_service_due_date: data.next_service_due_date,
          is_follow_up_required: data.is_follow_up_required,
          total_cost: data.total_cost,
          is_active: data.isactive,
          createdBy: data.createdby,
          createdOn: data.createdon,
        };
        console.log("isactive from API:", data.isactive, typeof data.isactive);

        setAccountServiceDetail(formattedData);

        setFormData({
          service_booking_date: data.service_booking_date,
          service_booking_time: data.service_booking_time?.slice(0, 5),
          location_address: data.location_address,
          service_notes: data.service_notes,
          cancellation_reason: data.cancellation_reason,
          customer_feedback: data.customer_feedback,
          next_service_due_date: data.next_service_due_date,
          is_active: data.isactive,
        });

        setSelectedServiceStatus(data.service_status_id);
        setSelectedServiceBookingSource(data.service_booking_source_id);
        setSelectedServiceLocationType(data.service_location_type_id);
        setIsFollowUpRequired(data.is_follow_up_required);
        setTotalCost(data.total_cost);
        setCustomerRating(data.customer_rating);

        const customObj =
          typeof data.customizations === "string"
            ? JSON.parse(data.customizations)
            : data.customizations || {};

        const fieldsArray: CustomField[] = Object.entries(customObj).map(
          ([key, value], index) => ({
            id: index.toString(),
            key,
            value: String(value)
          })
        );

        setFields(fieldsArray);

        console.log(data.customizations);
        setAssignedTo(
          data.assignedto
            ? data.assignedto
            : {
                id: 0,
                company_id: 0,
                fullname: "",
                email: "",
                mobilenumber: "",
                isactive: false,
                requestedby: "",
                createdby: "",
                generate_password: "",
              }
        );
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountServiceId) getAccountServiceDetail();
  }, [accountServiceId]);

  // Validate required fields
  const validateForm = () => {
    let flag = true;

    if (!formData.service_booking_date) {
      setShowErrorAtServiceBookingDateError(true);
      flag = false;
    } 
    else {
      setShowErrorAtServiceBookingDateError(false);
    }


    if (!formData.service_booking_time) {
      setShowErrorAtServiceBookingTimeError(true);
      flag = false;
    } else {
      setShowErrorAtServiceBookingTimeError(false);
    }

    if (!selectedServiceStatus) {
      setShowErrorAtServiceStatus(true);
      flag = false;
    } else setShowErrorAtServiceStatus(false);

    if (!selectedServiceBookingSource) {
      setShowErrorAtServiceBookingSource(true);
      flag = false;
    } else setShowErrorAtServiceBookingSource(false);

    if (!selectedServiceLocationType) {
      setShowErrorAtServiceLocationType(true);
      flag = false;
    } else setShowErrorAtServiceLocationType(false);

    if (totalCost === "" || totalCost < 0) {
      setTotalCostError("Total Cost is required");
      flag = false;
    } else {
      setTotalCostError("");
    }
    return flag;
  };

  const handleUpdateStatus = async (
    event: React.ChangeEvent,
    activeValue?: boolean,
  ) => {
    await handleUpdate(event, activeValue);
  };
  // Update account service
  const handleUpdate = async (
    event: React.FormEvent<HTMLFormElement> | React.ChangeEvent,
    activeValue?: boolean,
  ) => {
    event.preventDefault();

    if (!userHasAccessToUpdateAccountService) {
      toast.error('You are not authorized user');
      return;
    }

    if (!validateForm()) return;


    if (isSaving) return;

    const customizationsForBackend = Object.fromEntries(
      fields.map((field) => [field.key, field.value])
    );

    console.log("FOr backennd data");
    console.log(customizationsForBackend);
    const postData = {
      company_id: loginStatus.companyId,
      id: Number(accountServiceId),
      service_booking_date: formData.service_booking_date,
      service_booking_time: formData.service_booking_time,
      service_status_id: selectedServiceStatus,
      service_booking_source_id: selectedServiceBookingSource,
      service_location_type_id: selectedServiceLocationType,
      location_address: formData.location_address,
      assignedto:
        assignedTo?.id === 0
          ? accountServiceDetail?.assignedto
          : assignedTo?.id,
      service_notes: formData.service_notes,
      customizations: Object.keys(customizationsForBackend).length
        ? JSON.stringify(customizationsForBackend)
        : null,
      cancellation_reason: formData.cancellation_reason,
      customer_rating: customerRating,
      customer_feedback: formData.customer_feedback,
      next_service_due_date: formData.next_service_due_date,
      is_follow_up_required: isFollowUpRequired,
      isactive: activeValue ?? formData.is_active,
      total_cost: totalCost || 0,
      updatedby_id: loginStatus.id,
    };

    setIsSaving(true);
    try {
      const response = await axiosClient.post(
        POST_API.UPDATE_ACCOUNT_SERVICE,
        postData,
        { withCredentials: true },
      );
      if (response.data.status) {
        toast.success(response.data.message);
        // handleUpdateAccountService();
        getAccountServiceDetail();
        // onClose();
      } else toast.error(response.data.message);
    } catch (error: any) {
      handleApiError(error);
      // if (error.status === STATUS_CODE.UNATHORISED) {
      //   const refreshTokenResponse = await RefreshToken({
      //     callFunction: handleUpdate,
      //   });

      //   if (refreshTokenResponse) {
      //     await handleUpdate();
      //   }

      // } else {
      //   toast.error(error.response?.data || "Error updating account service");
      // }
    } finally {
      setIsSaving(false);
    }
  };

  const addField = () => {
    setFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: "", value: "" }
    ]);
  };

  const updateField = (
    id: string,
    fieldName: "key" | "value",
    value: string,
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [fieldName]: value } : f)),
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const serviceBookingSourceOptions = toSelectOptions(
    serviceBookingSource,
    "id",
    "name",
  );

  const serviceLocationTypeOptions = toSelectOptions(
    serviceLocationType,
    "id",
    "name",
  );

  const serviceStatusOptions = toSelectOptions(serviceStatus, "id", "name");

  if (loading) {
    return <ShimmerEffect></ShimmerEffect>;
  }
  return (
    <div className=" shadow-sm p-1 w-full">
      <form onSubmit={handleUpdate}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center
            text-2xl font-semibold text-white bg-blue-500 shrink-0"
            >
              {accountServiceDetail?.company_product_name
                ? accountServiceDetail.company_product_name
                    .charAt(0)
                    .toUpperCase()
                : "?"}
            </div>

            <div className="flex flex-col">
              {/* Product Name */}
              <h2 className="table-header-custom">
                {accountServiceDetail?.company_product_name ||
                  "Unnamed Product"}
              </h2>

              <span className="caption-custom">
                Account Name :{" "}
                <span className="caption-custom">
                  {accountServiceDetail?.account_name || "-"}
                </span>
              </span>
            </div>
          </div>

          <div className="mr-2">
            <label className="flex items-center gap-1 text-sm text-gray-700">
              {formData.is_active ? (
                <CheckCircle2 size={14} className="text-blue-500" />
              ) : (
                <XCircle size={14} className="text-blue-500" />
              )}
              Status
            </label>
            <div className="flex gap-2 items-center">
              <ToggleButton
                checked={formData.is_active}
                name="is_active"
                onToggle={(e) => {
                  const checked = e.target.checked;

                  setFormData((prev) => ({
                    ...prev,
                    is_active: checked,
                  }));

                  handleUpdateStatus(e, checked);
                }}
              />
              <span
                className={`text-sm ${
                  formData.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {formData.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Top Details */}
        <div className="grid grid-cols-4 gap-1 ">
          {/* <MetaField
          label="Account Service Code"
          value={accountServiceDetail?.account_service_code || "-"}
        /> */}
          <DisplayComponent
            icon={FileCode}
            title="Account Service Code"
            value={
              accountServiceDetail?.account_service_code
                ? accountServiceDetail?.account_service_code
                : "-"
            }
            penLogo={false}
          />

          <DisplayComponent
            icon={CalendarClock}
            title="Service Date Time"
            value={`${accountServiceDetail?.service_booking_date} ${accountServiceDetail?.service_booking_time}`}
            penLogo={false}
          />

          <DisplayComponent
            icon={User}
            title="Createdby"
            value={accountServiceDetail?.createdBy || "-"}
            penLogo={false}
          />

          <DisplayComponent
            icon={Calendar}
            title="Createdon"
            value={accountServiceDetail?.createdOn || "-"}
            penLogo={false}
          />
        </div>

        <div className="grid grid-cols-4 gap-1 mt-1">
          <div>
            {/* {!isLoadingForServiceBookingSource && (
              <CustomDropdown
                logo={Share2}
                preselectedOption={selectedServiceBookingSource}
                requiredRedDot
                labelName="Source"
                options={serviceBookingSource!}
                onSelect={setSelectedServiceBookingSource}
              />
            )} */}

            {!isLoadingForServiceBookingSource && (
              <CustomSelect
                label="Source"
                value={selectedServiceBookingSource}
                onChange={setSelectedServiceBookingSource}
                options={serviceBookingSourceOptions}
                icon={Share2}
                isRequired
              />
            )}
            {showErrorAtServiceBookingSource &&
              !selectedServiceBookingSource && (
                <div className="text-red-500 text-xs">
                  Please select Service Booking Source
                </div>
              )}
          </div>

          <div>
            {/* {!isLoadingForServiceLocationType && (
              <CustomDropdown
                logo={MapPin}
                preselectedOption={selectedServiceLocationType}
                requiredRedDot
                labelName="Location"
                options={serviceLocationType!}
                onSelect={setSelectedServiceLocationType}
              />
            )} */}
            {!isLoadingForServiceLocationType && (
              <CustomSelect
                label="Location"
                value={selectedServiceLocationType}
                onChange={setSelectedServiceLocationType}
                options={serviceLocationTypeOptions}
                icon={MapPin}
                isRequired
              />
            )}

            {showErrorAtServiceLocationType && !selectedServiceLocationType && (
              <div className="text-red-500 text-xs">
                Please select Service Location Type
              </div>
            )}
          </div>

          <div>
            {/* {!isLoadingForServiceStatus && (
              <CustomDropdown
                logo={Activity}
                preselectedOption={selectedServiceStatus}
                requiredRedDot
                labelName="Status"
                options={serviceStatus!}
                onSelect={setSelectedServiceStatus}
                
              />
            )} */}
            {!isLoadingForServiceStatus && (
              <CustomSelect
                label="Status"
                value={selectedServiceStatus}
                onChange={setSelectedServiceStatus}
                options={serviceStatusOptions}
                icon={Activity}
                isRequired
              />
            )}

            {showErrorAtServiceStatus && !selectedServiceStatus && (
              <div className="text-red-500 text-xs">
                Please select Service Status
              </div>
            )}
          </div>

          <div>
            <DatePickerInput
              label="Booking Date"
              name="service_booking_date"
              onChange={handleChange}
              logo={Calendar}
              required
              value={formData.service_booking_date}
            />
            {showErrorAtServiceBookingDateError && (
              <div className="text-red-500 text-xs">
                Please select Service Booking Date
              </div>
            )}
          </div>

          <div className="col-span-1">
            <label className="block input-label-custom">
              <div className="flex gap-1 items-center">
                <Clock size={13} className="text-blue-600" />
                <span>Booking Time</span>
              </div>
            </label>

            <CustomSelect
              placeholder="Select Service Booking Time"
              label=""
              value={
                timeOptions.find(
                  (t) => t.name === formData.service_booking_time,
                )?.id
              }
               onChange={handleBookingTimeChange}
               options={bookingTimeOptions}
            />

            {showErrorAtServiceBookingTimeError && (
              <div className="text-red-500 text-xs">
                Please select Service Booking Time
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <FormInput
              required
              type="number"
              label="Total Cost"
              placeholder="Enter total cost"
              logo={IndianRupee}
              defaultValue={totalCost}
              value={totalCost === "" ? "" : totalCost}
              onChange={handleCostChange}
            />
            {totalCostError && (
              <p className="text-xs  text-red-600 ">{totalCostError}</p>
            )}
          </div>

          <DatePickerInput
            label="Next Service Due Date"
            name="next_service_due_date"
            onChange={handleChange}
            logo={Calendar}
            value={formData.next_service_due_date}
          />

          <CompanyUserSearchFieldInput
            logo={User}
            label="Assign To:"
            defaultValue={accountServiceDetail?.assignedto_name}
            onUserSelected={setAssignedTo}
          />

          <div className="grid grid-cols-2 gap-1 col-span-full">
            <TextAreaInput
              logo={MapPin}
              rows={2}
              cols={2}
              label="Location Address"
              name="location_address"
              placeholder="Enter Location address"
              value={formData.location_address}
              maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
              onChange={handleChange}
            />

            <TextAreaInput
              logo={ShieldCheck}
              rows={2}
              cols={2}
              label="Note"
              name="service_notes"
              placeholder="Enter Service Note"
              value={formData.service_notes}
              onChange={handleChange}
            />
            <TextAreaInput
              logo={Ban}
              rows={2}
              cols={2}
              label="Cancellation Reason"
              name="cancellation_reason"
              placeholder="Enter Cancellation Reason"
              value={formData.cancellation_reason}
              maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
              onChange={handleChange}
            />
            <TextAreaInput
              logo={MessageSquare}
              rows={2}
              cols={2}
              label="Customer Feedback"
              name="customer_feedback"
              placeholder="Enter Customer Feedback"
              value={formData.customer_feedback}
              maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
              onChange={handleChange}
            />
          </div>

          <div className="p-2 bg-white border rounded-lg shadow-sm col-span-4 min-h-[85px] ">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <SlidersHorizontal size={14} className="text-blue-500" />
                <h3 className="flex  gap-1 input-label-custom">
                  Customizations
                </h3>
              </div>

              <Button
                type="button"
                onClick={addField}
                className={COLORS.ADD_BUTTON}
              >
                + Add
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
              {fields?.map((field) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <input
                    type="text"
                    placeholder="Customization name"
                    value={field.key}
                    onChange={(e) =>
                      updateField(field.id, "key", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded-md placeholder:text-sm"
                  />

                  <input
                    type="text"
                    placeholder="Enter Value"
                    value={field.value}
                    onChange={(e) =>
                      updateField(field.id, "value", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded-md placeholder:text-sm"
                  />

                  <button type="button" onClick={() => removeField(field.id)}>
                    <Trash
                      size={SIZE.ICON_DELETE_BUTTON_SIZE}
                      className={COLORS.ICON_DELETE_BUTTON}
                    ></Trash>
                  </button>
                </div>
              ))}

              {fields?.length === 0 && (
                <div className="flex items-center justify-center w-full bg-slate-00">
                  <p className="caption-custom italic ">
                    No customization fields added yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full flex items-center justify-between mt-1 w-full">
            <div className="flex items-center gap-20 flex-wrap">
              <div className="flex items-center">
                <FormCheckbox
                  label="Is Follow Up Required"
                  name="is_follow_up_required"
                  onChange={handleFollowUpChange}
                  checked={isFollowUpRequired}
                />
              </div>

              <div className="flex items-center ">
                <CustomerRating
                  logo={ThumbsUp}
                  label="Customer Rating"
                  onChange={handleCustomerRatingChange}
                  value={customerRating}
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={!userHasAccessToUpdateAccountService}
              >
                <div className="flex items-center gap-1">
                  <Save size={SIZE.SIXTEEN} />
                  <span>Save</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountServiceDetails;
