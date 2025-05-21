export type Product = {
    code : string,
    companyId? : number,
    cost? : number,
    count? : number,
    createdBy? : string,
    createdOn? : string,
    description : string,
    hsn? : string,
    id? : number,
    isActive? : boolean,
    name : string,
    sac? : string,
    taxRate? : number,
    validFrom? : string,
    
}
export type Products = {
    products : Product[]
}