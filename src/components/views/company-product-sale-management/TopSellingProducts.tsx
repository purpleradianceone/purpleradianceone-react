import { TopSaleProductProps } from "../../../@types/products/SummarySalesProps";
import {
  ArrowRight,
  
} from "lucide-react";
import { formatRupee } from "../../../utils/helperMethods/formatFunctions";
import COLORS from "../../../constants/Colors";

type Props = {
  topProducts: TopSaleProductProps[];
};

function TopSellingProducts({
  topProducts,
}: Props) {
 

  // const totalSales = topProducts.reduce(
  //   (sum, item) => sum + Number(item.total_sales || 0),
  //   0
  // );

  return (
    <div className="bg-white border border-slate-200 rounded-xl h-full">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 ">
        <h2 className=" table-header-custom !text-[13px]">
          Top Selling Products 
          <span className="rounded-md caption-custom !text-[10px]"> (This Month)</span>
        </h2>
      </div>

      <div>
        {topProducts.map((item, index) => {
          // const percentage =
          //   totalSales > 0
          //     ? Math.round(
          //         (Number(item.total_sales) /
          //           totalSales) *
          //           100
          //       )
          //     : 0;

          return (
            <div
              key={item.company_product_id}
              className="flex items-center justify-between px-4 py-1.5 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold
                      ${
                        index === 0
                          ? `${COLORS.LIGHT_PURPLE_BACKGROUND} ${COLORS.PRIMARY_PURPLE}`
                          : index === 1
                          ? "bg-blue-50 text-blue-600"
                          : "bg-orange-50 text-orange-500"
                      }
                    `}
                  >
                    {index + 1}
                  </div>

                  <ArrowRight className="w-3 h-3 text-slate-300" />
                </div>


                <div>
                  <p className="table-header-custom !text-[12px]">
                    {item.company_product_name}
                  </p>

                  
                </div>
              </div>

              <div className="text-right">
                <p className="table-header-custom !text-[13px]">
                 
                  ₹{formatRupee(item.total_sales)}
                </p>

                {/* <p className="text-xs text-slate-500">
                  {percentage}%
                </p> */}
              </div>
            </div>
          );
        })}

        {topProducts.length === 0 && (
          <div className="text-center caption-custom py-10">
            No sales data available
          </div>
        )}
      </div>
    </div>
  );
}

export default TopSellingProducts;