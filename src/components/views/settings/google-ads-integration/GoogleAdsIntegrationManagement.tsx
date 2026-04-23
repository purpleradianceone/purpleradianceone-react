import { FC, useState } from "react";
import { ConnectGoogleAdsButton } from "./ConnectGoogleAdsButton";
import { GoogleAdsIntegrationStatus } from "./GoogleAdsIntegrationStatus";


 export type  GoogleIntegrationStatusType ={
    id : number ,
    companyId : number ,
    isActive : boolean
}

/**
 * THIS IS THE MANAGEMENT FILE FOR GOOGLE ADS
 * @returns 
 */
const GoogleAdsIntegrationManagement : FC = ()=>{

        const [googleIntegrationStatus , setGoogleIntegrationStatus] = useState<GoogleIntegrationStatusType |null >(null);
    return(
        <div>
            <GoogleAdsIntegrationStatus
            googleIntegrationStatus={googleIntegrationStatus}
            setGoogleIntegrationStatus={setGoogleIntegrationStatus} 
            />

            <ConnectGoogleAdsButton  
            googleIntegrationStatus={googleIntegrationStatus}
            />
        </div>
    )
}

export default GoogleAdsIntegrationManagement;