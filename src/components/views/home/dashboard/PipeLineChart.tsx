import { ChevronLeft, ChevronRight } from "lucide-react";
import LeadSummaryReportType from "../../../../@types/home/dashboard/LeadSummaryReportType";

const PipelineChart = ({
  view,
  handleViewChange,
  leadSummaryData

}: {
   view : "Company" | "Self";
   handleViewChange : () => void;
   leadSummaryData : LeadSummaryReportType;
  
}) => {
  const pipelineData = [
  {
    stage: "Leads",
    count: leadSummaryData.totalLeads,
    color: "bg-gray-700", // Darker gray for the overall lead pool
    percentage: 100,
  },
  {
    stage: leadSummaryData.openLeadStatusName,
    count: leadSummaryData.totalOpenLeads,
    color: "bg-blue-500", // Blue for initial, active leads
    percentage: leadSummaryData.totalOpenLeadsPercentage,
  },
  {
    stage: leadSummaryData.contactedLeadStatusName,
    count: leadSummaryData.totalContactedLeads,
    color: "bg-cyan-500", // Cyan for leads that have been reached out to
    percentage: leadSummaryData.totalContactedLeadsPercentage,
  },
  {
    stage: leadSummaryData.workingLeadStatusName,
    count: leadSummaryData.totalWorkingLeads,
    color: "bg-indigo-500", // Indigo for leads actively being worked on
    percentage: leadSummaryData.totalWorkingLeadsPercentage,
  },
  {
    stage: leadSummaryData.unqualifiedLeadStatusName,
    count: leadSummaryData.totalUnqualifiedLeads,
    color: "bg-red-500", // Red for unqualified leads (negative outcome)
    percentage: leadSummaryData.totalUnqualifiedLeadsPercentage,
  },
  {
    stage: leadSummaryData.qualifiedLeadStatusName,
    count: leadSummaryData.totalQualifiedLeads,
    color: "bg-green-500", // Green for qualified leads (positive progression)
    percentage: leadSummaryData.totalQualifiedLeadsPercentage,
  },
  {
    stage: leadSummaryData.demoMeetingScheduledLeadStatusName,
    count: leadSummaryData.totalDemoMeetingScheduledLeads,
    color: "bg-purple-500", // Purple for scheduled key events
    percentage: leadSummaryData.totalDemoMeetingScheduledLeadsPercentage,
  },
  {
    stage: leadSummaryData.proposalSentLeadStatusName,
    count: leadSummaryData.totalProposalSentLeads,
    color: "bg-yellow-500", // Yellow for a pending proposal
    percentage: leadSummaryData.totalProposalSentLeadsPercentage,
  },
  {
    stage: leadSummaryData.negotiationLeadStatusName,
    count: leadSummaryData.totalNegotiationLeads,
    color: "bg-orange-500", // Orange for leads in negotiation (critical stage)
    percentage: leadSummaryData.totalNegotiationLeadsPercentage,
  },
  {
    stage: leadSummaryData.convertedLeadStatusName,
    count: leadSummaryData.totalConvertedLeads,
    color: "bg-emerald-600", // Darker emerald for successful closure
    percentage: leadSummaryData.totalConvertedLeadsPercentage,
  },
  {
    stage: leadSummaryData.LostLeadStatusName,
    count: leadSummaryData.totalLostLeads,
    color: "bg-stone-500", // Stone/grey for lost leads (final negative outcome)
    percentage: leadSummaryData.totalLostLeadsPercentage,
  },
  {
    stage: leadSummaryData.nurtureLeadStatusName,
    count: leadSummaryData.totalNurtureLeads,
    color: "bg-lime-500", // Lime green for leads in a nurturing phase
    percentage: leadSummaryData.totalNurtureLeadsPercentage,
  },
];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Sales Pipeline
          </h3>
          <p className="text-gray-600">
            Current pipeline status and conversion rates
          </p>
        </div>
         <div className="flex items-center text-gray-800 min-w-38 bg-gray-100 px-3 py-1 rounded-full space-x-2">
      <button
      type="button"
        onClick={handleViewChange}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Previous Year"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-semibold">{view}</span>
      <button
      type="button"
       onClick={handleViewChange}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Next Year"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {pipelineData.map((stage, index) => (
          <div key={index} className="">
            <div className="flex items-center justify-between mb-4 ">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
                <span className="font-medium text-xs text-gray-900">
                  {stage.stage}
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-sm font-medium text-gray-600">
                  {stage.count + " "}deals
                </span>
                {/* <span className="text-lg font-bold text-gray-900">{stage.value}</span> */}
              </div>
            </div>

            <div className="relative mt-5">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${stage.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: `${stage.percentage}%`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                ></div>
              </div>
              <span className="absolute right-0 -top-6 text-xs font-medium text-gray-500">
                {stage.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-1 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4">
            <p className="text-sm font-medium text-emerald-700 mb-1">
              Conversion Rate
            </p>
            <p className="text-xl font-bold text-emerald-800">{leadSummaryData.conversionRate}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-700 mb-1">
              Total Converted Leads
            </p>
            <p className="text-xl font-bold text-blue-800">{leadSummaryData.totalConvertedLeads}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineChart;
