/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import MetricCard from "./MetricCard";
import PipelineChart from "./PipeLineChart";
import QuickActions from "./QuickActions";
import {
  AlertCircleIcon,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
  WineIcon,
} from "lucide-react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import LeadSummaryReportType from "../../../../@types/home/dashboard/LeadSummaryReportType";
import ApiError from "../../../../@types/error/ApiError";
import LeadTaskType from "../../../../@types/lead-management/LeadTaskType";
import SalesChart from "./SalesChart";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import MonthlyAverageLeads from "../../../../@types/home/dashboard/MonthlyAverageLeads";
import { REFCURSOR_KEY } from "../../../../constants/RefcursorConstants";
import Tasks from "./Tasks";
import PieChart from "./PieChart";
import AppTutorailManager from "../../tutorails/AppTutorailManager";
import { DashboardCrmSteps } from "../../../../constants/AppTutorailsSteps";
import { TutorailColumnName } from "../../../../constants/Tutorail";
import { useTutorailDataContext } from "../../../../context/tutorail/useTutorailDataContext";

// import DashboardChartComponent from "../../../dashboarcrmcomponents/DashboardChartComponent";
// import { PieDataItem } from "../../../../@types/dashboard/PieDataItem";
// import { BarDataItem } from "../../../../@types/dashboard/BarDataItem";
// import { BarDataItemFor12MonthPerformance } from "../../../../@types/dashboard/BarDataItemFor12MonthPerformance";
type AccessModuleType = {
  id: number;
  crm_module_id: number;
  company_user_id: number;

  add: boolean;
  view: boolean;
  update: boolean;

  createdby: number;
  updatedby: number;
  createdon: string;
  module_name: string;
  updatedby_user: string;
  updatedon: string;
};

type DashboardDataType = Record<string, Array<Record<string, any>>>;
interface DashboardCRMProp {
  companyUserId: number | null;
}
const DashboardCRM: React.FC<DashboardCRMProp> = ({ companyUserId }) => {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();

  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(true); // Set to true initially
  const [upcomingTask, setUpcomingTasks] = useState<LeadTaskType[]>([]);
  const [pendingTasks, setPendingTasks] = useState<LeadTaskType[]>([]);
  const [leadSummaryReportData, setLeadSummaryReportData] = useState<
    LeadSummaryReportType[]
  >([]);
  const { tutorailData, setTutorailData } = useTutorailDataContext();
  const [tourFinished, setTourFinished] = useState<boolean>(false);
  const [leadBySource, setLeadBySourcce] = useState<LeadSummaryReportType[]>(
    []
  );
  const [monthlyAverageLeads, setMonthlyAverageLeads] = useState<
    MonthlyAverageLeads[]
  >([]);
  const [dashboardLayout, setDashboardLayout] = useState<string[]>([]);
  const [dashboardVisiblity, setDasboardVisibility] = useState<
    { key: string; value: boolean; chartType: string }[]
  >([]);

  const [dashboardData, setDashboardData] = useState<DashboardDataType>({});
  const [accessModuleCompanyUser, setAccessModuleCompanyUser] = useState<
    AccessModuleType[]
  >([]);

  useEffect(() => {
    setTourFinished(tutorailData.isCrmDashboardSeen);
  }, [tutorailData]);

  const getCrmModuleAccessOfCompanyUser = async () => {
    setAccessModuleCompanyUser([]);
    setIsTasksLoading(true);
    const getCrmModuleAccessData = {
      company_id: loginStatus.companyId,
      company_user_id: companyUserId,
      requestedby: loginStatus.id,
    };

    axios
      .post(POST_API.GET_CRM_MODULE_ACCESS, getCrmModuleAccessData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const accessModuleOfCompanyUser: AccessModuleType[] = response.data;
          setAccessModuleCompanyUser(accessModuleOfCompanyUser);
        }
        getDashboardData();
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getCrmModuleAccessOfCompanyUser,
          });
          if (refreshTokenStatus) {
            getCrmModuleAccessOfCompanyUser();
          }
        }
      });
  };

  const getDashboardData = async () => {
    setDashboardData({});
    setDashboardLayout([]);
    setDasboardVisibility([]);
    setLeadSummaryReportData([]);
    setLeadBySourcce([]);
    setMonthlyAverageLeads([]);
    setUpcomingTasks([]);
    setPendingTasks([]);
    setIsTasksLoading(true);
    const postData = {
      company_id: loginStatus.companyId,
      owner_id: companyUserId ?? loginStatus.id,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.GET_COMPANY_USER_DASHBOARD_CRM,
        postData,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const formattedDashboardData: DashboardDataType = response.data;
        response.data.my_fixed_cursor_get_dashboard_widget.map((res: any) => {
          setDashboardLayout((prev) => [...prev, res.dashboard_widget_name]);
          setDasboardVisibility((prev) => [
            ...prev,
            {
              key: res.dashboard_widget_name,
              value: true,
              chartType: res.chart_type_name,
            },
          ]);
        });
        response.data.my_fixed_cursor_lead_by_status.map((res: any) => {
          setLeadSummaryReportData((prev) => [
            ...prev,
            {
              id: res.lead_status_id,
              name: res.name,
              total: res.total,
              percentage: res.percentage,
            },
          ]);
        });
        response.data.my_fixed_cursor_lead_by_source.map((res: any) => {
          setLeadBySourcce((prev) => [
            ...prev,
            {
              id: res.lead_status_id,
              name: res.name,
              total: res.total,
            },
          ]);
        });
        response.data.my_fixed_cursor_12_month_performance.map((res: any) => {
          setMonthlyAverageLeads((prev) => [
            ...prev,
            {
              createdLeads: res.leads_created,
              convertedLeads: res.leads_converted,
              month: res.month_name,
            },
          ]);
        });
        response.data.my_fixed_cursor_upcoming_task.map((res: any) => {
          setUpcomingTasks((prev) => [
            ...prev,
            {
              id: res.id,
              leadId: res.lead_id,
              leadActivityId: res.lead_activity_id,
              leadTaskActivityName: res.lead_activity_name,
              leadTaskPriorityId: res.lead_task_priority_id,
              leadTaskPriorityName: res.lead_task_priority_name,
              leadTaskStageId: res.lead_task_stage_id,
              leadTaskStageName: res.lead_task_stage_name,
              subject: res.subject,
              description: res.description,
              resultOutcome: res.result_outcome,
              dueDateTime: res.due_date_time,
              overdueStatus: res.overdue_status,
              leadActivityDetails: res.lead_activity_details,
              isActive: res.isactive,
              colorCode: res.color_code,
            },
          ]);
        });

        response.data.my_fixed_cursor_pending_task.map((res: any) => {
          setPendingTasks((prev) => [
            ...prev,
            {
              id: res.id,
              leadId: res.lead_id,
              leadActivityId: res.lead_activity_id,
              leadTaskActivityName: res.lead_activity_name,
              leadTaskPriorityId: res.lead_task_priority_id,
              leadTaskPriorityName: res.lead_task_priority_name,
              leadTaskStageId: res.lead_task_stage_id,
              leadTaskStageName: res.lead_task_stage_name,
              subject: res.subject,
              description: res.description,
              resultOutcome: res.result_outcome,
              dueDateTime: res.due_date_time,
              overdueStatus: res.overdue_status,
              leadActivityDetails: res.lead_activity_details,
              isActive: res.isactive,
              colorCode: res.color_code,
            },
          ]);
        });
        setDashboardData(formattedDashboardData);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getDashboardData,
        });

        if (refreshTokenStatus) {
          getDashboardData();
        }
      }
    } finally {
      setIsTasksLoading(false);
    }
  };

  useEffect(() => {
    if (loginStatus?.companyId && loginStatus?.id) {
      getCrmModuleAccessOfCompanyUser();
    }
  }, [companyUserId]);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      navigate(ROUTES_URL.HOME, { replace: true });
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  const componentMapDefault: { [key: string]: JSX.Element } = {
    // Changed to ensure JSX.Element, not null
    "Total Leads": (
      <div
        key="Total Leads"
        className="flex col-span-2 w-full gap-4 justify-around"
      >
        <div className="flex grid-cols-6 sm:gap-1 md:gap-2 lg:gap-11 w-full">
          <MetricCard
            title="Total Leads"
            id="totalLeadsMetricCard"
            value={(
              dashboardData?.[REFCURSOR_KEY.MY_FIXED_CURSOR_TOTAL_LEADS]?.[0]
                ?.total_leads ?? 0
            ).toString()}
            icon={Users}
            color="bg-gradient-to-r from-cyan-500 to-cyan-600"
            gradient="bg-gradient-to-r from-cyan-500 to-cyan-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? dashboardVisiblity.find(
                    (visibility) => visibility.key == "Total Leads"
                  )!.value
                : false
            }
          />
          <MetricCard
            title="Active Leads"
            id="activeLeadsMetricCard"
            value={(
              dashboardData?.[REFCURSOR_KEY.MY_FIXED_CURSOR_ACTIVE_LEADS]?.[0]
                ?.active_leads ?? 0
            ).toString()}
            icon={Target}
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? dashboardVisiblity.find(
                    (visibility) => visibility.key == "Active Leads"
                  )!.value
                : false
            }
          />
          <MetricCard
            title="Converted Leads"
            id="convertedLeadsMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_CONVERTED_LEADS
              ]?.[0]?.converted_leads ?? 0
            ).toString()}
            icon={WineIcon}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? dashboardVisiblity.find(
                    (visibility) => visibility.key == "Converted Leads"
                  )!.value
                : false
            }
          />
          <MetricCard
            title="Unqualified Leads"
            id="unqualifiedLeadsMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_UNQUALIFIED_LEADS
              ]?.[0]?.unqualified_leads ?? 0
            ).toString()}
            icon={ShieldAlert}
            color="bg-gradient-to-r from-teal-500 to-teal-600"
            gradient="bg-gradient-to-r from-teal-500 to-teal-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? dashboardVisiblity.find(
                    (visibility) => visibility.key == "Unqualified Leads"
                  )!.value
                : false
            }
          />
          <MetricCard
            title="Lost Leads"
            id="lostLeadsMetricCard"
            value={
              dashboardData?.[REFCURSOR_KEY.MY_FIXED_CURSOR_LOST_LEADS]?.[0]
                ?.lost_leads ?? 0
            }
            icon={AlertCircleIcon}
            color="bg-gradient-to-r from-red-500 to-red-600"
            gradient="bg-gradient-to-r from-red-500 to-red-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? dashboardVisiblity.find(
                    (visibility) => visibility.key == "Lost Leads"
                  )!.value
                : false
            }
          />

          <MetricCard
            title="Conversion Rate"
            id="conversionRateMetricCard"
            value={`${(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_CONVERSION_RATE
              ]?.[0]?.conversion_rate ?? 0
            ).toString()}%`}
            icon={TrendingUp}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            gradient="bg-gradient-to-r from-orange-500 to-orange-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? dashboardVisiblity.find(
                    (visibility) => visibility.key == "Conversion Rate (%)"
                  )!.value
                : false
            }
          />
        </div>
      </div>
    ),

    "Leads by status": (
      <div
        key="Leads by status"
        className="grid grid-cols-1 col-span-1 xl:grid-cols-1 gap-8"
      >
        <div id="leadByStatusPipeline" className="min-h-[500px]">
          {leadSummaryReportData && (
            <PipelineChart
              pipelineData={leadSummaryReportData}
              chartFor="leadByStatus"
            />
          )}
        </div>
      </div>
    ),
    "12 months performance": (
      <div
        id="monthlyPerformance"
        key="12 months performance"
        className="min-h-[700px] col-span-1"
      >
        <SalesChart leadsData={monthlyAverageLeads} />
      </div>
    ),
    "Pending tasks": (
      <div
        id="pendingTasks"
        key="Pending tasks"
        className="h-full col-span-1 border-gray-100 bg-white rounded-2xl overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-white
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <Tasks
          companyUserId={companyUserId}
          isLoading={isTasksLoading}
          leadTasks={pendingTasks}
          taskType="pending"
        />
      </div>
    ),
    "Upcoming tasks": (
      <div
        id="upcomingTasks"
        key="Upcoming tasks"
        className="h-full col-span-1 border-gray-100 bg-white rounded-2xl overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-white
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <Tasks
          companyUserId={companyUserId}
          isLoading={isTasksLoading}
          leadTasks={upcomingTask}
          taskType="upcoming"
        />
      </div>
    ),
    "Leads by source": (
      <div
        id="leadBySource"
        key="Leads by source"
        className="h-full col-span-1 overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-50
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <PipelineChart
          pipelineData={leadBySource}
          chartFor="leadBySource"
        ></PipelineChart>
      </div>
    ),
    "Quick Actions": (
      <div
        id="quickActions"
        key="Quick Actions"
        className="h-full col-span-1 overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <QuickActions
          companyUserId={companyUserId}
          moduleAccessCompanyUser={accessModuleCompanyUser}
        />
      </div>
    ),
  };

  const componentMapPieChart: { [key: string]: JSX.Element } = {
    "Leads by status": (
      <div
        key="Leads by status"
        className="grid grid-cols-1 xl:grid-cols-1 gap-8"
      >
        <div id="leadByStatusPipeline" className="min-h-[500px]">
          {leadSummaryReportData && (
            <PieChart data={leadSummaryReportData} chartFor="leadByStatus" />
          )}
        </div>
      </div>
    ),
    "Leads by source": (
      <div
        key="Leads by source"
        id="leadBySource"
        className="h-full overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-50
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <PieChart data={leadBySource} chartFor="leadBySource" />
      </div>
    ),
  };

  const renderDashboardSections = () => {
    const renderedSections: JSX.Element[] = [];
    const layoutIterator = dashboardLayout[Symbol.iterator]();
    let nextSection = layoutIterator.next();
    while (!nextSection.done) {
      const currentSectionId = nextSection.value;
      const currentComponentBarChart = componentMapDefault[currentSectionId];
      const currentCompanonentPieChart = componentMapPieChart[currentSectionId];
      const cond = dashboardVisiblity.find(
        (visibility) => visibility.key === currentSectionId
      )!.value;
      const chartType = dashboardVisiblity.find(
        (visibility) => visibility.key === currentSectionId
      )!.chartType;

      // console.log(dashboardVisiblity.find(
      //   (visibility) => visibility.key === currentSectionId
      // )!.chartType)
      // console.log(currentSectionId)
      // console.log(dashboardVisiblity);
      // console.log("+++++++++++++++++");
      if (
        currentComponentBarChart &&
        cond &&
        (chartType === "Bar" ||
          chartType === "Square" ||
          chartType === "List" ||
          chartType === "Table")
      ) {
        renderedSections.push(currentComponentBarChart);
      } else if (currentCompanonentPieChart && cond && chartType === "Pie") {
        renderedSections.push(currentCompanonentPieChart);
      }
      nextSection = layoutIterator.next();
    }
    return renderedSections;
  };

  const handleTourEnd = async () => {
    const updateTutorailPostData = {
      company_id: loginStatus.companyId,
      id: tutorailData.id,
      column_name: TutorailColumnName.IS_CRM_DASHBOARD_SEEN,
      status: true,
      updatedby_id: loginStatus.id,
    };
    axios
      .post(POST_API.UPDATE_COMPANY_USER_TUTORAIL, updateTutorailPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          setTourFinished(true);
          setTutorailData({
            id: tutorailData.id,
            companyUserId: tutorailData.companyUserId,
            isNavbarSeen: tutorailData.isNavbarSeen,
            isDashboardSeen: tutorailData.isDashboardSeen,
            isCrmDashboardSeen: true,
            isCompanyUserSeen: tutorailData.isCompanyUserSeen,
            isCompanyUserActionsSeen: tutorailData.isCompanyUserActionsSeen,
            isLeadSeen: tutorailData.isLeadSeen,
            isAccountSeen: tutorailData.isAccountSeen,
            isProductSeen: tutorailData.isProductSeen,
            isTeamSeen: tutorailData.isTeamSeen,
            isSettingCompanySeen: tutorailData.isSettingCompanySeen,
            isSettingEmailTemplateSeen: tutorailData.isSettingEmailTemplateSeen,
            isSettingIntegrationSeen: tutorailData.isSettingIntegrationSeen,
            createdBy: tutorailData.createdOn,
            updatedBy: tutorailData.updatedBy,
            createdOn: tutorailData.createdOn,
            updatedOn: tutorailData.updatedOn,
          });
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleTourEnd,
          });
          if (refreshTokenResponse) {
            handleTourEnd();
          }
        }
      });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br w-full from-gray-50 via-blue-50 to-indigo-50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {isTasksLoading && (
          <div className="flex min-w-full justify-center items-center mt-16 pt-48 text-gray-600 text-lg">
            <LoadingSpinner></LoadingSpinner>
          </div>
        )}
        {!isTasksLoading && dashboardVisiblity.length !== 0 && (
          <div className="max-w-full p-6 mx-auto grid gap-3 grid-cols-2 space-y-5">
            {!tourFinished && (
              <AppTutorailManager
                steps={DashboardCrmSteps}
                handleTourEnd={handleTourEnd}
              />
            )}
            {renderDashboardSections()}
          </div>
        )}
      </div>

      {/* <div className="grid grid-cols-3">
        <div className="p-10 ">
          <h1 className="ml-10 text-xl font-bold ">Lead By Source</h1>
          <DashboardChartComponent
            type="Pie"
            data={
              (dashboardData[REFCURSOR_KEY.MY_FIXED_CURSOR_LEAD_BY_SOURCE] ??
                []) as PieDataItem[]
            }
            colors={["#8884d8", "#82ca9d", "#ffc658"]}
          />
        </div>

        <div className="p-10">
          <h1 className="ml-10 text-xl font-bold">Lead By Status</h1>
          <DashboardChartComponent
            type="Bar"
            data={
              (dashboardData[REFCURSOR_KEY.MY_FIXED_CURSOR_LEAD_BY_STATUS] ??
                []) as BarDataItem[]
            }
            colors={["#8884d8", "#82ca9d", "#ffc658"]}
          />
        </div>

        <div className="p-10">
          <h1 className="ml-10 text-xl font-bold">12 Month Performance</h1>
          <DashboardChartComponent
            type="Bar"
            data={
              (dashboardData[
                REFCURSOR_KEY.MY_FIXED_CURSOR_12_MONTH_PERFORMANCE
              ] ?? []) as BarDataItemFor12MonthPerformance[]
            }
            colors={["#8884d8", "#82ca9d", "#ffc658"]}
          />
        </div>
      </div>

      <div className="p-10">
        <h1 className="ml-10 text-xl font-bold">12 Month Performance</h1>
        <DashboardChartComponent
          type="Bar"
          data={
            (dashboardData[
              REFCURSOR_KEY.MY_FIXED_CURSOR_12_MONTH_PERFORMANCE
            ] ?? []) as BarDataItemFor12MonthPerformance[]
          }
          colors={["#8884d8", "#82ca9d", "#ffc658"]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-90px)] w-full px-6">
        <div className="flex flex-col bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-1">Pending Tasks</h2>
          <p className="text-gray-500 mb-4">
            Your Pending activities and deadlines
          </p>
        
        <DashboardChartComponent
            type="List"
            data={
              (dashboardData[REFCURSOR_KEY.MY_FIXED_CURSOR_PENDING_TASK] ??
                []) as PendingTaskList[]
            }
            colors={["#8884d8", "#82ca9d", "#ffc658"]}
          />
        </div>

        <div className="flex flex-col bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-1">Upcoming Tasks</h2>
          <p className="text-gray-500 mb-4">
            Your scheduled activities and deadlines
          </p>

          <DashboardChartComponent
            type="List"
            data={
              (dashboardData[REFCURSOR_KEY.MY_FIXED_CURSOR_UPCOMING_TASK] ??
                []) as PendingTaskList[]
            }
            colors={["#8884d8", "#82ca9d", "#ffc658"]}
          />
        </div>
      </div> */}
    </>
  );
};

export default DashboardCRM;
