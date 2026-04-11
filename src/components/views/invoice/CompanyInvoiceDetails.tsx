/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { FaFilePdf } from "react-icons/fa";
import TextAreaInput from "../../ui/TextAreaInput";
import SearchInput from "../../ui/SearchInput";
import MetaField from "../../ui/MetaField";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../ui/PageLayout";
import AccountInvoiceProps from "../../../@types/account/AccountInvoiceProps";
import { handleApiError } from "../../../config/error/handleApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import axiosClient from "../../../axios-client/AxiosClient";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import FormInput from "../../ui/FormInput";
import { formatRupee } from "../../../utils/helperMethods/formatFunctions";
import { Download, Pencil, Trash, X } from "lucide-react";
import CompanyInvoiceItemProps from "../../../@types/invoice/CompanyInvoiceItemProps";
import InvoiceStatusChip from "../../ui/InvoiceStatusChip";
import CustomDocumentPreviewComponent from "../../custom-document-preview-component/CustomDocumentPreviewComponent";
import LoadingPopUpAnimation from "../card/LoadingPopUpAnimation";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";

function CompanyInvoiceDetails() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState<AccountInvoiceProps | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const { loginStatus } = useLoggedInUserContext();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [tempItems, setTempItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showCompanyLogoPreview, setShowCompanyLogoPreview] = useState(false);
  const {
    userHasAccessToViewCompanyInvoiceItem,
    userHasAccessToUpdateCompanyInvoiceItem,
    userHasAccessToUpdateCompanyInvoiceApproval,
    userHasAccessToUpdateCompanyInvoice,
    userHasAccessToViewCompanyInvoice,
  } = useUserAccessModules();
  const getInvoices = async (signal: AbortSignal) => {
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
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };
  console.log(disabled);

  const getInvoiceItems = async (signal: AbortSignal) => {
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
    }
  };

  const SubmitInvoice = async () => {
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
    if (!userHasAccessToViewCompanyInvoice) return;
    setIsSubmitting(true);

    try {
      const response = await axiosClient.post(
        POST_API.PREVIEW_COMPANY_INVOICE,
        {
          company_id: loginStatus.companyId,
          company_invoice_id: Number(invoiceId),
          company_invoice_type_id: 1,
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
      setLogoPreview(fileUrl); // you can rename this later (e.g. setInvoicePreview)
      setShowCompanyLogoPreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to preview invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateInvoice = async () => {
    if (!invoice) return;
    if (disabled) {
      return;
    }
    if (!userHasAccessToUpdateCompanyInvoice) return;
    const postData = {
      id: invoice.id,
      company_id: loginStatus.companyId,
      due_date: invoice.dueDate,
      invoice_status_id: null,
      billing_address: invoice.billingAddress,
      shipping_address: invoice.shippingAddress,
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

  const handleInvoiceDownload = async () => {
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
          company_invoice_type_id: 1,
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

      // ✅ Same as your task document logic
      setLogoPreview(fileUrl); // you can rename this later (e.g. setInvoicePreview)
      setShowCompanyLogoPreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (item: any) => {
    console.log("Delete item with id:", item.id);
    console.log(disabled);

    if (disabled) {
      return;
    }
    // 👉 Replace with API call to delete item from backend

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
      return acc;
    },
    { basic: 0, discount: 0, taxable: 0, tax: 0, total: 0 },
  );

  const saveSingleItem = async (item: any) => {
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

  useEffect(() => {
    // 👉 Replace with API call
    getInvoices(new AbortController().signal);
    getInvoiceItems(new AbortController().signal);
  }, [refreshCount]);

  if (!invoice) return null;

  return (
    <PageLayout>
      <div className="p-1 font-roboto">
        {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="table-header-custom">
              Invoice #{invoice?.invoiceNumber || "[Auto-generated]"}
            </h1>
            <p className="text-sm text-gray-500">
              Account - {invoice?.accountName}
            </p>
          </div>
        </div>

        {/* META */}
        <div className="grid grid-cols-4 bg-gray-100 border rounded py-1 px-2 mb-2">
          <MetaField
            label="Invoice Number"
            value={invoice.invoiceNumber || "[Auto-generated]"}
          />
          <MetaField
            label="Invoice Date"
            value={invoice.invoiceDate || "[Auto-generated]"}
          />
          <MetaField
            label="Status"
            value={<InvoiceStatusChip statusId={invoice.statusId} />}
          />
          {disabled ? (
            <MetaField label="Due Date" value={invoice.dueDate} />
          ) : (
            <FormInput
              label="Due Date"
              type="date"
              value={invoice.dueDate}
              onChange={(e: any) =>
                setInvoice((prev) => ({
                  ...prev!,
                  dueDate: e.target.value,
                }))
              }
            />
          )}

          <MetaField label="Created By" value={invoice.createdBy} />
          <MetaField label="Created On" value={invoice.createdOn} />
          <MetaField label="Updated By" value={invoice.updatedBy} />
          <MetaField label="Updated On" value={invoice.updatedOn} />
        </div>

        {/* ADDRESS */}
        <div className="grid grid-cols-2 gap-x-3 border rounded p-2 bg-gray-100">
          <TextAreaInput
            label="Billing Address"
            disabled={disabled}
            value={invoice.billingAddress}
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
            disabled={disabled}
            value={invoice.shippingAddress}
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
            disabled={disabled}
            value={invoice.termAndConditions}
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
            disabled={disabled}
            value={invoice.remarks}
            onChange={(e: any) =>
              setInvoice((prev) => ({
                ...prev!,
                remarks: e.target.value,
              }))
            }
            rows={3}
            cols={3}
          />
        </div>
        <div className="flex items-center justify-end p-1">
          <div className="flex gap-2">
            <Button disabled={!disabled} onClick={handleInvoiceDownload}>
              <div className="flex items-center gap-1">
                <span>Download</span>
                <Download size={14} />
              </div>
            </Button>
            {showCompanyLogoPreview && (
              <div
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                onClick={() => setShowCompanyLogoPreview(false)}
              >
                <CustomDocumentPreviewComponent
                  fileUrl={logoPreview!}
                  fileExtension={"application/pdf"}
                  width={"50%"}
                  height={"85%"}
                  enableDownload={true}
                />
              </div>
            )}
            <Button
              disabled={!userHasAccessToViewCompanyInvoice}
              onClick={previewInvoice}
            >
              <div className="flex items-center gap-1">
                <span>Preview</span>
                <FaFilePdf size={14} color="white" />
              </div>
            </Button>
            <Button
              disabled={!userHasAccessToUpdateCompanyInvoice || disabled}
              onClick={updateInvoice}
            >
              Update
            </Button>
            <Button
              disabled={
                !userHasAccessToUpdateCompanyInvoiceApproval || disabled
              }
              onClick={SubmitInvoice}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* ITEMS */}
        {userHasAccessToViewCompanyInvoiceItem && (
          <div className="bg-white border rounded p-2 mb-1">
            <div className="flex justify-between py-1">
              <h3 className="font-semibold">Products & Services</h3>
              <SearchInput
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                placeholder="Search product..."
              />
            </div>

            <table className="w-full text-sm font-semibold">
              <thead className="sticky top-0 bg-gray-50 z-10 border">
                <tr className="bg-gray-100 border-b">
                  <th>#</th>
                  <th className="p-2 text-left">Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>HSN/SAC</th>
                  <th>Amount</th>
                  <th>Discount(%)</th>
                  <th>Taxable Value</th>
                  <th>CGST (%)</th>
                  <th>SGST (%)</th>
                  <th>IGST (%)</th>
                  <th>Total Item Amount</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* {filteredItems.map((item, i) => { */}
                {tempItems
                  .filter((item) =>
                    item?.companyProductName
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                  )
                  .map((item, i) => {
                    return (
                      <tr
                        key={item.id}
                        className="border-t font-normal text-sm hover:bg-blue-100 text-center"
                      >
                        <td>{i + 1}</td>
                        <td className="p-2 text-left">
                          {item.companyProductName}
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.rate}</td>
                        <td>{item.hsn || item.sac}</td>
                        <td>{item.basicValue}</td>
                        <td>
                          <input
                            type="number"
                            className={`${editingItemId !== item.id ? "" : "border"} rounded p-1 text-center w-16`}
                            value={item.discountPercent}
                            disabled={disabled || editingItemId !== item.id}
                            onChange={(e) =>
                              handleDiscountChange(
                                item.id,
                                Number(e.target.value),
                              )
                            }
                          />
                        </td>
                        <td>{item.taxableValue}</td>
                        <td>{item.cgstPercent}</td>
                        <td>{item.sgstPercent}</td>
                        <td>{item.igstPercent}</td>
                        <td>{item.totalAmount}</td>

                        {!disabled && (
                          <td>
                            <div className="flex gap-2 justify-center">
                              {editingItemId !== item.id ? (
                                <button
                                  disabled={
                                    !userHasAccessToUpdateCompanyInvoiceItem ||
                                    disabled
                                  }
                                  onClick={() => handleDeleteItem(item)}
                                >
                                  <Trash className="text-red-500" size={16} />
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
                                    <X className="text-gray-600" size={14} />
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
                                  <Pencil className="text-blue-600" size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div className="w-full items-center justify-center  flex-1">
              <span className="text-xs flex items-center justify-center font-medium text-gray-500 border rounded-lg px-2 py-1  bg-blue-100">
                You can add or modify invoice items while it's in draft state.
              </span>
            </div>
          </div>
        )}
        {/* BOTTOM */}
        <div className="grid grid-cols-2 text-sm mb-2">
          {/* Left */}
          <div className="space-y-2">
            {/* <TextAreaInput label="Terms & Conditions" rows={3} cols={3} />
                          <TextAreaInput label="Remarks" rows={1} cols={3} /> */}
          </div>
          <div>
            <span className="font-medium text-gray-700 text-sm ">Summary</span>
            {/* Right Summary */}
            <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
              <div className="flex justify-between">
                <span>Basic Amount</span>
                <span>{formatRupee(summary.basic)}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Discount</span>
                <span>{formatRupee(summary.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span>{formatRupee(summary.taxable)}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Tax</span>
                <span>{formatRupee(summary.tax)}</span>
              </div>

              <div className="border-t pt-2 flex justify-between text-base font-semibold text-blue-600">
                <span>Total Invoice Amount</span>
                <span>{formatRupee(summary.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default CompanyInvoiceDetails;
