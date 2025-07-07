/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import LeadManagementList from "../../lists/LeadManagementList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import PostDataToGetLeadData from "../../../@types/lead-management/PostDataToGetLeadData";
import LeadDataProps from "../../../@types/lead-management/LeadProps";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import { useNavigate } from "react-router-dom";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import ROUTES_URL from "../../../constants/Routes";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import PostDataTypeForLeadSourceAndStatusAndStates from "../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";

function LeadManagement() {
  const { userHasAccessToViewLead } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [leadData, setLeadData] = useState<LeadDataProps[]>([]);
  const [leadStatus, setLeadStatus] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >(null);
  const [leadSource, setLeadSource] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >(null);

  const { loginStatus } = useLoggedInUserContext();
  const navigate = useNavigate();

  const [leadsUpdateCount, setLeadsUpdateCount] = useState<number>(0);
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);

  const [selectedLeadStatus, setSelectedLeadStatus] = useState<number | null>(
    null
  );
  const [selectedLeadSource, setSelectedLeadSource] = useState<number | null>(
    null
  );

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const {
    currentPage,
    pageSize,
    dateRangeId,
    concatDate,
    searchParameter,
    totalPages,
    setTotalPages,
    handleDatePageIdChange,
    handleEndDateChange,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers();

  const handleLeadSelectedStatus = (selectedLeadStatus: number | undefined) => {
    if (selectedLeadStatus) {
      setSelectedLeadStatus(selectedLeadStatus);
    } else {
      setSelectedLeadStatus(null);
    }
  };

  const handleLeadSelectedSource = (selectedLeadSource: number | undefined) => {
    if (selectedLeadSource) {
      setSelectedLeadSource(selectedLeadSource);
    } else {
      setSelectedLeadSource(null);
    }
  };

  const getLeadsData = async () => {
    const offset = (currentPage - 1) * pageSize;
    
    const effectiveDateRangeId = dateRangeId;

    //NOTE : need to work on this
    const postDataToGetLeads: PostDataToGetLeadData = {
      company_id: loginStatus.companyId,
      id: null,
      ownerid: selectedCompanyUser.id,
      lead_source_id: selectedLeadSource,
      lead_status_id: selectedLeadStatus,
      search_company_specific_date_range_id: effectiveDateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter,
      search_parameter_date: concatDate,
      requestedby: loginStatus.id,
    };
    try {
      const response = await axios.post(POST_API.GET_LEAD, postDataToGetLeads, {
        withCredentials: true,
      });
      if (response.status === STATUS_CODE.OK) {
        //lead status call was here
        const responseData = response.data;
        if (response.data.length > 0) {
          setTotalPages(Math.ceil(response.data[0].count / pageSize));
        }

        const formattedData: LeadDataProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            mobileNumber: item.mobilenumber,
            companyId: item.company_id,
            companyUserId: item.ownerid,
            count: item.count,
            createdBy: item.createdby,
            createdOn: item.createdon,
            leadOwner: item["Lead Owner"],
            leadSource: item["Lead Source"],
            leadSourceId: item.lead_source_id,
            leadStatus: item["Lead Status"],
            leadStatusId: item.lead_status_id,
          })
        );
        setLeadData(formattedData);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadsData,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  const fetchLeadStatus = async () => {
    const postDataForLeadStatus: PostDataTypeForLeadSourceAndStatusAndStates = {
      id: null,
      name: null,
      description: null,
      isactive: true,
    };

    try {
      const response = await axios.post(
        POST_API.GET_LEAD_STATUS,
        postDataForLeadStatus,
        {
          withCredentials: true,
        }
      );
      if (response.status === STATUS_CODE.OK) {
        setLeadStatus(response.data);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchLeadStatus,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          fetchLeadStatus();
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  const fetchLeadSource = async () => {
    const postDataForLeadSource: PostDataTypeForLeadSourceAndStatusAndStates = {
      id: null,
      name: null,
      description: null,
      isactive: true,
    };
    axios
      .post(POST_API.GET_LEAD_SOURCE, postDataForLeadSource, {
        withCredentials: true,
      })
      .then((response) => {
        setLeadSource(response.data);
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: fetchLeadSource,
          });
          if (refreshTokenStatus) {
            fetchLeadSource();
            setIsDialogueOpen(false);
          } else {
            setIsDialogueOpen(true);
          }
        } else if (error.status === STATUS_CODE.FORBIDDEN) {
          setIsDialogueOpen(true);
        }
      });
  };

  const [persistedSelectedUserId, setPersistedSelectedUserId] = useState<
    number | null
  >(null);
  const [selectedCompanyUser, setSelectedCompanyUser] = useState<CompanyUser>({
    company_id: 0,
    id: 0,
    fullname: "",
    email: "",
    mobilenumber: "",
    createdby: "",
    isactive: false,
    requestedby: "",
    generate_password: "",
  });
  const handleSelectedCompanyUserCheckBoxChange = (
    params: CompanyUser | null
  ) => {
    if (params) {
      setPersistedSelectedUserId(params.id);
      setSelectedCompanyUser({
        company_id: params.company_id,
        id: params.id,
        fullname: params.fullname,
        email: params.email,
        mobilenumber: params.mobilenumber,
        createdby: "",
        isactive: params.isactive,
        requestedby: "",
        generate_password: "",
      });
    } else {
      setPersistedSelectedUserId(null);
      // Reset selectedCompanyUser to its initial state when null is received
      setSelectedCompanyUser({
        company_id: 0,
        id: 0,
        fullname: "",
        email: "",
        mobilenumber: "",
        createdby: "",
        isactive: false,
        requestedby: "",
        generate_password: "",
      });
    }
  };

  const handleAddLead = () => {
    setLeadsUpdateCount(leadsUpdateCount + 1);
  };
  //NOTE : NEED TO ADD PAGINATION FUNCTIONALITY HERE
  useEffect(() => {
    getLeadsData();
  }, [
    leadsUpdateCount,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    selectedCompanyUser,
    selectedLeadStatus,
    selectedLeadSource,
  ]);
  useEffect(() => {
    fetchLeadStatus();
    fetchLeadSource();
  }, []);
  useEffect(() => {
    if (!userHasAccessToViewLead) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewLead]);

  return (
    <div className="w-full">
      {userHasAccessToViewLead ? (
        <LeadManagementList
          handleAddLead={handleAddLead}
          handleSearchOption={{
            handleSearchParameterChange,
            handleDateRangeIdChange: handleDatePageIdChange,
          }}
          leadData={leadData}
          onEndDateChange={handleEndDateChange}
          onStartDateChange={handleStartDateChange}
          paginationData={{
            selectedPageSize: handlePageSizeChange,
            currentPage,
            handlePageChange,
            totalPages,
            pageSize,
          }}
          handleSelectedCompanyUserCheckBoxChange={
            handleSelectedCompanyUserCheckBoxChange
          }
          persistedSelectedUserId={persistedSelectedUserId}
          selectedLeadOwner={selectedCompanyUser}
          leadStatus={leadStatus!}
          handleLeadSelectedStatus={handleLeadSelectedStatus}
          leadSource={leadSource!}
          handleLeadSelectedSource={handleLeadSelectedSource}
        />
      ) : (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div>
      )}
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      />
    </div>
  );
}

export default LeadManagement;
