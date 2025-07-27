type CompanyPreferencesType = {
    id : number,
    companyId : number,
    isEmailServiceOn : boolean,
    isNotificationServiceMobileOn : boolean;
    isNotificatonServiceWebOn : boolean;
    uIdWebLeadCapture : string;
    createdBy : string,
    createdOn : string,
    updatedBy : string,
    updatedOn : string
}

export default CompanyPreferencesType;