import { Handshake } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE, } from "../../constants/AppConstants";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";
import LeadManagementAgGrid from "../ag-grid/LeadManagementsAgGrid";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import CreateLeadModal from "../modals/leads/CreateLeadModal";
import { useState } from "react";
import { leadsData } from "../../constants/TestData";

function LeadManagementList() {

  const {isLargeScreen,isMediumScreen,isSmallScreen} = useScreenSize();
  const {userHasAccessToViewLead} = useUserAccessModules();
  const [isCreateLeadModalOpen,setIsCreateLeadModalOpen] = useState<boolean>(false)

  if (userHasAccessToViewLead) {
    const handleCreateLeadModalClose =() => {
      setIsCreateLeadModalOpen(false)
    }

    return (
      <div className="w-full pt-2 pl-5 pr-1 gap-1">
        <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <div className="flex w-full gap-2">
          <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
            <div className="flex  gap-2">
              {!isSmallScreen && <Handshake className="w-6 h-6 text-blue-600" />}

              {(isMediumScreen || isLargeScreen) && (
                <span className="text-1xl font-bold">Lead Management</span>
              )}
            </div>

            {isLargeScreen && (
              
                <div className="flex gap-1">
                  {/* search box flex div */}
                  <div className="relative flex items-start w-80 ">
                    <SearchInput
                      onChange={() => {
                        
                      }}
                    ></SearchInput>
                  </div>
                </div>
              
            )}
             <div className="flex gap-1">
                  <Button
                  onClick={()=>{
                    setIsCreateLeadModalOpen(true)
                  }}
                  >
                    {!isSmallScreen && <Handshake size={SIZE.TWENTY} />}
                    {isSmallScreen && <Handshake size={SIZE.EIGHT} />}
                    {isLargeScreen && JSX_CHILDREN_NAME.CREATE_LEAD}
                  </Button>
                  
                </div>
              
          </div>
          </div>
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
            <div
              className="ag-theme-alpine w-full"
              style={{ height: "460px", width: "100%" }}
            >
              <LeadManagementAgGrid
              leads={leadsData}
              />
            </div> 
            <CreateLeadModal isOpen={isCreateLeadModalOpen} onClose={handleCreateLeadModalClose}></CreateLeadModal>           
          </div>
      </div>
    );
  }
}

export default LeadManagementList;
