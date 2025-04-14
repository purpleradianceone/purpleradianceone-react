/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClipboardPlus, Handshake, Search, X } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE, STATUS_CODE } from "../../constants/AppConstants";
import Button from "../ui/Button";
import LeadManagementAgGrid from "../ag-grid/LeadManagementsAgGrid";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import CreateLeadModal from "../modals/leads/CreateLeadModal";
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import PostDataToGetLeadData from "../../@types/lead-management/PostDataToGetLeadData";
import LeadDataProps from "../../@types/lead-management/LeadProps";
import RefreshToken from "../../config/validations/RefreshToken";
import { DialogueBox } from "../dialogue-box/Dialogue";
import ROUTES_URL from "../../constants/Routes";
import { useNavigate } from "react-router-dom";
import GetCompanyUsersForLead from "../modals/leads/company-users-selection-modal/GetCompanyUsersForLead";
import CompanyUser from "../../@types/company-users/CompanyUser";
import SearchInput from "../ui/SearchInput";

function LeadManagementList() {

  const navigate = useNavigate();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { userHasAccessToViewLead, userHasAccessToAddLead } =
    useUserAccessModules();
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] =useState<boolean>(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);

  const [openPopUpOfCompanyUserModal, setOpenPopUpOfCompanyUserModal] =
    useState(false);

  const handleCompanyUserPopUp = () => {
    setOpenPopUpOfCompanyUserModal(true);
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
const handleSelectedCompanyUserChange = (params: CompanyUser | null) => {
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

}


  const [leadData , setLeadData] = useState<LeadDataProps[]>([{
    id : 0,
    name : null,
    email : null,
    mobileNumber : "",
    companyId : 0,
    companyUserId : 0,
    count : 0,
    createdBy : "",
    createdOn : "",
    leadOwner : "",
    leadSource : "",
    leadSourceId : 0,
    leadStatus : "",
    leadStatusId : 0,
  }]);
  const {loginStatus}= useLoggedInUserContext();

  const  getLeadsData = async () =>{
    //NOTE : need to work on this 
    const postDataToGetLeads : PostDataToGetLeadData= {
      company_id: loginStatus.companyId,
      company_user_id: null,
      lead_source_id : null,
      lead_status_id : null,
      search_company_specific_date_range_id: null,
      limit: null,
      offset : null,
      search_parameter: null,
      search_parameter_date: null,
      requestedby: loginStatus.id,
    }
    try{
      const response = await axios.post(POST_API.GET_LEAD, postDataToGetLeads, {withCredentials : true})
      if(response.status=== STATUS_CODE.OK){
       const responseData = response.data;

       const formattedData  : LeadDataProps[] = responseData.map((item : any ) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        mobileNumber: item.mobilenumber,
        companyId: item.companyid,
        companyUserId: item.company_user_id,
        count: item.count,
        createdBy: item.createdby,
        createdOn: item.createdon,
        leadOwner: item["Lead Owner"],
        leadSource: item["Lead Source"],
        leadSourceId: item.lead_source_id,
        leadStatus: item["Lead Status"],
        leadStatusId: item.lead_status_id,
       }))
       setLeadData(formattedData);

    }}
    //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
    catch(error :  any ){
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
  }

  //NOTE : NEED TO ADD PAGINATION FUNCTIONALITY HERE
  useEffect(()=>{
    getLeadsData();
  }, [])


  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  if (userHasAccessToViewLead) {
    const handleCreateLeadModalClose = () => {
      setIsCreateLeadModalOpen(false);
    };

    return (
      <div className="w-full pt-2 pl-5 pr-1 gap-1">
        <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <div className="flex w-full gap-2">
            <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
              <div className="flex  gap-2">
                {!isSmallScreen && (
                  <Handshake className="w-6 h-6 text-blue-600" />
                )}

                {(isMediumScreen || isLargeScreen) && (
                  <span className="text-1xl font-bold">Lead Management</span>
                )}
              </div>

              {isLargeScreen && (
                <div className="flex gap-1">
                  {/* search box flex div */}
                  <div className="relative flex items-start w-80 ">
                    {/* NOTE : search box input */}
                    {/* NOTE : IF WANT TO ADD SEARCH FUNCTIONALITY THEN UNCOMMMENT THE BELOW CODE AND USE IT */}
                    <SearchInput
                      onChange={() => {
                      }}
                    ></SearchInput>
                  </div>
                </div>
              )}
              <div className="flex gap-1">

              <Button onClick={handleCompanyUserPopUp} type="button">
                  <div className="flex gap-2 items-center whitespace-nowrap">
                    <Search size={18} />
                    <span>Lead Owner</span>
                  </div>
                  
                </Button>
                {userHasAccessToAddLead && <Button
                  onClick={() => {
                    setIsCreateLeadModalOpen(true);
                  }}
                >
                  {!isSmallScreen && <ClipboardPlus size={SIZE.TWENTY} />}
                  {isSmallScreen && <ClipboardPlus size={SIZE.EIGHT} />}
                  {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
                </Button>}
                  {!userHasAccessToAddLead && 
                    <Button
                    disabled={true}
                    
                  >
                    {!isSmallScreen && <ClipboardPlus size={SIZE.TWENTY} />}
                    {isSmallScreen && <ClipboardPlus size={SIZE.EIGHT} />}
                    {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
                  </Button>
                  }
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <div
            className="ag-theme-alpine w-full"
            style={{ height: "460px", width: "100%" }}
          >
            <LeadManagementAgGrid   leads={leadData} />
          </div>
          <CreateLeadModal 
            isOpen={isCreateLeadModalOpen}
            onClose={handleCreateLeadModalClose}
            onCreateLeadRefreshLeadData={getLeadsData}
          ></CreateLeadModal>
        </div>
        {/* NOTE : NEED TO TALK ABOUT THIS */}
        <DialogueBox
                isOpen={isDialogueOpen}
                onClose={() => setIsDialogueOpen(false)}
                onConfirm={handleDialogueConfirm}
                title="Session Expired !"
                message="Session Expired. Please login again."
              />


        {openPopUpOfCompanyUserModal && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
            {/* Header with Close Button */}
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Select Company User
              </h3>
              <button
                onClick={() => setOpenPopUpOfCompanyUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            {/* NOTE : CALL TO THE MODAL COMPONENT */}
            <div className="p-1">
              <GetCompanyUsersForLead
                selectedUserId={persistedSelectedUserId} // Pass the persisted ID
                handleSelectedCompanyUserChange={
                  handleSelectedCompanyUserChange
                }
              />
            </div>
          </div>
        </div>
      )}
      </div>
    );
  }
}

export default LeadManagementList;
