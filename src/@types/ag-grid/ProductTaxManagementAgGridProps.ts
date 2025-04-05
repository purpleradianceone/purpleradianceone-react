import ProductTax from "../products/ProductTaxManagementProps"

type ProductTaxManagementAgGridProps = {
    productTax: ProductTax[]
    handleCompanyProductTaxChange : (status : boolean) => void,
}

export default ProductTaxManagementAgGridProps