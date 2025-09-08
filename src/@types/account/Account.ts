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
    pan : string;
    gst : string;
    tan : string;
    buillingAddress : string;
    shippingAddress : string;
    registeredOfficeAddress : string;
    businessResgistrationNumber : string;
    website : string;
    isActive : boolean;
    createdBy : string;
    createdOn : string;
}

export default Account;