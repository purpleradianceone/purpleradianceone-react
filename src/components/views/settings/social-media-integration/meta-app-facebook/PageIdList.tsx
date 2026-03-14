import { useEffect, useState } from "react";
import {
  disconnectFacebookPage,
  getFacebookPageDetails,
} from "../../../../../config/apis/IntegrationApis";
import { STATUS_CODE } from "../../../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import { FacebookPageDetails } from "../../../../../@types/FacebookIntegration/FacebookPageDetails";
import { handleApiError } from "../../../../../config/error/handleApiError";
import StatusChip from "../../../../ui/StatusChip";
import Button from "../../../../ui/Button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import FacebookPageSkeleton from "./PafeIdListCardPopUp";

export const PageIdList = ({
    refreshCount
}:{
    refreshCount : number
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [loadingPageList, setLoadingPageList] = useState<boolean>(false);

  const [facebookPageDetailsList, setFacebookPageDetailsList] = useState<
    FacebookPageDetails[]
  >([]);
  const getFacebookPageListApiCall = async () => {
    try {
        //Note : make it null before the api call
        setFacebookPageDetailsList([]);
      //Note : set loading state to true
      setLoadingPageList(true);

      //Note : api call with the post data
      const response = await getFacebookPageDetails({
        company_id: loginStatus.companyId,
        id: null, //Note : we are showing all the data
        facebook_company_token_id: 1,
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
        setFacebookPageDetailsList(formattedData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingPageList(false);
    }
  };
  useEffect(()=>{
        getFacebookPageListApiCall();
  },[refreshCount])
  // Note : call on the first render
  useEffect(() => {
    getFacebookPageListApiCall();
  }, []);

  const handleDeleteButtonClick = async (item: FacebookPageDetails) => {
    console.log(item);

    try {
      const response = await disconnectFacebookPage({
        company_id: loginStatus.companyId,
        id: item.id,
        page_id: item.pageId,
        isactive: false,
        updatedby_id: loginStatus.id,
      });

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      handleApiError(error);
    }finally{
        getFacebookPageListApiCall()
    }
  };

  if (loadingPageList) {
    return (
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-2">
        <FacebookPageSkeleton />
        <FacebookPageSkeleton />
      </div>
    );
  }

  if (!loadingPageList && facebookPageDetailsList.length === 0) {
   return (
  <div className="w-full flex justify-center py-10">
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-8 text-center">
      <p className="table-header-custom">
        No Facebook Page Found
      </p>
      <p className="caption-custom mt-1">
        There are no page details available for this company.
      </p>
    </div>
  </div>
);
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
      {facebookPageDetailsList &&
        facebookPageDetailsList.map((item: FacebookPageDetails) => (
          <div
            key={item.pageId}
            className="bg-white shadow-md rounded-lg p-2 border border-gray-200"
          >
            <div className="mb-2 flex justify-between">
              <div>
                <span className="caption-custom text-gray-600">
                  Page Name:{" "}
                </span>
                <span className="table-header-custom">{item.pageName}</span>
              </div>
              <Button
              title="Delete"
                className="bg-red-0 hover:bg-red-50 p-1 rounded text-rose-600 flex items-center"
                onClick={() => {
                  handleDeleteButtonClick(item);
                }}
                type="button"
              >
                {" "}
                <Trash size={14} />{" "}
              </Button>
            </div>

            <div className="mb-2">
              <span className="caption-custom text-gray-600">Page ID: </span>
              <span className="table-data-custom">{item.pageId}</span>
            </div>

            <div className="mb-2">
              <span className="caption-custom text-gray-600">Created By: </span>
              <span className="table-data-custom">{item.createdBy}</span>
            </div>

            <div className="mb-2">
              <span className="caption-custom text-gray-600">Created On: </span>
              <span className="table-data-custom">{item.createdOn}</span>
            </div>

            <div>
              <span className="caption-custom text-gray-600">Status: </span>
              <StatusChip isActive={item.isActive} />
              {/* <span
              className={`px-2 py-1 rounded text-sm ${
                item.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.isActive ? "Active" : "Inactive"}
            </span> */}
            </div>
          </div>
        ))}
    </div>
  );
};
