import { sanitizeToXhtml } from "../../utils/dom-purifier/sanitizeToXhtml";
import Button from "../ui/Button";
import axiosClient from "../../axios-client/AxiosClient";
import { handleApiError } from "../../config/error/handleApiError";

function Quotation() {
  const handleQuotationPdf = async () => {
    try {
      const payload = {
        quotationId: "QT-2026-0001",
        currency: "INR",
        pages: [
          {
            pageNo: 1,
            pageType: "QUOTATION",
            includeHeader: true,
            includeFooter: false,
            headerTemplate: "base_template_quotation/headers/quotation-header",
            footerTemplate: "base_template_quotation/footers/quotation-footer",
            contentHtml: sanitizeToXhtml(
              "<div>" +
                "<h2 style='text-align:center;'>Quotation</h2>" +
                "<p>Quotation introduction content.</p>" +
                "</div>"
            ),
            companyName: "ABC Pvt Ltd",
            companyAddress: "Pune, India",
            companyGstin: "27ABCDE1234F1Z5",
            companyLogoUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
            signatureImageUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
          },

          {
            pageNo: 2,
            pageType: "QUOTATION_ITEMS",
            includeHeader: false,
            includeFooter: false,
            headerTemplate: "base_template_quotation/headers/quotation-header",
            footerTemplate: "base_template_quotation/footers/quotation-footer",
            contentHtml: sanitizeToXhtml(
              "<div>" +
                "<h3>Items</h3>" +
                "<table style='width:100%; border-collapse:collapse;' cellpadding='0' cellspacing='0'>" +
                "<thead>" +
                "<tr>" +
                "<th style='border:1px solid #000; padding:6px;'>Sr. No.</th>" +
                "<th style='border:1px solid #000; padding:6px;'>Name</th>" +
                "<th style='border:1px solid #000; padding:6px;'>Qty</th>" +
                "<th style='border:1px solid #000; padding:6px;'>Price</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr>" +
                "<td style='border:1px solid #000; padding:6px;'>1</td>" +
                "<td style='border:1px solid #000; padding:6px;'>CRM License</td>" +
                "<td style='border:1px solid #000; padding:6px;'>2</td>" +
                "<td style='border:1px solid #000; padding:6px;'>&#8377;10,000</td>" +
                "</tr>" +
                "</tbody>" +
                "</table>" +
                "</div>"
            ),
            companyName: "ABC Pvt Ltd",
            companyAddress: "Pune, India",
            companyGstin: "27ABCDE1234F1Z5",
            companyLogoUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
            signatureImageUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
          },

          {
            pageNo: 3,
            pageType: "TERMS",
            includeHeader: false,
            includeFooter: true,
            headerTemplate: "base_template_quotation/headers/quotation-header",
            footerTemplate: "base_template_quotation/footers/quotation-footer",
            contentHtml: sanitizeToXhtml(
              "<div>" +
                "<h3>Terms &amp; Conditions</h3>" +
                "<ol>" +
                "<li>Valid for 30 days</li>" +
                "<li>GST applicable</li>" +
                "</ol>" +
                "</div>"
            ),
            companyName: "ABC Pvt Ltd",
            companyAddress: "Pune, India",
            companyGstin: "27ABCDE1234F1Z5",
            companyLogoUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
            signatureImageUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
          },
        ],
      };

      const response = await axiosClient.post(
        "http://localhost:8080/api/main/purple-crm-api/quotation/pdf",
        payload,
        {
          responseType: "blob",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${payload.quotationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to generate quotation PDF", error);
      handleApiError(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid place-items-center h-full">
        <Button onClick={handleQuotationPdf}>Quotation</Button>
      </div>
    </div>
  );
}

export default Quotation;
