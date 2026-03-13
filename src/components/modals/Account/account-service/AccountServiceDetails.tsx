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
} from "lucide-react";
import Button from "../../../ui/Button";
import TextAreaInput from "../../../ui/TextAreaInput";
import DatePickerInput from "../../../ui/DatePickerInput";
import FormCheckbox from "../../../ui/FormCheckbox";
import CustomerRating from "./CustomerRating";
import CompanyUserSearchFieldInput from "../../../ui/CompanyUserSearchFieldInput";
import CustomDropdown from "../../leads/CustomDropdown";
// import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";

import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { STATUS_CODE, VALIDATIONS } from "../../../../constants/AppConstants";
import { handleApiError } from "../../../../config/error/handleApiError";
import { useServiceStatus } from "../../../../config/hooks/useServiceStatus";
import { useServiceLocationType } from "../../../../config/hooks/useServiceLocationType";
import { useServiceBookingSource } from "../../../../config/hooks/useServiceBookingSource";
import axiosClient from "../../../../axios-client/AxiosClient";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import AccountServiceDetailProps from "../../../../@types/account/AccountServiceDetailProps";
import ShimmerEffect from "./ShimerEffect";

interface CustomField {
  id: string;
  key: string;
  value: string;
}

const AccountServiceDetails = () => {

  const { accountServiceId } = useParams<{ accountServiceId: string }>();
  const { loginStatus } = useLoggedInUserContext();

  const [isSaving, setIsSaving] = useState(false);

  // for fetching data account service detail
  const [loading, setLoading] = useState(false);
  const [selectedServiceStatus, setSelectedServiceStatus] = useState<number | undefined>(undefined);
  const [selectedServiceBookingSource, setSelectedServiceBookingSource] = useState<number | undefined>(undefined);
  const [selectedServiceLocationType, setSelectedServiceLocationType] = useState<number | undefined>(undefined);
  const [isFollowUpRequired, setIsFollowUpRequired] = useState(false);
  const [customerRating, setCustomerRating] = useState(0);
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
  const [error, setError] = useState({
    service_booking_date_error: "",
    service_booking_time_error: "",
    productId: false,
  });
  const [showErrorAtServiceStatus, setShowErrorAtServiceStatus] = useState(false);
  const [showErrorAtServiceBookingSource, setShowErrorAtServiceBookingSource] = useState(false);
  const [showErrorAtServiceLocationType, setShowErrorAtServiceLocationType] = useState(false);

  const { serviceStatus, isLoading: isLoadingForServiceStatus } = useServiceStatus();
  const { serviceLocationType, isLoading: isLoadingForServiceLocationType } = useServiceLocationType();
  const { serviceBookingSource, isLoading: isLoadingForServiceBookingSource } = useServiceBookingSource();

  const [accountServiceDetail, setAccountServiceDetail] = useState<AccountServiceDetailProps | null>(null);

  const intialFormData = {
    service_booking_date: "",
    service_booking_time: "",
    location_address: "",
    service_notes: "",
    cancellation_reason: "",
    customer_feedback: "",
    next_service_due_date: "",
  };

  const [formData, setFormData] = useState(intialFormData);

  // Time options
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        options.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return options;
  };
  const timeOptions = useMemo(() => generateTimeOptions(), []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFollowUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFollowUpRequired(e.target.checked);
  };

  const handleCustomerRatingChange = (value: number) => {
    setCustomerRating(value);
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
          service_date_time: data.service_date_time,
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
          isactive: data.isactive,
          createdBy: data.createdBy,
          createdOn: data.createdOn,
        };

        setAccountServiceDetail(formattedData);

        setFormData({
          service_booking_date: data.service_booking_date,
          service_booking_time: data.service_booking_time,
          location_address: data.location_address,
          service_notes: data.service_notes,
          cancellation_reason: data.cancellation_reason,
          customer_feedback: data.customer_feedback,
          next_service_due_date: data.next_service_due_date,
        });

        setSelectedServiceStatus(data.service_status_id);
        setSelectedServiceBookingSource(data.service_booking_source_id);
        setSelectedServiceLocationType(data.service_location_type_id);
        setIsFollowUpRequired(data.is_follow_up_required);
        setCustomerRating(data.customer_rating);

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
      setError((prev) => ({ ...prev, service_booking_date_error: "Please select Service Booking Date" }));
      toast.error("Please select Service Booking Date");
      flag = false;
    } else setError((prev) => ({ ...prev, service_booking_date_error: "" }));

    if (!formData.service_booking_time) {
      setError((prev) => ({ ...prev, service_booking_time_error: "Please select Service Booking Time" }));
      toast.error("Please select Service Booking Time");
      flag = false;
    } else setError((prev) => ({ ...prev, service_booking_time_error: "" }));

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

    return flag;
  };

  // Update account service
  const handleUpdate = async () => {
    // e.preventDefault();
    if (!validateForm()) return;


    if (isSaving) return;

    const postData = {
      company_id: loginStatus.companyId,
      id: Number(accountServiceId),
      service_booking_date: formData.service_booking_date,
      service_booking_time: formData.service_booking_time,
      service_status_id: selectedServiceStatus,
      service_booking_source_id: selectedServiceBookingSource,
      service_location_type_id: selectedServiceLocationType,
      location_address: formData.location_address,
      // assignedto: assignedTo?.id || null,
      assignedto: assignedTo?.id === 0 ? accountServiceDetail?.assignedto : assignedTo?.id,
      service_notes: formData.service_notes,
      // customizations: fields.length ? JSON.stringify(fields) : null,
      customizations: null,
      cancellation_reason: formData.cancellation_reason,
      customer_rating: customerRating,
      customer_feedback: formData.customer_feedback,
      next_service_due_date: formData.next_service_due_date,
      is_follow_up_required: isFollowUpRequired,
      isactive: true,
      updatedby_id: loginStatus.id,
    };
    console.log('----------------------');
    alert(JSON.stringify(postData, null, 2));
    console.log('----------------------');
    setIsSaving(true);
    try {
      const response = await axiosClient.post(POST_API.UPDATE_ACCOUNT_SERVICE, postData, { withCredentials: true });
      if (response.data.status) {
        toast.success(response.data.message);
        // handleUpdateAccountService();
        getAccountServiceDetail();
        // onClose();
      } else toast.error(response.data.message);
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: handleUpdate,
        });

        if (refreshTokenResponse) {
          await handleUpdate();
        }

      } else {
        toast.error(error.response?.data || "Error updating account service");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <ShimmerEffect></ShimmerEffect>;
  }
  return (

    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="table-header-custom">
          Account Service Details
        </h2>
      </div>

      {/* Top Details */}
      <div className="grid grid-cols-4 gap-6 mb-2 text-sm">

        <div>
          <p className="text-gray-500">Service Booking Source</p>
          <p className="font-medium">
            {accountServiceDetail?.service_booking_source || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Service Location Type</p>
          <p className="font-medium">
            {accountServiceDetail?.service_location_type || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Service Status</p>
          <p className="font-medium">
            {accountServiceDetail?.service_status || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Assigned To</p>
          <p className="font-medium">
            {accountServiceDetail?.assignedto_name || "-"}
          </p>
        </div>

      </div>

      {/* Booking Section */}
      <div className="grid grid-cols-4 gap-6 mb-6 text-sm">

        <div>
          <p className="text-gray-500">Service Booking Date</p>
          <p className="font-medium">
            {accountServiceDetail?.service_date_time || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Next Service Due Date</p>
          <p className="font-medium">
            {accountServiceDetail?.next_service_due_date || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Customer Rating</p>
          <p className="font-medium">
            {customerRating || "-"}
          </p>
        </div>

      </div>

      {/* Address */}
      <div className="mb-6 text-sm">
        <p className="text-gray-500 mb-1">Location Address</p>
        <p className="font-medium">
          {accountServiceDetail?.location_address || "-"}
        </p>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-2 gap-6 text-sm">

        <div>
          <p className="text-gray-500 mb-1">Service Notes</p>
          <p className="font-medium">
            {accountServiceDetail?.service_notes || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Cancellation Reason</p>
          <p className="font-medium">
            {accountServiceDetail?.cancellation_reason || "-"}
          </p>
        </div>

      </div>

      {/* Feedback */}
      <div className="mt-6 text-sm">
        <p className="text-gray-500 mb-1">Customer Feedback</p>
        <p className="font-medium">
          {accountServiceDetail?.customer_feedback || "-"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {!isLoadingForServiceBookingSource && (
          <CustomDropdown
            logo={Share2}
            preselectedOption={selectedServiceBookingSource}
            requiredRedDot
            labelName="Service Booking Source :"
            options={serviceBookingSource!}
            onSelect={setSelectedServiceBookingSource}
          />
        )}
        {showErrorAtServiceBookingSource && !selectedServiceBookingSource && (
          <div className="text-red-500 text-xs">Please select Service Booking Source</div>
        )}

        {!isLoadingForServiceLocationType && (
          <CustomDropdown
            logo={MapPin}
            preselectedOption={selectedServiceLocationType}
            requiredRedDot
            labelName="Service Location Type :"
            options={serviceLocationType!}
            onSelect={setSelectedServiceLocationType}
          />
        )}
        {showErrorAtServiceLocationType && !selectedServiceLocationType && (
          <div className="text-red-500 text-xs">Please select Service Location Type</div>
        )}

        {!isLoadingForServiceStatus && (
          <CustomDropdown
            logo={Activity}
            preselectedOption={selectedServiceStatus}
            requiredRedDot
            labelName="Service Status :"
            options={serviceStatus!}
            onSelect={setSelectedServiceStatus}
          />
        )}
        {showErrorAtServiceStatus && !selectedServiceStatus && (
          <div className="text-red-500 text-xs">Please select Service Status</div>
        )}

        <DatePickerInput
          label="Service Booking Date"
          name="service_booking_date"
          onChange={handleChange}
          logo={Calendar}
          error={error.service_booking_date_error}
          required
          value={formData.service_booking_date}
        />

        <div className=" col-span-1">
          <label htmlFor="service_booking_time" className="block input-label-custom">
            <div className="flex gap-1 items-center">
              <Clock size={13} className="text-blue-600" />
              <span>Service Booking Time:</span>
            </div>
          </label>
          <select
            id="service_booking_time"
            name="service_booking_time"
            value={formData.service_booking_time}
            className=" w-full pl-3 pr-10 py-1 border border-gray-300 rounded-md"
            onChange={handleChange}
          >
            <option value="">Select Service Booking Time</option>
            {timeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {error.service_booking_time_error && (
            <div className="caption-custom-inactive">{error.service_booking_time_error}</div>
          )}
        </div>

        <TextAreaInput
          logo={MapPin}
          rows={3}
          cols={4}
          label="Location Address: "
          name="location_address"
          placeholder="Enter Location address"
          value={formData.location_address}
          maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
          onChange={handleChange}
        />
        <TextAreaInput
          logo={ShieldCheck}
          rows={3}
          cols={4}
          label="Service Note: "
          name="service_notes"
          placeholder="Enter Service Note"
          value={formData.service_notes}
          onChange={handleChange}
        />
        <TextAreaInput
          logo={Ban}
          cols={4}
          rows={3}
          label="Cancellation Reason: "
          name="cancellation_reason"
          placeholder="Enter Cancellation Reason"
          value={formData.cancellation_reason}
          maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
          onChange={handleChange}
        />
        <TextAreaInput
          logo={MessageSquare}
          cols={4}
          rows={3}
          label="Customer Feedback: "
          name="customer_feedback"
          placeholder="Enter Customer Feedback"
          value={formData.customer_feedback}
          maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
          onChange={handleChange}
        />

        {/* Custom fields */}
        <div className="p-6 bg-white border rounded-lg shadow-sm max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Customization Fields</h3>
            <button type="button" onClick={() => setFields([...fields, { id: crypto.randomUUID(), key: "", value: "" }])} className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Add</button>
          </div>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input type="text" placeholder="Key" value={field.key} onChange={(e) => setFields(prev => prev.map(f => f.id === field.id ? { ...f, key: e.target.value } : f))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
                <input type="text" placeholder="Value" value={field.value} onChange={(e) => setFields(prev => prev.map(f => f.id === field.id ? { ...f, value: e.target.value } : f))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
                <button type="button" onClick={() => setFields(prev => prev.filter(f => f.id !== field.id))} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
              </div>
            ))}
            {fields.length === 0 && <p className="text-center text-gray-400 py-4 italic">No customization fields added yet.</p>}
          </div>
        </div>

        <FormCheckbox label="Is Follow Up Required" name="is_follow_up_required" onChange={handleFollowUpChange} checked={isFollowUpRequired} />
        <DatePickerInput label="Next Service Due Date" name="next_service_due_date" onChange={handleChange} logo={Calendar} value={formData.next_service_due_date} />

        <CompanyUserSearchFieldInput logo={User} label="Assign To:" defaultValue={accountServiceDetail?.assignedto_name} onUserSelected={setAssignedTo} />

        <CustomerRating logo={ThumbsUp} label="Customer Rating" onChange={handleCustomerRatingChange} value={customerRating} />
      </div>


      <div className="flex  tems-center justify-end gap-2">

        <div>
          <Button onClick={() => { }} type="button">Cancel</Button>
        </div>
        <div><Button onClick={(e) => {
          e.preventDefault();
          handleUpdate();
        }} type="submit">Save</Button></div>
      </div>


    </div>


  );
};

export default AccountServiceDetails;