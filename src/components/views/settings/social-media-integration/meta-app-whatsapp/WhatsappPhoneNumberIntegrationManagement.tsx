/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../ui/Button";
import FormHeader from "../../../../ui/FormHeader";
import { MessageCircleIcon, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { handleApiError } from "../../../../../config/error/handleApiError";
import { ResponseStatus } from "../MetaAppsIntegration";
import {
  createWhatsappPhoneIntegration,
  getCompanyWhatsappPhone,
  getFacebookComapnyStatus,
  getMeWhatsappAccount,
  updateCompanyWhatsappPhone,
} from "../../../../../config/apis/IntegrationApis";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import FormSkeleton from "../../../../modals/Account/FormSkeleton";
import MetaAppWhatsappIntegration from "./MetaIntegrationDeniedMessage";
import toast from "react-hot-toast";
import { STATUS_CODE } from "../../../../../constants/AppConstants";
import FormLayout from "../../../../ui/FormLayout";

export type WhatsappPhone = {
  companyId: number;
  id: number;
  businessId: string;
  wabaId: string;
  wabaName: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  qualityRating: string;
  isActive: boolean;
  // createdBy: string | null;
  // updatedBy: string | null;
  // createdOn: string | null;
  // updatedOn: string | null;
  // createdById: string | null;
  // updatedById: string | null;
  // requestedBy: string | null;
};

/**
 * WHATSAPP PHONE NUMBER INTEGRATION COMPONENT  AND INTEGRATED WHATSAPP NUMBERS
 *
 * - Parent component - includes rules for the Whatsapp phone number integration.
 * pop up form for addition of number.
 * list of connected phone numbers.
 * @returns Component for whatsapp phone number integration
 */

export const WhatsappPhoneNumberIntegrationManagement = () => {
  const { loginStatus } = useLoggedInUserContext();

  const [openCreatePopUp , setOpenCreatePopUp] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWhatsapp, setLoadingWhatsapp] = useState<boolean>(false);
  const [whatsappData, setWhatsappData] = useState<any[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [companyWhatsappPhone, setCompanyWhatsappPhone] = useState<
    WhatsappPhone[]
  >([]);
  const [selectedPhoneData, setSelectedPhoneData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [facebookStatus, setFacebookStatus] = useState<ResponseStatus>({
    createdBy: "",
    createdOn: "",
    expiringOn: "",
    id: 0,
    isActive: false,
  });

  /*
   * Fetch WhatsApp onboarding structure
   */
  const getFacebookIntegratedWhatsappAccount = async () => {
    try {
      setLoadingWhatsapp(true);

      const response = await getMeWhatsappAccount({
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
      });

      // if (response.status === 200) {
      //   if(!response.data.status  ){
      //     toast.error(response.data.message);
      //     return;
      //   }
      //   setWhatsappData(response.data);
      // }

      if (response?.status === 200) {
  const result = response.data;

  // SCENARIO 1: It's an Array (The data list came back)
  if (Array.isArray(result)) {
    setWhatsappData(result);
    return; // Exit early
  }

  // SCENARIO 2: It's an Object with a status check
  if (result && typeof result === 'object') {
    if (!result.status) {
      toast.error(result.message ?? "Operation failed");
      return;
    }
    
    // If status is true but it's not an array, maybe it's a single item?
    setWhatsappData(result); 
    return;
  }

  // FALLBACK: Unexpected data format
  console.error("Unexpected response format", result);
}
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingWhatsapp(false);
    }
  };

  /*
   * Check Facebook Integration Status
   */
  const getFacebookStatus = async () => {
    setLoading(true);

    try {
      const response = await getFacebookComapnyStatus({
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
      });

      if (response.status === 200) {
        const res = response.data;

        setFacebookStatus({
          createdBy: res.createdby,
          createdOn: res.createdon,
          expiringOn: res.expiringOn,
          id: res.id,
          isActive: res.isactive,
        });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  //get the company integrated whatsapp phone details
  const getCompanyWhatsappPhoneApiCall = async () => {
    setLoading(true)
    try {
      const response = await getCompanyWhatsappPhone({
        company_id: loginStatus.companyId,
        id: null,
        isactive: true,
        requestedby: loginStatus.id,
      });

      // if (response.status === STATUS_CODE.OK) {
      const res = response.data;
      const formattedData: WhatsappPhone[] = res.map((item: any) => ({
        companyId: item.company_id,
        id: item.id,
        businessId: item.business_id,
        wabaId: item.waba_id,
        wabaName: item.waba_name,
        phoneNumberId: item.phone_number_id,
        displayPhoneNumber: item.display_phone_number,
        verifiedName: item.verified_name,
        qualityRating: item.quality_rating,
        isActive: item.isactive,
        // createdBy: item.createdby,
        // updatedBy: string | null;
        // createdOn: string | null;
        // updatedOn: string | null;
        // createdById: string | null;
        // updatedById: string | null;
        // requestedBy: string | null;
      }));
      console.log("this is formatted data ");
      console.log(formattedData);

      setCompanyWhatsappPhone(formattedData);
      // }
    } catch (error) {
      handleApiError(error);
    }finally{
      setLoading(false)
    }
  };

  //call on the render
  useEffect(() => {
    getFacebookStatus();
    getCompanyWhatsappPhoneApiCall();
  }, []);

  const handleSaveSelectedPhone = async () => {
    if (!selectedPhoneData) {
      alert("Please select a phone number first.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        company_id: loginStatus.companyId,
        business_id: selectedPhoneData.businessId,
        waba_id: selectedPhoneData.wabaId,
        waba_name: selectedPhoneData.wabaName,
        phone_number_id: selectedPhoneData.phoneNumberId,
        display_phone_number: selectedPhoneData.displayPhoneNumber,
        verified_name: selectedPhoneData.verifiedName,
        quality_rating: selectedPhoneData.qualityRating,
        createdby_id: loginStatus.id,
      };

      const response = await createWhatsappPhoneIntegration(payload);

      if (response.data.status) {
        toast.success(response.data.message);
        setOpenCreatePopUp(false);
        setSelectedPhone(null)
        setWhatsappData([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
      getCompanyWhatsappPhoneApiCall()
    }
  };

  //Note : disconnect the whatsapp phone number using this api
  const handleUpdateWhatsappPhone = async (id: number) => {
    if (id == null) {
      return;
    }

    await updateCompanyWhatsappPhone({
      company_id: loginStatus.companyId,
      id: id,
      isactive: false,
      updatedby_id: loginStatus.id,
    })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        }
        getCompanyWhatsappPhoneApiCall()
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <FormSkeleton />
      </div>
    );
  }

  if (!facebookStatus.isActive) {
    return <MetaAppWhatsappIntegration />;
  }

  return (
    <div className="min-h-72 h-fit my-5 w-full flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full md:p-3 border border-gray-200">
        <FormHeader
          icon={MessageCircleIcon}
          preText="Whatsapp Phone Number Integration"
          description="Connect and manage your Whatsapp Account."
          children={
            <Button onClick={()=>{
              setOpenCreatePopUp(true)
              getFacebookIntegratedWhatsappAccount()
              setWhatsappData([])
              setSelectedPhone(null)
            }}>
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <span>Search Accounts</span>
              </div>
            </Button>
          }
        />

        
        <div className=" space-y-6">
          {/* If there is no whatsapp account is connected then show this  */}
          {
            companyWhatsappPhone.length ==0 &&(
              <div className="flex items-center justify-center min-h-24">
                <span className="caption-custom">No Whatsapp Account Connected</span>
                </div>
            )
          }
          {/*  Render WhatsApp Structure  */}
          {companyWhatsappPhone.length > 0 && (
            <div className="  pt-2">
              <h3 className="table-header-custom tracking-wider">
                Currently Integrated Number
              </h3>
              <div className="grid gap-4">
                {companyWhatsappPhone.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div>
                      <div className="font-bold text-gray-900">
                        {item.displayPhoneNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.verifiedName} • {item.wabaName}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Active
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateWhatsappPhone(item.id);
                      }}
                    >
                      <Trash className="text-red-500 h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {
        openCreatePopUp && <>
        
          <FormLayout>
           
            <FormHeader
             icon={Plus}
             onClose={()=>{
              setOpenCreatePopUp(false);
             }}
             preText="Integrate Whatsapp Account"
             description="Select any number that you want integrate with crm."
            />
             {
          loadingWhatsapp &&
          <div className="w-full h-full">
        <FormSkeleton />
      </div>
        }
  {whatsappData.map((business: any) => (
            <div key={business.businessId} className="border p-1  m-1 rounded-lg">
              <h2 className="font-semibold text-lg mb-2">
                {business.businessName}
              </h2>

              {business.whatsappAccounts.map((waba: any) => (
                <div key={waba.wabaId} className="ml-4 mb-4">
                  <h3 className="font-medium text-gray-700">{waba.wabaName}</h3>

                  <div className="ml-4 mt-2 space-y-2">
                    {waba.phoneNumbers.map((phone: any) => (
                      <div
                        key={phone.phoneNumberId}
                        className={`p-2 border rounded cursor-pointer ${
                          selectedPhone === phone.phoneNumberId
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedPhone(phone.phoneNumberId);

                          setSelectedPhoneData({
                            businessId: business.businessId,
                            businessName: business.businessName,
                            wabaId: waba.wabaId,
                            wabaName: waba.wabaName,
                            phoneNumberId: phone.phoneNumberId,
                            displayPhoneNumber: phone.displayPhoneNumber,
                            verifiedName: phone.verifiedName,
                            qualityRating: phone.qualityRating,
                          });
                        }}
                        // onClick={() => setSelectedPhone(phone.phoneNumberId)}
                      >
                        <div className="text-sm font-medium">
                          {phone.displayPhoneNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          Verified Name: {phone.verifiedName}
                        </div>
                        {phone.qualityRating && (
                          <div className="text-xs text-gray-500">
                            Quality: {phone.qualityRating}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
            {selectedPhone && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSaveSelectedPhone}
                disabled={saving}
                // className="bg-green-600 text-white"
              >
                {saving ? "Connecting..." : "Connect Selected Number"}
              </Button>
            </div>
          )}
          </FormLayout>
        </>
      }
    </div>
  );
};
// export const WhatsappPhoneNumberIntegrationManagement = () => {
//   const { loginStatus } = useLoggedInUserContext();
//   const [loading, setLoading] = useState<boolean>(false);

//   //Note : storing api response here , to show if the facebook account is connected or not
//   const [facebookStatus, setFacebookStatus] = useState<ResponseStatus>({
//     createdBy: "",
//     createdOn: "",
//     expiringOn: "",
//     id: 0,
//     isActive: false,
//   });

//   const getFacebookIntegratedWhatsappAccount = async ()=>{

//     console.log("call gone ");

//   const response   =await getMeWhatsappAccount({
//       company_id : loginStatus.companyId,
//       requestedby_id : loginStatus.id
//     })

//     console.log(response);

//   }
//   // const [refreshCount, setRefreshCount] = useState<number>(0);

//   const getFacebookStatus = async () => {
//     // Note : loading state true
//     setLoading(true);

//     try {
//       // Note : post data
//       const postData = {
//         company_id: loginStatus.companyId,
//         requestedby: loginStatus.id,
//       };

//       // Note : api call here
//       const response = await getFacebookComapnyStatus(postData);
//       console.log("this is the response");

//       console.log(response.data);

//       if (response.status === STATUS_CODE.OK) {
//         const res = response.data;

//         const formattedData: ResponseStatus = {
//           createdBy: res.createdby,
//           createdOn: res.createdon,
//           expiringOn: res.expiringOn,
//           id: res.id,
//           isActive: res.isactive,
//         };
//         setFacebookStatus(formattedData);
//       }
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Note : api call on first render
//   useEffect(() => {
//     getFacebookStatus();
//   }, []);

//   // Note : show the skeleton till api executes
//   if (loading) {
//     return (
//       <div className="w-full h-full">
//         <FormSkeleton />
//       </div>
//     );
//   }

//   // Note : if the facebook is not integrated then , this card will show
//   if (!loading && !facebookStatus.isActive) {
//     return <MetaAppWhatsappIntegration />;
//   }
//   return (
//     <div className="min-h-72 my-5 h-auto w-full flex items-center justify-center">
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
//         {/* <LeadAccessInstructions /> */}
//         <div className=" ">
//           <FormHeader
//             icon={MessageCircleIcon}
//             preText="Whatsapp Phone Number Integration"
//             description="Connect and manage your Whatsapp Account ."
//             children={
//               <Button
//                 onClick={()=>{
//                   getFacebookIntegratedWhatsappAccount();
//                 }
//               }
//               >
//                 <div className="flex items-center justify-center">
//                   <Plus size={16} /> <div>search</div>
//                 </div>
//               </Button>
//             }
//           />

//           {/* Note : connected whatsapp number list  */}
//           <div className="h-full min-h-56 flex items-center justify-center">
//             <h1 className="caption-custom">Whatsapp Account List</h1>
//             {/* here */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
