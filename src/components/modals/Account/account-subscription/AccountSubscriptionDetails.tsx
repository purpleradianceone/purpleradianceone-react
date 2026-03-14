/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, } from "lucide-react";

import Button from "../../../ui/Button";
import DatePickerInput from "../../../ui/DatePickerInput";
import ToggleButton from "../../../ui/ToggleButton";

import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";

import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import RefreshToken from "../../../../config/validations/RefreshToken";

import { STATUS_CODE } from "../../../../constants/AppConstants";
import { handleApiError } from "../../../../config/error/handleApiError";

import axiosClient from "../../../../axios-client/AxiosClient";


import AccountSubscriptionProps from "../../../../@types/account/AccountSubscriptionProps";
import ShimmerEffect from "../account-service/ShimerEffect";
import MetaField from "../../../ui/MetaField";

const AccountSubscriptionDetails = () => {

    const { accountSubscriptionId } = useParams<{ accountSubscriptionId: string }>();
    const { loginStatus } = useLoggedInUserContext();

    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [accountSubscriptionDetail, setAccountSubscriptionDetail] =
        useState<AccountSubscriptionProps | null>(null);

    const intialFormData = {
        start_date: "",
        end_date: "",
        package_detail: "",
        is_active: false
    };

    const [formData, setFormData] = useState(intialFormData);

    const [showStartDateError, setShowStartDateError] = useState(false);
    const [showEndDateError, setShowEndDateError] = useState(false);

    // -----------------------
    // Handle Input Change
    // -----------------------

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const getAccountSubscriptionDetail = async () => {

        try {

            setLoading(true);

            const postData = {
                company_id: loginStatus.companyId,
                id: Number(accountSubscriptionId),
                requestedby_id: loginStatus.id
            };

            const response = await axiosClient.post(
                POST_API.GET_ACCOUNT_SUBSCRIPTION,
                postData,
                { withCredentials: true }
            );

            if (response.status === 200 && response.data) {

                const data = response.data[0];

                const formattedData: AccountSubscriptionProps = {

                    id: data.id,
                    companyId: data.company_id,
                    accountSubscriptionCode: data.account_subscription_code,
                    accountId: data.account_id,
                    accountName: data.account_name,
                    companyProductId: data.company_product_id,
                    companyProductName: data.company_product_name,
                    startDate: data.start_date,
                    endDate: data.end_date,
                    packageDetail: JSON.stringify(data.packagedetail, null, 2),
                    isRenewal: data.is_renewal,
                    isActive: data.isactive,
                    createdBy: data.createdby,
                    createdOn: data.createdon
                };

                setAccountSubscriptionDetail(formattedData);

                setFormData({
                    start_date: data.start_date,
                    end_date: data.end_date,
                    package_detail: JSON.stringify(data.packagedetail, null, 2),
                    is_active: data.isactive
                });

            }

        } catch (error) {

            handleApiError(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (accountSubscriptionId) {
            getAccountSubscriptionDetail();
        }

    }, [accountSubscriptionId]);



    const validateForm = () => {

        let flag = true;

        if (!formData.start_date) {
            setShowStartDateError(true);
            flag = false;
        } else {
            setShowStartDateError(false);
        }

        if (!formData.end_date) {
            setShowEndDateError(true);
            flag = false;
        } else {
            setShowEndDateError(false);
        }

        return flag;

    };

    // -----------------------
    // Update Account Subscription
    // -----------------------

    const handleUpdate = async (activeValue?: boolean) => {

        if (!validateForm()) return;

        if (isSaving) return;

        // let packageJSON = null;

        // try {

        //     packageJSON = formData.package_detail
        //         ? JSON.parse(formData.package_detail)
        //         : null;

        // } catch {

        //     toast.error("Invalid package detail JSON");
        //     return;

        // }

        const postData = {

            company_id: loginStatus.companyId,
            id: Number(accountSubscriptionId),
            start_date: formData.start_date,
            end_date: formData.end_date,
            package_detail: null,
            isactive: activeValue ?? formData.is_active,
            updatedby_id: loginStatus.id

        };

        console.log("-----------");
        alert(JSON.stringify(postData, null, 2));
        console.log("-----------");

        setIsSaving(true);

        try {

            const response = await axiosClient.post(
                POST_API.UPDATE_ACCOUNT_SUBSCRIPTION,
                postData,
                { withCredentials: true }
            );

            if (response.data.status) {

                toast.success(response.data.message);

                getAccountSubscriptionDetail();

            } else {

                toast.error(response.data.message);

            }

        } catch (error: any) {

            if (error.status === STATUS_CODE.UNATHORISED) {

                const refreshTokenResponse = await RefreshToken({
                    callFunction: handleUpdate
                });

                if (refreshTokenResponse) {
                    await handleUpdate();
                }

            } else {

                toast.error(error.response?.data || "Error updating subscription");

            }

        } finally {

            setIsSaving(false);

        }

    };

    if (loading) {
        return <ShimmerEffect />;
    }

    return (

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <h2 className="table-header-custom">
                    Account Subscription Details
                </h2>

            </div>

            {/* Top Details */}

            <div className="grid grid-cols-4 gap-6 mb-3 text-sm">

                <MetaField
                    label="Account Subscription Field"
                    value={accountSubscriptionDetail?.accountSubscriptionCode || "-"}
                ></MetaField>

                <MetaField
                    label="Account Name"
                    value={accountSubscriptionDetail?.accountName || "-"}
                ></MetaField>

                <MetaField
                    label="Company Product Name"
                    value={accountSubscriptionDetail?.companyProductName || "-"}
                ></MetaField>

                <MetaField
                    label="Start Date"
                    value={accountSubscriptionDetail?.startDate || "-"}
                ></MetaField>

                <MetaField
                    label="End Date"
                    value={accountSubscriptionDetail?.endDate || "-"}
                ></MetaField>

                <MetaField
                    label="Is Renewal"
                    value={accountSubscriptionDetail?.isRenewal ? "Yes" : "No"}
                ></MetaField>

                <MetaField
                    label="Createdby"
                    value={accountSubscriptionDetail?.createdBy || "-"}
                ></MetaField>

                <MetaField
                    label="Createdon"
                    value={accountSubscriptionDetail?.createdOn || "-"}
                ></MetaField>

            </div>

            {/* Form Section */}

            <div className="grid grid-cols-2 gap-4">

                <div>

                    <DatePickerInput
                        label="Start Date"
                        name="start_date"
                        onChange={handleChange}
                        logo={Calendar}
                        required
                        value={formData.start_date}
                    />

                    {showStartDateError && (
                        <div className="text-red-500 text-xs">
                            Please select Start Date
                        </div>
                    )}

                </div>

                <div>

                    <DatePickerInput
                        label="End Date"
                        name="end_date"
                        onChange={handleChange}
                        logo={Calendar}
                        required
                        value={formData.end_date}
                    />

                    {showEndDateError && (
                        <div className="text-red-500 text-xs">
                            Please select End Date
                        </div>
                    )}

                </div>



                <div className="flex gap-2 items-center">

                    <ToggleButton
                        checked={formData.is_active}
                        name="is_active"
                        onToggle={(e) => {

                            const checked = e.target.checked;

                            setFormData((prev) => ({
                                ...prev,
                                is_active: checked
                            }));

                            handleUpdate(checked);

                        }}
                    />

                    <span
                        className={`text-sm ${formData.is_active
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                    >

                        {formData.is_active ? "Active" : "Inactive"}

                    </span>

                </div>

            </div>

            {/* Buttons */}

            <div className="flex items-center justify-end gap-2 mt-6">

                <div>
                    <Button onClick={() => { }} type="button">
                        Cancel
                    </Button>
                </div>

                <div>

                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}
                        type="button"
                    >
                        Save
                    </Button>

                </div>

            </div>

        </div>

    );

};

export default AccountSubscriptionDetails;