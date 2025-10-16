import CompanySecret from "../../../../@types/settings/CompanySecret";
import AllowedDomains from "./AllowedDomains";
import WebFormEmbed from "./WebFormEmbed";

function ProductFormIntegration({
    companySecretList,
    handleCompanySecretChange,
} : {
    companySecretList : CompanySecret[];
    handleCompanySecretChange : () => void;
}){
    return(
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1 min-h-full">
            <div className="w-full min-h-full">
              <AllowedDomains companySecretList={companySecretList} integrationFor="product"/>
            </div>
          </div>

          <div className="col-span-1">
            <WebFormEmbed
            companySecretList={companySecretList}
            integrationFor="product"
            handleCompanySecretChange={handleCompanySecretChange}
            />
          </div>
        </div>
    )
};
export default ProductFormIntegration;