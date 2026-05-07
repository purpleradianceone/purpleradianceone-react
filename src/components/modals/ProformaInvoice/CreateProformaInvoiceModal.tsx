/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FileText, Save, X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { formatRupee } from "../../../utils/helperMethods/formatFunctions";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";

import FormLayout from "../../ui/FormLayout";
import FormHeader from "../../ui/FormHeader";
import Button from "../../ui/Button";

import { LookupCompanyProductDropdown } from "../../views/lookups/lookup-company-product/LookupCompanyProductDropdown";
import Account from "../../../@types/account/Account";
import FormInput from "../../ui/FormInput";
import POST_API from "../../../constants/PostApi";
import { BsPlusCircle, BsTagFill } from "react-icons/bs";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";

// 🔥 row generator
const createRow = () => ({
  rowId: Date.now() + Math.random(),
  product: null,
  name: "",
  rate: 0,
  quantity: 1,
  discount: 0,
});

function CreateProformaInvoiceModal({
  isOpen,
  onClose,
  handleAddInvoice,
  account,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleAddInvoice: () => void;
  account: Account;
}) {
  const { loginStatus } = useLoggedInUserContext();
  const [items, setItems] = useState<any[]>([createRow()]);
  console.log(account);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  // ================= HANDLERS =================

  const addRow = () => setItems((prev) => [...prev, createRow()]);

  const removeRow = (rowId: number) => {
    setItems((prev) => prev.filter((i) => i.rowId !== rowId));
  };

  const updateItem = (rowId: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item) =>
        item.rowId === rowId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleProductSelect = (rowId: number, product: any) => {
    if (!product) return;

    // 🔥 prevent duplicate
    const isDuplicate = items.some(
      (i) => i.product?.id === product.id && i.rowId !== rowId,
    );

    if (isDuplicate) {
      toast.error("Product already added");
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.rowId === rowId
          ? {
              ...item,
              product,
              name: product.name,
              rate: product.rate || product.unit_price || 0,
            }
          : item,
      ),
    );

    // 🔥 auto add row (ERP behavior)
    const lastRow = items[items.length - 1];
    if (lastRow.rowId === rowId) {
      setItems((prev) => [...prev, createRow()]);
    }
  };

  // ================= VALIDATION =================

  const validItems = items.filter((i) => i.product);

  // ✅ allow empty row OR no empty row
  const isValid =
    validItems.length > 0 &&
    items.every((item, index) =>
      index === items.length - 1 ? true : item.product,
    );
  // allow last empty row

  // ================= SUMMARY =================

  const summary = items.reduce(
    (acc, item) => {
      if (!item.product) return acc;

      const base = item.rate * item.quantity;
      const discountAmt = (base * item.discount) / 100;
      const taxable = base - discountAmt;

      acc.basic += base;
      acc.discount += discountAmt;
      // acc.tax += tax;
      acc.total += taxable;

      return acc;
    },
    { basic: 0, discount: 0, tax: 0, total: 0 },
  );

  // ================= SUBMIT =================

  const handleCreateInvoice = async () => {
    if (!isValid) {
      toast.error("Please fix invalid rows");
      return;
    }

    const validItems = items.filter((i) => i.product);

    const item_data = validItems.map((item) => ({
      company_product_id: item.product.id,
      quantity: item.quantity,
      rate: item.rate,
      discount: item.discount ?? 0,
    }));

    const payload = {
      company_id: loginStatus.companyId,
      account_id: account?.id, // ✅ REQUIRED
      createdby_id: loginStatus.id, // ✅ FIXED KEY
      item_data: JSON.stringify(item_data), // ✅ CRITICAL FIX
    };
    console.log(payload);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.CREATE_COMPANY_PROFORMA_INVOICE,
        payload,
        { withCredentials: true },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        handleAddInvoice();
        navigate(
          ROUTES_URL.PROFORMA_INVOICE_DETAILS.replace(
            ":invoiceId",
            res.data.newid,
          ).replace(":accountId", String(account?.id)),
        );
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FormLayout widthPercent={90}>
      <FormHeader
        icon={FileText}
        preText="Create Proforma Invoice"
        description={`Account: ${account.name}`}
        onClose={onClose}
      />
      {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
      <div className="py-2 font-roboto bg-gray-50 h-[80vh] flex flex-col gap-2">
        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
          {/* TABLE */}
          <div className="col-span-9 bg-white overflow-auto ">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Items</h2>
                <p className="text-xs text-gray-500">
                  Add products / services / subscriptions for this invoice
                </p>
              </div>

              <button
                onClick={addRow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 shadow"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              {/* HEADER TABLE */}
              <table className="w-full text-sm border-collapse ">
                <colgroup>
                  <col className="w-[300px]" />
                  <col className="w-[100px]" />
                  <col className="w-[100px]" />
                  <col className="w-[80px]" />
                  <col className="w-[100px]" />
                  <col className="w-[50px]" />
                </colgroup>

                <thead className="bg-gray-100 table-header-custom">
                  <tr>
                    <th className="text-left p-2">
                      Product / Service / Subscription
                    </th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Discount %</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
              </table>

              {/* BODY SCROLL */}
              <div className="h-[55vh] overflow-y-auto">
                <table className="w-full text-sm border-collapse table-fixed">
                  <colgroup>
                    <col className="w-[300px]" />
                    <col className="w-[100px]" />
                    <col className="w-[100px]" />
                    <col className="w-[80px]" />
                    <col className="w-[120px]" />
                    <col className="w-[50px]" />
                  </colgroup>

                  <tbody>
                    {items.map((item) => {
                      const isInvalid = !item.product;

                      return (
                        <tr
                          key={item.rowId}
                          className={`transition ${
                            isInvalid
                              ? "bg-red-50 border border-dashed"
                              : "hover:bg-blue-50"
                          }`}
                        >
                          <td className="p-2">
                            <LookupCompanyProductDropdown
                              label=""
                              value={item.product}
                              handleCompanyProductSelection={(p) =>
                                handleProductSelect(item.rowId, p)
                              }
                            />
                          </td>

                          <td className="px-1">
                            <FormInput
                              type="number"
                              value={item.rate}
                              onChange={(e) =>
                                updateItem(
                                  item.rowId,
                                  "rate",
                                  Number(e.target.value),
                                )
                              }
                              // className="w-full border px-1 rounded"
                              className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </td>

                          <td className="px-1">
                            <FormInput
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.rowId,
                                  "quantity",
                                  Number(e.target.value),
                                )
                              }
                              className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </td>

                          <td className="px-1">
                            <FormInput
                              type="number"
                              value={item.discount}
                              min={0}
                              max={100}
                              onChange={(e) => {
                                let val = Number(e.target.value);
                                if (val < 0) val = 0;
                                if (val > 100) {
                                  toast.error("Discount cannot exceed 100%");
                                  val = 100;
                                }
                                updateItem(item.rowId, "discount", val);
                              }}
                              className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </td>

                          <td className="text-right font-medium px-2">
                            {formatRupee(
                              item.product
                                ? item.rate * item.quantity -
                                    (item.rate *
                                      item.quantity *
                                      item.discount) /
                                      100
                                : 0,
                            )}
                          </td>

                          <td className="text-center">
                            <button onClick={() => removeRow(item.rowId)}>
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="p-3">
                  <button
                    onClick={addRow}
                    className="w-full border border-dashed border-blue-300 text-blue-600 py-2 flex items-center justify-center gap-2 rounded-lg text-sm hover:bg-blue-50"
                  >
                    <BsPlusCircle size={16} className="inline" />
                    <span>Add another item</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className=" col-span-3 space-y-4 mt-14 ">
            {/* Summary Card */}
            <div className="bg-blue-50 border-blue-200 p-5 rounded-xl shadow-sm border">
              <h2 className="text-sm font-semibold mb-4 text-gray-700">
                Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Basic</span>
                  <span className="font-medium">
                    {formatRupee(summary.basic)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-red-500 font-medium">
                    {formatRupee(summary.discount)}
                  </span>
                </div>
              </div>

              <div className="border-t my-4"></div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatRupee(summary.total)}
                </span>
              </div>
            </div>

            {/* Tax Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex gap-3">
              <BsTagFill className="text-yellow-500 mt-1" />

              <div>
                <p className="text-sm font-semibold text-yellow-700">
                  Tax is inclusive
                </p>
                <p className="text-xs text-gray-500">
                  Calculated based on item tax configuration
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white p-1 flex justify-end gap-2">
          <div className="flex justify-center gap-2">
            <div className="w-fit">
              <Button type="button" onClick={onClose}>
                <div className="flex justify-center items-center gap-1">
                  <X size={16} />
                  <span>Cancel</span>
                </div>
              </Button>
            </div>
            <div className="w-fit">
              <Button disabled={!isValid} onClick={handleCreateInvoice}>
                <div className="flex justify-center items-center gap-1">
                  <Save size={16} />
                  <span>Save Invoice</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}

export default CreateProformaInvoiceModal;
