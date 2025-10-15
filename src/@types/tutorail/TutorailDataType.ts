export type TutorailDataType = {
        id : number;
        companyUserId : number;
        isNavbarSeen : boolean;
        isDashboardSeen : boolean;
        isCrmDashboardSeen : boolean;
        isCompanyUserSeen : boolean;
        isCompanyUserActionsSeen : boolean;
        isLeadSeen : boolean;
        isAccountSeen : boolean;
        isProductSeen : boolean;
        isTeamSeen : boolean;
        isSettingCompanySeen : boolean;
        isSettingEmailTemplateSeen : boolean;
        isSettingIntegrationSeen : boolean;
        createdBy : string;
        updatedBy : string;
        createdOn : string;
        updatedOn : string;
}

export type TutorailsDataContextProps = {
    tutorailData : TutorailDataType;
    setTutorailData : (tutorailDataState: TutorailDataType) => void;

};