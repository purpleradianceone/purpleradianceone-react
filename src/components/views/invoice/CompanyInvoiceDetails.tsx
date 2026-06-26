/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { FaFilePdf } from "react-icons/fa";
import TextAreaInput from "../../ui/TextAreaInput";
import SearchInput from "../../ui/SearchInput";
import MetaField from "../../ui/MetaField";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { PageLayout } from "../../ui/PageLayout";
import AccountInvoiceProps from "../../../@types/account/AccountInvoiceProps";
import { handleApiError } from "../../../config/error/handleApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import axiosClient from "../../../axios-client/AxiosClient";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import FormInput from "../../ui/FormInput";
import {
  formatQuantity,
  formatRupee,
} from "../../../utils/helperMethods/formatFunctions";
import {
  Check,
  ChevronRight,
  Download,
  LucideLightbulb,
  LucideSubtitles,
  Pencil,
  RotateCcw,
  Save,
  Send,
  Trash,
  User,
  X,
} from "lucide-react";
import CompanyInvoiceItemProps from "../../../@types/invoice/CompanyInvoiceItemProps";
import InvoiceStatusChip from "../../ui/InvoiceStatusChip";
import CustomDocumentPreviewComponent from "../../custom-document-preview-component/CustomDocumentPreviewComponent";
import LoadingPopUpAnimation from "../card/LoadingPopUpAnimation";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import {
  InvoiceHeaderSkeleton,
  InvoiceItemsSkeleton,
} from "./CompanyInvoiceDetailSkeleton";
import { LookupAccountDropdown } from "../lookups/lookup-account/LookupAccountDropdown";
import ROUTES_URL from "../../../constants/Routes";
import COLORS from "../../../constants/Colors";
import MESSAGE from "../../../constants/Messages";
import useInvoiceType from "../../../config/hooks/useInvoiceType";
import { amountToWords } from "../../../utils/helperMethods/amountToWords";
import ConfirmationDialog from "../../dialogue-box/ConfirmationDialogue";

function CompanyInvoiceDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<AccountInvoiceProps | null>(null);
  const [previousInvoice, setPreviousInvoice] =
    useState<AccountInvoiceProps | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const { loginStatus } = useLoggedInUserContext();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [tempItems, setTempItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [InvoicePreview, setInvoicePreview] = useState<string | null>(null);
  const [showCompanyInvoicePreview, setShowCompanyInvoicePreview] =
    useState(false);
  const [showConfirmationDialoge, setShowConfirmationDialoge] =
    useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showAccountName, setShowAccountName] = useState<boolean>(false);
  const isCreateMode = !invoiceId || Number(invoiceId) === 0;
  const { invoiceType, isLoading } = useInvoiceType();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [searchParams] = useSearchParams();
  const isUsedForSearchParams = searchParams.get("isNavigateFrom");

  const {
    userHasAccessToViewCompanyInvoiceItem,
    userHasAccessToUpdateCompanyInvoiceItem,
    userHasAccessToAddCompanyInvoiceItem,
    userHasAccessToUpdateCompanyInvoiceApproval,
    userHasAccessToUpdateCompanyInvoice,
    userHasAccessToViewCompanyInvoice,
    userHasAccessToAddCompanyInvoiceDraft,
    userHasAccessToViewCompanyInvoiceDraft,
    userHasAccessToUpdateCompanyInvoiceDraft,
  } = useUserAccessModules();

  const getInvoices = async (signal: AbortSignal) => {
    if(loginStatus.companyId === 0)return;
    if (!userHasAccessToViewCompanyInvoiceDraft) return;
    setInvoiceLoading(true);
    const postData = {
      id: Number(invoiceId),
      company_id: loginStatus.companyId,
      limit: 1,
      offset: 0,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(POST_API.GET_INVOICE, postData, {
        signal,
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;

        console.log(response.data);

        // ✅ Handle both array & object safely
        const item = Array.isArray(responseData)
          ? responseData[0]
          : responseData;

        if (!item) return;

        setDisabled(item.invoice_status_name?.trim().toUpperCase() !== "DRAFT");

        const formattedData: AccountInvoiceProps = {
          id: item.id,
          companyId: item.company_id,
          invoiceNumber: item.invoice_number,
          accountId: item.account_id,
          accountName: item.account_name,
          invoiceDate: item.invoice_date,
          dueDate: item.due_date,
          billingAddress: item.billing_address,
          shippingAddress: item.shipping_address,
          termAndConditions: item.terms_and_conditions,
          remarks: item.remark,
          basicValue: item.basic_value,
          discountAmount: item.discount_amount,
          taxableValue: item.taxable_value,
          totalTax: item.total_tax,
          totalAmount: item.total_amount,
          adjustmentForRoundOff: item.adjustment_for_round_off,
          status: item.invoice_status_name,
          statusId: item.invoice_status_id,
          isActive: item.isactive,
          createdBy: item.createdby,
          updatedBy: item.updatedby,
          createdOn: item.createdon,
          updatedOn: item.updatedon,
        };

        // ✅ Set single object (NOT array)
        setInvoice(formattedData);
        setPreviousInvoice(formattedData); // store previous for reset
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setInvoiceLoading(false);
      console.log("into inv finally");
    }
  };
  console.log(disabled);

  const getInvoiceItems = async (signal: AbortSignal) => {
    if(loginStatus.companyId === 0)return;
    if (
      !invoiceId ||
      Number(invoiceId) === 0 ||
      !userHasAccessToViewCompanyInvoiceItem
    )
      return;
    setItemsLoading(true);
    const postData = {
      company_id: loginStatus.companyId,
      company_invoice_id: Number(invoiceId),
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.GET_INVOICE_ITEM,
        postData,
        {
          signal,
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data?.sort(
          (a: any, b: any) => a.id - b.id,
        ); // Sort by ID to maintain order

        console.log("Invoice Items:", responseData);

        // ✅ Always treat as array
        const items = Array.isArray(responseData)
          ? responseData
          : [responseData];

        const formattedItems: CompanyInvoiceItemProps[] = items.map(
          (item: any) => ({
            id: item.id,
            companyId: item.company_id,
            companyInvoiceId: item.company_invoice_id,

            companyProductId: item.company_product_id,
            companyProductName: item.company_product_name,

            accountCompanyProductId: item.account_company_product_id,
            accountServiceId: item.account_service_id,
            accountSubscriptionId: item.account_subscription_id,

            hsn: item.hsn,
            sac: item.sac,

            quantity: item.quantity,
            rate: item.rate,
            basicValue: item.basic_value,

            discountPercent: item.discount_percent,
            discountAmount: item.discount_amount,
            taxableValue: item.taxable_value,

            cgstPercent: item.cgst_percent,
            sgstPercent: item.sgst_percent,
            igstPercent: item.igst_percent,
            cessPercent: item.cess_percent,

            cgstAmount: item.cgst_amount,
            sgstAmount: item.sgst_amount,
            igstAmount: item.igst_amount,
            cessAmount: item.cess_amount,

            totalTax: item.total_tax,
            totalAmount: item.total_amount,

            isActive: item.isactive,

            createdBy: item.createdby,
            updatedBy: item.updatedby,

            createdOn: item.createdon,
            updatedOn: item.updatedon,

            requestedById: item.requestedby_id,
          }),
        );

        // ✅ Set items array
        setItems(formattedItems);
        setTempItems(formattedItems);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setItemsLoading(false);
      console.log("into items finally");
    }
  };

  const SubmitInvoice = async () => {
    if(loginStatus.companyId === 0)return;
    if (!invoice) return;
    if (disabled) {
      return;
    }
    if (!userHasAccessToUpdateCompanyInvoiceApproval) {
      return;
    }
    const postData = {
      id: invoice.id,
      company_id: loginStatus.companyId,
      invoice_status_id: 2,
      updatedby_id: loginStatus.id,
      isactive: invoice.isActive,
    };
    console.log(postData);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_INVOICE,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        getInvoices(new AbortController().signal);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewInvoice = async () => {
    if(loginStatus.companyId === 0)return;
    if (!userHasAccessToViewCompanyInvoice) return;
    setIsSubmitting(true);

    try {
      const response = await axiosClient.post(
        POST_API.PREVIEW_COMPANY_INVOICE,
        {
          company_id: loginStatus.companyId,
          company_invoice_id: Number(invoiceId),
          company_invoice_type_id: 1,
          company_invoice_type: "Copy Type",
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "blob",
          withCredentials: true, // ✅ IMPORTANT
        },
      );
      const blob = new Blob([response.data], {
        type: "application/pdf", // fixed for invoice
      });

      console.log(response.data);

      const fileUrl = URL.createObjectURL(blob);

      // ✅ Same as your task document logic
      setInvoicePreview(fileUrl); // you can rename this later (e.g. setInvoicePreview)
      setShowCompanyInvoicePreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to preview invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRoundOff = () => {
    setInvoice((prev: any) => ({
      ...prev,
      adjustmentForRoundOff: previousInvoice?.adjustmentForRoundOff, // remove roundOff impact
    }));
  };

  const getRoundOffValues = (total: number) => {
    const roundedTotal = Math.round(total);
    const roundOff = Number((roundedTotal - total).toFixed(2));
    return {
      roundedTotal, // final rounded amount
      roundOff, // adjustment (+/-)
      isRounded: roundOff === 0, // ✅ true if already rounded
    };
  };

  const [roundOffValues, setRoundOffValues] = useState(
    getRoundOffValues(invoice?.totalAmount ?? 0),
  );

  useEffect(() => {
    setRoundOffValues(getRoundOffValues(invoice?.totalAmount ?? 0));
  }, [invoice?.adjustmentForRoundOff, invoice?.totalAmount, invoice]);

  const updateInvoice = async () => {
    if(loginStatus.companyId === 0)return;
    if (!invoice) return;
    if (disabled) {
      return;
    }
    if (!userHasAccessToUpdateCompanyInvoiceDraft) return;
    const postData = {
      id: invoice.id,
      company_id: loginStatus.companyId,
      due_date: invoice.dueDate,
      invoice_status_id: null,
      billing_address: invoice.billingAddress,
      shipping_address: invoice.shippingAddress,
      adjustment_for_round_off: invoice.adjustmentForRoundOff,
      terms_and_conditions: invoice.termAndConditions,
      remark: invoice.remarks,
      updatedby_id: loginStatus.id,
      isactive: invoice.isActive,
    };
    console.log(postData);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_INVOICE,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        getInvoices(new AbortController().signal);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvoiceDownload = async (invoiceTypeId: number | null) => {
    if(loginStatus.companyId === 0)return;
    if (!disabled) return;
    if (!userHasAccessToViewCompanyInvoice) return;
    setIsSubmitting(true);
    console.log(POST_API.COMPANY_INVOICE_DOWNLOAD);

    try {
      const response = await axiosClient.post(
        POST_API.COMPANY_INVOICE_DOWNLOAD,
        {
          company_id: loginStatus.companyId,
          company_invoice_id: Number(invoiceId),
          company_invoice_type_id: invoiceTypeId,
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "blob", // ✅ IMPORTANT
          withCredentials: true,
        },
      );

      const blob = new Blob([response.data], {
        type: "application/pdf", // fixed for invoice
      });

      console.log(response.data);

      const fileUrl = URL.createObjectURL(blob);
      setInvoicePreview(fileUrl); // you can rename this later (e.g. setInvoicePreview)
      setShowCompanyInvoicePreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (item: any) => {
    if(loginStatus.companyId === 0)return;
    console.log("Delete item with id:", item.id);
    console.log(disabled);

    if (disabled) {
      return;
    }

    const postData = {
      company_id: loginStatus.companyId,
      id: item.id,
      isactive: false, // Soft delete
      updatedby_id: loginStatus.id,
    };
    console.log(postData);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_INVOICE_ITEM,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setRefreshCount((prev) => prev + 1); // trigger refresh of items
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscountChange = (id: number, discountPercent: number) => {
    setTempItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const safeDiscount = Math.max(0, Math.min(100, discountPercent));

        const discountAmount = (item.basicValue * safeDiscount) / 100;
        const taxableValue = item.basicValue - discountAmount;

        const cgstAmount = (taxableValue * item.cgstPercent) / 100;
        const sgstAmount = (taxableValue * item.sgstPercent) / 100;
        const igstAmount = (taxableValue * item.igstPercent) / 100;
        const cessAmount = (taxableValue * item.cessPercent) / 100;

        const totalTax = cgstAmount + sgstAmount + igstAmount + cessAmount;
        const totalAmount = taxableValue + totalTax;

        return {
          ...item,
          discountPercent: safeDiscount,
          discountAmount,
          taxableValue,
          cgstAmount,
          sgstAmount,
          igstAmount,
          cessAmount,
          totalTax,
          totalAmount,
        };
      }),
    );
  };

  const summary = tempItems.reduce(
    (acc, item) => {
      acc.basic += item.basicValue || 0;
      acc.discount += item.discountAmount || 0;
      acc.taxable += item.taxableValue || 0;
      acc.tax += item.totalTax || 0;
      acc.total += item.totalAmount || 0;
      acc.cess += item.cessAmount || 0;
      acc.igst += item.igstAmount || 0;
      return acc;
    },
    { basic: 0, discount: 0, taxable: 0, tax: 0, total: 0, cess: 0, igst: 0 },
  );

  const hasCess = tempItems.some(
    (i) => i.cessAmount != null && i.cessAmount > 0,
  );
  const isIGST = tempItems.some(
    (i) => i.igstAmount != null && i.igstAmount > 0,
  );
  const saveSingleItem = async (item: any) => {
    if(loginStatus.companyId === 0)return;
    if (!userHasAccessToUpdateCompanyInvoiceItem) {
      return;
    }
    const postData = {
      company_id: loginStatus.companyId,
      id: item.id,
      discount_percent: item.discountPercent,
      isactive: item.isActive,
      updatedby_id: loginStatus.id,
    };
    console.log(postData);

    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_INVOICE_ITEM,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setRefreshCount((prev) => prev + 1); // trigger refresh of items
        setEditingItemId(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setTempItems(items); // reset
    setEditingItemId(null);
  };

  const handleSaveInvoice = async () => {
    if(loginStatus.companyId === 0)return;
    if (!userHasAccessToAddCompanyInvoiceDraft) return;
    if (!selectedAccount) {
      toast.error("Please select an account");
      return;
    }
    const formPayload = {
      company_id: loginStatus.companyId,
      account_id: selectedAccount.id,
      createdby_id: loginStatus.id,
    };
    console.log(formPayload);

    setIsSubmitting(true);
    await axiosClient
      .post(POST_API.CREATE_COMPANY_INVOICE, formPayload, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          console.log(response.data);

          const invoiceId = response?.data?.newid;
          // handleAddInvoice();
          const path = ROUTES_URL.INVOICE_DETAILS.replace(
            ":invoiceId",
            String(invoiceId),
          );
          navigate(path, { replace: true });
          // onClose();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error) => {
        console.log(error);
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleAddToInvoice = async () => {
    if(loginStatus.companyId === 0)return;
    if (disabled) {
      return;
    }
    const postData = {
      company_id: loginStatus.companyId,
      account_id: invoice?.accountId,
      createdby_id: loginStatus.id,
    };
    console.log(postData);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.CREATE_COMPANY_INVOICE_ITEM,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setRefreshCount((prev) => prev + 1);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account);
  };

  useEffect(() => {
    if (!invoiceId || Number(invoiceId) === 0) return;

    const controller = new AbortController();

    getInvoices(controller.signal);
    getInvoiceItems(controller.signal);

    return () => controller.abort();
  }, [invoiceId, refreshCount]);

  return (
    <PageLayout onScrollChange={setShowAccountName} scrollTopValue={80}>
      <div className="font-roboto">
        {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
        {/* HEADER */}

        {invoiceLoading ? (
          <InvoiceHeaderSkeleton />
        ) : (
          <>
            <div className=" sticky top-0 z-10  bg-slate-100 flex text-center justify-start items-center gap-3 ml-0.5 py-1">
              {/* <Link to={ROUTES_URL.INVOICE_MANAGEMENT}> */}
              {isUsedForSearchParams == "Invoice" ? (
                <Button
                  onClick={() => navigate(-1)}
                  className="caption-custom flex items-center justify-center hover:text-gray-800"
                >
                  Invoice
                </Button>
              ) : (
                <>
                  <Link to={ROUTES_URL.ACCOUNT_MANAGEMENT}>
                    <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
                      Account
                    </Button>
                  </Link>
                  <ChevronRight size={16} />
                  <Link
                    to={ROUTES_URL.ACCOUNT_DETAILS + `/${invoice?.accountId}`}
                  >
                    <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
                      Account Details
                    </Button>
                  </Link>
                </>
              )}
              {/* </Link> */}
              <ChevronRight size={16} />
              <h1 className="table-header-custom">Invoice Details</h1>
              {showAccountName && (
                <span
                  className={`
                ml-1 max-w-[700px] truncate text-sm text-gray-500
                transition-all duration-200 ease-out
                will-change-transform will-change-opacity justify-center items-center ${
                  showAccountName
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-1 pointer-events-none"
                } `}
                >
                  (<span>Account:</span>{" "}
                  <span className="table-data-custom">{`  ${invoice?.accountName},  `}</span>
                  <span>Invoice:</span>{" "}
                  <span className="table-data-custom">{`  ${invoice?.invoiceNumber}`}</span>
                  )
                </span>
              )}
            </div>
            <div className="flex justify-between items-center my-2">
              <div>
                <h1 className="table-header-custom">
                  {isCreateMode
                    ? "Create Invoice"
                    : `Invoice #${invoice?.invoiceNumber || "[Auto-generated]"}`}
                </h1>
                <p className="text-sm text-gray-500">
                  {isCreateMode
                    ? "Select an account to create invoice"
                    : `Account - ${invoice?.accountName}`}
                </p>
              </div>
              {!isCreateMode && (
                <div className="flex gap-x-2">
                  <div className="relative">
                    {/* Download Button */}
                    <button
                      className={`text-sm border p-2 rounded-md flex items-center gap-1 border-blue-300
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
      ${
        !disabled
          ? "bg-gray-50 cursor-not-allowed opacity-50"
          : "bg-gray-50 hover:bg-blue-200"
      }`}
                      disabled={!disabled}
                      onClick={() => setShowDownloadOptions((prev) => !prev)}
                    >
                      <div className="flex items-center gap-1">
                        <Download size={14} className="text-blue-500" />
                        <span className="text-gray-700">Download</span>
                      </div>
                    </button>

                    {/* Dropdown */}
                    {showDownloadOptions && (
                      <div className="absolute z-10 mt-1 w-48  bg-white border rounded-md shadow-md">
                        {isLoading ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Loading...
                          </div>
                        ) : (
                          invoiceType.map((type) => (
                            <div
                              key={type.id}
                              className="px-3 py-2 text-xs  hover:bg-blue-100 cursor-pointer flex justify-between"
                              onClick={() => {
                                handleInvoiceDownload(type.id); // 👈 pass type id
                                setShowDownloadOptions(false);
                              }}
                            >
                              <span>{type.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    className={`text-sm border p-2 rounded-md flex items-center gap-1 text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
                      ${
                        !userHasAccessToViewCompanyInvoice
                          ? "bg-gray-50 cursor-not-allowed opacity-50"
                          : "bg-gray-50 hover:bg-red-200 hover border-red-300"
                      }`}
                    disabled={!userHasAccessToViewCompanyInvoice}
                    onClick={previewInvoice}
                  >
                    <div className="flex items-center gap-1">
                      <FaFilePdf size={14} className="text-red-500" />
                      <span className="">Preview</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
            {isCreateMode && (
              <div className="flex items-end justify-between p-1 mb-2 gap-3">
                {/* Dropdown */}
                <div className="w-80">
                  <LookupAccountDropdown
                    icon={<User size={14} />}
                    value={selectedAccount}
                    label="Select Account"
                    handleAccountSelection={handleAccountSelect}
                  />
                </div>

                {/* Save Button */}
                <div className="">
                  <Button
                    disabled={
                      !selectedAccount ||
                      isSubmitting ||
                      !userHasAccessToAddCompanyInvoiceDraft
                    }
                    onClick={handleSaveInvoice}
                  >
                    {isSubmitting ? "Creating..." : "Create invoice"}
                  </Button>
                </div>
              </div>
            )}

            {/* META */}
            <div className="grid grid-cols-4 bg-gray-100 border rounded py-1 px-2 mb-2">
              <MetaField
                label="Invoice Number"
                value={invoice?.invoiceNumber || "[Auto-generated]"}
              />
              <MetaField
                label="Invoice Date"
                value={invoice?.invoiceDate || "[Auto-generated]"}
              />
              <MetaField
                label="Status"
                value={<InvoiceStatusChip statusId={invoice?.statusId} />}
              />
              {disabled ? (
                <MetaField label="Due Date" value={invoice?.dueDate} />
              ) : (
                <FormInput
                  label="Due Date"
                  type="date"
                  disabled={isCreateMode || disabled}
                  value={invoice?.dueDate}
                  onChange={(e: any) =>
                    setInvoice((prev) => ({
                      ...prev!,
                      dueDate: e.target.value,
                    }))
                  }
                />
              )}

              <MetaField label="Created By" value={invoice?.createdBy} />
              <MetaField label="Created On" value={invoice?.createdOn} />
              <MetaField label="Updated By" value={invoice?.updatedBy} />
              <MetaField label="Updated On" value={invoice?.updatedOn} />
            </div>

            {/* ADDRESS */}
            <div className="grid grid-cols-2 gap-x-3 border rounded p-2 mb-2 bg-gray-100">
              <TextAreaInput
                label="Billing Address"
                maxLength={255}
                disabled={isCreateMode || disabled}
                value={invoice?.billingAddress}
                onChange={(e: any) =>
                  setInvoice((prev) => ({
                    ...prev!,
                    billingAddress: e.target.value,
                  }))
                }
                rows={3}
                cols={3}
              />

              <TextAreaInput
                label="Shipping Address"
                maxLength={255}
                disabled={isCreateMode || disabled}
                value={invoice?.shippingAddress}
                onChange={(e: any) =>
                  setInvoice((prev) => ({
                    ...prev!,
                    shippingAddress: e.target.value,
                  }))
                }
                rows={3}
                cols={3}
              />

              <TextAreaInput
                label="Terms & Conditions"
                // maxLength={}
                disabled={isCreateMode || disabled}
                value={invoice?.termAndConditions}
                onChange={(e: any) =>
                  setInvoice((prev) => ({
                    ...prev!,
                    termAndConditions: e.target.value,
                  }))
                }
                rows={3}
                cols={3}
              />
              <TextAreaInput
                label="Remarks"
                maxLength={300}
                disabled={isCreateMode || disabled}
                value={invoice?.remarks}
                onChange={(e: any) =>
                  setInvoice((prev) => ({
                    ...prev!,
                    remarks: e.target.value,
                  }))
                }
                rows={3}
                cols={3}
              />
              <div className="col-span-2 flex items-center justify-end p-1">
                <div className="flex gap-2">
                  {showCompanyInvoicePreview && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                      onClick={() => setShowCompanyInvoicePreview(false)}
                    >
                      <CustomDocumentPreviewComponent
                        fileUrl={InvoicePreview!}
                        fileExtension={"application/pdf"}
                        width={"50%"}
                        height={"85%"}
                        enableDownload={true}
                        fileName={`${invoice?.invoiceNumber}`}
                      />
                    </div>
                  )}
                  {!isCreateMode && (
                    <Button
                      disabled={
                        !userHasAccessToUpdateCompanyInvoice || disabled
                      }
                      onClick={updateInvoice}
                    >
                      <div className="flex items-center gap-1">
                        <Save size={16} />
                        <span>Update</span>
                      </div>
                    </Button>
                  )}
                  {!isCreateMode && (
                    <Button
                      disabled={
                        !userHasAccessToUpdateCompanyInvoiceApproval || disabled
                      }
                      // onClick={SubmitInvoice}
                      onClick={() => setShowConfirmationDialoge(true)}
                    >
                      <div className="flex items-center gap-1">
                        <Send size={16} />
                        <span>Submit</span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {/* ITEMS */}
        {itemsLoading ? (
          <InvoiceItemsSkeleton />
        ) : (
          <>
            {!isCreateMode && userHasAccessToViewCompanyInvoiceItem && (
              <div className="bg-white border rounded p-2 mb-1">
                <div className="flex justify-between py-1">
                  <h3 className="font-semibold">Invoice Items</h3>
                  <SearchInput
                    value={searchTerm}
                    onChange={(e: any) => setSearchTerm(e.target.value)}
                    placeholder="Search product..."
                  />
                  <div>
                    <Button
                      type="button"
                      disabled={
                        disabled || !userHasAccessToAddCompanyInvoiceItem
                      }
                      onClick={() => {
                        if (!userHasAccessToAddCompanyInvoiceItem) {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.COMPANY_INVOICE_ITEM
                              .DENIED_ADD_ACCESS,
                          );
                          return;
                        }
                        handleAddToInvoice();
                      }}
                      className={COLORS.ADD_BUTTON}
                    >
                      +Add Pending Items
                    </Button>
                  </div>
                </div>
                <div className="w-full max-h-[35vh] overflow-y-auto border rounded">
                  <table className="w-full text-sm font-semibold ">
                    <thead className="sticky top-0 bg-gray-50 z-10 border">
                      <tr className="bg-gray-100 border-b">
                        <th>#</th>
                        <th className="p-2 text-left border-r">
                          Product/Service/Subscription
                        </th>
                        <th className="border-r">Qty</th>
                        <th className="border-r">Rate</th>
                        <th className="border-r">HSN/SAC</th>
                        <th className="border-r">Basic Amount</th>
                        <th className="border-r">Discount(%)</th>
                        <th className="border-r">Taxable Value</th>
                        {!isIGST && <th className="border-r">CGST (%)</th>}
                        {!isIGST && <th className="border-r">SGST (%)</th>}
                        {isIGST && <th className="border-r">IGST (%)</th>}
                        {hasCess && <th className="border-r">Cess (%)</th>}
                        <th className="border-r">Total </th>
                        {!disabled && <th className="border-r">Action</th>}
                      </tr>
                    </thead>

                    <tbody>
                      {tempItems.filter((item) =>
                        item?.companyProductName
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      ).length === 0 ? (
                        <tr>
                          <td
                            colSpan={disabled ? 12 : 13}
                            className="text-center py-4 text-gray-500"
                          >
                            No rows found
                          </td>
                        </tr>
                      ) : (
                        tempItems
                          .filter((item) =>
                            item?.companyProductName
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                          )
                          .map((item, i) => {
                            return (
                              <tr
                                key={item.id}
                                className="border-t font-normal text-xs hover:bg-blue-100 text-center "
                              >
                                <td className="border-r">{i + 1}</td>
                                <td className="p-2 text-left border-r">
                                  {item.companyProductName}
                                </td>
                                <td className="border-r">
                                  {formatQuantity(item.quantity)}
                                </td>
                                <td className="border-r">
                                  {formatQuantity(item.rate)}
                                </td>
                                <td className="border-r">
                                  {item.hsn || item.sac}
                                </td>
                                <td className="border-r">
                                  {formatRupee(item.basicValue)}
                                </td>
                                {editingItemId === item.id ? (
                                  <td className="border-r">
                                    <input
                                      type="number"
                                      className={`${editingItemId !== item.id ? "" : "border"} rounded p-1 text-center w-16`}
                                      value={item.discountPercent}
                                      disabled={
                                        disabled || editingItemId !== item.id
                                      }
                                      onChange={(e) =>
                                        handleDiscountChange(
                                          item.id,
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                  </td>
                                ) : (
                                  <td className="border-r">
                                    {formatRupee(item.discountAmount)} (
                                    {item.discountPercent}%)
                                  </td>
                                )}
                                <td className="border-r">
                                  {formatRupee(item.taxableValue)}
                                </td>
                                {!isIGST && (
                                  <td className="border-r">
                                    {formatRupee(item.cgstAmount)} (
                                    {item.cgstPercent}%)
                                  </td>
                                )}
                                {!isIGST && (
                                  <td className="border-r">
                                    {formatRupee(item.sgstAmount)} (
                                    {item.sgstPercent}%)
                                  </td>
                                )}
                                {isIGST && (
                                  <td className="border-r">
                                    {formatRupee(item.igstAmount)} (
                                    {item.igstPercent}%)
                                  </td>
                                )}
                                {hasCess && (
                                  <td className="border-r">
                                    {formatRupee(item.cessAmount)} (
                                    {item.cessPercent}%)
                                  </td>
                                )}
                                <td className="border-r">
                                  {formatRupee(item.totalAmount)}
                                </td>

                                {!disabled && (
                                  <td className="">
                                    <div className="flex gap-2 justify-center">
                                      {editingItemId !== item.id ? (
                                        <button
                                          disabled={
                                            !userHasAccessToUpdateCompanyInvoiceItem ||
                                            disabled
                                          }
                                          onClick={() => handleDeleteItem(item)}
                                        >
                                          <Trash
                                            className="text-red-500"
                                            size={16}
                                          />
                                        </button>
                                      ) : null}
                                      {editingItemId === item.id ? (
                                        <div className="flex gap-1 justify-center">
                                          <button
                                            className="text-green-600 text-xs border px-2 rounded hover:bg-blue-500 hover:text-white"
                                            onClick={() => saveSingleItem(item)}
                                          >
                                            Save
                                          </button>
                                          <button
                                            className="text-gray-500 text-xs border px-2 rounded hover:bg-blue-500 hover:text-white"
                                            onClick={cancelEdit}
                                          >
                                            {/* Cancel */}
                                            <X
                                              className="text-gray-600"
                                              size={14}
                                            />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          disabled={
                                            !userHasAccessToUpdateCompanyInvoiceItem ||
                                            disabled
                                          }
                                          onClick={() => {
                                            if (
                                              !userHasAccessToUpdateCompanyInvoiceItem
                                            ) {
                                              return;
                                            }
                                            setEditingItemId(item.id);
                                          }}
                                          className="text-blue-600 text-xs px-2 "
                                        >
                                          {/* Edit */}
                                          <Pencil
                                            className="text-blue-600"
                                            size={14}
                                          />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="w-full items-center justify-center  flex-1">
                  <span className="text-xs flex items-center justify-center font-medium text-gray-500 border rounded-lg px-2 py-1  bg-blue-100">
                    You can add or modify invoice items while it's in draft
                    state.
                  </span>
                </div>
              </div>
            )}
            {isCreateMode && (
              <div className="w-full items-center justify-center  flex-1">
                <span className="text-xs flex items-center justify-center font-medium text-gray-500 border rounded-lg px-2 py-1  bg-blue-100">
                  Once an invoice is created for an account, all items assigned
                  to that account are automatically added to the invoice.
                </span>
              </div>
            )}

            {/** Summery Block */}
            {!isCreateMode && (
              <div className="grid grid-cols-2 text-sm mb-2 ">
                <div></div>

                <div className="border rounded-lg p-2 bg-white mt-2 space-y-2">
                  <span className="font-medium text-gray-700 text-sm">
                    Invoice Summary
                  </span>

                  <div className="border rounded-lg p-2 bg-white mt-2 space-y-2">
                    {/* Basic + Discount */}
                    <div className="flex justify-between">
                      <span>A. Basic Value</span>
                      <span>{formatRupee(summary.basic)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>B. Total Discount</span>
                      <span>{formatRupee(summary.discount)}</span>
                    </div>

                    {/* Taxable */}
                    <div className="flex justify-between text-gray-600 border-t pt-2">
                      <div className="flex">
                        <span className="text-black">C</span>{" "}
                        <span>. Taxable Value (A-B)</span>
                      </div>
                      <span>{formatRupee(summary.taxable)}</span>
                    </div>

                    {/* Tax + Cess in one row */}
                    <div className="flex justify-between text-gray-600">
                      <div className="flex">
                        <span className="text-black">D</span>
                        <span>
                          . Total Tax ({summary.igst ? "IGST" : "CGST + SGST"}{" "}
                          {summary.cess ? "+ Cess" : ""})
                        </span>
                      </div>
                      <span>{formatRupee(summary.tax)}</span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>E. Total Amount (C+D)</span>
                      <span>₹{formatRupee(summary.total)}</span>
                    </div>

                    {/* Round Off Compact */}
                    <div className="flex items-center justify-between bg-gray-50 border rounded px-1 py-2 text-xs">
                      {/* Left */}
                      <div className="flex flex-col ">
                        <span className="flex gap-3 justify-start items-center table-header-custom-blue ">
                          F. Round Off{" "}
                          <span className="caption-custom">
                            Adjust the amount to make the invoice total rounded.
                          </span>
                        </span>
                        {!roundOffValues.isRounded && (
                          <span className="caption-custom mt-1">
                            <span className="flex">
                              {" "}
                              <LucideLightbulb size={14} />
                              Suggested: {roundOffValues.roundOff} to make{" "}
                              {roundOffValues.roundedTotal}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-1">
                        <div className="w-20">
                          <FormInput
                            disabled={disabled}
                            type="number"
                            min={-1}
                            max={1}
                            // className="border rounded px-1 py-0.5 w-10 text-right text-xs"
                            value={invoice?.adjustmentForRoundOff}
                            onChange={(e: any) =>
                              setInvoice((prev) => ({
                                ...prev!,
                                adjustmentForRoundOff: Number(e.target.value),
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            disabled={disabled}
                            onClick={updateInvoice}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                          >
                            <Check size={14} />
                            Apply
                          </button>

                          <button
                            disabled={disabled}
                            onClick={handleResetRoundOff}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs 
               text-gray-600 border border-gray-200 bg-gray-50 
               hover:bg-gray-100 disabled:opacity-50"
                          >
                            <RotateCcw size={14} />
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Final Total */}
                    <div className="flex justify-between items-center border-t pt-2">
                      <div className="text-xs text-gray-500 leading-tight">
                        <p className="text-blue-600 font-medium text-sm mb-1">
                          Total Invoice Amount (E+F)
                        </p>
                        <p className="flex gap-2 caption-custom">
                          <span className="caption-custom text-black">
                            <p> Amount In Words: </p>
                          </span>

                          {amountToWords(
                            summary.total +
                              (invoice?.adjustmentForRoundOff || 0),
                          )}
                        </p>
                      </div>

                      <span className="text-lg font-bold text-blue-600">
                        ₹
                        {formatRupee(
                          summary.total + (invoice?.adjustmentForRoundOff || 0),
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-1 bg-gray-50 border rounded px-2 py-0.5 caption-custom">
                    <span>
                      <LucideSubtitles size={16} />
                    </span>
                    Round off amount will be shown separately in the printed
                    invoice.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <ConfirmationDialog
          title="Confirm Submission of Invoice"
          description="Once submitted, this invoice cannot be edited."
          message="After submission, this invoice will be locked and no further changes or edits will be allowed. Please review all details carefully before submitting."
          open={showConfirmationDialoge}
          onConfirm={() => {
            SubmitInvoice();
          }}
          onCancel={() => setShowConfirmationDialoge(false)}
        />
      </div>
    </PageLayout>
  );
}

export default CompanyInvoiceDetails;
