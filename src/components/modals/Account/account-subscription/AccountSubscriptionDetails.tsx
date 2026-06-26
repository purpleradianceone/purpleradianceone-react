/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  FileCode,
  IndianRupee,
  Package,
  Repeat,
  Save,
  Trash,
  User,
  XCircle,
} from "lucide-react";

import Button from "../../../ui/Button";
import DatePickerInput from "../../../ui/DatePickerInput";
import ToggleButton from "../../../ui/ToggleButton";

import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";

import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

import {
  SIZE,
  VALIDATIONS,
} from "../../../../constants/AppConstants";
import { handleApiError } from "../../../../config/error/handleApiError";

import axiosClient from "../../../../axios-client/AxiosClient";

import AccountSubscriptionProps from "../../../../@types/account/AccountSubscriptionProps";
import ShimmerEffect from "../account-service/ShimerEffect";
import COLORS from "../../../../constants/Colors";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import FormInput from "../../../ui/FormInput";
import { DisplayComponent } from "../account-company-product/account-company-product-details/AccountCompanyProductDetailsCard";

interface CustomField {
  id: string;
  key: string;
  value: string;
}

interface PackageDetail {
  id: string;
  packageName: string;
  field: CustomField[];
  isNew?: boolean;
}

const AccountSubscriptionDetails = () => {
  const { accountSubscriptionId } = useParams<{
    accountSubscriptionId: string;
  }>();
  const { loginStatus } = useLoggedInUserContext();

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [packages, setPackages] = useState<PackageDetail[]>([]);

  const [totalCost, setTotalCost] = useState<number | "">("");
  const [totalCostError, setTotalCostError] = useState<string>("");

  const [accountSubscriptionDetail, setAccountSubscriptionDetail] =
    useState<AccountSubscriptionProps | null>(null);

  const intialFormData = {
    start_date: "",
    end_date: "",
    package_detail: "",
    is_active: false,
  };

  const [formData, setFormData] = useState(intialFormData);

  const [showStartDateError, setShowStartDateError] = useState(false);
  const [showEndDateError, setShowEndDateError] = useState(false);

  const { userHasAccessToUpdateAccountSubscription } = useUserAccessModules();
  // -----------------------
  // Handle Input Change
  // -----------------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const getAccountSubscriptionDetail = async () => {
    try {
      setLoading(true);

      const postData = {
        company_id: loginStatus.companyId,
        id: Number(accountSubscriptionId),
        requestedby_id: loginStatus.id,
      };

      const response = await axiosClient.post(
        POST_API.GET_ACCOUNT_SUBSCRIPTION,
        postData,
        { withCredentials: true },
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
          isAddedToInvoiceDraft: data.is_added_to_invoice_draft,
          isRenewal: data.is_renewal,
          isActive: data.isactive,
          totalCost: data.total_cost,
          createdBy: data.createdby,
          createdOn: data.createdon,
        };

        const packageObj =
          typeof data.package_detail === "string"
            ? JSON.parse(data.package_detail)
            : data.packagedetail || {};

        const packagesArray: PackageDetail[] = Object.entries(packageObj).map(
          ([packageName, values]: any) => ({
            id: crypto.randomUUID(),
            packageName,
            isNew: false,
            field: Object.entries(values).map(([key, value]) => ({
              id: crypto.randomUUID(),
              key,
              value: String(value),
            })),
          }),
        );

        setPackages(packagesArray);
        setTotalCost(data.total_cost);

        setAccountSubscriptionDetail(formattedData);

        setFormData({
          start_date: data.start_date,
          end_date: data.end_date,
          package_detail: JSON.stringify(data.packagedetail, null, 2),
          is_active: data.isactive,
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

    if (totalCost === "" || totalCost < 0) {
      setTotalCostError("Total Cost is required");
      flag = false;
    } else {
      setTotalCostError("");
    }

    return flag;
  };

  const handleUpdate = async (
    event?: React.FormEvent<HTMLFormElement> | React.ChangeEvent,
    activeValue?: boolean,
  ) => {
    event?.preventDefault();
    if (!userHasAccessToUpdateAccountSubscription) {
      toast.error("You are not authorized user");
      return;
    }

    if (!validateForm()) return;

    if (!validatePackages()) return;
    if (isSaving) return;

    const packageJSON = buildPackageJson();

    const postData = {
      company_id: loginStatus.companyId,
      id: Number(accountSubscriptionId),
      start_date: formData.start_date,
      end_date: formData.end_date,
      package_detail: JSON.stringify(packageJSON),
      isactive: activeValue ?? formData.is_active,
      total_cost: totalCost || 0,
      updatedby_id: loginStatus.id,
    };

    setIsSaving(true);

    try {
      const response = await axiosClient.post(
        POST_API.UPDATE_ACCOUNT_SUBSCRIPTION,
        postData,
        { withCredentials: true },
      );

      if (response.data.status) {
        toast.success(response.data.message);

        getAccountSubscriptionDetail();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      handleApiError(error);
    //   if (error.status === STATUS_CODE.UNATHORISED) {
    //     const refreshTokenResponse = await RefreshToken({
    //       callFunction: handleUpdate,
    //     });

    //     if (refreshTokenResponse) {
    //       await handleUpdate();
    //     }
    //   } else {
    //     toast.error(error.response?.data || "Error updating subscription");
    //   }
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
        isNew: true,
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
          },
        ],
      },
    ]);
  };

  const removePackage = (packageId: string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
  };

  const updatePackageName = (packageId: string, name: string) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === packageId ? { ...pkg, packageName: name } : pkg,
      ),
    );
  };

  const handlePackageChange = (
    packageId: string,
    fieldId: string,
    val: string,
  ) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === packageId
          ? {
              ...pkg,
              field: pkg.field.map((f) =>
                f.id === fieldId ? { ...f, value: val } : f,
              ),
            }
          : pkg,
      ),
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

        if (pkg.isNew) {
          result[pkg.packageName]["Active"] = "true";
        }
      }
    });

    console.log(result);
    return result;
  };

  const validatePackages = () => {
    const packageNames = new Set();

    for (const pkg of packages) {
      // ✅ Strict Package Name Validation
      if (
        pkg.packageName == null || // handles null & undefined
        pkg.packageName.trim() === "" ||
        pkg.packageName.trim().toLowerCase() === "null" ||
        pkg.packageName.trim().toLowerCase() === "undefined"
      ) {
        toast.error("Package name must not be empty");
        return false;
      }

      const normalizedName = pkg.packageName.trim().toLowerCase();

      // ✅ Duplicate check
      if (packageNames.has(normalizedName)) {
        toast.error(`Duplicate package name: ${pkg.packageName}`);
        return false;
      }
      packageNames.add(normalizedName);

      let allowed = 0;
      let completed = 0;

      for (const f of pkg.field) {
        if (f.key === "Allowed") {
          if (!f.value || isNaN(Number(f.value))) {
            toast.error(`Allowed must be a valid number in ${pkg.packageName}`);
            return false;
          }
          allowed = Number(f.value);
        }

        if (f.key === "Completed") {
          if (!f.value || isNaN(Number(f.value))) {
            toast.error(
              `Completed must be a valid number in ${pkg.packageName}`,
            );
            return false;
          }
          completed = Number(f.value);
        }
      }

      if (completed > allowed) {
        toast.error(
          `Package : ${pkg.packageName}\nCompleted cannot be greater than Allowed`,
        );
        return false;
      }
    }

    return true;
  };

  if (loading) {
    return <ShimmerEffect />;
  }

  return (
    <form onSubmit={handleUpdate}>
      <div className="p-1 shadow-sm w-full">
        {/* Header */}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center
      text-2xl font-semibold text-white bg-blue-500 shrink-0"
            >
              {accountSubscriptionDetail?.companyProductName
                ? accountSubscriptionDetail.companyProductName
                    .charAt(0)
                    .toUpperCase()
                : "?"}
            </div>

            {/* Product + Account Name */}
            <div className="flex flex-col">
              <h2 className="table-header-custom">
                {accountSubscriptionDetail?.companyProductName ||
                  "Unnamed Product"}
              </h2>

              <span className="caption-custom">
                Account Name :{" "}
                <span className="caption-custom">
                  {accountSubscriptionDetail?.accountName || "-"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Top Details */}

        <div className="grid grid-cols-4 gap-1">
          {/* <MetaField
          label="Account Subscription Code"
          value={accountSubscriptionDetail?.accountSubscriptionCode || "-"}
        ></MetaField> */}

          <DisplayComponent
            icon={FileCode}
            title="Account Subscription Code"
            value={String(
              accountSubscriptionDetail?.accountSubscriptionCode || "-",
            )}
            penLogo={false}
          />

          {/* <MetaField
          label="Account Name"
          value={accountSubscriptionDetail?.accountName || "-"}
        ></MetaField> */}

          {/* <MetaField
          label="Company Product"
          value={accountSubscriptionDetail?.companyProductName || "-"}
        ></MetaField> */}

          {/* <MetaField
          label="Start Date"
          value={accountSubscriptionDetail?.startDate || "-"}
        ></MetaField>
        <MetaField
          label="End Date"
          value={accountSubscriptionDetail?.endDate || "-"}
        ></MetaField> */}

          {/* <MetaField
          label="Is Renewal"
          value={accountSubscriptionDetail?.isRenewal ? "Yes" : "No"}
        ></MetaField> */}

          <DisplayComponent
            icon={Repeat}
            title="Is Renewal"
            value={accountSubscriptionDetail?.isRenewal ? "Yes" : "No"}
            penLogo={false}
          />

          {/* <MetaField
          label="Total Cost"
          value={accountSubscriptionDetail?.totalCost || "-"}
        ></MetaField> */}

          {/* <MetaField
          label="Createdby"
          value={accountSubscriptionDetail?.createdBy || "-"}
        ></MetaField>

        <MetaField
          label="Createdon"
          value={accountSubscriptionDetail?.createdOn || "-"}
        ></MetaField> */}
          <DisplayComponent
            icon={User}
            title="Createdby"
            value={accountSubscriptionDetail?.createdBy || "-"}
            penLogo={false}
          />

          <DisplayComponent
            icon={Calendar}
            title="Createdon"
            value={accountSubscriptionDetail?.createdOn || "-"}
            penLogo={false}
          />
        </div>

        {/* Form Section */}

        <div className="grid grid-cols-4 gap-1 items-start my-1">
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
              <div className="text-red-500 text-xs">Please select End Date</div>
            )}
          </div>

          <div>
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

          <div className="flex flex-col justify-start pt-1 ">
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

                  handleUpdate(e, checked);
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

        <div className="p-1 bg-white border rounded-lg shadow-sm col-span-2  min-h-[180px]">
          <div className="flex justify-between mb-1 items-center ">
            <div className="flex items-center gap-1">
              <Package size={14} className="text-blue-500" />
              <h3 className="flex gap-1 input-label-custom">Package Details</h3>
            </div>
            <Button
              type="button"
              onClick={addPackage}
              className={COLORS.ADD_BUTTON}
            >
              + Add Package
            </Button>
          </div>

          {/* Packages */}
          <div className="grid grid-cols-4 gap-3 p-1 ">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="border p-2 rounded-md gap-1 bg-gray-50 "
              >
                {/* Package Name + Remove */}
                <div className="flex items-center mb-2 gap-5 pr-2 justify-between ">
                  <input
                    value={pkg.packageName}
                    placeholder="Package Name"
                    onChange={(e) => updatePackageName(pkg.id, e.target.value)}
                    className=" input-label-custom border px-2 py-1 rounded flex-1 items-center justify-between focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {pkg.isNew && (
                    <button type="button" onClick={() => removePackage(pkg.id)}>
                      <Trash
                        size={SIZE.ICON_DELETE_BUTTON_SIZE}
                        className={COLORS.ICON_DELETE_BUTTON}
                      ></Trash>
                    </button>
                  )}
                </div>

                {/* Package Fields */}
                {pkg.field.map((f) => (
                  <div key={f.id} className="flex gap-2 mb-2 items-center ">
                    {/* Key */}
                    <input
                      value={f.key}
                      readOnly
                      className=" input-label-custom border rounded bg-gray-100 px-2 py-1 w-[140px] shrink-0 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />

                    {/* Value */}
                    {f.key === "Active" ? (
                      <>
                        <ToggleButton
                          checked={f.value === "true"}
                          onToggle={(e) => {
                            handlePackageChange(
                              pkg.id,
                              f.id,
                              e.target.checked ? "true" : "false",
                            );
                          }}
                          name={""}
                        />
                      </>
                    ) : (
                      <input
                        value={f.value}
                        onChange={(e) =>
                          handlePackageChange(pkg.id, f.id, e.target.value)
                        }
                        className=" input-label-custom border rounded bg-gray-100 px-2 py-1 w-[140px] shrink-0 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}

        <div className="flex items-center justify-end gap-2 mt-6">
          <div>
            <Button
              type="submit"
              disabled={!userHasAccessToUpdateAccountSubscription}
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
  );
};

export default AccountSubscriptionDetails;
