import LeadSummaryReportType from "../../../../@types/home/dashboard/LeadSummaryReportType";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const PipelineChart = ({
  pipelineData,
  chartFor,
}: {
  pipelineData: LeadSummaryReportType[];
  chartFor : "leadByStatus" | "leadBySource" ;
}) => {
    const [ref, inView] = useInView({ fallbackInView: false, threshold: 0.1 });


  const colors = [
    { color: "#3B82F6", bgColor: "bg-blue-500" },
    { color: "#10B981", bgColor: "bg-emerald-500" },
    { color: "#8B5CF6", bgColor: "bg-purple-500" },
    { color: "#F59E0B", bgColor: "bg-amber-500" },
    { color: "#EF4444", bgColor: "bg-red-500" },
    { color: "#06B6D4", bgColor: "bg-cyan-500" },
    { color: "#84CC16", bgColor: "bg-lime-500" },
    { color: "#F97316", bgColor: "bg-orange-500" },
    { color: "#6366F1", bgColor: "bg-indigo-500" },
    { color: "#EC4899", bgColor: "bg-pink-500" },
    { color: "#14B8A6", bgColor: "bg-teal-500" },
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      
    >
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="section-header-custom mb-2">
            Leads Pipeline
          </h3>
          <p className="table-header-custom">
            {chartFor === "leadByStatus" ? "Current pipeline by Lead Status" : "Current pipeline by Lead Source" }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 min-h-[380px]">
        {pipelineData.map((stage, index) => (
          <div key={index} className="">
            <div className="flex items-center justify-between mb-4 ">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                <span className="input-label-custom">
                  {stage.name}
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <span className="input-label-custom">
                  {stage.total + " "}deals
                </span>
                {/* <span className="text-lg font-bold text-gray-900">{stage.value}</span> */}
              </div>
            </div>

            <div className="relative mt-5">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${colors[index].bgColor} h-3 rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: `${stage.percentage}%`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                ></div>
              </div>
              <span className="absolute right-0 -top-6 caption-custom">
                {stage.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </motion.section>
  );
};

export default PipelineChart;
