/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useInView } from "react-intersection-observer";

import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";

import RecentStockMovementProps from "../../../../../@types/inventory/RecentStockMovementProps";

interface Props {
  isLoading: boolean;
  recentStockMovement: RecentStockMovementProps[];
}

function RecentStockMovement({ isLoading, recentStockMovement = [] }: Props) {
  const [ref, inView] = useInView({
    fallbackInView: true,
    threshold: 0.1,
  });

  const getTransactionTypeStyles = (type: string) => {
    const normalizedType = type?.toLowerCase();

    if (
      normalizedType?.includes("outward") ||
      normalizedType?.includes("sale") ||
      normalizedType?.includes("dispatch")
    ) {
      return {
        icon: ArrowUpRight,
        badgeClass: "bg-blue-50 text-blue-600 border border-blue-100",
        label: "Outward",
      };
    }

    return {
      icon: ArrowDownLeft,
      badgeClass: "bg-green-50 text-green-600 border border-green-100",
      label: "Inward",
    };
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Recent Stock Movements
          </h2>

          <p className="text-xs text-gray-500 mt-0.5">
            Latest inventory transactions
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : recentStockMovement?.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-xs text-gray-500">
            No recent stock movement found
          </div>
        ) : (
         <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
  {/* Header Table */}
  <table className="w-full min-w-[950px] table-fixed border-collapse">
    <colgroup>
      <col className="w-[140px]" />
      <col className="w-[120px]" />
      <col className="w-[220px]" />
      <col className="w-[200px]" />
      <col className="w-[80px]" />
      <col className="w-[120px]" />
      <col className="w-[200px]" />
    </colgroup>

    <thead className="bg-gray-50 border-b border-gray-100">
      <tr>
        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Date
        </th>

        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Type
        </th>

        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Product
        </th>

        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Transaction
        </th>

        <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Qty
        </th>

        <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Value
        </th>

        <th className="px-6 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Performed By
        </th>
      </tr>
    </thead>
  </table>

  {/* Scrollable Body */}
  <div className="max-h-[420px] overflow-y-auto overflow-x-hidden">
    <table className="w-full min-w-[950px] table-fixed border-collapse">
      <colgroup>
        <col className="w-[140px]" />
        <col className="w-[120px]" />
        <col className="w-[220px]" />
        <col className="w-[180px]" />
        <col className="w-[80px]" />
        <col className="w-[120px]" />
        <col className="w-[200px]" />
      </colgroup>

      <tbody className="divide-y divide-gray-100">
        {recentStockMovement.map(
          (ticket: RecentStockMovementProps, index: number) => {
            const {
              icon: TransactionIcon,
              badgeClass,
              label,
            } = getTransactionTypeStyles(
              ticket?.transaction_type_name || ""
            );

            return (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Date */}
                <td className="px-3 py-3 text-xs text-gray-700">
                  {ticket?.transaction_date || "-"}
                </td>

                {/* Type */}
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap ${badgeClass}`}
                  >
                    <TransactionIcon className="w-3 h-3" />

                    {label}
                  </span>
                </td>

                {/* Product */}
                <td className="px-3 py-3">
                  <div className="truncate text-xs font-semibold text-gray-900">
                    {ticket?.company_product_name || "-"}
                  </div>
                </td>

                {/* Transaction */}
                <td className="px-3 py-3">
                  <div className="truncate text-xs text-gray-600">
                    {ticket?.transaction_type_name || "-"}
                  </div>
                </td>

                {/* Qty */}
                <td className="px-3 py-3 text-center text-xs font-medium text-gray-700">
                  {ticket?.abs || 0}
                </td>

                {/* Value */}
                <td className="px-3 py-3 text-right text-xs font-semibold text-gray-900">
                  ₹
                  {ticket?.total_cost
                    ? Number(ticket.total_cost).toLocaleString()
                    : "0"}
                </td>

                {/* Performed By */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Avatar */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {ticket?.createdby
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    {/* Name */}
                    <span className="truncate text-xs font-medium text-gray-700">
                      {ticket?.createdby || "Unknown"}
                    </span>
                  </div>
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  </div>
</div>
        )}
      </div>
    </motion.div>
  );
}

export default RecentStockMovement;
