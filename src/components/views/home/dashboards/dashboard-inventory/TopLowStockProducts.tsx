/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useInView } from "react-intersection-observer";

import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";
import TopLowStockProducsProp from "../../../../../@types/home/dashboard/inventory/TopLowStockProducts";
import ROUTES_URL from "../../../../../constants/Routes";
import { Link } from "react-router-dom";


interface Props {
  isLoading: boolean;
  topLowStockProducs: TopLowStockProducsProp[];
}

function TopLowStockProducts({
  isLoading,
  topLowStockProducs = [],
}: Props) {
  const [ref, inView] = useInView({
    fallbackInView: true,
    threshold: 0.1,
  });

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
            Top Low Stock Products
          </div>
          <div className="caption-custom">Current low stock products</div>
        </div>

        <Link to={ROUTES_URL.STOCK_MANAGEMENT}
         className="caption-custom-blue transition-colors"
         onClick={()=>{}}
          >
          View All
        </Link>
      </div>

      {/* Body */}
      <div className="px-1 py-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : topLowStockProducs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Package className="w-10 h-10 text-gray-300 mb-3" />

            <p className="text-sm text-gray-500">
              No low stock products found
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {topLowStockProducs.map((product, index) => (
              <div
                key={product.company_product_id || index}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-3 hover:bg-gray-50 transition-colors"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Product Image Placeholder */}
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0">
                    <h3 className="table-data-custom truncate">
                      {product.company_product_name}
                    </h3>

                    <p className="caption-custom">
                      {`${product.product_type_name} (Unit:${product.unit_name})`}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex-shrink-0">
                  <span className="table-data-custom !text-red-500">
                    Stock: {product.quantity_live}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TopLowStockProducts;