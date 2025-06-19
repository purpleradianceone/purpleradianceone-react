/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AllCommunityModule,
  ColDef,
  themeAlpine,
} from "ag-grid-community";
import { useMemo, useState, useEffect } from "react";
import { INNERHTML } from "../../constants/AppConstants";
import { AgGridReact } from "ag-grid-react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import LeadContactType from "../../@types/lead-management/LeadContact";
import { X } from "lucide-react";

function CompanyLeadContactsSelectionAgGrid({
  isOpen,
  selectedLeadId,
  onClose,
  addCompanyLeadContactIdArray,
  handleCompanyLeadContactCheckBoxChange
}: {
  isOpen: boolean;
  selectedLeadId?: number;
  onClose: () => void;
  addCompanyLeadContactIdArray?: number[];
  handleCompanyLeadContactCheckBoxChange? : (data : LeadContactType , event : React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { loginStatus } = useLoggedInUserContext();

  const [leadContact, setLeadContact] = useState<LeadContactType[]>([]);

  const fetchLeadContact = async () => {
    const postDataGetLeadContact = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadId,
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
      .catch((error) => {
        alert("exception in fetch lead contact  :" + error);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeadContact();
    }
  }, [selectedLeadId, isOpen]);

  const leadContactsColDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        comparator: (valueA, valueB) => {
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        },
        
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        flex: 1.5,
      },
      {
        field: "mobileNumber",
        headerName: "Mobile Number",
        sortable: true,
        filter: true,
        flex: 1.5,
      },
      {
        headerName: "Select",
        sortable: true,
        filter: false,
        pinned: "right",
        width: 100,
        cellRenderer: (params: any) => {
         

           const isChecked = addCompanyLeadContactIdArray
              ? addCompanyLeadContactIdArray.includes(params.data.id)
              : false;

           return (
              <div className="flex flex-col ml-2 items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  onChange={(event) => {
handleCompanyLeadContactCheckBoxChange!(params.data, event);
                       
                       
                  }}
                  
                />
              </div>
            );
        },
        
      },
    ],
    // Include dependencies that affect the rendering.

    [leadContact,addCompanyLeadContactIdArray]
    //[addCompanyTeamUserArray, companyUsers]
    //need to check the above code
  );

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: 30,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
      // headerClass: "bg-blue-300",

    };
  }, [leadContact]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="grid max-w-4xl mt-1 w-full p-4 bg-white rounded-lg shadow-xl overflow-y-auto">
        <div className="flex justify-between">
          <div className="text-gray-500 font-bold text-lg">Add Lead Contacts To Meeting</div>
<button
          className="place-self-end mb-6"
          onClick={() => {
            onClose();
          }}
        >
          <X></X>
        </button>

        </div>
        
        <div
          // className="ag-theme-balham w-full "
          style={{ height: "70vh", width: "100%" }}
        >
          <AgGridReact
            rowData={leadContact}
            columnDefs={leadContactsColDefs}
            defaultColDef={defaultColDef}
            modules={[AllCommunityModule]}
            overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
            theme={themeAlpine}
            // onViewportChanged={handleViewPortChanged}
            // onGridReady={onGridReady}
            // rowClass="bg-blue-300 text-xs"
          />
        </div>
      </div>

    </div>
  );
}

export default CompanyLeadContactsSelectionAgGrid;
