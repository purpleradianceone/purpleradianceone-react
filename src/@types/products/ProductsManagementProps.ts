export type Product = {
    name : string,
    code : string,
    description : string,
    cost? : number,
    hsn? : string,
    sac? : string,
    
}

export type Products = {
    products : Product[]
}