/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useInView } from "react-intersection-observer";

import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";

import RecentStockMovementProps from "../../../../../@types/home/dashboard/inventory/RecentStockMovementProps";
import { Link } from "react-router-dom";
import ROUTES_URL from "../../../../../constants/Routes";

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
          <div className="table-header-custom">
            Recent Stock Movements
          </div>

          <p className="caption-custom">
            Latest inventory transactions
          </p>
        </div>

         <Link to={ROUTES_URL.STOCK_MANAGEMENT+"/"+ROUTES_URL.STOCK_LEDGER}
         className="caption-custom-blue transition-colors"
         onClick={()=>{}}
          >
          View All
        </Link>
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
          <div className="col-span-3 w-full min-w-0">
            {/* Horizontal Scroll */}
            <div className="w-full overflow-x-auto">
              {/* Main Container */}
              <div className="min-w-[900px] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100">
                  <table className="w-full table-fixed border-collapse">
                    <colgroup>
                      <col style={{ width: "125px" }} />
                      <col style={{ width: "110px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "50px" }} />
                      <col style={{ width: "110px" }} />
                      <col style={{ width: "200px" }} />
                    </colgroup>

                    <thead>
                      <tr className="h-9">
                        <th className="px-3 py-2 text-left align-middle text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Date
                        </th>

                        <th className="px-3 py-2 text-left align-middle text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Type
                        </th>

                        <th className="px-3 py-2 text-left align-middle text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Product
                        </th>

                        <th className="px-3 py-2 text-left align-middle text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Transaction
                        </th>

                        <th className="px-2 py-2 text-center align-middle text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Qty
                        </th>

                        <th className="px-3 py-2 text-right align-middle text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Value
                        </th>

                        <th className="px-4 py-2 text-left align-middle text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Performed By
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>

                {/* Body */}
                <div className="max-h-[340px] overflow-y-auto overflow-x-hidden">
                  <table className="w-full table-fixed border-collapse">
                    <colgroup>
                      <col style={{ width: "125px" }} />
                      <col style={{ width: "110px" }} />
                      <col style={{ width: "150px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "50px" }} />
                      <col style={{ width: "110px" }} />
                      <col style={{ width: "200px" }} />
                    </colgroup>

                    <tbody className="divide-y divide-gray-100">
                      {recentStockMovement.map(
                        (ticket: RecentStockMovementProps, index: number) => {
                          const {
                            icon: TransactionIcon,
                            badgeClass,
                            label,
                          } = getTransactionTypeStyles(
                            ticket?.transaction_type_name || "",
                          );

                          return (
                            <tr
                              key={index}
                              className="h-[46px] hover:bg-gray-50 transition-colors"
                            >
                              {/* Date */}
                              <td className="px-3 py-1.5 align-middle">
                                <div className="text-[11px] text-gray-700 whitespace-nowrap">
                                  {ticket?.transaction_date || "-"}
                                </div>
                              </td>

                              {/* Type */}
                              <td className="px-3 py-1.5 align-middle">
                                <span
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap ${badgeClass}`}
                                >
                                  <TransactionIcon className="w-3 h-3" />
                                  {label}
                                </span>
                              </td>

                              {/* Product */}
                              <td className="px-3 py-1.5 align-middle">
                                <div className="truncate text-[11px] font-semibold text-gray-900">
                                  {ticket?.company_product_name || "-"}
                                </div>
                              </td>

                              {/* Transaction */}
                              <td className="px-3 py-1.5 align-middle">
                                <div className="truncate text-[11px] text-gray-600">
                                  {ticket?.transaction_type_name || "-"}
                                </div>
                              </td>

                              {/* Qty */}
                              <td className="px-2 py-1.5 align-middle text-center">
                                <span className="text-[11px] font-medium text-gray-700">
                                  {ticket?.abs || 0}
                                </span>
                              </td>

                              {/* Value */}
                              <td className="px-3 py-1.5 align-middle text-right">
                                <span className="text-[11px] font-semibold text-gray-900 whitespace-nowrap">
                                  ₹
                                  {ticket?.total_cost
                                    ? Number(ticket.total_cost).toLocaleString()
                                    : "0"}
                                </span>
                              </td>

                              {/* User */}
                              <td className="px-4 py-1.5 align-middle">
                                <div className="flex items-center gap-2 min-w-0">
                                  {/* Avatar */}
                                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0">
                                    {ticket?.createdby
                                      ?.charAt(0)
                                      ?.toUpperCase() || "U"}
                                  </div>

                                  {/* Name */}
                                  <div className="min-w-0">
                                    <p className="truncate text-[11px] font-medium text-gray-700">
                                      {ticket?.createdby || "Unknown"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default RecentStockMovement;
