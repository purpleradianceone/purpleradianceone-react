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

interface CustomField {
    id: string;
    key: string;
    value: string;
}

interface PackageDetail {
    id: string;
    packageName: string;
    field: CustomField[];
}

const AccountSubscriptionDetails = () => {

    const { accountSubscriptionId } = useParams<{ accountSubscriptionId: string }>();
    const { loginStatus } = useLoggedInUserContext();

    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [packages, setPackages] = useState<PackageDetail[]>([]);

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

                console.log("Data of account subscription");
                console.log(data);
                console.log("Data of account subscription");

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

                const packageObj =
                    typeof data.package_detail === "string"
                        ? JSON.parse(data.package_detail)
                        : data.packagedetail || {};

                const packagesArray: PackageDetail[] = Object.entries(packageObj).map(
                    ([packageName, values]: any) => ({
                        id: crypto.randomUUID(),
                        packageName,
                        field: Object.entries(values).map(([key, value]) => ({
                            id: crypto.randomUUID(),
                            key,
                            value: String(value)
                        }))
                    })
                );

                setPackages(packagesArray);

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

    const handleUpdate = async (activeValue?: boolean) => {

        if (!validateForm()) return;

        if (isSaving) return;

        const packageJSON = buildPackageJson();

        const postData = {
            company_id: loginStatus.companyId,
            id: Number(accountSubscriptionId),
            start_date: formData.start_date,
            end_date: formData.end_date,
            package_detail: JSON.stringify(packageJSON),
            isactive: activeValue ?? formData.is_active,
            updatedby_id: loginStatus.id

        };

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

    const addPackage = () => {

        setPackages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                packageName: "",
                field: [
                    {
                        id: crypto.randomUUID(),
                        key: "Allowed",
                        value: "",
                    },
                    {
                        id: crypto.randomUUID(),
                        key: "Completed",
                        value: "0",
                    }
                ],
            },
        ]);

    };

    const removePackage = (packageId: string) => {

        setPackages((prev) =>
            prev.filter((pkg) => pkg.id !== packageId)
        );

    };

    const updatePackageName = (packageId: string, name: string) => {

        setPackages((prev) =>
            prev.map((pkg) =>
                pkg.id === packageId
                    ? { ...pkg, packageName: name }
                    : pkg
            )
        );

    };

    const handlePackageChange = (
        packageId: string,
        fieldId: string,
        val: string
    ) => {

        setPackages((prev) =>
            prev.map((pkg) =>
                pkg.id === packageId
                    ? {
                        ...pkg,
                        field: pkg.field.map((f) =>
                            f.id === fieldId ? { ...f, value: val } : f
                        ),
                    }
                    : pkg
            )
        );

    };

    const buildPackageJson = () => {

        const result: any = {};

        packages.forEach((pkg) => {

            if (pkg.packageName) {

                result[pkg.packageName] = {};

                pkg.field.forEach((f) => {
                    result[pkg.packageName][f.key] = f.value;
                });

            }
        });

        console.log(result);
        return result;
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
                    label="Account Subscription Code"
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

                <div>
                    <div className="mt-6">

                        {/* Header */}

                        <div className="flex justify-between items-center mb-3">

                            <h3 className="font-semibold">Package Details</h3>

                            <button
                                type="button"
                                onClick={addPackage}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                + Add Package
                            </button>

                        </div>

                        {/* Packages */}

                        {packages.map((pkg) => (
                            <div key={pkg.id} className="border p-4 rounded-md mb-3 bg-gray-50">

                                {/* Package Name + Remove */}
                                <div className="flex items-center gap-2 mb-3">
                                    <input
                                        value={pkg.packageName}
                                        placeholder="Package Name"
                                        onChange={(e) => updatePackageName(pkg.id, e.target.value)}
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePackage(pkg.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Package Fields */}
                                {pkg.field.map((f) => (
                                    <div key={f.id} className="flex gap-2 mb-2 items-center">

                                        {/* Key */}
                                        <input
                                            value={f.key}
                                            readOnly
                                            className="border px-2 py-1 rounded bg-gray-100 w-40"
                                        />

                                        {/* Value */}
                                        {f.key === "IsActive" ? (
                                            <>
                                                <ToggleButton
                                                    checked={f.value === "true"}
                                                    onToggle={(e) => {
                                                        handlePackageChange(
                                                            pkg.id,
                                                            f.id,
                                                            e.target.checked ? "true" : "false"
                                                        );
                                                    }} name={""} />
                                                <span
                                                    className={`text-sm ${f.value === "true" ? "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    {f.value === "true" ? "Active" : "Inactive"}
                                                </span>
                                            </>
                                        ) : (
                                            <input
                                                value={f.value}
                                                onChange={(e) =>
                                                    handlePackageChange(pkg.id, f.id, e.target.value)
                                                }
                                                className="border px-2 py-1 rounded flex-1"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                    </div>
                </div>

            </div>

            {/* Buttons */}

            <div className="flex items-center justify-end gap-2 mt-6">
                <div>

                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}
                    >
                        Save
                    </Button>

                </div>

            </div>

        </div>

    );

};

export default AccountSubscriptionDetails;