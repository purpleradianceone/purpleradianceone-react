type AssignProductToLeadType={
    company_id: number,
    lead_id: number,
    input_data : ItemData[],
    createdby: number
}



export type ItemData ={
    company_product_id : number ,
    lead_interest_id : number ,
    quantity_required : number ,
    cost_expected : number ,

} 
export default AssignProductToLeadType;