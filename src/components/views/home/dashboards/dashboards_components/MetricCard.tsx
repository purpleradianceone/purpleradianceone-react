import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import Sparkline from "./Sparkline";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;

  color: string;
  gradient: string;

  visibility?: boolean;
  id?: string;

  currentValue?: number;
  previousValue?: number;

  isTrend?: boolean;
  trendLabel?: string;
  
  isSparkline?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  gradient,

  visibility = false,
  id,

  currentValue = 0,
  previousValue = 0,

  isTrend = false,
  trendLabel = "from previous",

  isSparkline = false,
}) => {
  const [ref, inView] = useInView({
    fallbackInView: false,
    threshold: 0.1,
  });

  if (!visibility) return null;

  // Trend Calculation
  const trendValue = currentValue - previousValue;

  const trend =
    trendValue > 0 ? 1 : trendValue < 0 ? -1 : 0;

  // const isPositive = trend === 1;

  return (
    <div id={id} className="w-full">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full h-full"
      >
        <div className="relative h-full min-h-[165px] overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          {/* Background Gradient */}
          <div
            className={`absolute inset-0 ${gradient} opacity-[0.03]`}
          />

          <div className="relative flex h-full flex-col justify-between">

            {/* Top Section */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} shadow-md`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>

                {/* Sparkline */}
                {isSparkline && (
                  <div className="w-24">
                    <Sparkline trend={trend} />
                  </div>
                )}
              </div>

              <p className="line-clamp-1 text-xs font-medium text-gray-500">
                {title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {value}
              </h2>
            </div>

            {/* Bottom Section */}
            {isTrend && (
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs">
                  
                  <div
                    className={`flex items-center gap-1 font-semibold ${
                      trend === 1
                        ? "text-green-600"
                        : trend === -1
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {trend === 1 ? (
                      <TrendingUp size={14} />
                    ) : trend === -1 ? (
                      <TrendingDown size={14} />
                    ) : null}

                    <span>
                      {trendValue > 0 ? "+" : ""}
                      {trendValue}
                    </span>
                  </div>

                  <span className="truncate text-gray-500">
                    {trendLabel}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default MetricCard;

// import React from "react";
// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
// import Sparkline from "./Sparkline";

// interface MetricCardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;

//   color: string;
//   gradient: string;

//   visibility?: boolean;
//   id?: string;

//   trendValue?: number;
//   trendLabel?: string;
//   isPositive?: boolean;

//   isSparkline?: boolean;
// }

// const MetricCard: React.FC<MetricCardProps> = ({
//   title,
//   value,
//   icon: Icon,
//   color,
//   gradient,
//   visibility = true,
//   id,

//   trendValue,
//   trendLabel,
//   isPositive = true,

//   isSparkline = false,
// }) => {
//   const [ref, inView] = useInView({
//     fallbackInView: false,
//     threshold: 0.1,
//   });

//   if (!visibility) return null;

//   return (
//     <div id={id} className="w-full">
//       <motion.section
//         ref={ref}
//         initial={{ opacity: 0, y: 20 }}
//         animate={inView ? { opacity: 1, y: 0 } : {}}
//         transition={{ duration: 0.35, ease: "easeOut" }}
//         className="w-full h-full"
//       >
//         <div className="relative h-full overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-h-[165px]">
          
//           {/* Background Gradient */}
//           <div
//             className={`absolute inset-0 ${gradient} opacity-[0.03]`}
//           />

//           <div className="relative flex h-full flex-col justify-between">
            
//             {/* Top Section */}
//             <div>
//               <div className="mb-3 flex items-center justify-between">
//                 <div
//                   className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} shadow-md`}
//                 >
//                   <Icon className="h-5 w-5 text-white" />
//                 </div>
//               </div>

//               <p className="text-xs font-medium text-gray-500 line-clamp-1">
//                 {title}
//               </p>

//               <h2 className="mt-1 text-2xl font-bold text-gray-900">
//                 {value}
//               </h2>
//             </div>

//             {/* Bottom Section */}
//             <div className="mt-4">
//               {(trendValue || trendLabel) && (
//                 <div className="flex items-center gap-1.5 text-xs">
//                   <div
//                     className={`flex items-center gap-1 font-semibold ${
//                       isPositive
//                         ? "text-green-600"
//                         : "text-red-500"
//                     }`}
//                   >
//                     {isPositive ? (
//                       <TrendingUp size={14} />
//                     ) : (
//                       <TrendingDown size={14} />
//                     )}

//                     <span>{trendValue}</span>
//                   </div>

//                   <span className="text-gray-500 truncate">
//                     {trendLabel}
//                   </span>
//                 </div>
//               )}

//               {/* Sparkline */}
//               {isSparkline && (
//                 <div className="absolute top-0 right-0 mt-2">
//                   <Sparkline trend={trendValue?(trendValue>=0?(trendValue==0?0:1):-1):0}/>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.section>
//     </div>
//   );
// };

// export default MetricCard;

