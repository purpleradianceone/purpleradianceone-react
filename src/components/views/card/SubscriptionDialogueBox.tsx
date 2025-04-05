
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../ui/Button";
import EditSubscriptionUsersModal from "../../modals/subscription-users/EditSubscrptionUsersModal";
import UpdateSubscription from "../../subscription-module/UpdateSubscription";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";

function SubscriptionDialogueBox({
    isOpen,
    cardTitle,
    message,
    onClose,
}:{
    isOpen:boolean
    cardTitle : string,
    message : string,
    onClose : () => void
}
){


  // const handleSubscriptionComplete = () => {

  // }
  const {loginStatus}= useLoggedInUserContext();
    const [isEditSubscriptionUserModalOpen,setIsEditSubscriptionUserModalOpen] = useState<boolean>(false);
    const [isUpgradeSubscriptionModalOpen,setIsUpgradeSubscriptionModalOpen] = useState<boolean>(false);
    // const [existingActiveCompanyUser , setExistingActiveCompanyUser] = useState<number>(loginStatus.activeUsersInCompany);
  // const handleCompanyUserStatusChange = (statusChangeCount: number)  => {
  //   console.log(statusChangeCount);
    
  //   setExistingActiveCompanyUser(existingActiveCompanyUser + statusChangeCount);
  //   // if(status){
  //   //   setExistingActiveCompanyUser(existingActiveCompanyUser - 1)
  //   // }
  //   // else if(!status){
  //   //   setExistingActiveCompanyUser(existingActiveCompanyUser + 1)
  //   // }
  // }

    useEffect(()=>{
        if(!isOpen){
            localStorage.clear();
        }
    },[isOpen])




    if(!isOpen) return null;
    return (createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            // onClick={onClose}
          />
          
    
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-2 animate-in fade-in zoom-in duration-200">
            {/* <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button> */}
    
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 ">{cardTitle}</h2>
              <p className="text-gray-600">{message}</p>
            </div>
    
            <div className="flex justify-end gap-3">
              <div className='flex'>
              <Button
               onClick={() => {
                setIsEditSubscriptionUserModalOpen(true);
            }}>
               Users Modal
              </Button>
              </div>

             <div className="flex">
             <Button
               onClick={()=>{
                setIsUpgradeSubscriptionModalOpen(true);
               }}
              >
               Upgrade Subscription
              </Button>
             </div>
             
            </div>
          </div>
          <UpdateSubscription
            endDate={loginStatus.endDateSubscription}
            startDate={loginStatus.startDateSubscription}
            existingUserCount={loginStatus.subscriptionAllowedUsers}
            isOpen={isUpgradeSubscriptionModalOpen}
            subscriptionId={loginStatus.subscriptionId}
            onClose={()=>{
              setIsUpgradeSubscriptionModalOpen(false);
              onClose();
            }}
            // handleSubscriptionListChange={onClose}
            // handleSubscriptionListChange={}
          />
          <EditSubscriptionUsersModal
              isOpen={isEditSubscriptionUserModalOpen}
              onClose={()=>{
                setIsEditSubscriptionUserModalOpen(false);

              }}
              onRedirectToLoginPage={()=>{
                setIsEditSubscriptionUserModalOpen(false);
                onClose()
              }}
              // handleCompanyUserStatusChange={handleCompanyUserStatusChange}
              />
        </div>,
        document.body
      ));
};

export default SubscriptionDialogueBox;
