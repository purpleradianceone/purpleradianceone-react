/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowBigRightDash, ChevronLeft, History, Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { usePanel } from "../../../context/panel/usePanel";
import UpdateLeadForm from "./UpdateLeadForm";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import {
  MOBILE_NUMBER_VALIDATION,
  NUMBER_VALUES,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import PostDataTypeForLeadSourceAndStatusAndStates from "../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import LeadStatusHistory from "./LeadStatusHistory";
import LeadDetails from "./LeadDetails";
import Country from "../../../@types/general/Country";
import industryType from "../../../@types/general/industryType";
import LeadDetailsData from "../../../@types/lead-management/LeadDetailsData";
import State from "../../../@types/general/State";
import District from "../../../@types/general/District";

import LeadMeetingsModal from "../meetings/LeadMeetingsModal";
import qs from "query-string";

import PostDataLeadUpdate from "../../../@types/lead-management/PostDataLeadUpdate";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import RefreshToken from "../../../config/validations/RefreshToken";
import GetCompanyUsersForLead from "./company-users-selection-modal/GetCompanyUsersForLead";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import LeadOwnerHistory from "./LeadOwnerHistory";
import AssignProductToLead from "./AssignProductToLead";
import LeadAssignedCompanyProduct from "../../../@types/lead-management/LeadAssignedCompanyProduct";
import LeadAssignedComponyProducts from "./LeadAssignedCompanyProduct";
import InterestType from "../../../@types/lead-management/InterestType";

const ViewLeadManagement = () => {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const [isUpdateLeadFormOpen, setIsUpdateLeadFormOpen] =
    useState<boolean>(false);
  const { position } = usePanel();
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
  const [countries, setCountries] = useState<Country[]>([]);
  const [industryType, setIndustryType] = useState<industryType[]>([]);
  const [stateData, setStateData] = useState<State[]>([]);
  const [district, setDistrict] = useState<District[]>([]);
  const [leadAssignedCompanyProduct, setLeadAssignedCompanyProduct] = useState<
    LeadAssignedCompanyProduct[]
  >([]);
  const [interestTypeData, setInterestTypeData] = React.useState<
    InterestType[]
  >([]);

  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };
  //note : Message Snackbar
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  type activity = {
    work?: string;
    person?: string;
  };

  const [activityData, setActivityData] = useState<activity[]>([
    {
      person: "Shrutika Kohalatkar ",
      work: "changed lead deatils",
    },
    {
      person: "Gaurav Chandel ",
      work: "changed lead owner",
    },
    {
      person: "hrutik sargar ",
      work: "changed lead name",
    },
  ]);

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
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
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
      if (response?.status === STATUS_CODE.OK) {
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

        setActivityData([
          {
            person: loginStatus.fullName,
            work: response.data.message,
          },
          ...activityData,
        ]);
        const newPath = `${window.location.pathname}?${newQueryString}`;
        navigate(newPath, { replace: true });
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleSaveStatusUpdate,
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

  const getAllCountries = async () => {
    const PostData: Country = {
      id: null,
      dailcode: null,
      name: null,
      description: null,
      isactive: true,
    };

    try {
      const response = await axios.post(POST_API.GET_COUNTRY, PostData, {
        withCredentials: true,
      });
      if (response.status == STATUS_CODE.OK) {
        setCountries(response.data);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getAllCountries,
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
  const retryRequest = async (fn: () => Promise<void>, retries = 4) => {
    while (retries > 0) {
      try {
        await fn();
        return;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error;
        }
      }
    }
  };

  const fetchIndustryType = async () => {
    const postData = {
      id: null,
      name: null,
      isactive: true,
    };
    try {
      const response = await axios.post(POST_API.GET_INDUSTRY_TYPE, postData, {
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        setIndustryType(response.data);
      } else {
        throw new Error("Failed to fetch industry type");
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: fetchIndustryType,
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

  const getIndustryType = async () => {
    try {
      await retryRequest(fetchIndustryType, 3);
    } catch (error) {
      console.error("Failed after retries:", error);
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
      showMessageSnackbar({
        message: "select new onwer before submitting.",
        type: "error",
      });
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
        showMessageSnackbar({
          message: response.data.message,
          type: "success",
        });

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
        }));
        setActivityData([
          {
            person: loginStatus.fullName,
            work: response.data.message,
          },
          ...activityData,
        ]);
      } else {
        showMessageSnackbar({
          message: response.data.status,
          type: "error",
        });
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: handleLeadOwnerChange,
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

    const fetchDetails = async () => {
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
        } else {
          throw new Error("Failed to fetch lead details");
        }
      } catch (error: any) {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: getLeadDetails,
          });
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

    try {
      await retryRequest(fetchDetails, 3);
    } catch (error) {
      console.error("Failed to fetch lead details after retries:", error);
    }
  };
  const getAllState = async (countryId: number | null) => {
    if (!countryId) return;
    const PostDataForState: State = {
      id: null,
      country_id: countryId,
      name: null,
      description: null,
      isactive: true,
    };

    const fetchStates = async () => {
      const response = await axios.post(POST_API.GET_STATE, PostDataForState, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === STATUS_CODE.OK) {
        setStateData(response.data);
      } else {
        throw new Error("Failed to fetch states");
      }
    };

    try {
      await retryRequest(fetchStates, 4);
    } catch (error) {
      console.error("Failed to fetch states after retries:", error);
    }
  };

  const getAllDistrict = async (stateId: number | null) => {
    if (!stateId) return;
    const PostDataForDistrict: District = {
      id: null,
      state_id: stateId,
      name: null,
      description: null,
      isactive: true,
    };

    const fetchDistricts = async () => {
      try {
        const response = await axios.post(
          POST_API.GET_DISTRICT,
          PostDataForDistrict,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === STATUS_CODE.OK) {
          setDistrict(response.data);
        }
      } catch (error: any) {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: fetchDistricts,
          });
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

    try {
      await retryRequest(fetchDistricts, 4);
    } catch (error) {
      console.error("Failed to fetch districts after retries:", error);
    }
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadInterestData,
        });
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
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
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
    console.log(updatedProduct);
    console.log("this is updated lead product");

    setLeadAssignedCompanyProduct((prevData) =>
      prevData.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...product,
              quantityRequired: updatedProduct.quantityRequired,
              costExpected: updatedProduct.costExpected,
              leadInterestId: updatedProduct.leadInterestId!,
            }
          : product
      )
    );
  };
  useEffect(() => {
    const apisCalls = async () => {
      await getLeadDetails();
      await fetchLeadStatus();
      await getAllCountries();
      await getIndustryType();
      await getAllState(countryChangeRef.current);
      await getAllDistrict(stateChangeRef.current);
      await fetchLeadCompanyProduct();
      await getLeadInterestData();

    };

    const apiCallsWhenCountryChanged = async (countryId: number | null) => {
      await getAllState(countryId);
    };

    const apiCallWhenStateChanged = async (stateId: number | null) => {
      await getAllDistrict(stateId);
    };
    if (
      countryChangeRef.current !== leadDetailsData.country_id &&
      countryChangeRef.current !== 0
    ) {
      countryChangeRef.current = leadDetailsData.country_id;
      apiCallsWhenCountryChanged(countryChangeRef.current);
    } else if (
      stateChangeRef.current !== leadDetailsData.state_id &&
      stateChangeRef.current !== 0
    ) {
      stateChangeRef.current = leadDetailsData.state_id;
      apiCallWhenStateChanged(stateChangeRef.current);
    } else if (stateChangeRef.current === 0 && countryChangeRef.current === 0) {
      apisCalls();
    }
  }, [leadDetailsData]);

  const handleLeadInfoSave = async () => {
    const PostDataForLeadUpdate: PostDataLeadUpdate = {
      company_id: loginStatus.companyId,
      id: selectedLeadData.id, //NOTE : LEAD ID FOR EDIT
      name: selectedLeadData.name,
      email: selectedLeadData.email,
      mobilenumber: selectedLeadData.mobileNumber,
      updatedby: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.UPDATE_LEAD,
        PostDataForLeadUpdate,
        { withCredentials: true }
      );
      if (response.data.status === true) {
        const parsedQuery = JSON.parse(searchParams.get("leadData") || "{}");
        parsedQuery.name = selectedLeadData.name.toString();
        parsedQuery.email = selectedLeadData.email.toString();
        parsedQuery.mobileNumber = selectedLeadData.mobileNumber.toString();
        const newQueryString = qs.stringify({
          leadData: JSON.stringify(parsedQuery),
        });

        const newPath = `${window.location.pathname}?${newQueryString}`;
        navigate(newPath, { replace: true });

        showMessageSnackbar({
          message: response.data.message,
          type: "success",
        });
        setActivityData([
          {
            person: loginStatus.fullName,
            work: response.data.message,
          },
          ...activityData,
        ]);
      } else if (response.data.status === false) {
        showMessageSnackbar({
          message: response.data.message,
          type: "error",
        });
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleLeadInfoSave,
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

  // New Code
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  return (
    <div
      className={`${
        position === "left" ? " ml-14" : "ml-1"
      } fixed top-8 inset-0 z-10 bg-white mt-4   overflow-auto`}
    >
      {/* Header */}
      <div className="flex bg-slate-100 rounded-lg items-center justify-between border-b  m-1 pr-2">
        <div className="flex gap-6">
          <button
            className="flex items-center pr-1 text-sm text-gray-600 hover:text-blue-600 transition"
            onClick={() => {
              navigate(ROUTES_URL.GET_LEAD_MANAGEMENT);
            }}
          >
            <ChevronLeft size={18} />
            <span>Leads</span>
          </button>
          <div className="py-1">
            <div className="text-lg font-semibold">
              <Detail
                label="Name"
                type="text"
                value={selectedLeadData?.name}
                onChange={(e) => {
                  setSelectedLeadData({
                    ...selectedLeadData,
                    name: e.target.value,
                  });
                }}
                handleLeadInfoSave={handleLeadInfoSave}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-evenly w-48">
          {/* new code  */}
          <div className="relative inline-block">
            <button
              onClick={() => {
                setIsAddProductModalOpen(true);
              }}
              className="px-1 py-1 text-xs flex gap-1 items-center text-gray-500 bg-transparent border rounded  transition"
            >
              <Plus size={8} />
              <span>Product</span>
            </button>
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
          </div>
          <button
            className="hidden  text-xs rounded border px-3 my-1 text-gray-500"
            onClick={() => {
              setIsUpdateLeadFormOpen(true);
            }}
          >
            Edit
          </button>

          <Detail
            type="none"
            label="Created On"
            value={selectedLeadData?.createdOn}
          />
        </div>
      </div>

      {/* Lead Basic Info */}
      <div className="w-full flex ">
        <div className="ml-4 flex justify-between w-3/4   whitespace-nowrap overflow-auto">
          <Detail
            label="Email"
            type="text"
            value={selectedLeadData?.email}
            onChange={(e) => {
              setSelectedLeadData({
                ...selectedLeadData,
                email: e.target.value.trim(),
              });
            }}
            handleLeadInfoSave={handleLeadInfoSave}
          />
          <Detail
            label="Mobile Number"
            type="text"
            value={selectedLeadData?.mobileNumber}
            onChange={(e) => {
              setSelectedLeadData({
                ...selectedLeadData,
                mobileNumber: e.target.value,
              });
            }}
            handleLeadInfoSave={handleLeadInfoSave}
          />
          <Detail
            type="none"
            label="Lead Source"
            value={selectedLeadData?.leadSource}
          />
          <Detail
            type="none"
            label="Created By"
            value={selectedLeadData?.createdBy}
          />
          <div className="flex  ">
            <Detail
              label="Lead Owner"
              type="text"
              value={selectedLeadData?.leadOwner}
              handleClickLeadOwnerChange={handleClickLeadOwnerChange}
            />
            <button
              onClick={() => {
                setIsOpenLeadOwnerHistory(!isOpenLeadOwnerHistory);
              }}
            >
              <History size={13} className="mt-0" />
            </button>
          </div>
        </div>
        {reasonInputBoxOpenForLeadOwner && (
          <div className="w-1/4 ">
            <div className="  flex ml-2  gap-1 items-center">
              <label className="text-xs text-gray-600 font-medium">
                Reason(Optional)
              </label>
              <input
                type="text"
                placeholder="Enter reason for Owner Update"
                className=" border rounded px-3   text-xs "
                value={reasonTextForLeadOwnerChange}
                onChange={(e) =>
                  setReasonTextForLeadOwnerChange(e.target.value)
                }
              />
              <button
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded w-fit"
                onClick={() => {
                  handleLeadOwnerChange();
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Status Section */}
      <div className="m-3 mt-2 pl-1 flex h- bg-slate-100 flex-col shadow-md rounded-md">
        <div className="flex justify-between text-xs  mb-1 px-2">
          <span className="font-semibold ">Lead Status</span>
          <button
            onClick={() => {
              setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
            }}
          >
            <span className="border-b text-gray-500 hover:text-gray-950 hover:border-b-black">
              Status history
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
              } text-gray-800 font-medium text-center`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 17px) 0, 100% 50%, calc(100% - 17px) 100%, 0 100%)",
              }}
              onClick={() => {
                setReasonInputBoxOpen(true);
                setSelectedStatusId(item.id);
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

      {/* Lead Details & Meeting Section */}
      <div className=" w-[100%] h-auto flex  shadow-sm    ">
        {/* First child: 50% width */}
        <div className="w-[50%] h-full overflow-x-hidden   bg-gray-0 shadow-md m-2 rounded">

          <LeadDetails
            handleLeadActivityChange={(person: string, work: string) => {
              setActivityData([
                {
                  person: person,
                  work: work,
                },
                ...activityData,
              ]);
            }}
            district={district}
            stateData={stateData}
            leadDetailsData={leadDetailsData}
            setLeadDetailsData={setLeadDetailsData}
            countries={countries}
            selectedLeadData={selectedLeadData}
            industryType={industryType}
            getLeadDetails={getLeadDetails}
          />
        </div>

        {/* Second child: 50% width */}
        <div className="w-[50%] h-full bg-green-50 border my-2  p-4">
           <LeadMeetingsModal 
          isMeetingModalOpenFromProp={false}
          isCalendarViewEnabled={true}
          showConnectToPlatform={false}
          ></LeadMeetingsModal>
        </div>
      </div>

      {/* Assigned Company Product & Activity Section */}
      <div className=" w-[100%]   flex gap-1  shadow-sm">
        {/* First child: 50% width */}
        <div className="w-[50%] bg-slate-100 shadow-xl  rounded">
          <LeadAssignedComponyProducts
            data={leadAssignedCompanyProduct}
            interestTypeData={interestTypeData}
            handleLeadProductStatusUpdate={handleLeadProductStatusUpdate}
            handleLeadProductUpdate={handleLeadProductUpdate}
          />
        </div>

        {/* Second child: 50% width */}
        <div className="w-[50%] h-full  border my- p-4">
          <div className="sticky w-full bg-slate-100 font-sans text-sm font-semibold ">
            Activity
          </div>
          <div className=" pl-1 ">
            {activityData.map((item: activity, index: number) => (
              <div key={index}>
                {" "}
                <span className="text-sm font-semibold overflow-y-auto">
                  <span className="inline-block">
                    <ArrowBigRightDash size={12} />
                  </span>{" "}
                  {item.person}
                </span>{" "}
                <span>➡️</span> <span className="text-xs ">{item.work}</span>
              </div>
            ))}
          </div>
        </div>

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
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
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
                  //
                  setReasonInputBoxOpenForLeadOwner(true);
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
};

const Detail: React.FC<DetailProps> = ({
  label,
  value,
  type,
  options = [],
  onChange,
  handleLeadInfoSave,
  handleClickLeadOwnerChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  //note : Message Snackbar
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };
  const prevValueRef = useRef(value);

  const handleClick = () => {
    prevValueRef.current = value;
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (label === "Mobile Number") {
      const isValid = value.match(
        MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN
      );
      if (!isValid) {
        //revert to previous value
        const syntheticEvent = {
          target: { value: prevValueRef.current },
        } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

        onChange?.(syntheticEvent);
        showMessageSnackbar({
          message: MOBILE_NUMBER_VALIDATION.ERROR_MESSAGE_MOBILE_NUMBER_INDIAN,
          type: "error",
        });
        return;
      }
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
              className="text-sm text-gray-700 p-0 m-0 border-none focus:outline-none focus:ring-0 w-auto"
              value={value}
              onChange={onChange}
              onBlur={handleBlur}
              autoFocus
            />
          )
        )
      ) : type === "none" ? (
        <div>
          <p
            title={value}
            className="font-medium text-sm text-gray-800 whitespace-nowrap overflow-x-auto text-clip"
          >
            {value || "-"}
          </p>
        </div>
      ) : label === "Lead Owner" ? (
        <div
          title={value}
          className={`font-medium text-sm text-gray-900   whitespace-nowrap overflow-x-auto text-clip  cursor-pointer`}
          onClick={handleClickLeadOwnerChange}
        >
          {value || "-"}
        </div>
      ) : (
        <div
          title={value}
          className={`font-medium ${
            label === "Name"
              ? "text-sm text-black"
              : "text-sm md:whitespace-nowrap md:overflow-hidden text-gray-900"
          }   whitespace-nowrap overflow-hidden   cursor-pointer`}
          onClick={handleClick}
        >
          {value || "-"}
        </div>
      )}
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </div>
  );
};
