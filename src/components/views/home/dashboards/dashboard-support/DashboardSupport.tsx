/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../../constants/Routes";
import {
  AlarmClock,
  CalendarCheck,
  CalendarClock,
  DoorOpen,
  ListTodo,
  LucideListTodo,
  Ticket,
  TicketCheck,
  TicketMinusIcon,
  TicketSlashIcon,
} from "lucide-react";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../../constants/AppConstants";
import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";
import { REFCURSOR_KEY } from "../../../../../constants/RefcursorConstants";
import { DashboardComponentJsxKey } from "../../../../../enums/dashboard/DashboardComponentJsxKey.enum";
import MetricCard from "../dashboards_components/MetricCard";
import QuickActions from "../dashboards_components/QuickActions";
import axiosClient from "../../../../../axios-client/AxiosClient";
import { handleApiError } from "../../../../../config/error/handleApiError";
import SupportTasksDashboard from "./SupportTasksDashboard";
import SupportTicketTaskDashboardProps from "../../../../../@types/support-ticket-management/SupportTicketTaskDashboardProps";
import RecentTicketDashboardProps from "../../../../../@types/support-ticket-management/RecentTicketDashboardProps";
import RecentTicketsDashboard from "./RecentTicketsDashboard";

/* ---------------- TYPES ---------------- */

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

interface DashboardSupportProp {
  companyUserId: number | null;
}

/* ---------------- COMPONENT ---------------- */

const DashboardSupport: React.FC<DashboardSupportProp> = ({
  companyUserId,
}) => {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();

  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [upcomingTask, setUpcomingTasks] = useState<
    SupportTicketTaskDashboardProps[]
  >([]);
  const [pendingTasks, setPendingTasks] = useState<
    SupportTicketTaskDashboardProps[]
  >([]);

  const [recentTickets, setRecentTickets] = useState<
    RecentTicketDashboardProps[]
  >([]);

  const [dashboardLayout, setDashboardLayout] = useState<string[]>([]);
  const [dashboardVisiblity, setDasboardVisibility] = useState<
    { key: string; value: boolean; chartType: string }[]
  >([]);
  const [dashboardData, setDashboardData] = useState<DashboardDataType>({});
  const [accessModuleCompanyUser, setAccessModuleCompanyUser] = useState<
    AccessModuleType[]
  >([]);

  /* ---------------- SAFE HELPERS (FIX) ---------------- */

  const getVisibility = (key: string): boolean =>
    dashboardVisiblity.find((v) => v.key.trim() === key.trim())?.value ?? false;

  // const getChartType = (key: string): string | undefined =>
  //   dashboardVisiblity.find((v) => v.key === key)?.chartType;

  /* ---------------- API CALLS ---------------- */

  const getCrmModuleAccessOfCompanyUser = async () => {
    try {
      const response = await axiosClient.post(
        POST_API.GET_CRM_MODULE_ACCESS,
        {
          company_id: loginStatus.companyId,
          company_user_id: companyUserId,
          requestedby: loginStatus.id,
        },
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        setAccessModuleCompanyUser(response.data);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const getDashboardData = async () => {
    setRecentTickets([]);
    setUpcomingTasks([]);
    setPendingTasks([]);
    setIsTasksLoading(true);

    try {
      const response = await axiosClient.post(
        POST_API.GET_COMPANY_USER_DASHBOARD_SUPPORT,
        {
          company_id: loginStatus.companyId,
          assignto: companyUserId,
          requestedby_id: loginStatus.id,
        },
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const data = response.data;

        setDashboardLayout(
          data.my_fixed_cursor_get_dashboard_widget?.map(
            (w: any) => w.dashboard_widget_name
          ) ?? []
        );

        setDasboardVisibility(
          data.my_fixed_cursor_get_dashboard_widget?.map((w: any) => ({
            key: w.dashboard_widget_name,
            value: true,
            chartType: w.chart_type_name,
          })) ?? []
        );

        const mapTask = (item: any) => ({
          id: item.id,
          support_ticket_id: item.support_ticket_id,
          ticket_number: item.ticket_number,
          support_ticket_task_stage_id: item.support_ticket_task_stage_id,
          support_ticket_task_stage_name: item.support_ticket_task_stage_name,
          description: item.description,
          result_outcome: item.result_outcome,
          due_date_time: item.due_date_time,
          overdue_status: item.overdue_status,
        });

        setUpcomingTasks(
          data.my_fixed_cursor_upcoming_task?.map(mapTask) ?? []
        );
        setPendingTasks(data.my_fixed_cursor_pending_task?.map(mapTask) ?? []);

        setRecentTickets(data.my_fixed_cursor_recent_tickets ?? []);

        setDashboardData(data);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsTasksLoading(false);
    }
  };

  const TOTAL_TICKET_ROW_COMPONENT_KEYS = [
    "Total Tickets",
    "Open Tickets",
    "In Progress Tickets",
    "On Hold Tickets",
    "Resolved Tickets",
    "Closed Tickets",
  ];

  const TOTAL_PENDING_TASK_ROW_COMPONENT_KEYS = [
    "Total Pending Task",
    "Total Pending Task - Today",
    "Total Upcoming Task",
    "Total Upcoming Task - Today",
  ];

  const isAnyKeyVisible = (TOTAL_TICKET_KEYS: string[]): boolean => {
    return dashboardVisiblity.some(
      (v) => TOTAL_TICKET_KEYS.includes(v.key) && v.value === true
    );
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    if (companyUserId !== null) {
      getCrmModuleAccessOfCompanyUser();
    }
    getDashboardData();
  }, [companyUserId]);

  useEffect(() => {
    const handleBack = (e: PopStateEvent) => {
      e.preventDefault();
      navigate(ROUTES_URL.HOME, { replace: true });
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  /* ---------------- COMPONENT MAP ---------------- */

  const componentMapDefault: Record<string, JSX.Element> = {
    [DashboardComponentJsxKey.Total_Tickets]: isAnyKeyVisible(
      TOTAL_TICKET_ROW_COMPONENT_KEYS
    ) ? (
      <div
        key="Total Tickets"
        className="flex col-span-2 w-full gap-4 justify-around"
      >
        <div className="flex grid-cols-6 sm:gap-1 md:gap-2 lg:gap-11 w-full">
          <MetricCard
            title="Total Tickets"
            id="totalTickets"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TOTAL_SUPPORT_TICKETS
              ]?.[0]?.total_support_tickets ?? 0
            ).toString()}
            icon={LucideListTodo}
            color="bg-gradient-to-r from-cyan-500 to-cyan-600"
            gradient="bg-gradient-to-r from-cyan-500 to-cyan-600"
            visibility={getVisibility("Total Tickets")}
          />
          <MetricCard
            title="Open Tickets"
            id="openTicketsMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_OPEN_SUPPORT_TICKETS
              ]?.[0]?.open_support_tickets ?? 0
            ).toString()}
            icon={DoorOpen}
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
            visibility={getVisibility("Open Tickets")}
          />
          <MetricCard
            title="In Progress Tickets"
            id="inProgressTicketsMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_INPROGRESS_SUPPORT_TICKETS
              ]?.[0]?.inprogress_support_tickets ?? 0
            ).toString()}
            icon={TicketSlashIcon}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            visibility={getVisibility("In Progress Tickets")}
          />
          <MetricCard
            title="On Hold Tickets"
            id="onHoldTicketsMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_ONHOLD_SUPPORT_TICKETS
              ]?.[0]?.onhold_support_tickets ?? 0
            ).toString()}
            icon={TicketMinusIcon}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            gradient="bg-gradient-to-r from-orange-500 to-orange-600"
            visibility={getVisibility("On Hold Tickets")}
          />
          <MetricCard
            title="Resolved Tickets"
            id="resolvedTicketsMetricCard"
            value={
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_RESOLVED_SUPPORT_TICKETS
              ]?.[0]?.resolved_support_tickets ?? 0
            }
            icon={TicketCheck}
            color="bg-gradient-to-r from-teal-500 to-teal-600"
            gradient="bg-gradient-to-r from-teal-500 to-teal-600"
            visibility={getVisibility("Resolved Tickets")}
          />

          <MetricCard
            title="Closed Tickets"
            id="closedTicketsMetricCard"
            value={`${(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_CLOSED_SUPPORT_TICKETS
              ]?.[0]?.closed_support_tickets ?? 0
            ).toString()}`}
            icon={Ticket}
            color="bg-gradient-to-r from-green-500 to-green-600"
            gradient="bg-gradient-to-r from-green-500 to-green-600"
            visibility={getVisibility("Closed Tickets")}
          />
        </div>
      </div>
    ) : (
      <div />
    ),
    [DashboardComponentJsxKey.QUICK_ACTIONS]: (
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

    [DashboardComponentJsxKey.Recent_Tickets]: (
      <div
        key="Recent Tickets"
        className="flex col-span-2 w-full gap-4 justify-around"
      >
        <div className="flex sm:gap-1 md:gap-2 lg:gap-11 w-full">
          <RecentTicketsDashboard
            isLoading={isTasksLoading}
            recentTickets={recentTickets}
          />
        </div>
      </div>
    ),

    [DashboardComponentJsxKey.TOTAL_PENDING_TASKS]: (
      <div
        key="Total Pending Task"
        className="flex col-span-2 w-full gap-4 justify-around"
      >
        <div className="flex grid-cols-4 sm:gap-1 md:gap-2 lg:gap-11 w-full">
          <MetricCard
            title="Total Pending Task"
            id="totalPendingTaskMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TOTAL_PENDING_TASK
              ]?.[0]?.total_pending_task ?? 0
            ).toString()}
            icon={CalendarClock}
            color="bg-gradient-to-r from-red-500 to-red-600"
            gradient="bg-gradient-to-r from-red-500 to-red-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? getVisibility("Total Pending Task")
                : false
            }
          />
          <MetricCard
            title="Total Pending Task - Today"
            id="totalPendingTaskTodayMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TOTAL_PENDING_TASK_TODAY
              ]?.[0]?.total_pending_task_today ?? 0
            ).toString()}
            icon={AlarmClock}
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? getVisibility("Total Pending Task - Today")
                : false
            }
          />
          <MetricCard
            title="Total Upcoming Task"
            id="totalUpcomingTaskMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TOTAL_UPCOMING_TASK
              ]?.[0]?.total_upcoming_task ?? 0
            ).toString()}
            icon={ListTodo}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? getVisibility("Total Upcoming Task")
                : false
            }
          />
          <MetricCard
            title="Total Upcoming Task - Today"
            id="totalUpcomingTaskTodayMetricCard"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TOTAL_UPCOMING_TASK_TODAY
              ]?.[0]?.total_upcoming_task_today ?? 0
            ).toString()}
            icon={CalendarCheck}
            color="bg-gradient-to-r from-teal-500 to-teal-600"
            gradient="bg-gradient-to-r from-teal-500 to-teal-600"
            visibility={
              dashboardVisiblity.length !== 0
                ? getVisibility("Total Upcoming Task - Today")
                : false
            }
          />
        </div>
      </div>
    ),
    [DashboardComponentJsxKey.PENDING_TASKS]: (
      <div
        id="pendingTasks"
        key="Pending tasks"
        className="h-full col-span-1 border-gray-100 bg-white rounded-2xl overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-white
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <SupportTasksDashboard
          companyUserId={companyUserId}
          isLoading={isTasksLoading}
          supportTasks={pendingTasks}
          taskType="pending"
        />
      </div>
    ),
    [DashboardComponentJsxKey.UPCOMING_TASKS]: (
      <div
        id="upcomingTasks"
        key="Upcoming tasks"
        className="h-full col-span-1 border-gray-100 bg-white rounded-2xl overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-white
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
      >
        <SupportTasksDashboard
          companyUserId={companyUserId}
          isLoading={isTasksLoading}
          supportTasks={upcomingTask}
          taskType="upcoming"
        />
      </div>
    ),
  };

  /* ---------------- RENDER ---------------- */

  const renderDashboardSections = () => {
    let totalTicketCountRowComponentRendered = false;
    let totalTaskCountRowComponentREndered = false;
    return dashboardLayout.map((key) => {
      if (!getVisibility(key)) return null;
      if (TOTAL_TICKET_ROW_COMPONENT_KEYS.includes(key)) {
        if (!totalTicketCountRowComponentRendered) {
          totalTicketCountRowComponentRendered = true;
          return componentMapDefault[DashboardComponentJsxKey.Total_Tickets];
        } else return null;
      }
      if (TOTAL_PENDING_TASK_ROW_COMPONENT_KEYS.includes(key)) {
        if (!totalTaskCountRowComponentREndered) {
          totalTaskCountRowComponentREndered = true;
          return componentMapDefault[
            DashboardComponentJsxKey.TOTAL_PENDING_TASKS
          ];
        } else return null;
      }
      return componentMapDefault[key] || null;
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {isTasksLoading ? (
        <div className="flex justify-center items-center mt-48">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="max-w-full p-6 mx-auto grid gap-3 grid-cols-2 space-y-5">
          {dashboardVisiblity.length > 0 && renderDashboardSections()}
        </div>
      )}
    </div>
  );
};

export default DashboardSupport;
