/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ChevronDown, ChevronRight, FileBarChart, Save, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import CompanyUsersReportModalProps from "../../../@types/company-users/CompanyUserReportModalProps";
import ApiError from "../../../@types/error/ApiError";
import CompanyUserReport from "../../../@types/report/CompanyUserReport";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useReportType } from "../../../config/hooks/useReportType";
import RefreshToken from "../../../config/validations/RefreshToken";
import { STATUS_CODE } from "../../../constants/AppConstants";
import MESSAGE from "../../../constants/Messages";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import Button from "../../ui/Button";
import FormHeader from "../../ui/FormHeader";

function CompanyUserReportModal({
  isOpen,
  onClose,
  companyUser,
}: CompanyUsersReportModalProps) {
  const {  userHasAccessToUpdateCompanyUserReportType } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const { reportTypeData, loading:isLoadingForReportTypeData } = useReportType();

  const [loading, setLoading] = useState(false);

  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

  const [companyUserAssignedReports, setCompanyUserAssignedReports] = useState<
    CompanyUserReport[]
  >([]);

  const [
    companyUserAssignedReportsChange,
    setCompanyUserAssignedReportsChange,
  ] = useState<CompanyUserReport[]>([]);

  const [spinnerAnimation, setSpinnerAnimation] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  /**
   * GROUP REPORTS
   */
  const groupedReports = useMemo(() => {
    return reportTypeData
      .map((reportType) => ({
        ...reportType,
        reports: companyUserAssignedReports.filter(
          (report) => report.report_type_id === reportType.id,
        ),
      }))
      .filter((group) => group.reports.length > 0);
  }, [reportTypeData, companyUserAssignedReports]);

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const isAllGroupSelected = (groupId: number) => {
    const reports = companyUserAssignedReports.filter(
      (r) => r.report_type_id === groupId,
    );

    return reports.every((r) => r.isactive);
  };

  const handleGroupSelectAll = (groupId: number) => {
    const isSelected = isAllGroupSelected(groupId);

    const updatedReports = companyUserAssignedReports.map((report) =>
      report.report_type_id === groupId
        ? {
            ...report,
            isactive: !isSelected,
          }
        : report,
    );

    setCompanyUserAssignedReports(updatedReports);
    setCompanyUserAssignedReportsChange(updatedReports);
  };

  const fetchCompanyUserReports = async () => {
    if (isOpen) {
      try {
        setLoading(true);

        const getCompanyUserDashboardPostData = {
          company_id: loginStatus.companyId,
          company_user_id: companyUser.id,
          isactive: null,
          requestedby_id: loginStatus.id,
        };

        await axiosClient
          .post(
            POST_API.GET_COMPANY_USER_REPORT,
            getCompanyUserDashboardPostData,
            { withCredentials: true },
          )
          .then((response) => {
            if (response.data != null) {
              setCompanyUserAssignedReports(response.data);
              setCompanyUserAssignedReportsChange(response.data);
            }
          })
          .catch(async (error: ApiError | any) => {
            handleApiError(error);
          });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSpinnerAnimation({
        status: "loading",
        message: MESSAGE.INPROCESS.SAVING,
      });

      const postDataForUpdateCompanyUserDashboard =
        companyUserAssignedReportsChange.map((d) => ({
          company_id: loginStatus.companyId,
          id: d.id,
          company_user_id: companyUser.id,
          isactive: d.isactive,
          updatedby_id: loginStatus.id,
        }));

      await axios
        .post(
          POST_API.UPDATE_COMPANY_USER_REPORT,
          postDataForUpdateCompanyUserDashboard,
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message);

            setSpinnerAnimation({
              status: "success",
              message: MESSAGE.SUCCESS.SAVED,
            });

            setTimeout(() => {
              setSpinnerAnimation({
                status: "idle",
                message: "",
              });
            }, 1000);

            setTimeout(() => {
              onClose();
            }, 1500);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: handleSave,
            });

            if (refreshTokenResponse) {
              handleSave();
            }
          }
        });
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCompanyUserReports();
    }

    if (!isOpen) {
      setCompanyUserAssignedReports([]);
      setExpandedGroups([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 p-4 overflow-hidden bg-black bg-opacity-5">
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative p-4 w-full max-w-[50%] min-h-[50vh] h-[55vh] max-h-[60vh] bg-white rounded-lg shadow-xl animate-fadeIn flex flex-col">
          {/* HEADER */}
          <FormHeader
            icon={FileBarChart}
            onClose={onClose}
            postText=" Assigned Reports"
            description="Manage report visibility and assignments for selected user."
            userName={companyUser.fullname}
          />

          {/* CONTENT */}
          <div className="flex-1 overflow-hidden">
            {loading || isLoadingForReportTypeData ? (
              <div className="flex justify-center items-center h-full">
                {/* SKELETON */}
                <div className="flex flex-col h-full animate-pulse">
                  {/* TABLE HEADER */}
                  <div className="bg-white border-b">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col className="w-[10%]" />
                        <col className="w-[60%]" />
                        <col className="w-[20%]" />
                      </colgroup>

                      <thead>
                        <tr className="text-left">
                          <th className="p-2 table-header-custom">Sr. No.</th>
                          <th className="p-2 table-header-custom">
                            Report Name
                          </th>
                          <th className="p-2 table-header-custom text-center">
                            Assigned
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* SKELETON BODY */}
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col className="w-[10%]" />
                        <col className="w-[60%]" />
                        <col className="w-[20%]" />
                      </colgroup>

                      <tbody>
                        {Array.from({ length: 4 }).map((_, groupIndex) => (
                          <React.Fragment key={groupIndex}>
                            {/* GROUP HEADER SKELETON */}
                            <tr className="border-t bg-slate-100">
                              <td className="p-3">
                                <div className="h-4 w-8 bg-slate-300 rounded"></div>
                              </td>

                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-4 w-4 bg-slate-300 rounded"></div>

                                  <div className="h-4 w-40 bg-slate-300 rounded"></div>
                                </div>
                              </td>

                              <td className="p-3">
                                <div className="flex justify-center">
                                  <div className="h-4 w-4 bg-slate-300 rounded-sm"></div>
                                </div>
                              </td>
                            </tr>

                            {/* CHILD ROWS SKELETON */}
                            {Array.from({ length: 3 }).map((_, childIndex) => (
                              <tr
                                key={childIndex}
                                className="border-t bg-white"
                              >
                                <td className="p-3 pl-5">
                                  <div className="h-3 w-10 bg-gray-200 rounded"></div>
                                </td>

                                <td className="p-3 pl-8">
                                  <div className="h-3 w-56 bg-gray-200 rounded"></div>
                                </td>

                                <td className="p-3">
                                  <div className="flex justify-center">
                                    <div className="h-4 w-4 bg-gray-200 rounded-sm"></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* FIXED HEADER */}
                <div className="bg-white border-b">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-[10%]" />
                      <col className="w-[60%]" />
                      <col className="w-[20%]" />
                    </colgroup>

                    <thead>
                      <tr className="text-left">
                        <th className="p-2 table-header-custom">Sr. No.</th>

                        <th className="p-2 table-header-custom">Report Name</th>

                        <th className="p-2 table-header-custom text-center">
                          Assigned
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-[10%]" />
                      <col className="w-[60%]" />
                      <col className="w-[20%]" />
                    </colgroup>

                    <tbody>
                      {groupedReports.map((group, groupIndex) => {
                        const isExpanded = expandedGroups.includes(group.id);

                        return (
                          <React.Fragment key={group.id}>
                            {/* GROUP HEADER */}
                            <tr
                              className={`border-t bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer`}
                            >
                              <td className="p-2 table-data-custom font-semibold">
                                {groupIndex + 1}
                              </td>

                              <td
                                className="table-data-custom font-semibold flex items-center gap-2"
                                onClick={() => toggleGroup(group.id)}
                              >
                                <span className="text-gray-600">
                                  {isExpanded ? (
                                    <ChevronDown size={18} />
                                  ) : (
                                    <ChevronRight size={18} />
                                  )}
                                </span>

                                {group.name}
                              </td>

                              <td className="table-data-custom text-center">
                                <input
                                  type="checkbox"
                                  checked={isAllGroupSelected(group.id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleGroupSelectAll(group.id);
                                  }}
                                  className="w-4 h-4 cursor-pointer"
                                />
                              </td>
                            </tr>

                            {/* CHILD REPORTS */}
                            {isExpanded &&
                              group.reports.map((report, reportIndex) => (
                                <tr
                                  key={report.id}
                                  className="border-t bg-white hover:bg-gray-100 transition-all"
                                >
                                  <td className="p-2 pl-5 table-data-custom text-gray-500">
                                    {groupIndex + 1}.{reportIndex + 1}
                                  </td>

                                  <td className="table-data-custom pl-8 text-gray-700">
                                    └ {report.report_name}
                                  </td>

                                  <td className="table-data-custom text-center">
                                    <input
                                      type="checkbox"
                                      checked={report.isactive}
                                      onChange={(e) => {
                                        const updatedReports =
                                          companyUserAssignedReports.map((d) =>
                                            d.id === report.id
                                              ? {
                                                  ...d,
                                                  isactive: e.target.checked,
                                                }
                                              : d,
                                          );

                                        setCompanyUserAssignedReports(
                                          updatedReports,
                                        );

                                        setCompanyUserAssignedReportsChange(
                                          updatedReports,
                                        );
                                      }}
                                      className="w-4 h-4 cursor-pointer"
                                    />
                                  </td>
                                </tr>
                              ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-1 border-t bg-white">
            <div className="flex gap-2 justify-self-end min-w-36 max-w-56">
              <Button type="button" onClick={onClose}>
                <div className="flex gap-0.5 items-center">
                  <X size={16} />
                  Cancel
                </div>
              </Button>

              <Button
                type="submit"
                disabled={!userHasAccessToUpdateCompanyUserReportType}
                onClick={(e) => {
                  e.preventDefault();

                  if (userHasAccessToUpdateCompanyUserReportType) {
                    handleSave();
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.DASHBOARD
                        .DENIED_UPDATE_ACCESS_DASHBOARD,
                    );
                  }
                }}
                spinner={spinnerAnimation}
              >
                <div className="flex gap-1 items-center">
                  <Save size={16} />
                  Save
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CompanyUserReportModal;

// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "axios";
// import { FileBarChart, Save, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import ApiError from "../../../@types/error/ApiError";
// import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
// import RefreshToken from "../../../config/validations/RefreshToken";
// import { STATUS_CODE } from "../../../constants/AppConstants";
// import MESSAGE from "../../../constants/Messages";
// import POST_API from "../../../constants/PostApi";
// import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
// import Button from "../../ui/Button";

// import toast from "react-hot-toast";
// import CompanyUsersReportModalProps from "../../../@types/company-users/CompanyUserReportModalProps";
// import CompanyUserReport from "../../../@types/report/CompanyUserReport";
// import axiosClient from "../../../axios-client/AxiosClient";
// import { handleApiError } from "../../../config/error/handleApiError";
// import { useReportType } from "../../../config/hooks/useReportType";
// import FormHeader from "../../ui/FormHeader";

// function CompanyUserReportModal({
//   isOpen,
//   onClose,
//   companyUser,
// }: CompanyUsersReportModalProps) {
//   const { userHasAccessToUpdateDashboard } = useUserAccessModules();
//   const { loginStatus } = useLoggedInUserContext();

//   const { reportTypeData } = useReportType();

//   const [companyUserAssignedReports, setCompanyUserAssignedReports] = useState<
//     CompanyUserReport[]
//   >([]);

//   const [
//     companyUserAssignedReportsChange,
//     setCompanyUserAssignedReportsChange,
//   ] = useState<CompanyUserReport[]>([]);

//   const [spinnerAnimation, setSpinnerAnimation] = useState<{
//     status: "idle" | "loading" | "success" | "error";
//     message: string;
//   }>({
//     status: "idle",
//     message: "",
//   });

//   // const { userHasAccessToUpdateAccess } = useUserAccessModules();

//   const handleSave = async () => {
//     try {
//       setSpinnerAnimation({
//         status: "loading",
//         message: MESSAGE.INPROCESS.SAVING,
//       });

//       const postDataForUpdateCompanyUserDashboard =
//         companyUserAssignedReportsChange.map((d) => ({
//           company_id: loginStatus.companyId,
//           id: d.id,
//           company_user_id: companyUser.id,
//           isactive: d.isactive,
//           updatedby_id: loginStatus.id,
//         }));

//       await axios
//         .post(
//           POST_API.UPDATE_COMPANY_USER_REPORT,
//           postDataForUpdateCompanyUserDashboard,
//           {
//             withCredentials: true,
//           },
//         )
//         .then((response) => {
//           if (response.data.status) {
//             // toast.success(response.data.message);

//             toast.success(response.data.message);
//             setSpinnerAnimation({
//               status: "success",
//               message: MESSAGE.SUCCESS.SAVED,
//             });

//             setTimeout(() => {
//               setSpinnerAnimation({
//                 status: "idle",
//                 message: "",
//               });
//             }, 1000);
//           } else {
//             toast.error(response.data.message);
//           }
//         })
//         .catch(async (error: ApiError | any) => {
//           if (error.status === STATUS_CODE.UNATHORISED) {
//             const refreshTokenResponse = await RefreshToken({
//               callFunction: handleSave,
//             });
//             if (refreshTokenResponse) {
//               handleSave();
//             }
//           }
//         });
//     } catch (e) {
//       alert(e);
//     } finally {
//       setTimeout(() => {
//         onClose();
//       }, 500);
//     }
//   };

//   const fetchCompanyUserReports = async () => {
//     if (isOpen) {
//       try {
//         const getCompanyUserDashboardPostData = {
//           company_id: loginStatus.companyId,
//           company_user_id: companyUser.id,
//           isactive: null,
//           requestedby_id: loginStatus.id,
//         };

//         await axiosClient
//           .post(
//             POST_API.GET_COMPANY_USER_REPORT,
//             getCompanyUserDashboardPostData,
//             { withCredentials: true },
//           )
//           .then((response) => {
//             if (response.data != null) {
//               setCompanyUserAssignedReports(response.data);
//             }
//           })
//           .catch(async (error: ApiError | any) => {
//             handleApiError(error);
//           });
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       //
//     }
//   };

//   // fetchCompanyUserDashboard();
//   // Open/Close dialog based on `isOpen` prop
//   useEffect(() => {
//     if (isOpen) {
//       fetchCompanyUserReports();
//     }
//     if (!isOpen) {
//       setCompanyUserAssignedReports([]);
//     }
//   }, [isOpen]);
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-5">
//       <div className="flex min-h-screen items-center justify-center">
//         <div
//           id="company-user-dashboard-modal"
//           className="relative p-4 w-full max-w-[60%] bg-white rounded-lg shadow-xl animate-fadeIn flex flex-col gap-1"
//         >
//           <FormHeader
//             icon={FileBarChart}
//             onClose={onClose}
//             postText=" assigned reports"
//             description="Modify assigned reports of user."
//             userName={companyUser.fullname}
//           />

//           {companyUserAssignedReports.length === 0 && (
//             <ul className="space-y-2">
//               {Array.from({ length: 5 }).map((_, index) => (
//                 <li
//                   key={index}
//                   className="p-2 border border-gray-200 rounded-lg bg-white animate-pulse"
//                 >
//                   <div className="flex justify-between items-center">
//                     <div className="flex flex-col gap-2">
//                       <div className="h-4 w-44 bg-gray-200 rounded"></div>
//                     </div>

//                     <div className="h-5 w-5 bg-gray-200 rounded-sm"></div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//           {companyUserAssignedReports.length !== 0 && (
//             <ul className="space-y-2">
//               {companyUserAssignedReports.map((dashboard) => (
//                 <li
//                   key={dashboard.id}
//                   className={`p-1 border rounded bg-gray-50`}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span className="table-data-custom">
//                       {dashboard.report_name}
//                     </span>

//                     <input
//                       type="checkbox"
//                       checked={dashboard.isactive}
//                       onChange={(e) => {
//                         const updateDashboard = companyUserAssignedReports.map(
//                           (d) =>
//                             d.id == dashboard.id
//                               ? { ...d, isactive: e.target.checked }
//                               : d,
//                         );

//                         setCompanyUserAssignedReports(updateDashboard);
//                         setCompanyUserAssignedReportsChange(updateDashboard);
//                       }}
//                       className="w-4 h-4 cursor-pointer"
//                     ></input>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}

//           <div className="pt-3 border-t bg-white">
//             <div className="flex gap-2 justify-self-end min-w-36 max-w-56">
//               <Button type="button" onClick={onClose}>
//                 <div className="flex gap-0.5 items-center">
//                   <X size={16} />
//                   Cancel
//                 </div>
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={!userHasAccessToUpdateDashboard}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   if (userHasAccessToUpdateDashboard) {
//                     handleSave();
//                   } else {
//                     toast.error(
//                       MESSAGE.MODULE_ACCESS.DASHBOARD
//                         .DENIED_UPDATE_ACCESS_DASHBOARD,
//                     );
//                   }
//                 }}
//                 spinner={spinnerAnimation}
//               >
//                 <div className="flex gap-1 items-center">
//                   <Save size={16} />
//                   Save
//                 </div>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CompanyUserReportModal;
