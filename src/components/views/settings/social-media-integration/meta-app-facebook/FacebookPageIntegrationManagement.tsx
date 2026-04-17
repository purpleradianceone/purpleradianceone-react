/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import { handleApiError } from "../../../../../config/error/handleApiError";
import FormSkeleton from "../../../../modals/Account/FormSkeleton";
import FormHeader from "../../../../ui/FormHeader";
import {  Plus, Save, Trash } from "lucide-react";
import Button from "../../../../ui/Button";
import FormLayout from "../../../../ui/FormLayout";
import {
  createConnectFacebookPage,
  disconnectFacebookPage,
  getFacebookComapnyStatus,
  getFacebookPageDetails,
  getMeFacebookAccounts,
} from "../../../../../config/apis/IntegrationApis";
import { FacebookPageDetails } from "../../../../../@types/FacebookIntegration/FacebookPageDetails";
import { STATUS_CODE } from "../../../../../constants/AppConstants";
import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";
import { FaFacebook } from "react-icons/fa";
import MetaAppWhatsappIntegration from "../meta-app-whatsapp/MetaIntegrationDeniedMessage";
import { ResponseStatus } from "../MetaAppsIntegration";
import FacebookPageSkeleton from "./PafeIdListCardPopUp";
import { useUserAccessModules } from "../../../../../config/hooks/useAccessModules";
import MESSAGE from "../../../../../constants/Messages";

export const FacebookPageIntegrationManagement = () => {
  const { loginStatus } = useLoggedInUserContext();

  const {userHasAccessToAddIntegrationSetting, userHasAccessToUpdateIntegrationSetting} = useUserAccessModules();
  const [openCreatePopUp, setOpenCreatePopUp] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [loadingFacebookList, setLoadingFacebookList] =
    useState<boolean>(false);
  const [loadingFacebook, setLoadingFacebook] = useState<boolean>(false);

  const [facebookData, setFacebookData] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedPageData, setSelectedPageData] = useState<any>(null);

  const [companyFacebookPages, setCompanyFacebookPages] = useState<
    FacebookPageDetails[]
  >([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [facebookStatus, setFacebookStatus] = useState<ResponseStatus>({
    createdBy: "",
    createdOn: "",
    expiringOn: "",
    id: 0,
    isActive: false,
  });

  const getFacebookStatus = async () => {
    // Note : loading state true
    setLoading(true);

    try {
      // Note : post data
      const postData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
      };

      // Note : api call here
      const response = await getFacebookComapnyStatus(postData);
      if (response.status === STATUS_CODE.OK) {
        const res = response.data;

        const formattedData: ResponseStatus = {
          createdBy: res.createdby,
          createdOn: res.createdon,
          expiringOn: res.expiringOn,
          id: res.id,
          isActive: res.isactive,
        };
        setFacebookStatus(formattedData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Note : api call on first render
  useEffect(() => {
    getFacebookStatus();
  }, []);

  /*
   * Fetch Facebook onboarding structure
   * Business → Pages
   */
  const getFacebookAccounts = async () => {
    try {
      setLoadingFacebook(true);

      const response = await getMeFacebookAccounts({
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
      });

      if (response?.status === 200) {
        const result = response.data;

        if (Array.isArray(result)) {
          setFacebookData(result);
          return;
        }

        if (result && typeof result === "object") {
          if (!result.status) {
            toast.error(result.message ?? "Operation failed");
            return;
          }

          setFacebookData(result);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingFacebook(false);
    }
  };

  /*
   * Get already integrated pages
   */
  const getCompanyFacebookPages = async () => {
    try {
      setLoadingFacebookList(true);

      const response = await getFacebookPageDetails({
        company_id: loginStatus.companyId,
        isactive: true,
        requestedby: loginStatus.id,
      });

      if (response.status === STATUS_CODE.OK) {
        const data = response.data;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData = data.map((item: any) => ({
          id: item.id,
          pageId: item.page_id,
          pageName: item.page_name,
          isActive: item.isactive,
          createdBy: item.createdby,
          updatedBy: item.updatedby,
          createdOn: item.createdon,
          updatedOn: item.updatedon,
        }));
        setCompanyFacebookPages(formattedData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingFacebookList(false);
    }
  };

  useEffect(() => {
    getCompanyFacebookPages();
  }, []);

  /*
   * Save Selected Page
   */
  //Need to work on this
  const handleSaveSelectedPage = async () => {
    if (!selectedPageData) {
      toast.error("Please select a page first.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        company_id: loginStatus.companyId,
        page_id: selectedPageData.pageId.trim(),
        company_user_id: loginStatus.id,
        createdby_id: loginStatus.id,
      };

      const response = await createConnectFacebookPage(payload);

      if (response.data.status) {
        toast.success(response.data.message);
        setOpenCreatePopUp(false);
        setSelectedPage(null);
        setFacebookData([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
      getCompanyFacebookPages();
    }
  };

  /*
   * Disconnect Page
   */
  const handleDisconnectPage = async (item: FacebookPageDetails) => {
    if(!userHasAccessToUpdateIntegrationSetting){
        toast.error(MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_UPDATE_ACCESS);
        return;
    }
    try {
      setIsDeleting(true);
      const response = await disconnectFacebookPage({
        company_id: loginStatus.companyId,
        id: item.id,
        page_id: item.pageId,
        isactive: false,
        updatedby_id: loginStatus.id,
      });

      if (response.data.status) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      getCompanyFacebookPages();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <FormSkeleton />;
  }

  // Note : if the facebook is not integrated then , this card will show
  if (!loading && !facebookStatus.isActive) {
    return <MetaAppWhatsappIntegration />;
  }
  return (
    <div className="min-h-72 my-5 w-full flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-3 border border-gray-200">
        <FormHeader
          icon={FaFacebook}
          iconColour="text-blue-500"
          preText="Facebook Page Integration"
          description="Connect and manage your Facebook Pages."
          children={
            <Button
              onClick={() => {
                if(!userHasAccessToAddIntegrationSetting){
                    toast.error(MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_ADD_ACCESS);
                    return;
                }
                setOpenCreatePopUp(true);
                getFacebookAccounts();
                setSelectedPage(null);
              }}
            >
              <div className="flex items-center ">
                <Plus size={14} /> Search Pages
              </div>
            </Button>
          }
        />

        {/* Already Integrated */}
        {!loadingFacebookList && companyFacebookPages.length === 0 && (
          <div className="flex items-center justify-center min-h-24">
            <span className="caption-custom">No Facebook Page Connected</span>
          </div>
        )}
        {loadingFacebookList && (
          <div className="h-fit">
            <FacebookPageSkeleton />
          </div>
        )}

        {!loadingFacebookList&& companyFacebookPages.length > 0 && (
          <div className="pt-2">
            <h3 className="table-header-custom">Currently Integrated Pages</h3>

            {companyFacebookPages.map((item: FacebookPageDetails) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div>
                  <div className="font-bold">{item.pageName}</div>
                  <div className="text-xs text-gray-500">{item.pageId}</div>
                </div>

                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Active
                </span>

                <button
                  disabled={isDeleting }
                  onClick={() => handleDisconnectPage(item)}
                >
                  {!isDeleting ? (
                    <Trash className="text-red-500 h-4 w-4" />
                  ) : (
                    <LoadingSpinner height={16} width={16} colour={"blue"} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPUP */}
      {openCreatePopUp && (
        <FormLayout width={5}>
          <FormHeader
            icon={Plus}
            preText="Integrate Facebook Page"
            description="Select any page to integrate with CRM."
            onClose={() => {
              setFacebookData([]);
              setOpenCreatePopUp(false);
              setSelectedPage(null);
            }}
          />

          {loadingFacebook && <FormSkeleton />}
          {!loadingFacebook && facebookData.length < 0 && (
            <>
              <div className="caption-custom">
                No Facebook page id associated with this facebook account.
              </div>
            </>
          )}

          {facebookData.map((business: any) => (
            <div key={business.businessId} className="border p-2 rounded mb-3">
              <h2 className="font-semibold">{business.businessName}</h2>

              {business.pages.map((page: any) => (
                <div
                  key={page.pageId}
                  className={`p-2 border rounded mt-2 cursor-pointer ${
                    selectedPage === page.pageId
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedPage(page.pageId);

                    setSelectedPageData({
                      businessId: business.businessId,
                      businessName: business.businessName,
                      pageId: page.pageId,
                      pageName: page.pageName,
                      category: page.category,
                    });
                  }}
                >
                  <div className="text-sm font-medium">{page.pageName}</div>
                  <div className="text-xs text-gray-500">{page.category}</div>
                </div>
              ))}
            </div>
          ))}

          {selectedPage && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveSelectedPage} disabled={saving}>
                {saving ? (
                  "Connecting..."
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <Save className="h-4 w-4" />
                    Connect
                  </div>
                )}
              </Button>
            </div>
          )}
        </FormLayout>
      )}
    </div>
  );
};
