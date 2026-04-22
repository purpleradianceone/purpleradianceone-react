
type CompanyQuotationItemProps = {
    id: number,
    company_quotation_id: number,
    company_product_id: number,
    company_product_name: string,
    lead_company_product_id: number,
    hsn: string,
    sac: string,
    quantity: number,
    rate: number,
    basic_value: number,
    discount_percent: number,
    discount_amount: number,
    taxable_value: number,
    cgst_percent: number,
    sgst_percent: number,
    igst_percent: number,
    cess_percent: number,
    cgst_amount: number,
    sgst_amount: number,
    igst_amount: number,
    cess_amount: number,
    total_tax: number,
    total_amount: number,
    isactive: number,
    createdby?: string,
    updatedby?: string,
    createdon?: string,
    updatedon?: string,

}

export default CompanyQuotationItemProps;