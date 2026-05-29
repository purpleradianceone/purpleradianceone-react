/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleUser,
  Crown,
  Edit3,
  Handshake,
  History,
  Mail,
  Network,
  Pen,
  Phone,
  Plus,
  Save,
  Settings,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import UpdateLeadForm from "./UpdateLeadForm";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import PostDataTypeForLeadSourceAndStatusAndStates from "../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import LeadStatusHistory from "./LeadStatusHistory";
import LeadDetails from "./LeadDetails";
import LeadDetailsData from "../../../@types/lead-management/LeadDetailsData";
import PostDataLeadUpdate from "../../../@types/lead-management/PostDataLeadUpdate";
import RefreshToken from "../../../config/validations/RefreshToken";
import qs from "query-string";
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
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Button from "../../ui/Button";
import StatusUpdateModal from "./lead-status/StatusUpdateModal";
import ConvertLeadModal from "./lead-status/ConvertLeadModal";

import { PageLayout } from "../../ui/PageLayout";
import axiosClient from "../../../axios-client/AxiosClient";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";
import LeadDataProps from "../../../@types/lead-management/LeadProps";
import { handleApiError } from "../../../config/error/handleApiError";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import FormLayout from "../../ui/FormLayout";
import { LeadNotes } from "./lead-notes/LeadNotes";
import { ModuleGuard } from "../../../config/guard/ModuleGuard";
import { Popover } from "../../ui/PopOver";
import LeadQuotationDetails from "./LeadQuotationDetails";
import TextAreaInput from "../../ui/TextAreaInput";
import { LeadWhatsappConversation } from "./lead-whatsapp-conversation/LeadWhatsappConversation";
import COLORS from "../../../constants/Colors";
import CustomDropdown from "./CustomDropdown";

const ViewLeadManagement = () => {
  const navigate = useNavigate();
  const {
    userHasAccessToUpdateLead,
    userHasAccessToViewLead,
    userHasAccessToViewLeadSettings,
    userHasAccessToViewLeadContacts,
    userHasAccessToViewLeadProduct,
    userHasAccessToUpdateLeadDetails,
    userHasAccessToViewLeadDetails,
  } = useUserAccessModules();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const { loginStatus } = useLoggedInUserContext();
  const [isUpdateLeadFormOpen, setIsUpdateLeadFormOpen] =
    useState<boolean>(false);
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
  const [selectedLeadData, setSelectedLeadData] = useState<LeadDataProps>(
    JSON.parse(searchParams.get("leadData") || "{}"),
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
  // const [isOpenMeetingsModal, setIsOpenMeetingsModal] =
  //   useState<boolean>(false);
  // const [isOpenProductCard, setIsOpenProductCard] = useState<boolean>(true);
  // const [isOpenLeadTeamsCard, setIsOpenLeadTeamsCard] =
  //   useState<boolean>(false);

  const [openedPopoverStatusId, setOpenedPopoverStatusId] = useState<
    number | null
  >(null);

  const [showAllContacts, setShowAllContacts] = useState(false);

  const visibleContacts = showAllContacts
    ? leadContact
    : leadContact.slice(0, 2);

  const fetchLeadStatus = async () => {
    try {
      const postDataForLeadStatusData = {
        id: null,
        name: null,
        description: null,
        isactive: true,
      };
      const response = await axiosClient.post(
        POST_API.GET_LEAD_STATUS,
        postDataForLeadStatusData,
        { withCredentials: true },
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

  const [isLeadStatusSaving, setIsLeadStatusSaving] = useState<boolean>(false);
  const handleSaveStatusUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedLeadData || selectedStatusId === null) return;
    if (isLeadStatusSaving) return;

    const postDataForLeadStatusUpdate = {
      company_id: loginStatus.companyId,
      id: selectedLeadData.id,
      lead_status_id: selectedStatusId,
      reason: reasonText,
      updatedby: loginStatus.id,
    };

    try {
      setIsLeadStatusSaving(true);
      const response = await axiosClient.post(
        POST_API.UPDATE_LEAD_STATUS,
        postDataForLeadStatusUpdate,
        { withCredentials: true },
      );
      if (response?.status == STATUS_CODE.OK) {
        if (response.data.status) {
          const updatedStatusName = leadStatus?.find(
            (item) => item.id === selectedStatusId,
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
            leadStatusId: selectedStatusId,
          }));
          setSelectedStatusId(selectedStatusId);
          setReasonInputBoxOpen(false);
          setReasonText("");

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
          handleSaveStatusUpdate(event);
        }
      }
    } finally {
      setIsLeadStatusSaving(false);
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

  previouseOwnerRef.current = selectedLeadData.companyUserId;

  const [showSpinnerForSavingLeadOwner, setShowSpinnerForSavingLeadOwner] =
    useState<boolean>(false);
  const handleLeadOwnerChange = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (selectedCompanyUser.id === null || selectedCompanyUser.id === 0) {
      setReasonInputBoxOpenForLeadOwner(false);
      toast.error("Select new lead owner before procedding.");
      return;
    }
    setShowSpinnerForSavingLeadOwner(true);

    const PostDataLeadOwnerChange = {
      company_id: loginStatus.companyId,
      id: selectedLeadData.id,
      ownerid: selectedCompanyUser.id,
      reason: reasonTextForLeadOwnerChange,
      updatedby: loginStatus.id,
    };
    try {
      const response = await axiosClient.post(
        POST_API.UPDATE_LEAD_OWNER,
        PostDataLeadOwnerChange,
        { withCredentials: true },
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
          setSelectedLeadData((prev: any) => ({
            ...prev,
            leadOwner: selectedCompanyUser.fullname,
            companyUserId: selectedCompanyUser.id,
          }));
          setShowSpinnerForSavingLeadOwner(false);
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      // selected company user should become null after this function runs
      setReasonInputBoxOpenForLeadOwner(false);
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
      setRefreshKeyForLeadOwnerChange((prev) => prev + 1);
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
      const response = await axiosClient.post(
        POST_API.GET_LEAD_DETAILS,
        PostData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

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
    editLeadDetailsData: LeadDetailsData,
  ) => {
    setLeadDetailsData(editLeadDetailsData);
  };

  // API call to get lead interest data
  async function getLeadInterestData() {
    try {
      const response = await axiosClient.get(POST_API.GET_LEAD_INTEREST_TYPE, {
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
      const response = await axiosClient.get(
        POST_API.GET_LEAD_ASSIGED_PRODUCT,
        {
          params: {
            companyId: loginStatus.companyId,
            leadId: selectedLeadData.id,
            companyProductId: null,
            leadInterestId: null,
            requestedBy: loginStatus.id,
          },
          withCredentials: true,
        },
      );

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
          }),
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
    updatedProduct: LeadAssignedCompanyProduct,
  ) => {
    setLeadAssignedCompanyProduct((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...product,
              isActive: !product.isActive,
            }
          : product,
      ),
    );
  };
  const handleLeadProductUpdate = (
    updatedProduct: LeadAssignedCompanyProduct,
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
          : product,
      ),
    );
  };

  // get lead contact
  const fetchLeadContact = async () => {
    const postDataGetLeadContact = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      requestedby: loginStatus.id,
    };
    await axiosClient
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
          }),
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
      // getLeadDetails();
      // fetchLeadContact();
      // getLeadInterestData();
      // fetchLeadCompanyProduct();
    };
    apisCalls();
  }, []);

  useEffect(() => {
    if (userHasAccessToViewLeadDetails) {
      getLeadDetails();
    }
  }, [userHasAccessToViewLeadDetails]);

  useEffect(() => {
    if (userHasAccessToViewLeadContacts) {
      fetchLeadContact();
    }
  }, [userHasAccessToViewLeadContacts]);

  useEffect(() => {
    if (userHasAccessToViewLeadProduct) {
      getLeadInterestData();
      fetchLeadCompanyProduct();
    }
  }, [userHasAccessToViewLeadProduct]);

  const [showSaveLeadButton, setShowSaveLeadButton] = useState<boolean>(false);

  const [isEditingLeadInfo, setIsEditingLeadInfo] = useState<boolean>(false);

  const [originalLeadInfo, setOriginalLeadInfo] =
    useState<LeadDataProps>(selectedLeadData);

  const handleCancelLeadInfoEdit = () => {
    setSelectedLeadData(originalLeadInfo);
    setShowSaveLeadButton(false);
    setIsEditingLeadInfo(false);
  };

  const handleLeadInfoSave = async () => {
    const trimmedName = selectedLeadData.name?.trim() ?? "";

    // case 1: only spaces → not allowed
    if (selectedLeadData.name !== "" && trimmedName === "") {
      setSelectedLeadData((prev: any) => ({
        ...prev,
        name: null,
      }));
    }

    if (selectedLeadData.email !== "" && selectedLeadData.email !== null) {
      const isValid = selectedLeadData.email?.trim().match(VALIDATIONS.EMAIL);
      if (!isValid) {
        toast.error(MESSAGE.ERROR.EMAIL_NOT_VALID_ERROR);
        return;
      }
    }

    if (
      selectedLeadData.mobileNumber !== "" &&
      selectedLeadData.mobileNumber !== null
    ) {
      const isValid = VALIDATIONS.MOBILE_NUMBER_REGEX.test(
        selectedLeadData.mobileNumber || "",
      );

      if (!isValid) {
        toast.error("Enter a valid 10-digit mobile number");
        return;
      }
    }

    const PostDataForLeadUpdate: PostDataLeadUpdate = {
      company_id: loginStatus.companyId,
      id: selectedLeadData.id, //NOTE : LEAD ID FOR EDIT
      name: selectedLeadData.name,
      email: selectedLeadData.email,
      mobilenumber: selectedLeadData.mobileNumber,
      updatedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.UPDATE_LEAD,
        PostDataForLeadUpdate,
        { withCredentials: true },
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

        setShowSaveLeadButton(false);
        setIsEditingLeadInfo(false);

        setOriginalLeadInfo(selectedLeadData);
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
          setOriginalLeadInfo(selectedLeadData);
          setIsEditingLeadInfo(false);
        }
      } else if (error.status === 400) {
        toast.error(error.response.data);
      }
    }
    // finally{
    //   handleLeadInfoSave()
    // }
  };
  type ActiveCard =
    | "meeting"
    | "contact"
    | "LeadTeams"
    | "leadUsers"
    | "LeadNotes"
    | "conversation";
  const [activeTab, setActiveTab] = useState<ActiveCard>("contact");

  const handleClickCards = (event: React.MouseEvent<HTMLElement>) => {
    const id = event.currentTarget.id as ActiveCard;
    setActiveTab(id);
  };

  // New Code
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isLeadSettingModalOpen, setIsLeadSettingModalOpen] =
    useState<boolean>(false);

  const [refreshkeyForLeadOwnerChange, setRefreshKeyForLeadOwnerChange] =
    useState<number>(0);
  // Note : Clears the states when user clicks on lead owner change button
  function handleLeadOwnerChangeStateClear() {
    setReasonTextForLeadOwnerChange("");
    setReasonInputBoxOpenForLeadOwner(!reasonInputBoxOpenForLeadOwner);
    // setPersistedSelectedUserId(selectedLeadData.companyUserId);
    // window.location.reload();
    setRefreshKeyForLeadOwnerChange((prev) => prev + 1);
  }

  function handleLeadOwnerSelected(user: CompanyUser | null) {
    if (!user || user.id == 0) return null;

    if (user.id == selectedLeadData.companyUserId) {
      toast.error("Select another user.");
      return;
    }
    setSelectedCompanyUser(user);
    setReasonInputBoxOpenForLeadOwner(true);
  }

  const handleStatusSelection = (statusId: number) => {
    if (!userHasAccessToUpdateLeadDetails) {
      toast.error(
        MESSAGE.MODULE_ACCESS.LEAD_MODULE.UPDATE_LEAD_ACCESS_DENIED_message,
      );
      return;
    }

    // prevent same status update
    if (Number(selectedLeadData.leadStatusId) === statusId) {
      return;
    }

    setSelectedStatusId(statusId);
    setReasonInputBoxOpen(true);
  };

  const [showName, setShowName] = useState<boolean>(false);
  return (
    <PageLayout onScrollChange={setShowName} scrollTopValue={70}>
      {/* header navigation bar */}
      <div className="sticky top-0 z-20 bg-white py-0.5 border-b">
        <div className=" flex items-center justify-between  gap-3    ">
          <div className="flex gap-3 items-center">
            <Link to={ROUTES_URL.GET_LEAD_MANAGEMENT}>
              <Button
                type="button"
                className="flex caption-custom ml-1 items-center justify-center hover:text-gray-800"
              >
                <span>Leads</span>
              </Button>
            </Link>
            <ChevronRight size={16} />
            <h1 className="table-header-custom">Lead Details</h1>

            {/*  Appears only on scroll */}
            {showName && (
              <>
                {/* <ChevronRight size={16} /> */}
                <span
                  className={`
            ml-2 max-w-[240px] truncate text-sm text-gray-500
          transition-all duration-200 ease-out
          will-change-transform will-change-opacity ${
            showName
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-1 pointer-events-none"
          } `}
                >
                  (
                  {selectedLeadData.name ||
                    selectedLeadData.email ||
                    selectedLeadData.mobileNumber}
                  )
                </span>
              </>
            )}
          </div>
          {/**Add Setting in lead details page here  */}
          <div className=" flex items-center min-w-20 justify-end mr-2  ">
            {/* new code  */}
            <div className="relative inline-block">
              <Popover
                accessRight={userHasAccessToViewLeadSettings}
                align="right"
                width={400}
                trigger={
                  <button
                    type="button"
                    onClick={() => {
                      if (userHasAccessToViewLeadSettings) {
                        setIsLeadSettingModalOpen(true);
                      } else {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.LEAD_MODULE
                            .UPDATE_LEAD_ACCESS_DENIED_message,
                        );
                      }
                    }}
                    className={`px-1 py-0.5 caption-custom flex gap-1 items-center justify-center
    border rounded transition
    ${
      userHasAccessToViewLeadSettings
        ? "bg-white hover:bg-slate-400 hover:text-white text-gray-500 cursor-pointer"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }
  `}
                  >
                    <Settings size={12} />
                    <span>Lead setting</span>
                  </button>
                }
              >
                {(onClose) => (
                  <LeadSettingForLead
                    isOpen={isLeadSettingModalOpen}
                    onClose={() => {
                      setIsLeadSettingModalOpen(false);
                      onClose();
                    }}
                    lead={selectedLeadData}
                  />
                )}
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header hidden */}
        <div className="hidden   bg-slate-100 mx-2 p-0.5 rounded  items-center justify-between     ">
          <div className="flex w-[30%] gap-6">
            <button
              type="button"
              className="flex items-center gap-1 caption-custom justify-center hover:text-blue-600 "
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeft size={14} />
              <span>back</span>
            </button>
          </div>

          {/**Add Setting in lead details page here  */}
          <div className=" flex items-center min-w-20 justify-end mr-2  w-full">
            {/* new code  */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => {
                  if (userHasAccessToUpdateLead) {
                    setIsLeadSettingModalOpen(true);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.LEAD_MODULE
                        .UPDATE_LEAD_ACCESS_DENIED_message,
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
                type="button"
                disabled={!userHasAccessToViewLead}
                onClick={() => {
                  if (userHasAccessToUpdateLead) {
                    setIsAddProductModalOpen(true);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.LEAD_MODULE
                        .UPDATE_LEAD_ACCESS_DENIED_message,
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
              type="button"
              className="hidden  text-xs rounded border px-3 my-1 text-gray-500"
              onClick={() => {
                setIsUpdateLeadFormOpen(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="flex items-start justify-start gap-16 py-2 px-1">
          {/* LEFT SECTION */}
          <div className="flex items-start gap-3 min-w-0">
            {/* ICON */}
            <div className="bg-blue-600 p-2 rounded text-white mt-1">
              <Handshake size={30} />
            </div>

            {/* NAME + STATUS */}
            <div className="flex flex-col leading-none min-w-0">
              {/* LEAD NAME */}
              <div className="flex items-center pb-0.5 min-w-0">
                <span
                  title={selectedLeadData.name || ""}
                  className={`
      text-slate-800 min-w-0 truncate

      ${
        selectedLeadData.name
          ? "table-header-custom !text-[17px]"
          : "caption-custom italic text-slate-500"
      }
    `}
                >
                  {selectedLeadData.name || "Add here..."}
                </span>
              </div>
              <span
                className={`caption-custom !text-[11px]
    truncate
    ${leadDetailsData.job_title ? "" : "italic text-slate-500"}
  `}
                title={leadDetailsData.job_title || ""}
              >
                {leadDetailsData.job_title}
              </span>

              {/* STATUS DROPDOWN */}
              <div className="w-[130px] min-w-0 flex pt-1 items-center">
                <div className="w-full min-w-0">
                  <CustomDropdown
                    labelName="status"
                    options={leadStatus || []}
                    selectedValue={
                      selectedLeadData.leadStatusId
                        ? Number(selectedLeadData.leadStatusId)
                        : 0
                    }
                    readOnly={!userHasAccessToUpdateLeadDetails}
                    paddingy={0}
                    height="h-6"
                    onSelect={(value) => {
                      if (value === null || value === undefined) return;

                      const statusId = Number(value);

                      if (Number(selectedLeadData.leadStatusId) === statusId)
                        return;

                      handleStatusSelection(statusId);
                      setOpenedPopoverStatusId(statusId);
                    }}
                  />
                </div>

                {/* POPUP MODALS */}
                <Popover
                  width={350}
                  open={openedPopoverStatusId !== null}
                  onClose={() => {
                    setOpenedPopoverStatusId(null);
                    setSelectedStatusId(null);
                    setReasonInputBoxOpen(false);
                    setReasonText("");
                  }}
                  trigger={<div />}
                >
                  {(onClose) => (
                    <>
                      {reasonInputBoxOpen &&
                        selectedStatusId !== null &&
                        selectedStatusId !== 9 && (
                          <StatusUpdateModal
                            isLeadStatusSaving={isLeadStatusSaving}
                            handleCancel={() => {
                              setReasonInputBoxOpen(false);
                              setOpenedPopoverStatusId(null);
                              setSelectedStatusId(null);
                              setReasonText("");
                              onClose();
                            }}
                            handleSaveStatusUpdate={async (event) => {
                              event.preventDefault();
                              await handleSaveStatusUpdate(event);
                              setOpenedPopoverStatusId(null);
                              onClose();
                            }}
                            onReasonChange={(e) =>
                              setReasonText(e.target.value)
                            }
                            reasonText={reasonText}
                          />
                        )}

                      {reasonInputBoxOpen && selectedStatusId === 9 && (
                        <ConvertLeadModal
                          isLeadStatusSaving={isLeadStatusSaving}
                          isOpen={reasonInputBoxOpen}
                          onClose={() => {
                            setReasonInputBoxOpen(false);
                            setOpenedPopoverStatusId(null);
                            setSelectedStatusId(null);
                            setReasonText("");
                            onClose();
                          }}
                          leadData={selectedLeadData}
                          handleLeadConversion={(event) => {
                            event.preventDefault();
                            handleSaveStatusUpdate(event);

                            setOpenedPopoverStatusId(null);
                            onClose();
                          }}
                          onReasonChange={(e) => setReasonText(e.target.value)}
                          reasonText={reasonText}
                          handleLeadMappedToAccount={() => {
                            const parsedQuery = JSON.parse(
                              searchParams.get("leadData") || "{}",
                            );

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
                            setOpenedPopoverStatusId(null);
                            setReasonText("");
                            setSelectedStatusId(null);

                            const newPath = `${window.location.pathname}?${newQueryString}`;
                            navigate(newPath, { replace: true });
                          }}
                        />
                      )}
                    </>
                  )}
                </Popover>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="grid grid-cols-3 gap-x-10 shrink-0 mt-1 ml-2">
            {/* Owner */}
            <div className="flex flex-col gap-1 min-w-[100px]">
              <div className="flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-pink-500 ml-5 shrink-0" />
                <span className="font-medium caption-custom">Owner:</span>
              </div>

              <span className="caption-custom-black pl-6">
                {selectedLeadData.leadOwner}
              </span>
            </div>

            {/* Source */}
            <div className="flex flex-col gap-1 min-w-[100px]">
              <div className="flex items-center gap-1">
                <Network className="h-3.5 w-3.5 text-orange-500 ml-5 shrink-0" />
                <span className="font-medium caption-custom">Source:</span>
              </div>

              <span className="caption-custom-black pl-6">
                {selectedLeadData.leadSource}
              </span>
            </div>

            {/* Created On */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-yellow-500 ml-5 shrink-0" />
                <span className="font-medium caption-custom">Created On:</span>
              </div>

              <span className="caption-custom-black pl-6">
                {selectedLeadData.createdOn}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Status Section */}
        <div className="w-[99.5%] bg-white border rounded-md  px-1 mx-1 pt-3 pb-1 mb-2  ">
          <div className="flex items-center overflow-x-auto min-w-max">
            {leadStatus!.map((item: any, index: number) => {
              const currentIndex = leadStatus!.findIndex(
                (s: any) => s.name === selectedLeadData.leadStatus,
              );

              const isCompleted = index < currentIndex;
              const isActive = selectedLeadData.leadStatus === item.name;

              return (
                <React.Fragment key={item.id}>
                  {/* STATUS ITEM */}
                  <Popover
                    width={500}
                    onClose={() => {
                      setSelectedStatusId(null);
                    }}
                    trigger={
                      <button
                        type="button"
                        title={item.name}
                        onClick={() => {
                          handleStatusSelection(item.id);
                        }}
                        className="flex flex-col items-center relative z-10 min-w-[110px]"
                      >
                        {/* TOP SECTION */}

                        <div
                          className={`
                              flex items-center gap-1 px-1 py-1 rounded-lg transition-all duration-300

                              ${isActive ? "bg-blue-50" : ""}
                            `}
                        >
                          {/* ICON */}
                          <div
                            className={`
                                w-4 h-4 rounded-full flex items-center justify-center
                                transition-all duration-300

                                ${
                                  isCompleted
                                    ? "bg-green-500 text-white"
                                    : isActive
                                      ? "bg-blue-500 text-white"
                                      : "bg-slate-100 text-slate-400 border"
                                }
                              `}
                          >
                            <CheckCircle2 size={12} />
                          </div>

                          {/* TEXT */}
                          <span
                            className={`
                                text-xs font-medium whitespace-nowrap

                                ${
                                  isActive
                                    ? "text-blue-600"
                                    : isCompleted
                                      ? "text-slate-700"
                                      : "text-slate-500"
                                }
                              `}
                          >
                            {item.name}
                          </span>
                        </div>

                        {/* BOTTOM PROGRESS */}
                        <div className="mt-0.5 flex items-center ml-1 w-full">
                          {/* DOT */}
                          <div
                            className={`
                                      w-1.5 h-1.5 rounded-full z-10 transition-all duration-300

                                      ${
                                        isCompleted
                                          ? "bg-green-500"
                                          : isActive
                                            ? "bg-blue-600"
                                            : "bg-slate-300"
                                      }
                                    `}
                          />

                          {/* LINE */}
                          {index !== leadStatus!.length && (
                            <div
                              className={`
                               h-[2px] flex-1 transition-all  duration-300

                              ${
                                index < currentIndex
                                  ? "bg-green-500"
                                  : index === currentIndex
                                    ? "bg-blue-600"
                                    : "bg-slate-200"
                              }
                            `}
                            />
                          )}
                        </div>
                      </button>
                    }
                  >
                    {(onClose) => (
                      <>
                        {reasonInputBoxOpen &&
                          item.id !== 9 &&
                          selectedStatusId !== 9 && (
                            <StatusUpdateModal
                              isLeadStatusSaving={isLeadStatusSaving}
                              handleCancel={() => {
                                setReasonInputBoxOpen(!reasonInputBoxOpen);
                                setSelectedStatusId(null);
                                setReasonText("");
                                onClose();
                              }}
                              handleSaveStatusUpdate={async (
                                event: React.FormEvent<HTMLFormElement>,
                              ) => {
                                event.preventDefault();
                                await handleSaveStatusUpdate(event);
                                onClose();
                              }}
                              onReasonChange={(
                                e:
                                  | React.ChangeEvent<HTMLInputElement>
                                  | React.ChangeEvent<HTMLTextAreaElement>,
                              ) => setReasonText(e.target.value)}
                              reasonText={reasonText}
                            />
                          )}

                        {reasonInputBoxOpen && selectedStatusId === 9 && (
                          <ConvertLeadModal
                            isLeadStatusSaving={isLeadStatusSaving}
                            isOpen={reasonInputBoxOpen}
                            onClose={() => {
                              setReasonInputBoxOpen(!reasonInputBoxOpen);
                              setSelectedStatusId(null);
                              setReasonText("");
                              onClose();
                            }}
                            leadData={selectedLeadData}
                            handleLeadConversion={(
                              event: React.FormEvent<HTMLFormElement>,
                            ) => {
                              event.preventDefault();
                              handleSaveStatusUpdate(event);
                              onClose();
                            }}
                            onReasonChange={(e) =>
                              setReasonText(e.target.value)
                            }
                            reasonText={reasonText}
                            handleLeadMappedToAccount={() => {
                              const parsedQuery = JSON.parse(
                                searchParams.get("leadData") || "{}",
                              );

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
                      </>
                    )}
                  </Popover>
                </React.Fragment>
              );
            })}

            {/* HISTORY BUTTON */}
            <div className="ml-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
                }}
                className="
                  flex items-center gap-1
                  text-xs text-slate-500
                  hover:text-blue-600
                  transition-all border rounded-md p-0.5
                "
              >
                <History size={13} />
                History
              </button>
            </div>
          </div>
        </div>
        {/* Sections  */}
        <div className="w-full  flex flex-col md:flex-row gap-1 mt-1">
          {/* Column 1 */}
          <div className="w-full md:w-1/2 flex flex-col gap-2 p-1">
            {/* Lead Basic Info */}
            <div className=" flex   border rounded-lg shadow-md ">
              <div className="w-full grid grid-cols-3 gap-x-6 gap-y-4 pb-2">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b col-span-3 py-1 px-2">
                  <span className="table-header-custom">Lead Information</span>

                  <div className="flex items-center gap-2">
                    {!isEditingLeadInfo && userHasAccessToUpdateLead && (
                      <button
                        type="button"
                        onClick={() => {
                          setOriginalLeadInfo(selectedLeadData);
                          setIsEditingLeadInfo(true);
                          setShowSaveLeadButton(true);
                        }}
                        className="flex items-center gap-1 border rounded-md px-2 py-0.5 caption-custom  hover:bg-gray-100 transition-colors"
                      >
                        <Pen className="w-2.5 h-2.5" />
                        Edit
                      </button>
                    )}

                    {showSaveLeadButton && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={handleLeadInfoSave}
                          className={`${COLORS.ADD_BUTTON} flex items-center justify-center gap-1`}
                        >
                          <Save size={12} />
                          Save
                        </Button>

                        <button
                          type="button"
                          onClick={handleCancelLeadInfoEdit}
                          className="flex items-center gap-1 border rounded-md px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* NAME - FULL WIDTH */}
                <div className="col-span-3 flex items-start gap-2 pl-1">
                  {/* ICON */}
                  <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                    <Handshake className="h-4 w-4 text-blue-600" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col min-w-0">
                    <label className="caption-custom text-slate-500">
                      Name
                    </label>

                    <div className="flex items-center gap-1 min-w-0">
                      <input
                        disabled={!userHasAccessToUpdateLead}
                        title={selectedLeadData.name || ""}
                        name="name"
                        type="text"
                        placeholder="Add here..."
                        className={`
            border-none bg-transparent p-0 m-0
            outline-none focus:ring-0
            text-slate-800 min-w-0

            ${
              selectedLeadData.name
                ? "input-label-custom !font-semibold"
                : "caption-custom italic"
            }

            placeholder:caption-custom
            placeholder:text-slate-500
            placeholder:italic
          `}
                        value={selectedLeadData.name || ""}
                        style={{
                          width: `${Math.min(
                            selectedLeadData.name?.length || 10,
                            35,
                          )}ch`,
                        }}
                        onChange={(e) => {
                          setShowSaveLeadButton(true);

                          setSelectedLeadData({
                            ...selectedLeadData,
                            name: e.target.value,
                          });
                        }}
                        maxLength={60}
                        size={
                          selectedLeadData.name
                            ? selectedLeadData.name.length
                            : 10
                        }
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            await handleLeadInfoSave();
                            e.currentTarget.blur();
                          }
                        }}
                      />

                      {isEditingLeadInfo && (
                        <Edit3 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex items-start gap-2 min-w-0 pl-1">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-blue-500" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <label className="caption-custom text-slate-500">
                      Email
                    </label>

                    <div className="flex items-center min-w-0">
                      <input
                        disabled={!userHasAccessToUpdateLead}
                        title={selectedLeadData.email || ""}
                        name="email"
                        type="text"
                        placeholder="Add here..."
                        className={`
            border-none bg-transparent p-0 m-0
            outline-none focus:ring-0
            text-slate-800 min-w-0

            ${
              selectedLeadData.email
                ? "input-label-custom"
                : "caption-custom italic"
            }

            placeholder:caption-custom
            placeholder:text-slate-500
            placeholder:italic
          `}
                        value={selectedLeadData.email || ""}
                        style={{
                          width: `${Math.min(
                            selectedLeadData.email?.length || 28,
                            24,
                          )}ch`,
                        }}
                        onChange={(e) => {
                          setShowSaveLeadButton(true);

                          setSelectedLeadData({
                            ...selectedLeadData,
                            email: e.target.value,
                          });
                        }}
                      />

                      {isEditingLeadInfo && (
                        <Edit3 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                {/* MOBILE */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-green-500" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <label className="caption-custom text-slate-500">
                      Mobile Number
                    </label>

                    <div className="flex items-center min-w-0">
                      <input
                        disabled={!userHasAccessToUpdateLead}
                        title={selectedLeadData.mobileNumber || ""}
                        name="mobileNumber"
                        type="text"
                        placeholder="Add here..."
                        className={`
            border-none bg-transparent p-0 m-0
            outline-none focus:ring-0
            text-slate-800 min-w-0

            ${
              selectedLeadData.mobileNumber
                ? "input-label-custom"
                : "caption-custom italic"
            }

            placeholder:caption-custom
            placeholder:text-slate-500
            placeholder:italic
          `}
                        value={selectedLeadData.mobileNumber || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");

                          if (value.length <= 10) {
                            setShowSaveLeadButton(true);

                            setSelectedLeadData({
                              ...selectedLeadData,
                              mobileNumber: value,
                            });
                          }
                        }}
                      />

                      {isEditingLeadInfo && (
                        <Edit3 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                {/* LEAD OWNER */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                    <Crown className="h-4 w-4 text-pink-500" />
                  </div>

                  <div className="flex relative">
                    <CompanyUserSearchFieldInput
                      key={refreshkeyForLeadOwnerChange}
                      label="Lead Owner"
                      labelClassname="caption-custom"
                      onUserSelected={handleLeadOwnerSelected}
                      defaultValue={selectedLeadData?.leadOwner}
                      disabled={!isEditingLeadInfo}
                      has={{
                        border: false,
                        penLogo: isEditingLeadInfo,
                        xLogo: false,
                        searchLogo: false,
                      }}
                    />

                    <button
                      type="button"
                      title="Lead owner history"
                      className="absolute left-24 caption-custom flex items-center mt-1 hover:text-blue-700"
                      onClick={() => {
                        setIsOpenLeadOwnerHistory(!isOpenLeadOwnerHistory);
                      }}
                    >
                      <History size={12} />
                    </button>
                  </div>
                </div>

                {/* LEAD SOURCE */}
                <div className="flex items-start gap-2 min-w-0 pl-1">
                  <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Network className="h-4 w-4 text-orange-500" />
                  </div>

                  <Detail
                    type="none"
                    label="Lead Source"
                    value={selectedLeadData?.leadSource}
                  />
                </div>

                {/* CREATED ON */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-yellow-500" />
                  </div>

                  <Detail
                    type="none"
                    label="Created On"
                    value={selectedLeadData?.createdOn}
                  />
                </div>

                {/* CREATED BY */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                    <CircleUser className="h-4 w-4 text-cyan-500" />
                  </div>

                  <Detail
                    type="none"
                    label="Created By"
                    value={selectedLeadData?.createdBy}
                  />
                </div>
              </div>
              {reasonInputBoxOpenForLeadOwner && (
                <FormLayout width={2} padding={2}>
                  <form onSubmit={handleLeadOwnerChange}>
                    <div className="flex flex-col gap-1">
                      <TextAreaInput
                        cols={2}
                        label="Reason (Optional)"
                        autoFocus={true}
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
                          <Button type="submit">
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
                  </form>
                </FormLayout>
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
            <div className=" shadow-md  rounded">
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
          <div className="w-full md:w-1/2 flex  bg-pink-00 flex-col gap-0 ">
            {/* Meeting / Contact / Span Tabs */}
            <div
              className={`
                      transition-all duration-300
                      overflow-hidden
                      border border-slate-200
                      rounded-lg
                      bg-white
                      shadow-md
                      my-1
                      h-[260px]
                  
                      ${showAllContacts ? "max-h-[400px]" : "h-[260px]"}
                    `}
            >
              <div className="pl-1 py-1.5 border-b flex justify-between items-center">
                <div className="flex gap-4 caption-custom">
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

                  <span
                    id="LeadNotes"
                    className={`cursor-pointer ${
                      activeTab === "LeadNotes"
                        ? "border-b-2 border-blue-500 caption-custom-blue"
                        : "hover:text-blue-500"
                    }`}
                    onClick={handleClickCards}
                  >
                    Notes
                  </span>

                  {selectedLeadData?.leadSourceId === 2 && (
                    <span
                      id="conversation"
                      className={`cursor-pointer ${
                        activeTab === "conversation"
                          ? "border-b-2 border-blue-500 caption-custom-blue"
                          : "hover:text-blue-500"
                      }`}
                      onClick={handleClickCards}
                    >
                      Conversation
                    </span>
                  )}
                </div>

                {/* RIGHT SIDE: ADD BUTTON */}
                {/* {activeTab === "contact" && (
    <Button
      className={COLORS.ADD_BUTTON}
      onClick={() => setOpenLeadContactModal(true)}
    >
      + Add Contact
    </Button>
  )} */}
              </div>
              <div className="flex flex-col h-full bg-red-00 gap-2">
                <div
                  className="
                      flex flex-col gap-2 h-full overflow-y-auto
                      [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-track]:bg-gray-50
                      [&::-webkit-scrollbar-thumb]:bg-gray-200
                      [&::-webkit-scrollbar-thumb]:rounded-full
                    "
                >
                  {activeTab === "meeting" && (
                    <div className="flex  items-center justify-center   min-h-72">
                      <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 border rounded-xl bg-gray-50 shadow-sm">
                        <h2 className="table-header-custom">
                          Schedule a Meeting
                        </h2>
                        <p className="input-label-custom">
                          Plan your next discussion with ease. Use this option
                          to select a convenient time, invite participants, and
                          share meeting details — all in one place.
                        </p>
                        <p className="input-label-custom max-w-md">
                          Once scheduled, participants will receive
                          notifications with the meeting link and reminders
                          before it begins.
                        </p>
                        <div>
                          <Button
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              const leadDataSearchParams = JSON.parse(
                                searchParams.get("leadData") || "{}",
                              );
                              sessionStorage.setItem(
                                "leadData",
                                JSON.stringify(leadDataSearchParams!),
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

                  {activeTab === "contact" && (
                    <div className="h-[220px] overflow-y-auto ">
                      {
                        <LeadContact
                          selectedLeadData={selectedLeadData}
                          leadContact={visibleContacts}
                          fetchLeadContact={fetchLeadContact}
                        />
                      }

                      {leadContact.length > 2 && (
                        <div
                          className="sticky bottom-0 
                          bg-white
                          px-2 
                          z-10"
                        >
                          <button
                            type="button"
                            onClick={() => setShowAllContacts(!showAllContacts)}
                            className="
                                  hover:text-blue-700 hover:underline focus:outline-none caption-custom-blue 
                                  
                                "
                          >
                            {showAllContacts
                              ? "Show Less"
                              : `View All Contacts (${leadContact.length})`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "LeadTeams" && (
                    <LeadAssignedTeams
                      selectedLeadData={selectedLeadData}
                      // isOpen={isOpenLeadTeamsCard}
                    />
                  )}

                  {activeTab === "LeadNotes" && (
                    <ModuleGuard permissionKey="userHasAccessToViewLeadNote">
                      <LeadNotes selectedLeadData={selectedLeadData} />
                    </ModuleGuard>
                  )}

                  {activeTab === "conversation" && (
                    <ModuleGuard permissionKey="userHasAccessToViewLeadWhatsAppConversation">
                      <LeadWhatsappConversation
                        selectedLeadData={selectedLeadData}
                      />
                    </ModuleGuard>
                  )}
                </div>
              </div>
            </div>
            {/* Activity */}
            <div className=" shadow-md ">
              <LeadTasksModal
                ownerId={selectedLeadData.companyUserId}
              ></LeadTasksModal>
            </div>
            {/* End Activity */}
          </div>
        </div>
        {
          <div className="w-full mt-2">
            <LeadQuotationDetails lead={selectedLeadData} />
          </div>
        }
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
        {/* Note : this loading pop up will be shown when we change the lead owner */}
        {showSpinnerForSavingLeadOwner && (
          <LoadingPopUpAnimation show={showSpinnerForSavingLeadOwner} />
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
      {/* </div> */}
    </PageLayout>
  );
};
export default ViewLeadManagement;

type DetailProps = {
  label: string;
  value: string;
  type?: "text" | "number" | "select" | "none";
  options?: string[]; //only used if type is 'select'
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
  const isSubmittingRef = useRef(false);
  const handleClick = () => {
    prevValueRef.current = value;
    setIsEditing(true);
  };

  // const handleBlur = () => {
  //   setIsEditing(false);

  //   const trimmedValue = value.trim();
  //   // Step 1: Check if value changed
  //   if (trimmedValue === prevValueRef.current) {
  //     // toast.error(MESSAGE.ERROR.NO_CHANGES);
  //     return; // No changes made, do nothing
  //   }

  //   if (label === "Mobile number") {
  //     const isValid = value
  //       .trim()
  //       .match(MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN);

  //     if (!isValid) {
  //       //revert to previous value
  //       const syntheticEvent = {
  //         target: { value: prevValueRef.current },
  //       } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  //       onChange?.(syntheticEvent);

  //       toast.error(
  //         MOBILE_NUMBER_VALIDATION.ERROR_MESSAGE_MOBILE_NUMBER_INDIAN,
  //       );
  //       return;
  //     }
  //   } else if (label === "Email") {
  //     const isValid = value.trim().match(VALIDATIONS.EMAIL);
  //     if (!isValid) {
  //       //revert to previous value
  //       const syntheticEvent = {
  //         target: { value: prevValueRef.current },
  //       } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  //       onChange?.(syntheticEvent);

  //       toast.error(MESSAGE.ERROR.EMAIL_NOT_VALID_ERROR);
  //       return;
  //     }
  //   }
  //   //  Apply trimmed value before saving
  //   if (trimmedValue !== value) {
  //     const syntheticEvent = {
  //       target: { value: trimmedValue },
  //     } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  //     onChange?.(syntheticEvent); // update UI with trimmed value
  //   }
  //   if (value !== prevValueRef.current) {
  //     handleLeadInfoSave!();
  //   }
  // };

  const handleBlur = () => {
    setIsEditing(false);
    validateAndSave();
  };

  //   const validateAndSave = () => {
  //   const trimmedValue = value.trim();

  //   // Step 1: No change check
  //   if (trimmedValue === prevValueRef.current) {
  //     return;
  //   }

  //   if (label === "Mobile number") {
  //     const isValid = trimmedValue.match(
  //       MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN
  //     );

  //     if (!isValid) {
  //       const syntheticEvent = {
  //         target: { value: prevValueRef.current },
  //       } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  //       onChange?.(syntheticEvent);
  //       toast.error(
  //         MOBILE_NUMBER_VALIDATION.ERROR_MESSAGE_MOBILE_NUMBER_INDIAN
  //       );
  //       return;
  //     }
  //   }

  //   if (label === "Email") {
  //     const isValid = trimmedValue.match(VALIDATIONS.EMAIL);

  //     if (!isValid) {
  //       const syntheticEvent = {
  //         target: { value: prevValueRef.current },
  //       } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  //       onChange?.(syntheticEvent);
  //       toast.error(MESSAGE.ERROR.EMAIL_NOT_VALID_ERROR);
  //       return;
  //     }
  //   }

  //   // Apply trimmed value
  //   if (trimmedValue !== value) {
  //     const syntheticEvent = {
  //       target: { value: trimmedValue },
  //     } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  //     onChange?.(syntheticEvent);
  //   }

  //   handleLeadInfoSave?.();
  // };
  const validateAndSave = () => {
    if (isSubmittingRef.current) return;

    const trimmedValue = value.trim();

    if (trimmedValue === prevValueRef.current) {
      return;
    }

    if (label === "Mobile number") {
      const isValid = trimmedValue.match(
        MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN,
      );

      if (!isValid) {
        onChange?.({
          target: { value: prevValueRef.current },
        } as React.ChangeEvent<HTMLInputElement>);
        toast.error(
          MOBILE_NUMBER_VALIDATION.ERROR_MESSAGE_MOBILE_NUMBER_INDIAN,
        );
        return;
      }
    }

    if (label === "Email") {
      const isValid = trimmedValue.match(VALIDATIONS.EMAIL);

      if (!isValid) {
        onChange?.({
          target: { value: prevValueRef.current },
        } as React.ChangeEvent<HTMLInputElement>);
        toast.error(MESSAGE.ERROR.EMAIL_NOT_VALID_ERROR);
        return;
      }
    }

    if (trimmedValue !== value) {
      onChange?.({
        target: { value: trimmedValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    isSubmittingRef.current = true;
    handleLeadInfoSave?.();

    // Reset after tick
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur(); // optional: removes focus
      // validateAndSave()
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
              className={`input-label-custom border border-gray-400 rounded-sm  p-0 m-0 ${
                label === "Name" ? "w-fit" : "w-48"
              } focus:outline-none focus:ring-0 `}
              value={value}
              onChange={onChange}
              onBlur={handleBlur}
              autoFocus
              maxLength={60}
              onKeyDown={handleKeyDown}
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
          {value ? (
            <>
              {value} {/* Icon never gets truncated */}
              <Edit3 className="ml-1 h-4 w-4 inline-block text-slate-400 flex-shrink-0" />
            </>
          ) : (
            <span className="input-label-custom">Add here...</span>
          )}
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
            <span
              className={`truncate ${
                label === "Name" ? "" : " max-w-[205px]"
              } `}
            >
              {value ? (
                value
              ) : (
                <span className="p-1 caption-custom italic">Add here...</span>
              )}
            </span>

            {/* Icon never gets truncated */}
            <Edit3 className="ml-1 h-4 w-4 text-slate-400 flex-shrink-0" />
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
