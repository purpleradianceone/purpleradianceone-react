type Account = {
    count : number;
    id : number;
    companyId : number;
    name : string;
    email : string;
    mobileNumber : string;
    industryTypeId : number;
    industryTypeName : string;
    businessTypeId : number;
    businessTypeName : string;
    countryId : number;
    stateId : number;
    districtId : number;
    countryName : string;
    stateName : string;
    districtName : string;
    pan : string;
    gst : string;
    tan : string;
    billingAddress : string;
    shippingAddress : string;
    registeredOfficeAddress : string;
    businessResgistrationNumber : string;
    website : string;
    isActive : boolean;
    createdBy : string;
    createdOn : string;
}

export default Account;