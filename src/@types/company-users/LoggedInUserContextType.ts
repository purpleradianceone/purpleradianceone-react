export type LoggedInUserType = {
    companyId : number,
    companyName : string,
    createdOn : string,
    email : string,
    fullName? :string,
    id : number,
    message : string,
    mobileNumber : string,
    status : boolean,
    token : string
    //subscription fields
    activeUsersInCompany:number,
    subscriptionAllowedUsers:number,
    isActiveSubscription:boolean
};  

export type LoggedInUserContextProps = {
    loginStatus : LoggedInUserType;
    setLoginStatus : (loginStatusState: LoggedInUserType) => void;

};

// company_id
// company_name
// createdon
// email
// fullname
// id
// message
// mobilenumber
// status
// token