/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { usePanel } from "../../../context/panel/usePanel";
import UpdateLeadForm from "./UpdateLeadForm";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
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
// import LeadDetailsData from "../../../@types/lead-management/LeadDetailsData";

const ViewLeadManagement = () => {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const [isUpdateLeadFormOpen, setIsUpdateLeadFormOpen] = useState(false);
  const { position } = usePanel();
  const [searchParams] = useSearchParams();
  const [reasonInputBoxOpen, setReasonInputBoxOpen] = useState(false);
  const [reasonText, setReasonText] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);

  const [isOpenLeadStatusHistory, setIsOpenLeadStatusHistory] =
    useState<boolean>(false);
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
    } catch (error) {
      console.log(error);
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
        setSelectedLeadData((prev: any) => ({
          ...prev,
          leadStatus: updatedStatusName,
        }));
        setReasonInputBoxOpen(false);
        setReasonText("");
        setSelectedStatusId(null);
      }
    } catch (err) {
      console.error("Failed to update lead", err);
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
    } catch (error) {
      console.log(error);
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
    const response = await axios.post(POST_API.GET_INDUSTRY_TYPE, postData, {
      withCredentials: true,
    });

    if (response.status === STATUS_CODE.OK) {
      setIndustryType(response.data);
    } else {
      throw new Error("Failed to fetch industry type");
    }
  };

  const getIndustryType = async () => {
    try {
      await retryRequest(fetchIndustryType, 3);
    } catch (error) {
      console.error("Failed after retries:", error);
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
      } else {
        throw new Error("Failed to fetch lead details");
      }
    };

    try {
      await retryRequest(fetchDetails, 3);
    } catch (error) {
      console.error("Failed to fetch lead details after retries:", error);
      alert("Unable to fetch Lead Details. Please try again later.");
    }
  };
  const getAllState = async () => {
    const PostDataForState: State = {
      id: null,
      country_id: null,
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
      alert("Unable to fetch States. Please try again later.");
    }
  };

  const getAllDistrict = async () => {
    const PostDataForDistrict: District = {
      id: null,
      state_id: null,
      name: null,
      description: null,
      isactive: true,
    };

    const fetchDistricts = async () => {
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
      } else {
        throw new Error("Failed to fetch districts");
      }
    };

    try {
      await retryRequest(fetchDistricts, 4);
    } catch (error) {
      console.error("Failed to fetch districts after retries:", error);
    }
  };

  useEffect(() => {
    const apisCalls = async () => {
      await fetchLeadStatus();
      await getAllCountries();
      await getIndustryType();
      await getAllState();
      await getAllDistrict();
      await getLeadDetails();
    };
    apisCalls();
  }, []);

  return (
    <div
      className={`${
        position === "left" ? "mx-6" : ""
      } fixed top-8 inset-0 z-10 bg-white mt-4 overflow-auto pl-9`}
    >
      {/* Header */}
      <div className="flex bg-slate-100 rounded-lg items-center justify-between border-b my-1 mr-1 pr-2">
        <div className="flex gap-4">
          <button
            className="flex items-center pr-1 text-sm text-gray-600 hover:text-blue-600 transition"
            onClick={() => {
              navigate(ROUTES_URL.GET_LEAD_MANAGEMENT);
            }}
          >
            <ChevronLeft size={18} />
            <span>Leads</span>
          </button>
          <div>
            <div className="text-xs text-gray-500">Lead</div>
            <div className="font-semibold">
              {selectedLeadData?.name ||
                selectedLeadData.email ||
                selectedLeadData.mobileNumber ||
                "-"}
            </div>
          </div>
        </div>

        <div className="flex justify-evenly w-48">
          <button
            className="text-xs rounded border px-3 my-1 text-gray-500"
            onClick={() => {
              setIsUpdateLeadFormOpen(true);
            }}
          >
            Edit
          </button>

          <Detail label="Lead Owner " value={selectedLeadData?.leadOwner} />
        </div>
      </div>

      <div className="w-full">
        <div className="ml-4 flex justify-between gap-4 w-3/4 overflow-auto">
          <Detail label="Email" value={selectedLeadData?.email} />
          <Detail
            label="Mobile Number"
            value={selectedLeadData?.mobileNumber}
          />
          <Detail label="Lead Source" value={selectedLeadData?.leadSource} />
          <Detail label="Created By" value={selectedLeadData?.createdBy} />
          <Detail label="Created On" value={selectedLeadData?.createdOn} />
        </div>
      </div>

      <div className="m-3 mt-2 pl-1 flex h- bg-slate-50 flex-col shadow-md rounded-xl">
        <div className="flex justify-between text-xs text-gray-600 mb-1 px-2">
          <span>Lead Status</span>
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
              key={item.id}
              className={`flex-1 text-xs ${
                selectedLeadData.leadStatus === item.name
                  ? "bg-blue-500 text-white hover:bg-blue-800"
                  : "hover:bg-blue-500 hover:text-white"
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

      <div className=" w-[100%] h-auto flex gap-4  shadow-sm    ">
        {/* First child: 70% width */}
        <div className="w-[65%] h-full overflow-auto   bg-gray-0 shadow-md m-2 rounded">
          <LeadDetails
            district={district}
            stateData={stateData}
            leadDetailsData={leadDetailsData}
            setLeadDetailsData={setLeadDetailsData}
            countries={countries}
            selectedLeadData={selectedLeadData}
            industryType={industryType}
          />
        </div>

        {/* Second child: 30% width */}
        <div className="w-[35%] h-full bg-green-50 border my-2 text-white p-4">
          This div should get 30% width and full height
        </div>
      </div>

      {isUpdateLeadFormOpen && (
        <UpdateLeadForm
          isOpen={isUpdateLeadFormOpen}
          onClose={() => {
            setIsUpdateLeadFormOpen(false);
          }}
          selectedLeadForEdit={selectedLeadData}
        />
      )}
      <LeadStatusHistory
        selectedLeadData={selectedLeadData}
        isOpen={isOpenLeadStatusHistory}
        onClose={() => {
          setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
        }}
      />
    </div>
  );
};

export default ViewLeadManagement;

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-xs text-gray-700 whitespace-nowrap overflow-x-auto text-clip">
      {value || "-"}
    </p>
  </div>
);
