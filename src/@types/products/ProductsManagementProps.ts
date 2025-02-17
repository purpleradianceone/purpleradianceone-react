export type Product = {
    name : string,
    itemCode : string,
    description : string,
    price : number,
    HSN : string,
    SAC : string,
    
}

export type Products = {
    products : Product[]
}