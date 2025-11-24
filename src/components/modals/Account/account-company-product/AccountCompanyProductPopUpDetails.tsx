/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createPortal } from "react-dom";
import AccountProduct from "../../../../@types/account/AccountProduct";
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  LucideCalendar,
  LucideIcon,
  MapPin,
  Package,
  Pen,
  User,
  X,
} from "lucide-react";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import GetCompanyUsers from "../../../views/manage-company-users/CompanyUsersManagement";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import FormHeader from "../../../ui/FormHeader";
import COLORS from "../../../../constants/Colors";
import { SIZE } from "../../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import TextAreaInput from "../../../ui/TextAreaInput";
import FormInput from "../../../ui/FormInput";
import DatePickerInput from "../../../ui/DatePickerInput";
import IntervalType from "../../../../@types/interval/IntervalType";
import { Item } from "../../../../constants/NumberList";

const AccountCompanyProductPopUpDetails = ({
  selectedProductCard,
  onClose,
  refreshKey,
}: {
  selectedProductCard: AccountProduct | null;
  onClose: () => void;
  refreshKey: number;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [
    openCompanyUserModuleForInstalledByChange,
    setOpenCompanyUserModuleForInstalledByChange,
  ] = useState<boolean>(false);
  const [productData, setProductData] = useState<AccountProduct | null>(
    selectedProductCard
  );

  //  Fix: Update productData whenever selectedProductCard changes
  useEffect(() => {
    if (selectedProductCard) {
      setProductData(selectedProductCard);
    }
  }, [selectedProductCard, refreshKey]);


 
  const handleChangeInstalledBy = () => {
    setOpenCompanyUserModuleForInstalledByChange(true);
  };

  const handleSelctedInstalledByUser = (data: CompanyUser) => {
    if (data.id === productData?.installedBy) {
      toast.error("Select different user.");
      return;
    }
    if ((data.id > 0 && data.id !== null) || data.id !== undefined) {
      updateAccountCompanyProduct("installed_by", data.id, data.fullname);
      setOpenCompanyUserModuleForInstalledByChange(false);
    }
  };

  const formattedDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj
      .toLocaleString("defalut", { month: "short" })
      .toLowerCase();
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  function formatDate(dateStr: string): string {
    const formattedInput = dateStr.replace(/-/g, " ");
    const date = new Date(formattedInput);

    // Validate date
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }

    // Format options for "Oct 19, 2025"
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  }

  // const handleValueChange = (title: string, value: string | number) => {
  //   console.log(title + " => " + value);
  //   if (title === "interval") {
  //     updateAccountCompanyProduct("warranty", value);
  //   }

  //   if (title === "intervalOption") {
  //     updateAccountCompanyProduct("warranty_interval_type_id", value);
  //   }

  //   if (title === "amcInterval") {
  //     updateAccountCompanyProduct("amc_cycle", value);
  //   }

  //   if (title === "amcIntervalOption") {
  //     updateAccountCompanyProduct("amc_cycle_interval_type_id", value);
  //   }
  // };
  const handleDescriptionChange = (field: string, newValue: string) => {
    if (field === "Delivery Address") {
      updateAccountCompanyProduct("delivery_address", newValue);
    }
    if (field === "Billing Address") {
      updateAccountCompanyProduct("billing_address", newValue);
    }

    if (field === "Warranty Terms") {
      updateAccountCompanyProduct("warranty_terms", newValue);
    }

    if (field === "Quantity") {
      updateAccountCompanyProduct("quantity", parseInt(newValue));
    }

    if (field === "Purchase Date") {
      updateAccountCompanyProduct("purchase_date", formattedDate(newValue));
    }
    if (field === "Delivery Date") {
      updateAccountCompanyProduct("delivery_date", formattedDate(newValue));
    }
    if (field === "Installation Date") {
      updateAccountCompanyProduct("installation_date", formattedDate(newValue));
    }

    if (field === "AMC Start Date") {
      updateAccountCompanyProduct(
        "amc_cycle_start_date",
        formattedDate(newValue)
      );
    }

    if (field === "AMC End Date") {
      updateAccountCompanyProduct(
        "amc_cycle_end_date",
        formattedDate(newValue)
      );
    }

    if (field === "Warranty Start Date") {
      updateAccountCompanyProduct(
        "warranty_start_date",
        formattedDate(newValue)
      );
    }

    if (field === "Warranty End Date") {
      updateAccountCompanyProduct("warranty_end_date", formattedDate(newValue));
    }
    console.log(field + " -> " + newValue);
  };
  const handleClose = () => {
    setOpenCompanyUserModuleForInstalledByChange(false);
  };
 

  const updateAccountCompanyProduct = async (
    field: string,
    value: any,
    displayName?: string
  ) => {
    // Keep previous state for rollback
    const previousState = productData;

    // Optimistically update (optional – to make UI feel fast)
    setProductData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };

      switch (field) {
        case "installed_by":
          updated.installedBy = value;
          updated.installedByName = displayName!;
          break;
        case "billing_address":
          updated.billingAddress = value;
          break;
        case "delivery_address":
          updated.deliveryAddress = value;
          break;
        case "warranty_terms":
          updated.warrantyTerms = value;
          break;
        case "quantity":
          updated.quantity = parseInt(value);
          break;
        case "purchase_date":
          updated.purchaseDate = formatDate(value);
          break;
        // add other cases if needed
      }
      return updated;
    });

    try {
      const postData = {
        id: productData?.id,
        [field]: value,
        company_id: loginStatus.companyId,
        updatedby_id: loginStatus.id,
      };

      const response = await axios.post(
        POST_API.UPDATE_ACCOUNT_COMPANY_PRODUCT,
        postData,
        { withCredentials: true }
      );

      if (response.data.status) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Update failed!");
        //  Rollback to previous data
        setProductData(previousState);
      }
    } catch (error: any) {
      toast.error("Network error: Unable to update.");
      //  Rollback to previous data
      setProductData(previousState);
    }
  };

  if (selectedProductCard === null) return null;
  return (
    productData &&
    createPortal(
      <div className="fixed inset-0  bg-black bg-opacity-5 flex justify-center items-center z-50 p-4">
        <div className="bg-gray-50  border rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
          {/* Header */}
          <div className="relative px-6 pt-4 pb-3">
            <button
              onClick={() => {
                onClose();
                setProductData(null);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-blue-400">
                {productData!.companyProductName
                  ? productData!.companyProductName.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  {productData!.companyProductName ? (
                    productData?.companyProductName
                  ) : (
                    <span className="text-sm italic">Un-Named Product</span>
                  )}
                </h2>
                <p className="text-md text-gray-600 mt-1 flex items-center">
                  <Briefcase size={16} className="inline mr-2" />
                  {productData!.accountName ? (
                    <>
                      {" "}
                      <span>account name : {productData.accountName}</span>
                    </>
                  ) : (
                    <span className="text-sm italic">No account name</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-2">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2"> */}
              {/* Left Section */}
              <div className="grid  grid-cols-2 md:grid-cols-4 gap-1   rounded p-0.5 ">
                <DisplayComponent
                  icon={Package}
                  title="Quantity"
                  value={productData.quantity
                    .toLocaleString()
                    .concat(" " + productData.unitNameInStock)}
                  penLogo={false}
                />
                {productData.serialNumber && (
                  <DisplayComponent
                    icon={Package}
                    title="Serial Number"
                    value={
                      productData.serialNumber ? productData.serialNumber : ""
                    }
                    penLogo={false}
                  />
                )}

                {productData.barcode && (
                  <DisplayComponent
                    icon={Package}
                    title="Barcode"
                    value={
                      productData.barcode ? productData.barcode : ""
                    }
                    penLogo={false}
                  />
                )}

                <InfoBlock
                  icon={Calendar}
                  title="Purchase Date"
                  type="date"
                  value={productData!.purchaseDate}
                  onValueChange={handleDescriptionChange}
                  penLogo={true}
                />

                <InfoBlock
                  icon={Calendar}
                  title="Delivery Date"
                  type="date"
                  value={productData!.deliveryDate}
                  onValueChange={handleDescriptionChange}
                  penLogo={true}
                />

                <InfoBlock
                  icon={Calendar}
                  title="Installation Date"
                  type="date"
                  value={productData!.installationDate}
                  onValueChange={handleDescriptionChange}
                  penLogo={true}
                />
                <div
                  className="cursor-pointer"
                  onClick={handleChangeInstalledBy}
                >
                  <DisplayComponent
                    icon={Calendar}
                    title="Installed By"
                    value={productData!.installedByName}
                    penLogo={true}
                  />
                </div>
              </div>

              {/* Right Section */}
              {/* <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1  bg-gray-00 rounded p-0.5">
                  <div className="col-span-2 ">
                    <InfoRow
                      icon={Shield}
                      title="Warranty"
                      intervalName="interval"
                      intervalOptionName="intervalOption"
                      onValueChange={handleValueChange}
                      displayValue={productData.warrantyIntervalName}
                      interval={rangeOfNumber}
                      intervalOption={intervalTypeData}
                      selectedIntervalOptionValue={
                        productData.warrantyIntervalTypeId
                      }
                      selectedIntervalTypevalue={productData.warranty}
                      penLogo={true}
                    />
                  </div>
                  <InfoBlock
                    icon={Clock}
                    title="Warranty Start Date"
                    type="date"
                    value={productData!.warrantyStartDate}
                    onValueChange={handleDescriptionChange}
                    penLogo={true}
                  />
                  <InfoBlock
                    icon={Clock}
                    title="Warranty End Date"
                    type="date"
                    value={productData!.warrantyEndDate}
                    onValueChange={handleDescriptionChange}
                    penLogo={true}
                  />
                </div> */}

                {/* <div className="grid grid-cols-2 gap-1  bg-gray-00 rounded p-0.5">
                  <div className="col-span-2">
                    <InfoRow
                      icon={Shield}
                      title="Amc"
                      intervalName="amcInterval"
                      intervalOptionName="amcIntervalOption"
                      onValueChange={handleValueChange}
                      displayValue={productData.amcIntervalName}
                      interval={rangeOfNumber}
                      intervalOption={intervalTypeData}
                      selectedIntervalOptionValue={
                        productData.amcCycleIntervalTypeId
                      }
                      selectedIntervalTypevalue={productData.amcCycle}
                      penLogo={true}
                    />
                  </div>
                  <InfoBlock
                    icon={Clock}
                    title="AMC Start Date"
                    type="date"
                    value={productData!.amcCycleStartDate}
                    onValueChange={handleDescriptionChange}
                    penLogo={true}
                  />
                  <InfoBlock
                    icon={Clock}
                    title="AMC End Date"
                    type="date"
                    value={productData!.amcCycleEndDate}
                    onValueChange={handleDescriptionChange}
                    penLogo={true}
                  />
                </div>
                */}
              {/* </div> */}
            {/* </div> */}

            <div className="space-y-2 grid grid-cols-1">
              {/* Addresses */}

              <InfoBlock
                type="textarea"
                icon={MapPin}
                title="Delivery Address"
                value={productData!.deliveryAddress}
                penLogo={true}
                onValueChange={handleDescriptionChange}
              />

              <InfoBlock
                type="textarea"
                icon={Building2}
                title="Billing Address"
                value={productData!.billingAddress}
                penLogo={true}
                onValueChange={handleDescriptionChange}
              />

              {/* Warranty Terms */}

              <InfoBlock
                type="textarea"
                icon={FileText}
                title="Warranty Terms"
                value={productData!.warrantyTerms}
                penLogo={true}
                onValueChange={handleDescriptionChange}
              />
            </div>
          </div>
        </div>
        {openCompanyUserModuleForInstalledByChange &&
          createPortal(
            <>
              <div className="fixed inset-0 z-50 bg-black bg-opacity-5   flex justify-center items-center  p-2 sm:p-2">
                <div className="bg-white w-full max-w-6xl h-[90vh]   rounded  p-2 relative overflow-auto">
                  <FormHeader
                    icon={User}
                    onClose={handleClose}
                    description="select the new installed by user"
                    preText="Select the new user "
                  />
                  <GetCompanyUsers
                    onRowSelect={handleSelctedInstalledByUser}
                    isUsedInAccountProductForAssingingInstalledBy={true}
                  />
                </div>
              </div>
            </>,
            document.body
          )}
      </div>,
      document.body
    )
  );
};

export default AccountCompanyProductPopUpDetails;

// interface InfoRowProps {
//   icon: LucideIcon;
//   title: string;
//   intervalName: string;
//   intervalOptionName: string;
//   selectedIntervalTypevalue?: string | number;
//   selectedIntervalOptionValue?: string | number;
//   displayValue: string | number;
//   penLogo?: boolean;
//   intervalOption?: IntervalType[];
//   interval?: Item[];
//   onValueChange: (title: string, value: number | string) => void;
// }

// function InfoRow({
//   icon: Logo,
//   title,
//   intervalName,
//   intervalOptionName,
//   displayValue,
//   selectedIntervalTypevalue,
//   selectedIntervalOptionValue,
//   penLogo,
//   intervalOption,
//   interval,
//   onValueChange,
// }: InfoRowProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedValue, setSelectedValue] = useState(
//     selectedIntervalTypevalue ?? ""
//   );
//   const [selectedIntervalOption, setSelectedIntervalOption] = useState(
//     selectedIntervalOptionValue ?? ""
//   );
//   const [changedValue, setChangedValue] = useState<string | number>(
//     displayValue ?? ""
//   );

//   // Helper function to combine display value
//   const updateLocalDisplayValue = (value: string, optionValue: string) => {
//     if (value && optionValue) {
//       const intervalLabel =
//         interval?.find((i) => i.id.toString() === value)?.name ?? "";
//       const optionLabel =
//         intervalOption?.find((i) => i.id!.toString() === optionValue)?.name ??
//         "";
//       const newDisplay = `${intervalLabel} ${optionLabel}`.trim();
//       setChangedValue(newDisplay);
//     }
//   };

//   // Handle first dropdown change (interval number)
//   const handleChange = React.useCallback(
//     (event: React.ChangeEvent<HTMLSelectElement>) => {
//       const newValue = event.target.value;
//       setSelectedValue(newValue);
//       updateLocalDisplayValue(
//         newValue,
//         selectedIntervalOption.toLocaleString()
//       );
//       requestAnimationFrame(() => onValueChange(intervalName, newValue));
//       setIsEditing(false);
//     },
//     [intervalName, onValueChange, selectedIntervalOption]
//   );

//   // Handle second dropdown change (interval type like day/week)
//   const handleIntervalOptionChange = React.useCallback(
//     (event: React.ChangeEvent<HTMLSelectElement>) => {
//       const newValue = event.target.value;
//       setSelectedIntervalOption(newValue);
//       updateLocalDisplayValue(selectedValue.toString(), newValue);
//       requestAnimationFrame(() => onValueChange(intervalOptionName, newValue));
//       setIsEditing(false);
//     },
//     [intervalOptionName, onValueChange, selectedValue]
//   );

//   // Memoized dropdown options
//   const intervalOptions = React.useMemo(
//     () =>
//       interval?.map((item) => (
//         <option key={item.id} value={item.id}>
//           {item.name}
//         </option>
//       )),
//     [interval]
//   );

//   const intervalOptionOptions = React.useMemo(
//     () =>
//       intervalOption?.map((item) => (
//         <option key={item.id} value={item.id!}>
//           {item.name}
//         </option>
//       )),
//     [intervalOption]
//   );

//   return (
//     <div className="flex w-full items-start gap-3 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
//       <div className="flex-shrink-0 p-2 bg-blue-50 rounded-full">
//         <Logo
//           className={`${COLORS.FORM_HEADER_ICONS_COLOR}`}
//           size={SIZE.SIXTEEN}
//         />
//       </div>
//       <div>
//         <h4 className="font-medium text-gray-900 mb-1">{title}</h4>

//         {!isEditing ? (
//           <div
//             className="flex items-center gap-2 hover:bg-gray-200 rounded px-2 cursor-pointer"
//             onClick={() => setIsEditing(true)}
//           >
//             <p className="text-gray-700">
//               {changedValue ? (
//                 changedValue
//               ) : (
//                 <span className="text-sm italic">Not provided</span>
//               )}
//             </p>
//             {penLogo && <Pen className="text-blue-600" size={12} />}
//           </div>
//         ) : (
//           <div className="flex flex-row gap-2">
//             <select
//               className="border rounded px-2 py-1"
//               value={selectedValue}
//               onChange={handleChange}
//             >
//               {intervalOptions}
//             </select>

//             <select
//               className="border rounded px-2 py-1"
//               value={selectedIntervalOption}
//               onChange={handleIntervalOptionChange}
//             >
//               {intervalOptionOptions}
//             </select>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// this function is only used in the warranty and amc

interface InfoBlockProps {
  type: "text" | "number" | "none" | "textarea" | "date" | "interval";
  icon: LucideIcon;
  title: string;
  value: string | number;
  penLogo?: boolean;
  onValueChange?: (field: string, newValue: string) => void; // 🔹 callback to parent
  intervalOption?: IntervalType[];
  interval?: Item[];
}

function DisplayComponent({
  value,
  penLogo,
  title,
  icon: Logo,
}: {
  value: string;
  penLogo: boolean;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex w-full h-fit items-start gap-3 p-2 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="flex-shrink-0 p-1 bg-blue-50 rounded-full">
        <Logo
          className={`${COLORS.FORM_HEADER_ICONS_COLOR}`}
          size={SIZE.SIXTEEN}
        />
      </div>

      <div className="flex flex-col w-full">
        <h4 className="font-semibold text-gray-900 mb-1 text-base">{title}</h4>

        <div className="flex items-center justify-between group px-2 py-0.5 rounded-md transition-colors duration-200 hover:bg-gray-100 cursor-pointer">
          <p className="text-gray-700 text-sm">
            {value.length > 30
              ? value.substring(0, 29).concat("...")
              : value || (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
          </p>
          {penLogo && <Pen className="text-blue-500 " size={14} />}
        </div>
      </div>
    </div>
  );
}
function InfoBlock({
  icon: Logo,
  title,
  value,
  penLogo,
  onValueChange,
  type,
  intervalOption,
  interval,
}: InfoBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [changedValue, setChangedValue] = useState<string | number>(value);
  const prevValueRef = useRef(value);

  //  Safely handle both string and number date values
  function convertToInputDateFormat(dateValue?: string | number): string {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";

    //  Format based on local time (not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const handleClick = () => {
    setChangedValue(value);
    prevValueRef.current = value;
    setIsEditing(true);
  };

  const handleBlur = (
    event:
      | React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = event.target.value.trim();

    setIsEditing(false);
    // Note : need to make changes here
    const trimmedValue = event.target.value.trim();
    // Step 1: Check if value changed
    if (trimmedValue === prevValueRef.current) {
      // toast.error(MESSAGE.ERROR.NO_CHANGES);
      return; // No changes made, do nothing
    }

    if (title === "Quantity") {
      const isValid = event.target.value.trim().match(/^(?!0$)[1-9]\d*$/);

      if (!isValid) {
        //revert to previous value
        const syntheticEvent = {
          target: { value: prevValueRef.current },
        } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

        // onChange?.(syntheticEvent);
        setChangedValue(syntheticEvent.target.value);

        toast.error("Quantity is required.");
        return;
      }
    }

    setChangedValue(newValue);
    // Pass the changed value to parent
    if (newValue !== prevValueRef.current && onValueChange) {
      onValueChange(title, newValue);
    }
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setChangedValue(event.target.value);
  };

  return (
    <div className="flex w-full h-fit items-start gap-3 p-2 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="flex-shrink-0 p-1 items-center bg-blue-50 rounded-full">
        <Logo
          className={`${COLORS.FORM_HEADER_ICONS_COLOR}`}
          size={SIZE.FOURTEEN}
        />
      </div>
      <div className="w-full">
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>

        {!isEditing ? (
          <div
            onClick={handleClick}
            className="flex items-center gap-2 hover:cursor-pointer hover:bg-gray-200 rounded px-2"
          >
            <p className="text-gray-700">
              {changedValue || (
                <span className="text-sm italic">Not provided</span>
              )}
            </p>
            {penLogo && <Pen className="text-blue-600" size={12} />}
          </div>
        ) : type === "textarea" ? (
          <div className="w-full">
            <TextAreaInput
              autoFocus={true}
              cols={3}
              label={title}
              rows={2}
              defaultValue={changedValue}
              onChange={handleTextAreaChange}
              onBlur={handleBlur}
              className="w-full"
            />
          </div>
        ) : type === "number" ? (
          <FormInput
            type="number"
            defaultValue={value}
            onBlur={handleBlur}
            min={0}
            autoFocus={true}
          />
        ) : type === "text" ? (
          <FormInput />
        ) : type === "date" ? (
          <div>
            {/* installation date */}
            <DatePickerInput
              label=""
              logo={LucideCalendar}
              defaultValue={convertToInputDateFormat(value)}
              placeholder="Select Date"
              onBlur={handleBlur}
            />
          </div>
        ) : type === "interval" ? (
          <div>
            <select value={value} onChange={handleBlur} defaultValue={value}>
              <option value="">Select Interval</option>
              {interval &&
                interval.map((item) => (
                  <option value={item.id!}>{item.name}</option>
                ))}
            </select>
            <select value={value} onChange={handleBlur} defaultValue={value}>
              {intervalOption &&
                intervalOption.map((item) => (
                  <option value={item.id!}>{item.name}</option>
                ))}
            </select>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
