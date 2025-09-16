/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, History, Plus, Settings, X } from "lucide-react";
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
      // showMessageSnackbar({
      //   message: "Select new lead owner before procedding.",
      //   type: "error",
      // });
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
        <div className="flex bg-slate-100 rounded-lg items-center justify-between border-b  m-1 px-1 ">
          <div className="flex gap-6">
            <button
              className="flex items-center  text-sm text-gray-600 hover:text-blue-600 transition"
              onClick={() => {
                navigate(ROUTES_URL.GET_LEAD_MANAGEMENT);
              }}
            >
              <ChevronLeft size={18} />
              <span>Leads</span>
            </button>
            <div className="py-1">
              <div
                title={
                  userHasAccessToUpdateLead
                    ? ""
                    : MESSAGE.MODULE_ACCESS.LEAD_MODULE
                        .UPDATE_LEAD_ACCESS_DENIED_message
                }
                className="text-lg font-semibold"
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
                  hasBorder={true}
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
                className="px-1 py-1 text-xs flex gap-1 items-center justify-center text-gray-500 bg-transparent border rounded  transition"
              >
                <Settings size={12} />
                <span>Settings</span>
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
          <Detail
            type="none"
            label="Created on"
            value={selectedLeadData?.createdOn}
          />
        </div>

        {/* Lead Basic Info */}
        <div className="w-full flex ">
          <div className="mx-3 flex justify-between w-full    whitespace-nowrap overflow-auto">
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
                hasBorder={true}
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
                hasBorder={true}
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
              label="Created by"
              value={selectedLeadData?.createdBy}
            />
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
              <div className="relative">

              <Detail
                label="Lead owner"
                hasBorder={true}
                type={userHasAccessToUpdateLead ? "select" : "none"}
                value={selectedLeadData?.leadOwner}
                handleClickLeadOwnerChange={handleClickLeadOwnerChange}
                />
                </div>

              <button
              title="Lead owner history"
              className="absolute right-4 text-xs flex items-center mt-1 hover:text-gray-900 text-gray-500" 
                onClick={() => {
                  setIsOpenLeadOwnerHistory(!isOpenLeadOwnerHistory);
                }}
              >
               <History size={12} className="mt-0" />
              </button>
            </div>
          </div>
          {reasonInputBoxOpenForLeadOwner && (
            <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-2 w-full max-w-md mx-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700 font-medium">
                    Reason (Optional)
                  </label>
                  <textarea
                    rows={7}
                    placeholder="Enter reason for lead owner update"
                    className="border rounded  p-1 text-sm"
                    value={reasonTextForLeadOwnerChange}
                    onChange={(e) =>
                      setReasonTextForLeadOwnerChange(e.target.value)
                    }
                  />
                  <div className="flex justify-end">
                    <button
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded self-end"
                      onClick={() => {
                        handleLeadOwnerChange();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lead Status Section */}
        <div className="m-3 mt-2 pl-1 flex  bg-slate-100 flex-col shadow-md rounded-md">
          <div className="flex justify-between text-xs  mb-1 px-2">
            <span className="font-semibold ">Lead Status</span>
            <button
              onClick={() => {
                setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
              }}
            >
              <span className="border-b flex items-center gap-1 text-gray-500 hover:text-gray-950 hover:border-b-black">
                Status history
                <History size={12} className="mt-0" />
              </span>
            </button>
          </div>
          <div className="flex border rounded-r-full mb-0.5  bg-white">
            {leadStatus!.map((item: any) => (
              <button
                title={item.name}
                key={item.id}
                className={`flex-1 text-xs text-ellipsis  overflow-hidden ${
                  selectedLeadData.leadStatus === item.name
                    ? "bg-blue-700 text-white hover:bg-blue-900"
                    : "hover:bg-blue-700 hover:text-white"
                }
              ${
                selectedStatusId === item.id &&
                "bg-sky-400 text-white hover:bg-sky-500"
              } text-gray-800 font-medium text-center`}
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 17px) 0, 100% 50%, calc(100% - 17px) 100%, 0 100%)",
                }}
                onClick={() => {
                  if (userHasAccessToUpdateLead) {
                    setReasonInputBoxOpen(true);
                    setSelectedStatusId(item.id);
                  } else {
                    // showMessageSnackbar({
                    //   message:
                    //     MESSAGE.MODULE_ACCESS.LEAD_MODULE
                    //       .UPDATE_LEAD_ACCESS_DENIED_message,
                    //   type: "error",
                    // });
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

          {reasonInputBoxOpen && (
            <div className="  flex m-1  gap-1">
              <label className="text-xs text-gray-600 font-medium">
                Reason (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter reason for status update"
                className="border rounded px-3  text-sm"
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
              />
              <button
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-0.5 rounded w-fit"
                onClick={handleSaveStatusUpdate}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Sections  */}
        <div className="w-full flex flex-col md:flex-row gap-1 p-2">
          {/* Column 1 */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
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
          <div className="w-full md:w-1/2 flex  flex-col gap-0 shadow-lg ">
            {/* Meeting / Contact / Span Tabs */}
            <div className="bg-slate-200 pl-1  flex text-xs font-semibold text-gray-800 gap-4">
              <span
                id="contact"
                className={`cursor-pointer ${
                  activeTab === "contact"
                    ? "border-b-2 border-blue-500 text-blue-600"
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
                    ? "border-b-2 border-blue-500 text-blue-600"
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
                    ? "border-b-2 border-blue-500 text-blue-600"
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
                      <h2 className="text-lg font-semibold text-gray-800">
                        Schedule a Meeting
                      </h2>
                      <p className="text-sm text-gray-600 max-w-md">
                        Plan your next discussion with ease. Use this option to
                        select a convenient time, invite participants, and share
                        meeting details — all in one place.
                      </p>
                      <p className="text-xs text-gray-500 max-w-md">
                        Once scheduled, participants will receive notifications
                        with the meeting link and reminders before it begins.
                      </p>
                      <button
                        className="bg-blue-600 hover:bg-blue-700  text-xs md:text-sm p-2 text-white rounded-md "
                        onClick={() => {
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
                      </button>
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
            {/* <div className="border p-4 bg-white shadow-sm rounded">
            <div className=" top-0 bg-slate-100 font-sans text-sm font-semibold">
              Activity
            </div>
            <div className="pl-1 space-y-1">
              {activityData.map((item: activity, index: number) => (
                <div key={index}>
                  <span className="text-sm font-semibold">
                    <ArrowBigRightDash
                      size={12}
                      className="inline-block mr-1"
                    />
                    {item.person}
                  </span>{" "}
                  <span>➡️</span> <span className="text-xs">{item.work}</span>
                </div>
              ))}
            </div>
          </div> */}
            {}
            <LeadTasksModal
              ownerId={selectedLeadData.companyUserId}
            ></LeadTasksModal>
            {/* End Activity */}
          </div>
        </div>

        {/* end  */}
        <UpdateLeadForm
          isOpen={isUpdateLeadFormOpen}
          onClose={() => {
            setIsUpdateLeadFormOpen(false);
          }}
          selectedLeadForEdit={selectedLeadData}
        />

        <LeadStatusHistory
          selectedLeadData={selectedLeadData}
          isOpen={isOpenLeadStatusHistory}
          onClose={() => {
            setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
          }}
        />
        <LeadOwnerHistory
          selectedLeadData={selectedLeadData}
          isOpen={isOpenLeadOwnerHistory}
          onClose={() => {
            setIsOpenLeadOwnerHistory(!isOpenLeadOwnerHistory);
          }}
        />

        {isLeadOwnerPopUpOpen && (
          <div className="fixed top-12 inset-0 z-30 bg-black bg-opacity-40 flex items-center justify-center p-4 ">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl max-h-[100%] overflow-y-auto relative animate-fadeIn">
              {/* Header with Close Button */}
              <div className="flex justify-between items-center p-2 border-b border-gray-200">
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
      toast.error(MESSAGE.ERROR.NO_CHANGES);
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
      <label className="text-xs text-gray-700 block  whitespace-nowrap overflow-hidden  ">
        {label}
      </label>
      {isEditing ? (
        type === "select" ? (
          <select
            className="text-sm text-gray-700 "
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
              className="text-sm text-gray-700 border border-gray-400 rounded-sm  p-0 m-0  focus:outline-none focus:ring-0 w-auto"
              value={value}
              onChange={onChange}
              onBlur={handleBlur}
              autoFocus
              maxLength={100}
              size={value ? value.length : 10}
            />
          )
        )
      ) : type === "none" ? (
        <div>
          <p
            className={`  font-medium text-sm   text-gray-800 whitespace-nowrap overflow-x-auto text-clip`}
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
                }text-gray-400 font-normal  text-xs px-1`}
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
          className={`font-medium  border border-gray-100 px-1 rounded-md text-sm text-gray-900   whitespace-nowrap overflow-x-auto text-clip  cursor-pointer`}
          onClick={handleClickLeadOwnerChange}
        >
          {value ?? (
            <span className="text-gray-400 font-normal text-xs">
              Add here...
            </span>
          )}
        </div>
      ) : (
        <div
          title={value ?? "Enter value "}
          className={`font-medium ${
            label === "Name"
              ? "text-sm text-black border-gray-200 "
              : "text-sm md:whitespace-nowrap md:overflow-hidden text-gray-900"
          }   whitespace-nowrap overflow-hidden ${
            hasBorder ? "border rounded-md px-1 border-gray-100 " : ""
          }   cursor-pointer`}
          onClick={handleClick}
        >
          {value ? (
            value
          ) : (
            <>
              <span className="text-gray-400 font-normal text-xs italic">
                Add here...
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
