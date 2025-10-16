/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowLeft,
  Edit3,
  Handshake,
  History,
  Plus,
  Save,
  Settings,
  User2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import UpdateLeadForm from "./UpdateLeadForm";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import PostDataTypeForLeadSourceAndStatusAndStates from "../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import LeadStatusHistory from "./LeadStatusHistory";
import LeadDetails from "./LeadDetails";
import LeadDetailsData from "../../../@types/lead-management/LeadDetailsData";
import PostDataLeadUpdate from "../../../@types/lead-management/PostDataLeadUpdate";
import RefreshToken from "../../../config/validations/RefreshToken";
import qs from "query-string";
import GetCompanyUsersForLead from "./company-users-selection-modal/GetCompanyUsersForLead";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import LeadOwnerHistory from "./LeadOwnerHistory";
import AssignProductToLead from "./AssignProductToLead";
import LeadAssignedCompanyProduct from "../../../@types/lead-management/LeadAssignedCompanyProduct";
import LeadAssignedComponyProducts from "./LeadAssignedCompanyProduct";
import InterestType from "../../../@types/lead-management/InterestType";
import LeadContact from "./LeadContact";
import LeadContactType from "../../../@types/lead-management/LeadContact";
import LeadAssignedTeams from "./LeadAssignedTeams";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
import LeadTasksModal from "./lead-task/LeadTasksModal";
import LeadSettingForLead from "./lead-settings/LeadSettingsForLead";
import toast from "react-hot-toast";
import { useUserPreference } from "../../../context/user/UserPreference";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Button from "../../ui/Button";
import FormHeader from "../../ui/FormHeader";
import { createPortal } from "react-dom";
import StatusUpdateModal from "./lead-status/StatusUpdateModal";
import ConvertLeadModal from "./lead-status/ConvertLeadModal";

const ViewLeadManagement = () => {
  const navigate = useNavigate();
  const { userHasAccessToUpdateLead, userHasAccessToViewLead } =
    useUserAccessModules();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const { loginStatus } = useLoggedInUserContext();
  const [isUpdateLeadFormOpen, setIsUpdateLeadFormOpen] =
    useState<boolean>(false);
  const { userPreference } = useUserPreference();
  const [searchParams] = useSearchParams();
  const [reasonInputBoxOpen, setReasonInputBoxOpen] = useState<boolean>(false);
  const [reasonInputBoxOpenForLeadOwner, setReasonInputBoxOpenForLeadOwner] =
    useState<boolean>(false);
  const [reasonText, setReasonText] = useState<string>("");
  const [reasonTextForLeadOwnerChange, setReasonTextForLeadOwnerChange] =
    useState<string>("");
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const countryChangeRef = useRef<number>(0);
  const stateChangeRef = useRef<number>(0);
  const previouseOwnerRef = useRef<number>(0);
  const [isOpenLeadStatusHistory, setIsOpenLeadStatusHistory] =
    useState<boolean>(false);

  const [isOpenLeadOwnerHistory, setIsOpenLeadOwnerHistory] =
    useState<boolean>(false);

  //NOTE : THIS IS THE SELECTED LEAD
  const [selectedLeadData, setSelectedLeadData] = useState(
    JSON.parse(searchParams.get("leadData") || "{}")
  );

  const [leadStatus, setLeadStatus] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >([]);

  const [leadAssignedCompanyProduct, setLeadAssignedCompanyProduct] = useState<
    LeadAssignedCompanyProduct[]
  >([]);
  const [interestTypeData, setInterestTypeData] = React.useState<
    InterestType[]
  >([]);
  //meeting modal states
  const [leadContact, setLeadContact] = useState<LeadContactType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("contact");
  const [isOpenMeetingsModal, setIsOpenMeetingsModal] =
    useState<boolean>(false);
  const [isOpenProductCard, setIsOpenProductCard] = useState<boolean>(true);
  const [isOpenLeadTeamsCard, setIsOpenLeadTeamsCard] =
    useState<boolean>(false);

  const fetchLeadStatus = async () => {
    try {
      const postDataForLeadStatusData = {
        id: null,
        name: null,
        description: null,
        isactive: true,
      };
      const response = await axios.post(
        POST_API.GET_LEAD_STATUS,
        postDataForLeadStatusData,
        { withCredentials: true }
      );
      if (response.status === STATUS_CODE.OK) {
        const data = response.data;
        if (Array.isArray(data)) {
          setLeadStatus(data);
        } else {
          setLeadStatus([]);
        }
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: fetchLeadStatus,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          fetchLeadStatus();
        }
      }
    }
  };

  const handleSaveStatusUpdate = async () => {
    if (!selectedLeadData || selectedStatusId === null) return;

    const postDataForLeadStatusUpdate = {
      company_id: loginStatus.companyId,
      id: selectedLeadData.id,
      lead_status_id: selectedStatusId,
      reason: reasonText,
      updatedby: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.UPDATE_LEAD_STATUS,
        postDataForLeadStatusUpdate,
        { withCredentials: true }
      );
      if (response?.status == STATUS_CODE.OK) {
        if (response.data.status) {
        
          const updatedStatusName = leadStatus?.find(
            (item) => item.id === selectedStatusId
          )?.name;

          const parsedQuery = JSON.parse(searchParams.get("leadData") || "{}");
          parsedQuery.leadStatusId = selectedStatusId.toString();
          parsedQuery.leadStatus = updatedStatusName!.toString();
          const newQueryString = qs.stringify({
            leadData: JSON.stringify(parsedQuery),
          });

          setSelectedLeadData((prev: any) => ({
            ...prev,
            leadStatus: updatedStatusName,
          }));
          setReasonInputBoxOpen(false);
          setReasonText("");
          setSelectedStatusId(null);

          const newPath = `${window.location.pathname}?${newQueryString}`;
          navigate(newPath, { replace: true });

          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleSaveStatusUpdate,
        });
        if (refreshTokenStatus) {
          handleSaveStatusUpdate();
        }
      }
    }
  };

  //lead owner change
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
  const [isLeadOwnerPopUpOpen, setIsLeadOwnerPopUpOpen] =
    useState<boolean>(false);
  const [persistedSelectedUserId, setPersistedSelectedUserId] = useState<
    number | null
  >(selectedLeadData.companyUserId);

  previouseOwnerRef.current = selectedLeadData.companyUserId;

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
  };

  const handleClickLeadOwnerChange = () => {
    setIsLeadOwnerPopUpOpen(true);
  };

  const handleLeadOwnerChange = async () => {
    if (selectedCompanyUser.id === null || selectedCompanyUser.id === 0) {
      setReasonInputBoxOpenForLeadOwner(false);
      toast.error("Select new lead owner before procedding.");
      return;
    }
    const PostDataLeadOwnerChange = {
      company_id: loginStatus.companyId,
      id: selectedLeadData.id,
      ownerid: selectedCompanyUser.id,
      reason: reasonTextForLeadOwnerChange,
      updatedby: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.UPDATE_LEAD_OWNER,
        PostDataLeadOwnerChange,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          toast.success(response.data.message);
          const parsedQuery = JSON.parse(searchParams.get("leadData") || "{}");
          parsedQuery.leadOwner = selectedCompanyUser.fullname.toString();
          const newQueryString = qs.stringify({
            leadData: JSON.stringify(parsedQuery),
          });

          const newPath = `${window.location.pathname}?${newQueryString}`;
          navigate(newPath, { replace: true });

          //resetting the states
          setReasonTextForLeadOwnerChange("");
          setReasonInputBoxOpenForLeadOwner(false);
          setSelectedLeadData((prev: any) => ({
            ...prev,
            leadOwner: selectedCompanyUser.fullname,
            companyUserId: selectedCompanyUser.id,
          }));
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: handleLeadOwnerChange,
        });
        if (refreshTokenStatus) {
          handleLeadOwnerChange();
        }
      }
    } finally {
      // selected company user should become null after this function runs
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
  const [leadDetailsData, setLeadDetailsData] = useState<LeadDetailsData>({
    id: 0,
    lead_id: 0,
    country_id: 0,
    additional_contact_number: "",
    address: "",
    country_name: "",
    createdby: "",
    createdon: "",
    district_id: 0,
    district_name: "",
    industry_name: "",
    industry_type: "",
    industry_type_id: 0,
    job_title: "",
    state_id: 0,
    state_name: "",
    updatedby: "",
    updatedon: "",
    website: "",
  });

  const getLeadDetails = async () => {
    const PostData = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      requestedby: loginStatus.id,
    };

    try {
      const response = await axios.post(POST_API.GET_LEAD_DETAILS, PostData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === STATUS_CODE.OK) {
        const data = response.data;
        setLeadDetailsData({
          id: data.id,
          lead_id: data.lead_id,
          country_id: data.country_id,
          country_name: data["Country Name"],
          district_id: data.district_id,
          district_name: data["District Name"],
          state_id: data.state_id,
          state_name: data["State Name"],
          address: data.address,
          industry_type_id: data.industry_type_id,
          industry_type: data["Industry Type"],
          industry_name: data.industry_name,
          job_title: data.job_title,
          website: data.website,
          additional_contact_number: data.additional_contact_number,
          createdby: data.createdby,
          createdon: data.createdon,
          updatedby: data.updatedby,
          updatedon: data.updatedon,
        });
        countryChangeRef.current = data.country_id;
        stateChangeRef.current = data.state_id;
        // districtChangeRef.current = data.district_id;
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getLeadDetails,
        });
        if (refreshTokenStatus) {
          getLeadDetails();
        }
      }
    }
  };
  // this is the lead details data on save callback
  const handleSaveEditLeadDetailsCallback = (
    editLeadDetailsData: LeadDetailsData
  ) => {
    setLeadDetailsData(editLeadDetailsData);
  };

  // API call to get lead interest data
  async function getLeadInterestData() {
    try {
      const response = await axios.get(POST_API.GET_LEAD_INTEREST_TYPE, {
        params: {
          id: null,
          name: null,
          isActive: true,
        },
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        setInterestTypeData(response.data);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadInterestData,
        });
        if (refreshTokenStatus) {
          getLeadInterestData();
        }
      }
    }
  }
  //fetch the lead assigned company product
  const fetchLeadCompanyProduct = async () => {
    try {
      const response = await axios.get(POST_API.GET_LEAD_ASSIGED_PRODUCT, {
        params: {
          companyId: loginStatus.companyId,
          leadId: selectedLeadData.id,
          companyProductId: null,
          leadInterestId: null,
          requestedBy: loginStatus.id,
        },
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        const mappedData: LeadAssignedCompanyProduct[] = response.data.map(
          (item: any) => ({
            id: item.id,
            leadName: item["Lead Name"],
            leadId: item["lead_id"],
            companyProductName: item["Company Product Name"],
            companyProductId: item["company_product_id"],
            leadInterestName: item["Lead Interest Name"],
            leadInterestId: item["lead_interest_id"],
            costExpected: item["cost_expected"],
            quantityRequired: item["quantity_required"],
            createdBy: item["createdby"],
            createdOn: item["createdon"],
            updatedBy: item["updatedby"],
            updatedOn: item["updatedon"],
            isActive: item["isactive"],
          })
        );

        setLeadAssignedCompanyProduct(mappedData);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: fetchLeadCompanyProduct,
        });
        if (refreshTokenStatus) {
          fetchLeadCompanyProduct();
        }
      }
    }
  };

  const handleLeadProductStatusUpdate = (
    updatedProduct: LeadAssignedCompanyProduct
  ) => {
    setLeadAssignedCompanyProduct((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...product,
              isActive: !product.isActive,
            }
          : product
      )
    );
  };
  const handleLeadProductUpdate = (
    updatedProduct: LeadAssignedCompanyProduct
  ) => {
    setLeadAssignedCompanyProduct((prevData) =>
      prevData.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...product,
              quantityRequired: updatedProduct.quantityRequired,
              costExpected: updatedProduct.costExpected,
              leadInterestId: updatedProduct.leadInterestId!,
              // changes here
              leadInterestName: updatedProduct.leadInterestName,
            }
          : product
      )
    );
  };

  // get lead contact
  const fetchLeadContact = async () => {
    const postDataGetLeadContact = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_LEAD_CONTACT, postDataGetLeadContact, {
        withCredentials: true,
      })
      .then((response) => {
        const mappedLeadContactData: LeadContactType[] = response.data.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            address: item.address,
            createdBy: item.createdby,
            createdOn: item.createdon,
            isActive: item.isactive,
            isPrimary: item.is_primary,
            jobTitle: item.job_title,
            leadId: item.lead_id,
            linkedinProfile: item.linkedin_profile,
            mobileNumber: item.mobilenumber,
            preferredCommunicationChannel: item.preferred_communication_channel,
            preferredLanguage: item.preferred_language,
            socialMediaHandles: item.social_media_handles,
            updatedBy: item.updatedby,
            updatedOn: item.updatedon,
          })
        );
        setLeadContact(mappedLeadContactData);
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: fetchLeadContact,
          });
          if (refreshTokenStatus) {
            fetchLeadContact();
          }
        }
      });
  };

  // call to the all apis
  useEffect(() => {
    const apisCalls = () => {
      fetchLeadStatus();
      getLeadDetails();
      fetchLeadContact();
      getLeadInterestData();
      fetchLeadCompanyProduct();
    };
    apisCalls();
  }, []);

  const handleLeadInfoSave = async () => {
    const trimmedName = selectedLeadData.name?.trim() ?? "";

    // case 1: only spaces → not allowed
    if (selectedLeadData.name !== "" && trimmedName === "") {
      setSelectedLeadData((prev: any) => ({
        ...prev,
        name: null,
      }));
    }
    console.log(trimmedName);

    const PostDataForLeadUpdate: PostDataLeadUpdate = {
      company_id: loginStatus.companyId,
      id: selectedLeadData.id, //NOTE : LEAD ID FOR EDIT
      name: selectedLeadData.name,
      email: selectedLeadData.email,
      mobilenumber: selectedLeadData.mobileNumber,
      updatedby_id: loginStatus.id,
    };
    console.log(PostDataForLeadUpdate);

    try {
      const response = await axios.post(
        POST_API.UPDATE_LEAD,
        PostDataForLeadUpdate,
        { withCredentials: true }
      );
      if (response.data.status) {
        //parse query string
        const rawLeadData = window.location.search;
        const urlParams = new URLSearchParams(rawLeadData);
        const leadDataStr = urlParams.get("leadData");

        const parsedQuery = JSON.parse(leadDataStr || "{}");
        parsedQuery.name = !selectedLeadData.name ? "" : selectedLeadData.name;
        parsedQuery.email = !selectedLeadData.email
          ? ""
          : selectedLeadData.email;
        parsedQuery.mobileNumber = !selectedLeadData.mobileNumber
          ? ""
          : selectedLeadData.mobileNumber;

        const newQueryString = qs.stringify({
          leadData: JSON.stringify(parsedQuery),
        });

        const newPath = `${window.location.pathname}?${newQueryString}`;
        navigate(newPath, { replace: true });

        toast.success(response.data.message);
        fetchLeadContact();
      } else if (response.data.status === false) {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleLeadInfoSave,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          handleLeadInfoSave();
        }
      } else if (error.status === 400) {
        toast.error(error.response.data);
      }
    }
  };

  const handleClickCards = (event: React.MouseEvent<HTMLElement>) => {
    const id = event.currentTarget.id;
    setActiveTab(id); // set active tab for border effect

    if (id === "meeting") {
      setIsOpenProductCard(false);
      setIsOpenMeetingsModal(true);
      setIsOpenLeadTeamsCard(false);
    } else if (id === "contact") {
      setIsOpenProductCard(true);
      setIsOpenMeetingsModal(false);
      setIsOpenLeadTeamsCard(false);
    } else if (id === "LeadTeams") {
      setIsOpenProductCard(false);
      setIsOpenMeetingsModal(false);
      setIsOpenLeadTeamsCard(true);
    }
  };

  const getHeightAboveTasks = useCallback(() => {
    if (isOpenMeetingsModal) {
      return "min-h-40";
    } else {
      return "min-h-72";
    }
  }, [isOpenMeetingsModal]);

  // New Code
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isLeadSettingModalOpen, setIsLeadSettingModalOpen] =
    useState<boolean>(false);

  // Note : Clears the states when user clicks on lead owner change button
  function handleLeadOwnerChangeStateClear() {
    setReasonTextForLeadOwnerChange("");
    setReasonInputBoxOpenForLeadOwner(!reasonInputBoxOpenForLeadOwner);
    setPersistedSelectedUserId(selectedLeadData.companyUserId);
  }
  return (
    <div
      className={` fixed top-8 inset-0 z-10 bg-white ${
        userPreference.isLeftMenu ? "ml-[54px] mt-4" : " mt-6"
      } overflow-auto`}
    >
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex mt-1 bg-slate-100 mx-2 p-0.5 rounded  items-center justify-between     ">
          <div className="flex w-[30%] gap-6">
            <button
              className="flex items-center gap-1 caption-custom justify-center hover:text-blue-600 "
              onClick={() => {
                navigate(ROUTES_URL.GET_LEAD_MANAGEMENT);
              }}
            >
              <ArrowLeft size={14} />
              <span>Leads</span>
            </button>
          </div>

          {/**Add Setting in lead details page here  */}
          <div className=" flex items-center min-w-20 justify-end mr-2  w-full">
            {/* new code  */}
            <div className="relative inline-block">
              <button
                onClick={() => {
                  if (userHasAccessToUpdateLead) {
                    setIsLeadSettingModalOpen(true);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.LEAD_MODULE
                        .UPDATE_LEAD_ACCESS_DENIED_message
                    );
                  }
                }}
                className="px-1 py-0.5 caption-custom flex gap-1 items-center justify-center bg-white hover:bg-slate-400 hover:text-white text-gray-500 bg-transparent border rounded  transition"
              >
                <Settings size={12} />
                <span>Lead setting</span>
              </button>
              {isLeadSettingModalOpen && (
                <LeadSettingForLead
                  isOpen={isLeadSettingModalOpen}
                  onClose={() => {
                    setIsLeadSettingModalOpen(false);
                  }}
                  lead={selectedLeadData}
                />
              )}
            </div>
          </div>

          <div className="hidden items-center justify-evenly w-48">
            {/* new code  */}
            <div className="relative inline-block">
              <button
                disabled={!userHasAccessToViewLead}
                onClick={() => {
                  if (userHasAccessToUpdateLead) {
                    setIsAddProductModalOpen(true);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.LEAD_MODULE
                        .UPDATE_LEAD_ACCESS_DENIED_message
                    );
                  }
                }}
                className="hidden px-1 py-1 text-xs  gap-1 items-center justify-center text-gray-500 bg-transparent border rounded  transition"
              >
                <Plus size={8} />
                <span>Product</span>
              </button>
            </div>

            <button
              className="hidden  text-xs rounded border px-3 my-1 text-gray-500"
              onClick={() => {
                setIsUpdateLeadFormOpen(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Lead Status Section */}
        <div className="mx-2 mt-2  flex  bg-slate-100  shadow rounded-sm">
          <div className="flex w-full">
            <div
              className="flex w-[100%] border bg-white"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
              }}
            >
              {leadStatus!.map((item: any) => (
                <button
                  title={item.name}
                  key={item.id}
                  className={`flex-1 overflow-hidden ${
                    selectedLeadData.leadStatus === item.name
                      ? "bg-blue-700 table-header-custom-white hover:bg-blue-500 hover:text-white"
                      : "hover:bg-blue-700 table-header-custom hover:text-white"
                  }
              ${
                selectedStatusId === item.id &&
                "bg-sky-400 hover:bg-sky-500 table-header-custom-white"
              } text-center p-1`}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
                  }}
                  onClick={() => {
                    if (userHasAccessToUpdateLead) {
                      setReasonInputBoxOpen(true);
                      setSelectedStatusId(item.id);
                    } else {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                      );
                    }
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
            {/* status history */}
            <div className="flex justify-end caption-custom  mb-1 px-2">
              {/* <span className="font-semibold ">Lead Status</span> */}
              <button
                onClick={() => {
                  setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
                }}
              >
                <span
                  title="Status history"
                  className="flex items-center justify-center hover:text-blue-600 "
                >
                  <History size={12} className="mt-0" />
                  History
                </span>
              </button>
            </div>
          </div>
        </div>
        {reasonInputBoxOpen && selectedStatusId !== 9 && (
          <StatusUpdateModal
            handleCancel={() => {
              setReasonInputBoxOpen(!reasonInputBoxOpen);
              setSelectedStatusId(null);
            }}
            handleSaveStatusUpdate={handleSaveStatusUpdate}
            onReasonChange={(e) => setReasonText(e.target.value)}
            reasonText={reasonText}
          />
        )}

        {reasonInputBoxOpen && selectedStatusId === 9 && (
          <ConvertLeadModal
            isOpen={reasonInputBoxOpen}
            onClose={() => {
              setReasonInputBoxOpen(!reasonInputBoxOpen);
              setSelectedStatusId(null);
              setReasonText("");
            }}
            leadData={selectedLeadData}
            handleLeadConversion={handleSaveStatusUpdate}
            onReasonChange={(e) => setReasonText(e.target.value)}
              reasonText={reasonText}
              handleLeadMappedToAccount={()=>{
               const parsedQuery = JSON.parse(searchParams.get("leadData") || "{}");
          parsedQuery.leadStatusId = "9";
          parsedQuery.leadStatus = "Converted";
          const newQueryString = qs.stringify({
            leadData: JSON.stringify(parsedQuery),
          });

          setSelectedLeadData((prev: any) => ({
            ...prev,
            leadStatus: "Converted",
          }));
          setReasonInputBoxOpen(false);
          setReasonText("");
          setSelectedStatusId(null);

          const newPath = `${window.location.pathname}?${newQueryString}`;
          navigate(newPath, { replace: true });
              }}
            />
          )}

        {/* Sections  */}
        <div className="w-full flex flex-col md:flex-row gap-1 p-2">
          {/* Column 1 */}
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            {/* Lead Basic Info */}
            <div className=" flex   shadow-sm border rounded-sm p-1  ">
              <div className="mx-1 grid md:grid-cols-3 bg-pink-00 sm:grid-cols-1  gap-2  ">
                <div className=" flex items-center gap-3 col-span-3  ">
                  <div className="bg-blue-600  p-2 rounded text-white">
                    <Handshake size={30} />
                  </div>
                  <div
                    title={
                      userHasAccessToUpdateLead
                        ? ""
                        : MESSAGE.MODULE_ACCESS.LEAD_MODULE
                            .UPDATE_LEAD_ACCESS_DENIED_message
                    }
                    className="table-header-custom"
                    onClick={() => {
                      if (!userHasAccessToUpdateLead) {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.LEAD_MODULE
                            .UPDATE_LEAD_ACCESS_DENIED_message
                        );
                      }
                    }}
                  >
                    <Detail
                      label="Name"
                      // hasBorder={true}
                      type={userHasAccessToUpdateLead ? "text" : "none"}
                      value={selectedLeadData?.name}
                      onChange={(e) => {
                        setSelectedLeadData({
                          ...selectedLeadData,
                          name: e.target.value,
                        });
                        // }
                      }}
                      handleLeadInfoSave={handleLeadInfoSave}
                    />
                  </div>
                </div>
                <div
                
                  onClick={() => {
                    if (!userHasAccessToUpdateLead) {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                      );
                    }
                  }}
                  title={
                    userHasAccessToUpdateLead
                      ? ""
                      : MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                  }
                >
                  <Detail
                    // hasBorder={true}
                    label="Email"
                    type={userHasAccessToUpdateLead ? "text" : "none"}
                    value={selectedLeadData?.email}
                    onChange={(e) => {
                      setSelectedLeadData({
                        ...selectedLeadData,
                        email: e.target.value.trim(),
                      });
                    }}
                    handleLeadInfoSave={handleLeadInfoSave}
                  />
                </div>

                <div
                className="ml-4"
                  onClick={() => {
                    if (!userHasAccessToUpdateLead) {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                      );
                    }
                  }}
                  title={
                    userHasAccessToUpdateLead
                      ? ""
                      : MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                  }
                >
                  <Detail
                    label="Mobile number"
                    // hasBorder={true}
                    type={userHasAccessToUpdateLead ? "text" : "none"}
                    value={selectedLeadData?.mobileNumber}
                    onChange={(e) => {
                      setSelectedLeadData({
                        ...selectedLeadData,
                        mobileNumber: e.target.value,
                      });
                    }}
                    handleLeadInfoSave={handleLeadInfoSave}
                  />
                </div>
                <Detail
                  type="none"
                  label="Lead source"
                  value={selectedLeadData?.leadSource}
                />
                <Detail
                  type="none"
                  label="Created on"
                  value={selectedLeadData?.createdOn}
                />
                <div className="ml-4">

                <Detail
                  type="none"
                  label="Created by"
                  value={selectedLeadData?.createdBy}
                  />
                  </div>
                <div
                  className="flex"
                  title={
                    userHasAccessToUpdateLead
                      ? ""
                      : MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                  }
                  onClick={() => {
                    if (!userHasAccessToUpdateLead) {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                      );
                    }
                  }}
                >
                  <div className="flex relative ">
                    <Detail
                      label="Lead owner"
                      hasBorder={true}
                      type={userHasAccessToUpdateLead ? "select" : "none"}
                      value={selectedLeadData?.leadOwner}
                      handleClickLeadOwnerChange={handleClickLeadOwnerChange}
                    />
                    <button
                      title="Lead owner history"
                      className="absolute left-24 caption-custom flex items-center mt-1 hover:text-blue-700"
                      onClick={() => {
                        setIsOpenLeadOwnerHistory(!isOpenLeadOwnerHistory);
                      }}
                    >
                      <History size={12} className="mt-0" />
                    </button>
                  </div>
                </div>
              </div>
              {reasonInputBoxOpenForLeadOwner && (
                <div className="fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-2 w-full max-w-md mx-2">
                    <div className="flex flex-col gap-1">
                      <label className="table-header-custom">
                        Reason (Optional)
                      </label>
                      <textarea
                        rows={7}
                        placeholder="Enter reason for lead owner update"
                        className="border rounded  p-1 input-label-custom"
                        value={reasonTextForLeadOwnerChange}
                        onChange={(e) =>
                          setReasonTextForLeadOwnerChange(e.target.value)
                        }
                      />
                      <div className="flex justify-end ">
                        <div className="flex gap-1">
                          <Button
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLeadOwnerChange();
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <Save size={16} />
                              Save
                            </div>
                          </Button>
                          <Button
                            type="button"
                            onClick={handleLeadOwnerChangeStateClear}
                          >
                            <div className="flex items-center ">
                              <X size={18} />
                              Cancel
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Lead Details */}
            <div className="shadow-md rounded-sm">
              <LeadDetails
                handleSaveEditLeadDetailsCallback={
                  handleSaveEditLeadDetailsCallback
                }
                leadDetailsData={leadDetailsData}
                setLeadDetailsData={setLeadDetailsData}
                selectedLeadData={selectedLeadData}
                getLeadDetails={getLeadDetails}
              />
            </div>

            {/* Assigned Company Product */}
            <div className=" shadow-md rounded">
              <LeadAssignedComponyProducts
                setIsAddProductModalOpen={setIsAddProductModalOpen}
                data={leadAssignedCompanyProduct}
                interestTypeData={interestTypeData}
                handleLeadProductStatusUpdate={handleLeadProductStatusUpdate}
                handleLeadProductUpdate={handleLeadProductUpdate}
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="w-full md:w-1/2 flex  flex-col gap-0 shadow-sm">
            {/* Meeting / Contact / Span Tabs */}
            <div className="bg-slate-200 pl-1  flex caption-custom gap-4">
              <span
                id="contact"
                className={`cursor-pointer ${
                  activeTab === "contact"
                    ? "border-b-2 border-blue-500 caption-custom-blue"
                    : "hover:text-blue-500"
                }`}
                onClick={handleClickCards}
              >
                Contacts
              </span>
              <span
                id="meeting"
                className={`cursor-pointer ${
                  activeTab === "meeting"
                    ? "border-b-2 border-blue-500 caption-custom-blue"
                    : "hover:text-blue-500"
                }`}
                onClick={handleClickCards}
              >
                Meeting
              </span>

              <span
                id="LeadTeams"
                className={`cursor-pointer ${
                  activeTab === "LeadTeams"
                    ? "border-b-2 border-blue-500 caption-custom-blue"
                    : "hover:text-blue-500"
                }`}
                onClick={handleClickCards}
              >
                Lead Teams
              </span>
            </div>
            <div className="flex flex-col min-h-72 gap-2">
              <div
                className={`flex max-h-72 ${getHeightAboveTasks()} overflow-y-scroll flex-col  gap-2 [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-50
             [&::-webkit-scrollbar-thumb]:bg-gray-50
              [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full`}
              >
                {isOpenMeetingsModal && (
                  <div className="flex  items-center justify-center   min-h-72">
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 border rounded-xl bg-gray-50 shadow-sm">
                      <h2 className="table-header-custom">
                        Schedule a Meeting
                      </h2>
                      <p className="input-label-custom">
                        Plan your next discussion with ease. Use this option to
                        select a convenient time, invite participants, and share
                        meeting details — all in one place.
                      </p>
                      <p className="input-label-custom max-w-md">
                        Once scheduled, participants will receive notifications
                        with the meeting link and reminders before it begins.
                      </p>
                      <div>
                        <Button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            const leadDataSearchParams = JSON.parse(
                              searchParams.get("leadData") || "{}"
                            );
                            sessionStorage.setItem(
                              "leadData",
                              JSON.stringify(leadDataSearchParams!)
                            );
                            navigate(ROUTES_URL.SCHEDULE_MEETING);
                          }}
                        >
                          + Schedule Meeting
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {isOpenProductCard && (
                  <LeadContact
                    selectedLeadData={selectedLeadData}
                    leadContact={leadContact}
                    fetchLeadContact={fetchLeadContact}
                  />
                )}
                {isOpenLeadTeamsCard && (
                  <LeadAssignedTeams
                    selectedLeadData={selectedLeadData}
                    isOpen={isOpenLeadTeamsCard}
                  />
                )}
              </div>
            </div>
            {/* Activity */}
            <LeadTasksModal
              ownerId={selectedLeadData.companyUserId}
            ></LeadTasksModal>
            {/* End Activity */}
          </div>
        </div>

        {/* end  */}

        {/* update lead form */}
        <UpdateLeadForm
          isOpen={isUpdateLeadFormOpen}
          onClose={() => {
            setIsUpdateLeadFormOpen(false);
          }}
          selectedLeadForEdit={selectedLeadData}
        />

        {/* lead status history */}
        <LeadStatusHistory
          selectedLeadData={selectedLeadData}
          isOpen={isOpenLeadStatusHistory}
          onClose={() => {
            setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
          }}
        />
        {/* lead owner history */}
        <LeadOwnerHistory
          selectedLeadData={selectedLeadData}
          isOpen={isOpenLeadOwnerHistory}
          onClose={() => {
            setIsOpenLeadOwnerHistory(!isOpenLeadOwnerHistory);
          }}
        />

        {/* lead owner pop up open */}
        {isLeadOwnerPopUpOpen &&
          createPortal(
            <div className="fixed top-12 inset-0 z-50 bg-black bg-opacity-5 flex items-center justify-center p-4 ">
              <div className="bg-white p-3  rounded-2xl shadow-lg w-full max-w-6xl max-h-[100%] overflow-y-auto relative animate-fadeIn">
                {/* Header with Close Button */}
                {/* <div className="flex justify-between items-center p-2 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">
                  Select Company User
                </h3>
                <button
                  onClick={() => {
                    setIsLeadOwnerPopUpOpen(false);

                    if (
                      selectedCompanyUser.id !== 0 &&
                      selectedCompanyUser.id !== null &&
                      selectedCompanyUser.id === persistedSelectedUserId
                    ) {
                      setReasonInputBoxOpenForLeadOwner(true);
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div> */}
                <FormHeader
                  preText="Assign new lead owner."
                  description="Select and assign a new owner to manage this lead."
                  onClose={() => {
                    setIsLeadOwnerPopUpOpen(false);

                    if (
                      selectedCompanyUser.id !== 0 &&
                      selectedCompanyUser.id !== null &&
                      selectedCompanyUser.id === persistedSelectedUserId
                    ) {
                      setReasonInputBoxOpenForLeadOwner(true);
                    }
                  }}
                  icon={User2}
                />
                {/* NOTE : CALL TO THE MODAL COMPONENT */}
                <div className="">
                  <GetCompanyUsersForLead
                  isUsedForSettings={false}
                    selectedUserId={persistedSelectedUserId} // Pass the persisted ID
                    handleSelectedCompanyUserChange={
                      handleSelectedCompanyUserChange
                    }
                  />
                </div>
              </div>
            </div>,
            document.body
          )}
        <AssignProductToLead
          selectedLeadData={selectedLeadData}
          isOpen={isAddProductModalOpen}
          onClose={() => {
            setIsAddProductModalOpen(false);
          }}
          leadAssignedComponyProduct={leadAssignedCompanyProduct}
          fetchLeadCompanyProduct={fetchLeadCompanyProduct}
          interestTypeData={interestTypeData}
        />
      </motion.section>
    </div>
  );
};
export default ViewLeadManagement;

type DetailProps = {
  label: string;
  value: string;
  type?: "text" | "number" | "select" | "none";
  options?: string[]; //only used if type is 'select'
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleLeadInfoSave?: () => Promise<void>;
  handleClickLeadOwnerChange?: () => void;
  hasBorder?: boolean;
};

const Detail: React.FC<DetailProps> = ({
  label,
  value,
  type,
  options = [],
  onChange,
  handleLeadInfoSave,
  handleClickLeadOwnerChange,
  hasBorder,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const prevValueRef = useRef(value);

  const handleClick = () => {
    prevValueRef.current = value;
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    const trimmedValue = value.trim();
    // Step 1: Check if value changed
    if (trimmedValue === prevValueRef.current) {
      // toast.error(MESSAGE.ERROR.NO_CHANGES);
      return; // No changes made, do nothing
    }

    if (label === "Mobile number") {
      const isValid = value
        .trim()
        .match(MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN);

      if (!isValid) {
        //revert to previous value
        const syntheticEvent = {
          target: { value: prevValueRef.current },
        } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

        onChange?.(syntheticEvent);

        toast.error(
          MOBILE_NUMBER_VALIDATION.ERROR_MESSAGE_MOBILE_NUMBER_INDIAN
        );
        return;
      }
    } else if (label === "Email") {
      const isValid = value.trim().match(VALIDATIONS.EMAIL);
      if (!isValid) {
        //revert to previous value
        const syntheticEvent = {
          target: { value: prevValueRef.current },
        } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

        onChange?.(syntheticEvent);

        toast.error(MESSAGE.ERROR.EMAIL_NOT_VALID_ERROR);
        return;
      }
    }
    //  Apply trimmed value before saving
    if (trimmedValue !== value) {
      const syntheticEvent = {
        target: { value: trimmedValue },
      } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

      onChange?.(syntheticEvent); // update UI with trimmed value
    }
    if (value !== prevValueRef.current) {
      handleLeadInfoSave!();
    }
  };
  return (
    <div className="">
      <label className="caption-custom block  whitespace-nowrap overflow-hidden  ">
        {label}
      </label>
      {isEditing ? (
        type === "select" ? (
          <select
            className="input-label-custom"
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            autoFocus
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          type !== "none" && (
            <input
              type={type}
              className={`input-label-custom border border-gray-400 rounded-sm  p-0 m-0 ${label==="Name" ? "w-fit" : "w-48"} focus:outline-none focus:ring-0 `}
              value={value}
              onChange={onChange}
              onBlur={handleBlur}
              autoFocus
              maxLength={60}
              size={value ? value.length : 10}
            />
          )
        )
      ) : type === "none" ? (
        <div>
          <p
            className={`input-label-custom  text-gray-800 whitespace-nowrap overflow-x-hidden text-clip`}
          >
            {value ? (
              <span
                className={`${
                  label === "Lead source" ||
                  label === "Created by" ||
                  label === "Created on"
                    ? ""
                    : "border border-gray-200 rounded-md px-1"
                } `}
              >
                {value}
              </span>
            ) : (
              <span
                className={`${
                  label === "Lead source" ||
                  label === "Created by" ||
                  label === "Created on"
                    ? ""
                    : "border border-gray-200 rounded-md "
                }caption-custom px-1`}
              >
                {label === "Lead source" ||
                label === "Created by" ||
                label === "Created on"
                  ? "Data not found"
                  : "Add here..."}
              </span>
            )}
          </p>
        </div>
      ) : label === "Lead owner" ? (
        <div
          title={value}
          className={`input-label-custom hover:bg-slate-100      cursor-pointer`}
          onClick={handleClickLeadOwnerChange}
        >
          {
          value?
          <>
          
         {value} {/* Icon never gets truncated */}
            <Edit3 className="ml-1 h-3 w-3 inline-block text-slate-400 flex-shrink-0" /> 
          </>
            :<span className="input-label-custom">Add here...</span>}
        </div>
      ) : (
        <div
          title={value ?? "Enter value "}
          className={`table-header-custom flex items-center min-w-48 
    ${label === "Name" ? "table-header-custom" : "input-label-custom"}
    ${hasBorder ? "border rounded-md px-1 border-gray-200" : ""}
    cursor-pointer`}
          onClick={handleClick}
        >
          <div className="flex items-center cursor-pointer hover:bg-slate-100 rounded transition-colors">
            {/* Only the text truncates */}
            <span className={`truncate ${label==="Name" ? "" : " max-w-[205px]"} `}>
              {value ? (
                value
              ) : (
                <span className="p-1 caption-custom italic">Add here...</span>
              )}
            </span>

            {/* Icon never gets truncated */}
            <Edit3 className="ml-1 h-3 w-3 text-slate-400 flex-shrink-0" />
          </div>
        </div>

        // <div
        //   title={value ?? "Enter value "}
        //   className={`table-header-custom flex items-center min-w-48 max-w-fit gap-3 justify-between ${
        //     label === "Name"
        //       ? "table-header-custom p-0  border-gray-200 "
        //       : "input-label-custom"
        //   }   truncate overflow-hidden ${
        //     hasBorder ? "border rounded-md px-1 border-gray-200 " : ""
        //   }   cursor-pointer`}
        //   onClick={handleClick}
        // >
        //   {value ? (

        //     <>
        //     {value}
        //     </>
        //   ) : (
        //     <>
        //       <span className=" p-1 caption-custom flex items-center justify-between italic">
        //         Add here...
        //       </span>
        //     </>
        //   )}
        //   <Pen size={12} className="caption-custom "/>
        // </div>
      )}
    </div>
  );
};
