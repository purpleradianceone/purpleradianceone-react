type CompanyWarehouseType ={
    id : number ;
    companyId?: number;
    warehouseTypeId?: number;
    warehouseTypeName?: string;
    name: string ;
    description?: string;
    location?: string ;
    isactive: boolean ;
    ceatedbyId?: number;
    updatedbyId?: number;
    requestedbyId?: number;
}

export default CompanyWarehouseType;