/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import Timezone from "../../@types/user-profile/Timezone";
import POST_API from "../../constants/PostApi";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE, VALIDATIONS } from "../../constants/AppConstants";
import RefreshToken from "../../config/validations/RefreshToken";
import { useUserPreference } from "../../context/user/UserPreference";
import CustomTimezoneDropdown from "./custom-dropdown-timezonedata/CustomTimezoneDropdown";

import REGEX from "../../constants/Regex";
import { useMasterRowsInGrid } from "../../config/hooks/useMasterRowsInGrid";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { alphabets, backgroundColors } from "../../constants/Colors";
import toast from "react-hot-toast";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import MESSAGE from "../../constants/Messages";
import { useCountries } from "../../config/hooks/useCountries";
import Country from "../../@types/general/Country";
import { AppVersionViewCard } from "../views/card/AppVersionViewCard";
import axiosClient from "../../axios-client/AxiosClient";
import {
  CompanyDetail,
  isCompanyDetailEqual,
} from "../../@types/company-detail/CompanyDetail";
import { handleApiError } from "../../config/error/handleApiError";
import FormInput from "../ui/FormInput";
import TextAreaInput from "../ui/TextAreaInput";
import CustomDropdown from "../modals/leads/CustomDropdown";
import EditableSection from "./EditableSection";
import { usebusinessType } from "../../config/hooks/useBusinessType";
import { useIndustryType } from "../../config/hooks/useIndustryType";
import Button from "../ui/Button";
import { CheckCircle, XCircle } from "lucide-react";
import { useStates } from "../../config/hooks/useStates";
import { useDistricts } from "../../config/hooks/useDisctricts";
import { toSelectOptions } from "../../utils/toSelectOption";
import CustomSelect from "../ui/CustomSelect";
import CustomDocumentPreviewComponent from "../custom-document-preview-component/CustomDocumentPreviewComponent";

const UserPreference = () => {
  const { countries } = useCountries();
  const classnameForParagragh = "table-data-custom  block truncate w-full";
  const { userPreference, setUserPreference } = useUserPreference();
  const { loginStatus, setLoginStatus } = useLoggedInUserContext();
  const { rowsInGridDropdownOptions } = useMasterRowsInGrid();

  const navigate = useNavigate();
  const {
    userHasAccessToUpdateUser,
    userHasAccessToUpdateSettingGeneral,
    userHasAccessToViewSettingGeneral,
    userHasAccessToViewCompanyDetail,
    userHasAccessToUpdateCompanyDetail,
    userHasAccessToUpdateSubscription,
  } = useUserAccessModules();

  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState<number>(
    userPreference.rowsInGrid,
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const [showCompanyLogoPreview, setShowCompanyLogoPreview] = useState(false);

  const [showUserLogoPreview, setShowUserLogoPreview] = useState(false);

  const [companyDetail, setCompanyDetail] = useState<CompanyDetail>({
    id: 0,

    company_id: 0,

    industry_type_id: 0,
    industry_type_name: "",

    business_type_id: 0,
    business_type_name: "",

    state_id: 0,
    state_name: "",

    district_id: 0,
    district_name: "",

    pan: "",
    gst: "",
    tan: "",
    cin: "",

    business_registration_number: "",

    billing_address: "",
    shipping_address: "",
    registered_office_address: "",

    website: "",

    logo_file_extension: "",
    logo_origin_url: "",
    logo_cdn_url: "",

    isactive: false,

    createdby: "",
    updatedby: "",

    createdon: "",
    updatedon: "",
  });
  const [previousCompanyDetail, setPriviousCompanyDetail] =
    useState<CompanyDetail>({
      id: 0,

      company_id: 0,

      industry_type_id: 0,
      industry_type_name: "",

      business_type_id: 0,
      business_type_name: "",

      state_id: 0,
      state_name: "",

      district_id: 0,
      district_name: "",

      pan: "",
      gst: "",
      tan: "",
      cin: "",

      business_registration_number: "",

      billing_address: "",
      shipping_address: "",
      registered_office_address: "",

      website: "",

      logo_file_extension: "",
      logo_origin_url: "",
      logo_cdn_url: "",

      isactive: false,

      createdby: "",
      updatedby: "",

      createdon: "",
      updatedon: "",
    });

  const { states } = useStates(userPreference.countryId);
  const { districts } = useDistricts(companyDetail.state_id);
  const stateTypeOption = toSelectOptions(states, "id", "name");
  const districtTypeOption = toSelectOptions(districts, "id", "name");

  useEffect(() => {
    if (userPreference.countryId && countries.length > 0) {
      const found = countries.find(
        (c: Country) => c.id === userPreference.countryId,
      );
      setSelectedCountry(found || null);
    }
  }, [userPreference.countryId, countries]);

  const [showTimeZoneData, setShowTimeZoneData] = React.useState(false);
  const [selectedTimeZoneData, setSelectedTimeZoneData] =
    React.useState<Timezone>({
      count: 0,
      id: 0,
      name: "",
      timezone: "",
      utc_offset: "",
    });

  // NOTE : CODE FOR EDIT USER PROFILE

  const [formData, setFormData] = useState({
    fullName: loginStatus.fullName || "",
    email: loginStatus.email || "",
    mobileNumber: loginStatus.mobileNumber || "",
  });

  const [initialData, setInitialData] = useState(formData);
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    mobileNumber?: string;
    email?: string;
    pan?: string;
    gst?: string;
    tan?: string;
    cin?: string;
    business_registration_number?: string;
  }>({});
  const prevTimezoneId = useRef<number>(userPreference.timezoneId);

  const [selectedTimezoneId, setSelectedTimezoneId] = React.useState<number>(
    userPreference.timezoneId,
  );

  // timezone states
  const limitForGrid = userPreference.rowsInGrid;
  const [timezoneList, setTimezoneList] = useState<Timezone[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(userPreference.rowsInGrid);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  // const [totalCount, setTotalCount] = useState<number | null>(null);

  const handleTimezonePreferenceChange = async () => {
    if (loginStatus.companyId === 0) return;
    //getting the id as per value
    const selectedMasterRowInGrid = rowsInGridDropdownOptions.find(
      (option) => parseInt(option.rowsInGrid) === selectedRowsPerPage,
    );

    const postData = {
      company_id: loginStatus.companyId,
      id: userPreference.id,
      is_left_menu: userPreference.isLeftMenu,
      country_id: selectedCountry?.id,
      is_hamburger_menu_collapsed: userPreference.isHamburgerMenuCollapsed,
      master_rows_in_grid_id: selectedMasterRowInGrid?.id,
      timezone_id: selectedTimezoneId,
      updatedby: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.UPDATE_COMPANY_USER_PREFERENCE,
        postData,
        {
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          toast.success(response.data.message);

          setUserPreference({
            ...userPreference,
            timezoneId: selectedTimezoneId,
            timezoneUTCOffset:
              selectedTimeZoneData.utc_offset === ""
                ? userPreference.timezoneUTCOffset
                : selectedTimeZoneData.utc_offset,
            timezoneName:
              selectedTimeZoneData.name === ""
                ? userPreference.timezoneName
                : selectedTimeZoneData.name,
            timezone:
              selectedTimeZoneData.timezone === ""
                ? userPreference.timezone
                : selectedTimeZoneData.timezone,
            rowsInGrid: parseInt(selectedMasterRowInGrid!.rowsInGrid),
            countryId: selectedCountry?.id || userPreference.countryId,
          });
          setShowTimeZoneData(false);
          setEditingSection(null);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: handleTimezonePreferenceChange,
        });
        if (refreshTokenStatus) {
          handleTimezonePreferenceChange();
        }
      }
    }
  };

  useEffect(() => {
    setSelectedTimezoneId(userPreference.timezoneId);
  }, [userPreference]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const hasChanged =
      updatedForm.fullName !== initialData.fullName ||
      updatedForm.email !== initialData.email ||
      updatedForm.mobileNumber !== initialData.mobileNumber;

    const hasErrors = Object.values(formErrors).some((e) => e !== "");

    setIsSaveEnabled(hasChanged && !hasErrors);
  };

  const handleUserDetailSave = async () => {
    if (isSaveEnabled) {
      await updateUserProfile();
      setInitialData(formData);
      setIsSaveEnabled(false);
    } else {
      toast("No Details Changed", {
        icon: "⚠️",
        style: {
          border: "1px solid #facc15",
          background: "#fffbeb",
          color: "#92400e",
        },
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMsg = "";

    if (!value.trim()) {
      errorMsg = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      if (name === "email") {
        const emailRegex = REGEX.EMAIL;
        if (!emailRegex.test(value.trim())) {
          errorMsg = "Invalid email format";
        }
      }

      if (name === "mobileNumber") {
        const mobileRegex = REGEX.MOBILE_NUMBER_NEW;
        if (!mobileRegex.test(value.trim())) {
          errorMsg = "Mobile number must be 10 digits and start with 6–9";
        }
      }
    }

    if (name === "pan") {
      if (value.trim().length !== 0 && !REGEX.PAN.test(value.trim())) {
        errorMsg = "Invalid PAN format (valid PAN: ABCDE1234F)";
      } else {
        errorMsg = "";
      }
    }

    if (name === "gst") {
      if (value.trim().length !== 0 && !REGEX.GST.test(value.trim())) {
        errorMsg = "Invalid GST format (valid GST: 27ABCDE1234F1Z5)";
      } else {
        if (companyDetail.state_id) {
          const result = value.substring(2, 12);
          if (value.trim().length !== 0 && result !== companyDetail.pan) {
            errorMsg = "Given PAN number must be include in GST.";
          } else {
            errorMsg = "";
          }
        } else {
          errorMsg = "First select the location information (ex: state)";
        }
      }
    }

    if (name === "tan") {
      if (value.trim().length !== 0 && !REGEX.TAN.test(value.trim())) {
        errorMsg = "Invalid TAN format (valid TAN: MUMA12345B)";
      } else {
        errorMsg = "";
      }
    }

    if (name === "cin") {
      if (value.trim().length !== 0 && !REGEX.CIN.test(value.trim())) {
        errorMsg = "Invalid CIN format (valid CIN: L12345MH2020PLC123456)";
      } else {
        errorMsg = "";
      }
    }

    if (name === "business_registration_number") {
      if (value.trim().length !== 0 && !REGEX.BRN.test(value.trim())) {
        errorMsg = "Invalid Business Registration Number";
      } else {
        errorMsg = "";
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));

    const hasChanged =
      formData.fullName.trim() !== initialData.fullName ||
      formData.email !== initialData.email ||
      formData.mobileNumber.trim() !== initialData.mobileNumber;

    // Include current error for updated field
    const currentErrors = {
      ...formErrors,
      [name]: errorMsg,
    };

    const hasErrors = Object.values(currentErrors).some((e) => e !== "");

    setIsSaveEnabled(hasChanged && !hasErrors);
  };

  const updateUserProfile = async () => {
    if (loginStatus.companyId === 0) return;
    try {
      const postData = {
        company_id: loginStatus.companyId,
        id: loginStatus.id,
        fullname: formData.fullName.trim(),
        mobilenumber: formData.mobileNumber.trim(),
        isactive: loginStatus.status,
        updatedby: loginStatus.id,
      };

      const response = await axios.put(POST_API.UPDATE_COMPANY_USER, postData, {
        withCredentials: true,
      });
      const res = response.data;
      if (response.status === STATUS_CODE.OK) {
        if (res.status) {
          setEditingSection(null);
          toast.success(response.data.message);
          setLoginStatus({
            ...loginStatus,
            fullName: formData.fullName.trim(),
            mobileNumber: formData.mobileNumber.trim(),
          });
        } else {
          formData.fullName = loginStatus.fullName!;
          formData.mobileNumber = loginStatus.mobileNumber;

          toast.error(res.message);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: updateUserProfile,
        });

        if (refreshTokenStatus) {
          updateUserProfile();
        }
      }
    }
  };

  // code for getting timezone data

  const loadTimezones = async (
    newOffset: number,
    searchTextToUse = "",
    customLimit?: number,
  ) => {
    if (loginStatus.companyId === 0) return;
    const effectiveLimit = customLimit !== undefined ? customLimit : limit;

    const postData = {
      search_company_specific_date_range_id: null,
      search_parameter: searchTextToUse || null,
      search_parameter_date: null,
      offset: newOffset,
      limit: effectiveLimit,
    };

    try {
      const response = await axios.post(POST_API.GET_TIMEZONE, postData, {
        withCredentials: true,
      });

      const newTimezones: Timezone[] = response.data || [];

      if (newOffset === 0) {
        setTimezoneList(newTimezones);
        if (searchTextToUse) {
          setLimit(limitForGrid);
        } else {
          setLimit(limitForGrid);
        }
      } else {
        setTimezoneList((prev) => [...prev, ...newTimezones]);
      }

      const nextOffset = newOffset + effectiveLimit;
      setOffset(nextOffset);
      if (searchTextToUse) {
        setHasMore(newTimezones.length === effectiveLimit);
      }
    } catch (err) {
      console.error("Error fetching timezones:", err);
    }
  };

  const handleSelectRowInGridOptionChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedOptionValue = parseInt(event.target.value, 10);

    if (!isNaN(selectedOptionValue)) {
      setSelectedRowsPerPage(selectedOptionValue);
    }
  };

  const handleSelectCountryOptionChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const id = Number(e.target.value);
    const selected = countries.find((c) => c.id === id) || null;
    setSelectedCountry(selected);
  };

  useEffect(() => {
    if (showTimeZoneData) {
      setOffset(0);
      setLimit(limitForGrid);
      setSearchText("");
      setHasMore(true);
      loadTimezones(0);
    } else {
      setTimezoneList([]);
      setOffset(0);
      setLimit(limitForGrid);
      setSearchText("");
      setHasMore(true);
    }
  }, [showTimeZoneData]);

  // Called when user types
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setOffset(0);
    setLimit(limitForGrid);
    setHasMore(true);
    loadTimezones(0, text, limitForGrid);
  };

  const loadMore = () => {
    if (hasMore) {
      loadTimezones(offset, searchText, limit);
    }
  };

  const getColor = (email: string) => {
    if (!email) return backgroundColors[0];
    const emailChar = email.charAt(0);
    const index = alphabets.indexOf(emailChar.toLowerCase());
    return backgroundColors[index];
  };

  //For company details
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviousPreview, setPreviousLogoPreview] = useState<string | null>(
    null,
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    console.log("Company logo file: " + logoPreview?.toString());
  }, [logoPreview]);

  const getCompanyDetail = () => {
    if (loginStatus.companyId === 0) return;
    try {
      axiosClient
        .post(POST_API.GET_COMPANY_DETAIL, {
          company_id: loginStatus.companyId,
          requestedby_id: loginStatus.id,
        })
        .then((response) => {
          console.log(response.data);
          if (response.status === STATUS_CODE.OK) {
            setCompanyDetail(response.data[0]);
            setPriviousCompanyDetail(response.data[0]);
          }
        })
        .catch((e) => {
          console.log("inside get company detail catch");
          handleApiError(e);
        });
    } catch (ex) {
      handleApiError(ex);
    }
  };

  const handleCompanyDetailsChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const updatedCompanyDetail = { ...companyDetail, [name]: value };
    setCompanyDetail(updatedCompanyDetail);
  };

  const handleCompanyLogoUpload = async () => {
    if (loginStatus.companyId === 0) return;
    if (logoFile) {
      try {
        const formData = new FormData();
        formData.append("file", logoFile);
        formData.append("id", companyDetail.id.toString());
        formData.append("company_id", loginStatus.companyId.toString());
        formData.append("updatedby_id", loginStatus.id.toString());
        console.log(formData);

        await axiosClient
          .post(POST_API.UPLOAD_COMPANY_LOGO, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            withCredentials: true,
          })
          .then((response) => {
            const data = response.data;

            if (data.status) {
              toast.success(data.message);
            } else {
              toast.error(data.message);
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch(async (error: any) => {
            handleApiError(error);
            setLogoPreview(logoPreviousPreview);
          })
          .finally(() => {
            setIsLogoChange(false);
          });
        console.log("inside if condition");
      } catch (ex) {
        console.log(ex);
        handleApiError(ex);
      }
    } else {
      toast("No File Selected For Upload", {
        icon: "⚠️",
        style: {
          border: "1px solid #facc15",
          background: "#fffbeb",
          color: "#92400e",
        },
      });
    }
  };

  const [
    isLoadingForCompanyDetailsUpdate,
    setIsLoadingForCompanyDetailsUpdate,
  ] = useState<boolean>(false);

  const updateCompanyDetail = () => {
    if (loginStatus.companyId === 0) return;

    if (!isCompanyDetailEqual(previousCompanyDetail, companyDetail)) {
      setIsLoadingForCompanyDetailsUpdate(true);
      try {
        axiosClient
          .post(POST_API.UPDATE_COMPANY_DETAIL, {
            company_id: loginStatus.companyId,
            industry_type_id: companyDetail.industry_type_id,
            business_type_id: companyDetail.business_type_id,
            state_id:
              companyDetail.state_id != 0 ? companyDetail.state_id : null,
            district_id:
              companyDetail.district_id !== 0
                ? companyDetail.district_id
                : null,
            pan: companyDetail.pan,
            gst: companyDetail.gst,
            tan: companyDetail.tan,
            cin: companyDetail.cin,
            business_registration_number:
              companyDetail.business_registration_number,
            billing_address: companyDetail.billing_address,
            shipping_address: companyDetail.shipping_address,
            registered_office_address: companyDetail.registered_office_address,
            website: companyDetail.website,
            // logo_file_extension: companyDetail.logo_file_extension,
            // logo_origin_url: companyDetail?.logo_origin_url,
            // logo_cdn_url: companyDetail?.logo_cdn_url,
            isactive: companyDetail?.isactive,
            updatedby_id: loginStatus.id,
          })
          .then((response) => {
            if (response.data.status) {
              toast.success(response.data.message);
              getCompanyDetail();
              setEditingSection(null);
            } else {
              toast.error(response.data.message);
            }
          })
          .catch((e) => {
            handleApiError(e);
          });
        console.log("inside if condition");
      } catch (ex) {
        console.log(ex);
        handleApiError(ex);
      } finally {
        setIsLoadingForCompanyDetailsUpdate(false);
      }
    } else {
      toast("No Details Changed", {
        icon: "⚠️",
        style: {
          border: "1px solid #facc15",
          background: "#fffbeb",
          color: "#92400e",
        },
      });
    }
  };

  useEffect(() => {
    getCompanyDetail();
  }, [loginStatus.companyId]);

  const getCompanyLogo = () => {
    if (loginStatus.companyId === 0) return;
    axios
      .post(
        POST_API.GET_COMPANY_LOGO,
        {
          company_id: loginStatus.companyId,
          id: companyDetail.id,
          logo_file_extension: companyDetail.logo_file_extension,
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "arraybuffer",
          withCredentials: true,
        },
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: companyDetail.logo_file_extension,
        });

        const imageUrl = URL.createObjectURL(blob);
        setLogoPreview(imageUrl);
        setPreviousLogoPreview(imageUrl);
        console.log("inside get logo");
      })
      .catch((e) => {
        console.log("inside get company logo catch" + e);
      });
  };

  useEffect(() => {
    if (
      companyDetail.logo_file_extension &&
      companyDetail.logo_file_extension !== ""
    ) {
      getCompanyLogo();
    }
  }, [companyDetail.logo_file_extension]);

  const [isLogoChange, setIsLogoChange] = useState<boolean>(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    console.log(logoFile);

    // preview
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  useEffect(() => {
    if (logoPreview !== logoPreviousPreview) {
      setIsLogoChange(true);
    } else {
      setIsLogoChange(false);
    }
  }, [logoPreview]);

  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleEditableSectionSave = () => {
    if (
      !formErrors.pan &&
      !formErrors.gst &&
      !formErrors.tan &&
      !formErrors.cin &&
      !formErrors.business_registration_number
    ) {
      updateCompanyDetail();
    } else {
      if (formErrors.pan) toast.error("Please enter valid PAN");
      if (formErrors.gst) toast.error("Please enter valid GST");
      if (formErrors.tan) toast.error("Please enter valid TAN");
      if (formErrors.cin) toast.error("Please enter valid CIN");
      if (formErrors.business_registration_number)
        toast.error("Please enter valid BRN");
    }
  };

  const handleEditableSectionEdit = (key: string) => {
    setFormErrors((prev) => ({
      ...prev,
      fullName: "",
      mobileNumber: "",
      pan: "",
      gst: "",
      tan: "",
      cin: "",
      brn: "",
    }));
    setCompanyDetail(previousCompanyDetail);
    setEditingSection(key);
  };
  const handleEditableSectionCancel = () => {
    setCompanyDetail(previousCompanyDetail);
    setFormData(initialData);
    setEditingSection(null);
  };

  const { businessType } = usebusinessType();
  const { industryTypeData } = useIndustryType();

  // useEffect(()=>{

  //   console.log("state id:"+companyDetail.state_id + ", district id:"+companyDetail.district_id);

  // },[companyDetail.state_id,companyDetail.district_id]);

  return (
    <div className="w-full mx-24 min-h-screen bg-gray-100 py-8 px-2 space-y-10">
      {/* Profile Info Card */}
      <div className="  bg-white rounded-2xl shadow-lg  p-8 space-y-2">
        <div className="flex items-center justify-between ">
          <h3 className="section-header-custom">
            My Profile{" "}
            {userHasAccessToUpdateUser && (
              <span className="caption-custom">(Click edit to change)</span>
            )}
          </h3>
        </div>
        <div className="border-t pt-4 w-full"></div>
        <div className="flex justify-center items-center gap-8 ">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div
              className={`relative w-32 h-32 rounded-full flex items-center justify-center text-white text-6xl font-semibold  border-4 border-white shadow-xl ring-2 ring-gray-200  transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getColor(loginStatus.email)}`}
              onDoubleClick={() => setShowUserLogoPreview(true)}
            >
              {loginStatus.fullName?.charAt(0)?.toUpperCase()}
            </div>
            {showUserLogoPreview && (
              <div
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                onClick={() => setShowUserLogoPreview(false)}
              >
                <div
                  className={`w-72 h-72 rounded-full flex items-center justify-center text-white text-9xl font-semibold shadow-2xl ${getColor(loginStatus.email)}`}
                >
                  {loginStatus.fullName?.charAt(0)?.toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Basic Info Grid */}
          <div className="w-full">
            <EditableSection
              title=""
              hasAccess={userHasAccessToUpdateUser}
              onEdit={() => {
                handleEditableSectionEdit("user detail");
              }}
              isEditing={editingSection === "user detail"}
              onCancel={handleEditableSectionCancel}
              sectionKey="user detail"
              onSave={handleUserDetailSave}
            >
              {editingSection === "user detail" ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                  <div className="w-96">
                    <h4 className="table-header-custom">Name</h4>
                    <FormInput
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                      minLength={VALIDATIONS.MIN_NAME_LENGTH}
                      className="w-full p-2 border rounded"
                      error={formErrors.fullName}
                    />
                  </div>

                  <div>
                    <h4 className="table-header-custom">Email</h4>
                    <p className={classnameForParagragh}>
                      {formData.email || "Not Provided"}
                    </p>
                  </div>

                  <div className="w-96">
                    <h4 className="table-header-custom">Contact Number</h4>
                    <FormInput
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
                      minLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
                      className="w-full p-2 border rounded"
                      error={formErrors.mobileNumber}
                    />
                  </div>

                  <div className="justify-center items-center">
                    <h4 className="table-header-custom mb-1">Profile Status</h4>

                    <span
                      className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold w-fit ${
                        loginStatus.status
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      {loginStatus.status ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}

                      {loginStatus.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 ">
                  <div className="grid grid-cols-2 border-b pb-1">
                    <div className="">
                      <h4 className="table-header-custom">Name</h4>
                      <p
                        title={formData.fullName ?? "Not Provided"}
                        className="table-data-custom block truncate w-full "
                      >
                        {formData.fullName || "Not Provided"}
                      </p>
                    </div>

                    <div>
                      <h4 className="table-header-custom">Email</h4>
                      <p className={classnameForParagragh}>
                        {formData.email || "Not Provided"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-b pb-1">
                    <div>
                      <h4 className="table-header-custom">Contact Number</h4>

                      <p className={classnameForParagragh}>
                        {formData.mobileNumber || "Not Provided"}
                      </p>
                    </div>

                    <div className="justify-center items-center">
                      <h4 className="table-header-custom ">Profile Status</h4>

                      <span
                        className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold w-fit ${
                          loginStatus.status
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {loginStatus.status ? (
                          <CheckCircle size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}

                        {loginStatus.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </EditableSection>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1  gap-5">
        {/* Company Detail CARD */}
        <div
          className={` ${
            !userHasAccessToViewCompanyDetail ? "hidden" : ""
          }   bg-white rounded-2xl shadow-lg px-8 py-6 space-y-2 `}
        >
          <div className="flex items-center justify-between">
            <h3 className="section-header-custom">
              Company Details{" "}
              {userHasAccessToUpdateCompanyDetail && (
                <span className="caption-custom">(Click edit to change)</span>
              )}
            </h3>
          </div>

          {/** Company Logo */}
          <div className="border-t pt-4">
            {/* Left aligned container */}
            <div className="flex flex-col items-start">
              {/* Image */}
              <div className="w-40 h-40 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                {logoPreview || companyDetail?.logo_file_extension ? (
                  <img
                    src={logoPreview ?? companyDetail?.logo_cdn_url}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                    onDoubleClick={() => setShowCompanyLogoPreview(true)}
                  />
                ) : (
                  <span className="caption-custom">No Logo</span>
                )}
                {showCompanyLogoPreview && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setShowCompanyLogoPreview(false)}
                  >
                    {/* <img
                      src={logoPreview ?? companyDetail?.logo_cdn_url}
                      alt="Company Logo"
                      className="max-w-[80%] max-h-[80%] object-contain rounded-lg shadow-lg"
                    /> */}
                    <CustomDocumentPreviewComponent
                      fileUrl={logoPreview ?? companyDetail?.logo_cdn_url}
                      fileExtension={companyDetail.logo_file_extension}
                      width={"50%"}
                      enableDownload={true}
                    />
                  </div>
                )}
              </div>

              {/* Button centered under image */}
              {userHasAccessToUpdateCompanyDetail &&
                (!isLogoChange ? (
                  <div className="w-40 flex justify-center mt-2">
                    <label className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      {logoPreview || companyDetail?.logo_file_extension
                        ? "Change Logo"
                        : "Upload Logo"}

                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="w-55 flex justify-center mt-2 gap-2">
                    <div>
                      <Button
                        type="button"
                        onClick={() => setLogoPreview(logoPreviousPreview)}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleCompanyLogoUpload}
                      >
                        Save Logo
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* COMPANY DETAILS SECTION */}
          <div className="flex flex-col space-y-6">
            {/* ================= COMPANY INFO ================= */}
            <div>
              <EditableSection
                title={loginStatus?.companyName ?? "Company Name"}
                hasAccess={userHasAccessToUpdateCompanyDetail}
                onEdit={() => handleEditableSectionEdit("company")}
                isEditing={editingSection === "company"}
                onCancel={handleEditableSectionCancel}
                sectionKey="company"
                onSave={() => {
                  handleEditableSectionSave();
                }}
                isLoading={isLoadingForCompanyDetailsUpdate}
              >
                {editingSection === "company" ? (
                  <FormInput
                    label="Website:"
                    name="website"
                    value={companyDetail?.website ?? ""}
                    onChange={handleCompanyDetailsChange}
                    className="input-custom"
                    placeholder="eg. www.abc.com"
                  />
                ) : (
                  <div className="grid grid-cols-2 items-start border-b pb-1">
                    <div className="flex gap-4">
                      <div className="input-label-custom py-1">Website:</div>

                      <a
                        href={companyDetail?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="caption-custom-blue py-1.5 break-all"
                      >
                        {companyDetail?.website ?? ""}
                      </a>
                    </div>
                  </div>
                )}
              </EditableSection>
            </div>

            {/* ================= BUSINESS ================= */}
            <div>
              <EditableSection
                title="Business Information"
                sectionKey="business"
                hasAccess={userHasAccessToUpdateCompanyDetail}
                onEdit={() => handleEditableSectionEdit("business")}
                isEditing={editingSection === "business"}
                onCancel={handleEditableSectionCancel}
                onSave={() => {
                  handleEditableSectionSave();
                }}
                isLoading={isLoadingForCompanyDetailsUpdate}
              >
                {editingSection === "business" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <CustomDropdown
                      labelName="Business Type: "
                      preselectedOption={companyDetail.business_type_id}
                      selectedValue={companyDetail.business_type_id}
                      options={businessType}
                      onSelect={(businessTypeId) => {
                        setCompanyDetail((prev) => {
                          return {
                            ...prev,
                            business_type_id: businessTypeId ?? 0,
                          };
                        });
                      }}
                    />
                    <CustomDropdown
                      labelName="Industry Type: "
                      preselectedOption={companyDetail.industry_type_id}
                      selectedValue={companyDetail.industry_type_id}
                      options={industryTypeData}
                      onSelect={(industryTypeId) => {
                        setCompanyDetail((prev) => {
                          return {
                            ...prev,
                            industry_type_id: industryTypeId ?? 0,
                          };
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 items-start border-b pb-1">
                    <div className="flex gap-3">
                      <div className="input-label-custom py-1">
                        Business Type:
                      </div>
                      <span className="caption-custom text-blue-600 py-1.5">
                        {companyDetail?.business_type_name ?? "-"}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="input-label-custom py-1">
                        Industry Type:
                      </div>
                      <span className="caption-custom text-blue-600 py-1.5">
                        {companyDetail?.industry_type_name ?? "-"}
                      </span>
                    </div>
                  </div>
                )}
              </EditableSection>
            </div>

            {/* ================= LOCATION ================= */}
            <div>
              <EditableSection
                title="Location Information"
                sectionKey="location"
                hasAccess={userHasAccessToUpdateCompanyDetail}
                onEdit={() => handleEditableSectionEdit("location")}
                isEditing={editingSection === "location"}
                onCancel={handleEditableSectionCancel}
                onSave={() => {
                  if (companyDetail.state_id && companyDetail.district_id) {
                    handleEditableSectionSave();
                  } else {
                    if (
                      companyDetail.state_id === 0 &&
                      companyDetail.district_id === 0
                    ) {
                      handleEditableSectionSave();
                    } else {
                      // toast.error("Please select both state and district.");
                      toast("Please select both state and district.", {
                        icon: "⚠️",
                        style: {
                          border: "1px solid #facc15",
                          background: "#fffbeb",
                          color: "#92400e",
                        },
                      });
                    }
                  }
                }}
                isLoading={isLoadingForCompanyDetailsUpdate}
              >
                {editingSection === "location" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="">
                      <CustomSelect
                        label="State:"
                        value={companyDetail.state_id}
                        options={stateTypeOption}
                        onChange={(id) => {
                          setCompanyDetail((prev) => {
                            return {
                              ...prev,
                              state_id: id ?? 0,
                            };
                          });

                          if (previousCompanyDetail.state_id !== id) {
                            setCompanyDetail((prev) => {
                              return {
                                ...prev,
                                district_id: 0,
                              };
                            });
                          }
                          if (id === undefined) {
                            setCompanyDetail((prev) => {
                              return {
                                ...prev,
                                district_id: 0,
                              };
                            });
                          }
                        }}
                        // label="State"
                        isClearable={false}
                      />
                    </div>
                    <div className="">
                      <CustomSelect
                        label="District: "
                        isDisabled={!companyDetail.state_id}
                        value={companyDetail.district_id}
                        options={districtTypeOption}
                        onChange={(id) => {
                          setCompanyDetail((prev) => {
                            return {
                              ...prev,
                              district_id: id ?? 0,
                            };
                          });
                        }}
                        // label="District"
                        isClearable={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 items-start border-b pb-1">
                    <div className="flex gap-4">
                      <div className="input-label-custom py-1">State:</div>
                      <span className="caption-custom text-blue-600 py-1.5">
                        {companyDetail?.state_name ?? "-"}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <div className="input-label-custom py-1">District:</div>
                      <span className="caption-custom text-blue-600 py-1.5">
                        {companyDetail?.district_name ?? "-"}
                      </span>
                    </div>
                  </div>
                )}
              </EditableSection>
            </div>

            {/* ================= TAX INFORMATION ================= */}
            <div>
              <EditableSection
                title="Tax Information"
                hasAccess={userHasAccessToUpdateCompanyDetail}
                onEdit={() => handleEditableSectionEdit("tax")}
                isEditing={editingSection === "tax"}
                onCancel={handleEditableSectionCancel}
                sectionKey="tax"
                onSave={() => {
                  handleEditableSectionSave();
                }}
                isLoading={isLoadingForCompanyDetailsUpdate}
              >
                {editingSection === "tax" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput
                      label="PAN: "
                      name="pan"
                      value={companyDetail?.pan ?? ""}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      onBlur={handleBlur}
                      onChange={handleCompanyDetailsChange}
                      error={formErrors.pan}
                    />

                    <FormInput
                      label="GST: "
                      name="gst"
                      value={companyDetail?.gst ?? ""}
                      onChange={handleCompanyDetailsChange}
                      onBlur={handleBlur}
                      error={formErrors.gst}
                    />

                    <FormInput
                      label="TAN: "
                      name="tan"
                      value={companyDetail?.tan ?? ""}
                      onChange={handleCompanyDetailsChange}
                      onBlur={handleBlur}
                      error={formErrors.tan}
                    />

                    <FormInput
                      label="CIN: "
                      name="cin"
                      value={companyDetail?.cin ?? ""}
                      onChange={handleCompanyDetailsChange}
                      onBlur={handleBlur}
                      error={formErrors.cin}
                    />

                    <FormInput
                      label="Business Registration Number: "
                      name="business_registration_number"
                      value={companyDetail?.business_registration_number ?? ""}
                      onChange={handleCompanyDetailsChange}
                      onBlur={handleBlur}
                      error={formErrors.business_registration_number}
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 items-start border-b pb-1">
                      <div className="flex gap-4">
                        <div className="input-label-custom py-1">PAN:</div>
                        <span className="caption-custom text-blue-600 py-1.5">
                          {companyDetail?.pan ?? ""}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <div className="input-label-custom py-1">GST:</div>
                        <span className="caption-custom text-blue-600 py-1.5">
                          {companyDetail?.gst ?? ""}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 items-start border-b pb-1">
                      <div className="flex gap-4">
                        <div className="input-label-custom py-1">TAN:</div>
                        <span className="caption-custom text-blue-600 py-1.5">
                          {companyDetail?.tan ?? ""}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <div className="input-label-custom py-1">CIN:</div>
                        <span className="caption-custom text-blue-600 py-1.5">
                          {companyDetail?.cin ?? ""}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 items-start border-b pb-1">
                      <div className="flex gap-4">
                        <div className="input-label-custom py-1">
                          Business Reg No:
                        </div>
                        <span className="caption-custom text-blue-600 py-1.5">
                          {companyDetail?.business_registration_number ?? ""}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </EditableSection>
            </div>

            {/* ================= ADDRESS ================= */}
            <div>
              <EditableSection
                title="Address Information"
                sectionKey="address"
                hasAccess={userHasAccessToUpdateCompanyDetail}
                onEdit={() => handleEditableSectionEdit("address")}
                isEditing={editingSection === "address"}
                onCancel={handleEditableSectionCancel}
                onSave={() => {
                  handleEditableSectionSave();
                }}
                isLoading={isLoadingForCompanyDetailsUpdate}
              >
                {editingSection === "address" ? (
                  <div className="space-y-2">
                    <TextAreaInput
                      label="Registered Office Address: "
                      name="registered_office_address"
                      value={companyDetail?.registered_office_address ?? ""}
                      onChange={handleCompanyDetailsChange}
                      rows={3}
                      cols={0}
                    />

                    <TextAreaInput
                      label="Billing Address: "
                      name="billing_address"
                      value={companyDetail?.billing_address ?? ""}
                      onChange={handleCompanyDetailsChange}
                      rows={3}
                      cols={0}
                    />

                    <TextAreaInput
                      label="Shipping Address: "
                      value={companyDetail?.shipping_address ?? ""}
                      name="shipping_address"
                      onChange={handleCompanyDetailsChange}
                      rows={3}
                      cols={0}
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="grid grid-cols-[185px_1fr] items-start border-b pb-1">
                      <div className="input-label-custom py-1">
                        Registered Office Address:
                      </div>
                      <span className="caption-custom text-blue-600 hover:text-blue-700 rounded-md py-1.5 whitespace-pre-wrap">
                        {companyDetail?.registered_office_address ?? ""}
                      </span>
                    </div>

                    <div className="grid grid-cols-[185px_1fr] items-start border-b pb-1">
                      <div className="input-label-custom py-1">
                        Billing Address:
                      </div>
                      <span className="caption-custom text-blue-600 hover:text-blue-700 rounded-md py-1.5 whitespace-pre-wrap">
                        {companyDetail?.billing_address ?? ""}
                      </span>
                    </div>

                    <div className="grid grid-cols-[185px_1fr] items-start border-b pb-1">
                      <div className="input-label-custom py-1">
                        Shipping Address:
                      </div>
                      <span className="caption-custom text-blue-600 hover:text-blue-700 rounded-md py-1.5 whitespace-pre-wrap">
                        {companyDetail?.shipping_address ?? ""}
                      </span>
                    </div>
                  </div>
                )}
              </EditableSection>
            </div>
          </div>
        </div>

        {/* PREFERENCE CARD */}
        <div
          className={` ${
            !userHasAccessToViewSettingGeneral ? "hidden" : ""
          }   bg-white rounded-2xl shadow-lg px-8 py-6 space-y-2 `}
        >
          <div className="flex items-center justify-between">
            <h3 className="section-header-custom">
              Preferences{" "}
              <span className="caption-custom">(Click Edit to change)</span>
            </h3>
          </div>
          <div className="border-t pt-4">
            <EditableSection
              hasAccess={userHasAccessToUpdateSettingGeneral}
              title=""
              sectionKey="preferences"
              onEdit={() => handleEditableSectionEdit("preferences")}
              isEditing={editingSection === "preferences"}
              onCancel={handleEditableSectionCancel}
              onSave={() => {
                if (userHasAccessToUpdateSettingGeneral) {
                  if (prevTimezoneId.current !== selectedTimezoneId) {
                    handleTimezonePreferenceChange();
                    prevTimezoneId.current = selectedTimezoneId;
                  } else if (
                    userPreference.rowsInGrid !== selectedRowsPerPage
                  ) {
                    handleTimezonePreferenceChange();
                  } else if (userPreference.countryId !== selectedCountry?.id) {
                    handleTimezonePreferenceChange();
                  } else {
                    handleEditableSectionCancel();
                  }
                } else {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.GENERAL_SETTING.DENIED_UPDATE_ACCESS,
                  );
                }
              }}
              isLoading={isLoadingForCompanyDetailsUpdate}
            >
              {editingSection === "preferences" ? (
                <div className="space-y-1">
                  {/* Time Zone */}
                  <div className="grid grid-cols-[140px_1fr] items-start border-b pb-2">
                    <div className="input-label-custom py-1">Time Zone:</div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="caption-custom">Current:</span>

                      <span className="caption-custom-blue">
                        {userPreference.timezone}
                      </span>

                      <div className="relative z-10 w-auto">
                        <CustomTimezoneDropdown
                          setShowTimeZoneData={setShowTimeZoneData}
                          timezoneData={timezoneList}
                          hasMore={hasMore}
                          loadMore={loadMore}
                          onSearchChange={handleSearchChange}
                          onSelect={(zone) => {
                            setSelectedTimeZoneData(zone);
                            setSelectedTimezoneId(zone.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Records Per Page */}
                  <div className="grid grid-cols-[140px_1fr] items-start border-b pb-2">
                    <label
                      htmlFor="records-per-page-select"
                      className="input-label-custom py-1"
                    >
                      Records Per Page:
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="caption-custom">Current:</span>

                      <span className="caption-custom-blue">
                        {userPreference.rowsInGrid}
                      </span>

                      <select
                        onClick={() => {
                          if (!userHasAccessToUpdateSettingGeneral) {
                            toast.error(
                              MESSAGE.MODULE_ACCESS.GENERAL_SETTING
                                .DENIED_UPDATE_ACCESS,
                            );
                            return;
                          }
                        }}
                        onChange={(e) => {
                          if (userHasAccessToUpdateSettingGeneral) {
                            handleSelectRowInGridOptionChange(e);
                          }
                        }}
                        value={selectedRowsPerPage}
                        id="records-per-page-select"
                        className="block caption-custom w-36 border rounded border-gray-300 shadow-sm
        focus:border-indigo-500 focus:ring-indigo-500
        text-gray-900 py-1"
                        aria-label="Select number of records per page"
                      >
                        <option value="">Select</option>

                        {rowsInGridDropdownOptions &&
                          rowsInGridDropdownOptions.map((data) => (
                            <option key={data.id} value={data.rowsInGrid}>
                              {data.rowsInGrid}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Country */}
                  <div className="grid grid-cols-[140px_1fr] items-start border-b pb-2">
                    <div className="input-label-custom py-1">Country:</div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="caption-custom">Current:</span>

                      <span className="caption-custom-blue">
                        {
                          countries.find(
                            (country: Country) =>
                              country.id === userPreference.countryId,
                          )?.name
                        }
                      </span>

                      <select
                        onClick={() => {
                          if (!userHasAccessToUpdateSettingGeneral) {
                            toast.error(
                              MESSAGE.MODULE_ACCESS.GENERAL_SETTING
                                .DENIED_UPDATE_ACCESS,
                            );
                            return;
                          }
                        }}
                        onChange={(e) => {
                          if (userHasAccessToUpdateSettingGeneral) {
                            handleSelectCountryOptionChange(e);
                          }
                        }}
                        value={selectedCountry?.id?.toString() ?? ""}
                        className="block caption-custom w-36 border rounded border-gray-300 shadow-sm
        focus:border-indigo-500 focus:ring-indigo-500
        text-gray-900 py-1"
                      >
                        <option value="">Select</option>

                        {countries &&
                          countries.map((data) => (
                            <option key={data.id} value={data.id!}>
                              {data.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Time Zone */}
                  <div className="grid grid-cols-[140px_1fr] items-start border-b pb-1">
                    <div className="input-label-custom py-1">Time Zone:</div>
                    <p
                      className="caption-custom text-blue-600 hover:text-blue-700 py-1.5"
                      aria-label="Click Edit change time zone"
                    >
                      {userPreference.timezone}
                    </p>
                  </div>

                  {/* Records Per Page */}
                  <div className="grid grid-cols-[140px_1fr] items-start border-b pb-1">
                    <div className="input-label-custom py-1">
                      Records Per Page:
                    </div>
                    <p
                      className="caption-custom text-blue-600 hover:text-blue-700 py-1.5"
                      aria-label="Click Edit change rows per page"
                    >
                      {userPreference.rowsInGrid}
                    </p>
                  </div>

                  {/* Country */}
                  <div className="grid grid-cols-[140px_1fr] items-start border-b pb-1">
                    <div className="input-label-custom py-1">Country:</div>
                    <p
                      className="caption-custom text-blue-600 hover:text-blue-700 py-1.5"
                      aria-label="Click Edit change country"
                    >
                      {
                        countries.find(
                          (country: Country) =>
                            country.id === userPreference.countryId,
                        )?.name
                      }
                    </p>
                  </div>
                </div>
              )}
            </EditableSection>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="section-header-custom">
              Current Subscription <span className="caption-custom"></span>
            </h3>
          </div>
          <div className="border-t pt-4">
            <EditableSection
              title=""
              sectionKey="subscription"
              onEdit={() => {
                navigate(ROUTES_URL.GET_SUBSCRIPTION);
              }}
              hasAccess={userHasAccessToUpdateSubscription}
              isEditing={false}
              onCancel={() => {}}
              onSave={() => {}}
              editButtonText="Update Subscription"
              isLoading={false}
              key={"subscription"}
            >
              <div className="grid grid-cols-2 items-start border-b pb-1">
                <div className="flex gap-4">
                  <div className="input-label-custom py-1">Started On:</div>
                  <span className="caption-custom text-blue-600 py-1.5">
                    {loginStatus.startDateSubscription || "-"}
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="input-label-custom py-1">Ending On:</div>
                  <span className="caption-custom text-blue-600 py-1.5">
                    {loginStatus.endDateSubscription || "Not Provided"}
                  </span>
                </div>
              </div>
            </EditableSection>
          </div>
        </div>
        <AppVersionViewCard />
      </div>
    </div>
  );
};

export default UserPreference;
