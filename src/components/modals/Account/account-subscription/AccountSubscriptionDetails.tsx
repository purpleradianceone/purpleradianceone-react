/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  
  IndianRupee,
  Package,
  RefreshCw,
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

import { SIZE, VALIDATIONS } from "../../../../constants/AppConstants";
import { handleApiError } from "../../../../config/error/handleApiError";

import axiosClient from "../../../../axios-client/AxiosClient";

import AccountSubscriptionProps from "../../../../@types/account/AccountSubscriptionProps";
import ShimmerEffect from "../account-service/ShimerEffect";
import COLORS from "../../../../constants/Colors";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import FormInput from "../../../ui/FormInput";
import MetaInfoItem from "../../../ui/MetaInfoItem";

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
      <div className="p-1 shadow-sm w-full bg-gray-50 ">
        {/* Header */}
  <div className="flex flex-col gap-2">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-[350px_1fr]">
            {/* Logo */}
            <div className="px-3 py-4 border-r border-slate-200 flex gap-4 mt-1">
            <div className="flex items-center ">
             <div className={`p-3 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR} flex items-center justify-center shrink-0`}>
              <RefreshCw className={COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE} />
            </div>
            </div>
              {/* Product + Account Name */}

              <div>
                <h2 className="page-header-custom">
                  {accountSubscriptionDetail?.companyProductName}
                </h2>

                <p
                  className={`${COLORS.PRIMARY_PURPLE}
                ${COLORS.LIGHT_PURPLE_BACKGROUND}
                caption-custom !font-bold w-fit px-2  rounded-md`}
                >
                  {accountSubscriptionDetail?.accountSubscriptionCode}
                </p>

                <p className="caption-custom mt-1">
                  Account Name :
                  <span className="caption-custom !font-bold !text-slate-700">
                    {" "}
                    {accountSubscriptionDetail?.accountName}
                  </span>
                </p>
              </div>
            </div>

 {/* Top Details */}
            <div className="px-3 py-7">
  <div className="grid grid-cols-5 gap-4">

    <MetaInfoItem
  icon={Repeat}
  label="Is Renewal"
  value={
    accountSubscriptionDetail?.isRenewal
      ? "Yes"
      : "No"
  }
/>

<MetaInfoItem
  icon={User}
  label="Created By"
  value={accountSubscriptionDetail?.createdBy}
  iconBgClass="bg-orange-50"
  iconColorClass="text-orange-600"
/>

<MetaInfoItem
  icon={Calendar}
  label="Created On"
  value={accountSubscriptionDetail?.createdOn}
  iconBgClass="bg-blue-50"
  iconColorClass="text-blue-600"
/>

     <div className="flex flex-col border-l pl-6 ">
            <label className="flex items-center caption-custom gap-1">
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
        </div>
          </div>
        </div>

            <div>
            <div className="bg-white rounded-xl border border-slate-200  shadow-sm px-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <div className={COLORS.SECTION_HEADER_ICON_STYLE}>
                <User size={16} />
                </div>
                <h3 className="table-header-custom">Subscription Information</h3>
              </div>

 {/* Form Section */}

        <div className="grid grid-cols-3 gap-10 items-start my-1 ">
          <div className="border-r pr-7">
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

          <div className="border-r pr-7">
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

          <div >
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

          </div>
        </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
               
              </div>
            </div>
                </div>
       


       
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
               <div className={COLORS.SECTION_HEADER_ICON_STYLE}>
                <Package size={16} />
                </div>
              <h3 className="table-header-custom">Package Details</h3>
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
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 mt-3">
  {packages.map((pkg, index) => (
    <div
      key={pkg.id}
      className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-1 border-b bg-slate-50">
  <div className="flex items-center gap-2">
    <div
      className={`w-7 h-7 rounded-lg ${COLORS.LIGHT_PURPLE_BACKGROUND}
      flex items-center justify-center`}
    >
      <Package size={16} className={COLORS.PRIMARY_PURPLE} />
    </div>

    <span className="font-medium">
      Package {index + 1}
    </span>
  </div>

  {pkg.isNew && (
    <button
      type="button"
      onClick={() => removePackage(pkg.id)}
    >
      <Trash
        size={16}
        className="text-red-500 hover:text-red-600"
      />
    </button>
  )}
</div>

      {/* Package Table */}
      <div className="p-">
        <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
          <tbody>
  {/* Package Name Row */}
  <tr className="border-b">
    <td className="w-1/2 px-3 py-2 input-label-custom !font-medium bg-slate-50 border-r">
      Package Name
    </td>
    <td className="px-3 py-2">
      <input
        value={pkg.packageName}
        placeholder="Enter package name"
        onChange={(e) =>
          updatePackageName(pkg.id, e.target.value)
        }
        className="w-full bg-transparent focus:outline-none table-header-custom placeholder:text-xs font-normal"
      />
    </td>
  </tr>

  {/* Existing Fields */}
  {pkg.field.map((f) => (
    <tr key={f.id} className="border-b last:border-b-1 table-header-custom">
      <td className="w-1/2 px-3 py-2 input-label-custom !font-medium bg-slate-50 border-r">
        {f.key}
      </td>

      <td className="px-3 py-2">
        {f.key === "Active" ? (
              <div className="flex justify-start items-center">
          <ToggleButton
            checked={f.value === "true"}
            onToggle={(e) =>
              handlePackageChange(
                pkg.id,
                f.id,
                e.target.checked ? "true" : "false"
              )
            }
            name=""
          />
              </div>
        ) : (
          <input
            value={f.value}
            onChange={(e) =>
              handlePackageChange(
                pkg.id,
                f.id,
                e.target.value
              )
            }
            className="w-full bg-transparent focus:outline-none text-sm"
          />
        )}
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  ))}
</div>
        </div>

        {/* Buttons */}

        <div className="flex items-center justify-end gap-2 mt-3 mr-2">
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
