/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import MetricCard from "./MetricCard";
import PipelineChart from "./PipeLineChart";
import RecentActivity from "./RecentActivity";
import QuickActions from "./Actions";
import UpcomingTasks from "./UpcomingTasks";
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
import { useServerCurrentTime } from "../../../../config/hooks/useServerCurrentTime";
import SalesChart from "./SalesChart";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import MonthlyAverageLeads from "../../../../@types/home/dashboard/MonthlyAverageLeads";
import { REFCURSOR_KEY } from "../../../../constants/RefcursorConstants";

type DashboardDataType = Record<string, Array<Record<string, any>>>;

function Dashboard() {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();

  const { currentTime } = useServerCurrentTime();
  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(true); // Set to true initially
  const [upcomingTask, setUpcomingTasks] = useState<LeadTaskType[]>([]);
  const [completedTasks, setCompletedTasks] = useState<LeadTaskType[]>([]);
  const [pendingTasks, setPendingTasks] = useState<LeadTaskType[]>([]);

  const [dashboardData, setDashboardData] = useState<DashboardDataType>({});

  const getDashboardData = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      owner_id: companyPipelineView ? null : loginStatus.id,
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

        setDashboardData(formattedDashboardData);
      
        // setDashboardData(formattedDashboardData);
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
    }
  };

  useEffect(() => {
    if (!dashboardData) return;

    console.log("-------------------------------------------------");
    console.log(
      dashboardData[REFCURSOR_KEY.MY_FIXED_CURSOR_ACTIVE_LEADS]?.[0]
        ?.active_leads ?? 0
    );
  }, [dashboardData]);

  const [companyPipelineView, setCompanyPipelineView] =
    useState<boolean>(false);

  // useEffect(() => {
  //   if (loginStatus?.companyId && loginStatus?.id) {
  //     getDashboardData();
  //   }
  // }, [loginStatus, companyPipelineView]);

  useEffect(() => {
    if (loginStatus?.companyId && loginStatus?.id) {
      getDashboardData();
    }
  }, []);

  const [leadSummaryReportData, setLeadSummaryReportData] =
    useState<LeadSummaryReportType>({
      totalLeads: 0,
      totalOpenLeads: 0,
      totalContactedLeads: 0,
      totalWorkingLeads: 0,
      totalQualifiedLeads: 0,
      totalUnqualifiedLeads: 0,
      totalDemoMeetingScheduledLeads: 0,
      totalProposalSentLeads: 0,
      totalNegotiationLeads: 0,
      totalConvertedLeads: 0,
      totalLostLeads: 0,
      totalNurtureLeads: 0,
      totalActiveLeads: 0,
      conversionRate: 0,
      totalOpenLeadsPercentage: 0,
      totalContactedLeadsPercentage: 0,
      totalWorkingLeadsPercentage: 0,
      totalQualifiedLeadsPercentage: 0,
      totalUnqualifiedLeadsPercentage: 0,
      totalDemoMeetingScheduledLeadsPercentage: 0,
      totalProposalSentLeadsPercentage: 0,
      totalNegotiationLeadsPercentage: 0,
      totalConvertedLeadsPercentage: 0,
      totalLostLeadsPercentage: 0,
      totalNurtureLeadsPercentage: 0,
      openLeadStatusName: "",
      contactedLeadStatusName: "",
      workingLeadStatusName: "",
      qualifiedLeadStatusName: "",
      unqualifiedLeadStatusName: "",
      demoMeetingScheduledLeadStatusName: "",
      proposalSentLeadStatusName: "",
      negotiationLeadStatusName: "",
      convertedLeadStatusName: "",
      LostLeadStatusName: "",
      nurtureLeadStatusName: "",
    });
  const [monthlyAverageLeads, setMonthlyAverageLeads] = useState<
    MonthlyAverageLeads[]
  >([]);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const [dashboardLayout, setDashboardLayout] = useState<string[]>([]);
  const [dashboardVisiblity, setDasboardVisibility] = useState<
    { key: string; value: boolean }[]
  >([]);
  
  const getLeadSummaryReport = async () => {
    const postDataToGetLeads = {
      company_id: loginStatus.companyId,
      ownerid: companyPipelineView ? null : loginStatus.id,
      requestedby_id: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.GET_LEAD_SUMMARY_REPORT,
        postDataToGetLeads,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        const formattedData: LeadSummaryReportType = {
          totalLeads: response.data.total_leads,
          totalOpenLeads: response.data.total_open_leads,
          totalContactedLeads: response.data.total_contacted_leads,
          totalWorkingLeads: response.data.total_working_leads,
          totalQualifiedLeads: response.data.total_qualified_leads,
          totalUnqualifiedLeads: response.data.total_unqualified_leads,
          totalDemoMeetingScheduledLeads:
            response.data.total_demo_meeting_scheduled_leads,
          totalProposalSentLeads: response.data.total_proposal_sent_leads,
          totalNegotiationLeads: response.data.total_negotiation_leads,
          totalConvertedLeads: response.data.total_converted_leads,
          totalLostLeads: response.data.total_lost_leads,
          totalNurtureLeads: response.data.total_nurture_leads,
          totalActiveLeads: response.data.total_active_leads,
          conversionRate: response.data.conversion_rate,
          totalOpenLeadsPercentage: response.data.total_open_leads_percentage,
          totalContactedLeadsPercentage:
            response.data.total_contacted_leads_percentage,
          totalWorkingLeadsPercentage:
            response.data.total_working_leads_percentage,
          totalQualifiedLeadsPercentage:
            response.data.total_qualified_leads_percentage,
          totalUnqualifiedLeadsPercentage:
            response.data.total_unqualified_leads_percentage,
          totalDemoMeetingScheduledLeadsPercentage:
            response.data.total_demo_meeting_scheduled_leads_percentage,
          totalProposalSentLeadsPercentage:
            response.data.total_proposal_sent_leads_percentage,
          totalNegotiationLeadsPercentage:
            response.data.total_negotiation_leads_percentage,
          totalConvertedLeadsPercentage:
            response.data.total_converted_leads_percentage,
          totalLostLeadsPercentage: response.data.total_lost_leads_percentage,
          totalNurtureLeadsPercentage:
            response.data.total_nurture_leads_percentage,
          openLeadStatusName: response.data.open_lead_status_name,
          contactedLeadStatusName: response.data.contacted_lead_status_name,
          workingLeadStatusName: response.data.working_lead_status_name,
          qualifiedLeadStatusName: response.data.qualified_lead_status_name,
          unqualifiedLeadStatusName: response.data.unqualified_lead_status_name,
          demoMeetingScheduledLeadStatusName:
            response.data.demo_meeting_scheduled_lead_status_name,
          proposalSentLeadStatusName:
            response.data.proposal_sent_lead_status_name,
          negotiationLeadStatusName: response.data.negotiation_lead_status_name,
          convertedLeadStatusName: response.data.converted_lead_status_name,
          LostLeadStatusName: response.data.lost_lead_status_name,
          nurtureLeadStatusName: response.data.nurture_lead_status_name,
        };
        setLeadSummaryReportData(formattedData);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadSummaryReport,
        });

        if (refreshTokenStatus) {
          getLeadSummaryReport();
        }
      }
    }
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  const handlePrevYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const getLeadsMonthlyAverage = async () => {
    setMonthlyAverageLeads([]);
    const postDataToGetLeads = {
      company_id: loginStatus.companyId,
      year: currentYear,
      ownerid: companyPipelineView ? null : loginStatus.id,
      requestedby_id: loginStatus.id,
    };
    try {
      await axios
        .post(POST_API.GET_LEADS_MONTHLY_AVERAGE, postDataToGetLeads, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            response.data.map((res: any) => {
              setMonthlyAverageLeads((prev) => [
                ...prev,
                {
                  averageMonthlyLeads: res.average_monthly_leads,
                  monthlyConvertedLeads: res.monthly_converted_leads,
                  month: res.month,
                  year: res.year,
                },
              ]);
            });
          }
        })
        .catch(async (error) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunction: getLeadsMonthlyAverage,
            });
            if (refreshTokenStatus) {
              getLeadsMonthlyAverage();
            }
          }
        });
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadSummaryReport,
        });

        if (refreshTokenStatus) {
          getLeadSummaryReport();
        }
      }
    }
  };

  const getUpcomingLeadTasks = async () => {
    setIsTasksLoading(true);
    const getLeadTaskPostData = {
      company_id: loginStatus.companyId,
      company_user_id: loginStatus.id,
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.GET_UPCOMING_LEAD_TASKS,
        getLeadTaskPostData,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        const fetchedTasks: LeadTaskType[] = response.data.map((res: any) => ({
          id: res.id,
          leadId: res.lead_id,
          leadActivityId: res.lead_activity_id,
          leadTaskPriorityId: res.lead_task_priority_id,
          leadTaskStageId: res.lead_task_stage_id,
          subject: res.subject,
          description: res.description,
          colorCode: res.color_code,
          assignedToName: res.assigned_to,
          dueDateTime: res.due_date_time,
          leadActivityDetails: res.lead_activity_details,
          isActive: res.isactive,
          createdBy: res.createdby,
          updatedBy: res.updatedby,
          createdOn: res.createdon,
          updatedOn: res.updatedon,
          resultOutcome: res.result_outcome,
          leadTaskActivityName: res.lead_activity_name,
          leadTaskPriorityName: res.lead_task_priority_name,
          leadTaskStageName: res.lead_task_stage_name,
          overdueStatus: res.overdue_status,
        }));
        setUpcomingTasks(fetchedTasks);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: getUpcomingLeadTasks,
        });
        if (refreshTokenResponse) {
          getUpcomingLeadTasks();
        }
      } else {
        console.error("Failed to fetch lead tasks:", error);
      }
    } finally {
      setIsTasksLoading(false);
    }
  };

  const getPendingLeadTasks = async () => {
    setIsTasksLoading(true);
    const getLeadTaskPostData = {
      company_id: loginStatus.companyId,
      company_user_id: loginStatus.id,
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.GET_PENDING_LEAD_TASKS,
        getLeadTaskPostData,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        const fetchedTasks: LeadTaskType[] = response.data.map((res: any) => ({
          id: res.id,
          leadId: res.lead_id,
          leadActivityId: res.lead_activity_id,
          leadTaskPriorityId: res.lead_task_priority_id,
          leadTaskStageId: res.lead_task_stage_id,
          subject: res.subject,
          description: res.description,
          colorCode: res.color_code,
          assignedToName: res.assigned_to,
          dueDateTime: res.due_date_time,
          leadActivityDetails: res.lead_activity_details,
          isActive: res.isactive,
          createdBy: res.createdby,
          updatedBy: res.updatedby,
          createdOn: res.createdon,
          updatedOn: res.updatedon,
          resultOutcome: res.result_outcome,
          leadTaskActivityName: res.lead_activity_name,
          leadTaskPriorityName: res.lead_task_priority_name,
          leadTaskStageName: res.lead_task_stage_name,
          overdueStatus: res.overdue_status,
        }));
        setPendingTasks(fetchedTasks);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: getPendingLeadTasks,
        });
        if (refreshTokenResponse) {
          getPendingLeadTasks();
        }
      } else {
        console.error("Failed to fetch lead tasks:", error);
      }
    } finally {
      setIsTasksLoading(false);
    }
  };

  const getCompletedLeadTasks = async () => {
    setIsTasksLoading(true);
    const getLeadTaskPostData = {
      company_id: loginStatus.companyId,
      company_user_id: loginStatus.id,
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.GET_COMPLETED_LEAD_TASKS,
        getLeadTaskPostData,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        const fetchedTasks: LeadTaskType[] = response.data.map((res: any) => ({
          id: res.id,
          leadId: res.lead_id,
          leadActivityId: res.lead_activity_id,
          leadTaskPriorityId: res.lead_task_priority_id,
          leadTaskStageId: res.lead_task_stage_id,
          subject: res.subject,
          description: res.description,
          colorCode: res.color_code,
          assignedToName: res.assigned_to,
          dueDateTime: res.due_date_time,
          leadActivityDetails: res.lead_activity_details,
          isActive: res.isactive,
          createdBy: res.createdby,
          updatedBy: res.updatedby,
          createdOn: res.createdon,
          updatedOn: res.updatedon,
          resultOutcome: res.result_outcome,
          leadTaskActivityName: res.lead_activity_name,
          leadTaskPriorityName: res.lead_task_priority_name,
          leadTaskStageName: res.lead_task_stage_name,
          completedAt: res.completed_at,
          completedAtDateTime: res.completed_at_due_date_time,
          overdueStatus: res.overdue_status,
        }));
        setCompletedTasks(fetchedTasks);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: getCompletedLeadTasks,
        });
        if (refreshTokenResponse) {
          getCompletedLeadTasks();
        }
      } else {
        console.error("Failed to fetch lead tasks:", error);
      }
    } finally {
      setIsTasksLoading(false);
    }
  };

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);

    setDashboardLayout([
      "metricCards",
      "salesChart",
      "pipelineChart",
      "pendingTasks",
      "upcomingTasks",
      "quickActions",
      "completedTasks",
    ]);

    setDasboardVisibility([
      {
        key: "metricCards",
        value: true,
      },
      {
        key: "recentActivity",
        value: true,
      },
      {
        key: "pipelineChart",
        value: true,
      },
      {
        key: "upcomingTasks",
        value: true,
      },
      {
        key: "salesChart",
        value: true,
      },
      {
        key: "pendingTasks",
        value: true,
      },
      {
        key: "completedTasks",
        value: true,
      },
      {
        key: "quickActions",
        value: true,
      },
    ]);

    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      navigate(ROUTES_URL.HOME, { replace: true });
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  useEffect(() => {
    getLeadSummaryReport();
  }, [companyPipelineView]);

  useEffect(() => {
    setMonthlyAverageLeads([]);
    getLeadsMonthlyAverage();
  }, [currentYear, companyPipelineView]);

  useEffect(() => {
    if (currentTime) {
      getUpcomingLeadTasks();
      getPendingLeadTasks();
      getCompletedLeadTasks();
    }
  }, [currentTime]);

  const componentMap: { [key: string]: JSX.Element } = {
    // Changed to ensure JSX.Element, not null
    metricCards: (
      <div key="metricCards" className="grid grid-cols-1 xl:grid-cols-1 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <MetricCard
            title="Total Lead"
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
                    (visibility) => visibility.key == "metricCards"
                  )!.value
                : false
            }
          />
          <MetricCard
            title="Active Deals"
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
                    (visibility) => visibility.key == "metricCards"
                  )!.value
                : false
            }
          />
          <MetricCard
            title="Converted Leads"
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
                    (visibility) => visibility.key == "metricCards"
                  )!.value
                : false
            }
          />
          <MetricCard
            title="Unqualified Deals"
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
                    (visibility) => visibility.key == "metricCards"
                  )!.value
                : false
            }
          />
          <MetricCard
            title="Lost Deals"
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
                    (visibility) => visibility.key == "metricCards"
                  )!.value
                : false
            }
          />

          <MetricCard
            title="Conversion Rate"
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
                    (visibility) => visibility.key == "metricCards"
                  )!.value
                : false
            }
          />
        </div>
      </div>
    ),

    pipelineChart: (
      <div
        key="pipelineChart"
        className="grid grid-cols-1 xl:grid-cols-1 gap-8"
      >
        <div className="min-h-0">
          {leadSummaryReportData && (
            <PipelineChart
              view={companyPipelineView ? "Company" : "Self"}
              handleViewChange={() => {
                setCompanyPipelineView(!companyPipelineView);
              }}
              leadSummaryData={leadSummaryReportData}
            />
          )}
        </div>
      </div>
    ),
    recentActivity: (
      <div
        key="recentActivity"
        className="lg:col-span-1 h-full overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <RecentActivity />
      </div>
    ),
    salesChart: (
      <div key="salesChart" className="min-h-[500px]">
        <SalesChart
          leadsData={monthlyAverageLeads}
          currentYear={currentYear}
          handleNextYear={handleNextYear}
          handlePrevYear={handlePrevYear}
        />
      </div>
    ),
    pendingTasks: (
      <div
        key="pendingTasks"
        className="h-full overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-50
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <UpcomingTasks
          isLoading={isTasksLoading}
          leadTasks={pendingTasks}
          taskType="pending"
        />
      </div>
    ),
    upcomingTasks: (
      <div
        key="upcomingTasks"
        className="h-full overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <UpcomingTasks
          isLoading={isTasksLoading}
          leadTasks={upcomingTask}
          taskType="upcoming"
        />
      </div>
    ),
    completedTasks: (
      <div
        key="completedTasks"
        className="h-full overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-50
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <UpcomingTasks
          isLoading={isTasksLoading}
          leadTasks={completedTasks}
          taskType="completed"
        />
      </div>
    ),
    quickActions: (
      <div
        key="quickActions"
        className="h-full overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <QuickActions />
      </div>
    ),
  };

  const renderDashboardSections = () => {
    const renderedSections: JSX.Element[] = [];
    const layoutIterator = dashboardLayout[Symbol.iterator]();
    let nextSection = layoutIterator.next();

    while (!nextSection.done) {
      const currentSectionId = nextSection.value;
      const currentComponent = componentMap[currentSectionId];
      const cond = dashboardVisiblity.find(
        (visibility) => visibility.key === currentSectionId
      )!.value;

      if (currentComponent && cond) {
        if (currentSectionId !== "metricCards") {
          const nextId = layoutIterator.next().value;
          const nextComponent = nextId ? componentMap[nextId] : null;

          if (nextId !== "metricCards" && nextComponent) {
            renderedSections.push(
              <div
                key={`${currentSectionId}-${nextId}-grid`}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[700px]"
              >
                {currentComponent}
                {nextComponent}
              </div>
            );
          } else {
            renderedSections.push(currentComponent);
            if (nextId) {
              nextSection = { value: nextId, done: false };
              continue;
            }
          }
        } else {
          renderedSections.push(currentComponent);
        }
      }
      nextSection = layoutIterator.next();
    }
    return renderedSections;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br w-full from-gray-50 via-blue-50 to-indigo-50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {isTasksLoading && (
          <div className="flex min-w-full justify-center items-center mt-16 pt-48 text-gray-600 text-lg">
            <LoadingSpinner></LoadingSpinner>
          </div>
        )}
        {!isTasksLoading && (
          <div className="max-w-full p-6 mx-auto space-y-14">
            {renderDashboardSections()}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
