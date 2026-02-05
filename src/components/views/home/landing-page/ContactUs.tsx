import { useEffect } from "react";
import  {  BASE_URL_FOR_FORM_INTEGRATION } from "../../../../constants/PostApi";

function ContactUs() {
   useEffect(() => {
    const iframe = document.getElementById("contact-form-iframe") as HTMLIFrameElement | null;
    
     const iframeOrigin = BASE_URL_FOR_FORM_INTEGRATION;

    if (!iframe) return; // iframe not found — exit early

    iframe.onload = () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        console.log("Iframe loaded successfully!");
        contentWindow.postMessage(window.location.origin, iframeOrigin);

      
      } else {
        console.warn("Iframe contentWindow not available yet.");
      }
    };
  }, []);

  return (
      <div
      id="contactUs"
        className="flex w-full justify-center items-center"
        dangerouslySetInnerHTML={{
          __html: `<iframe 
            id="contact-form-iframe" 
           src="${BASE_URL_FOR_FORM_INTEGRATION}/embed/contact_us_form.html?client_id=c0aacdf2-6d22-41db-9214-3e31d7c52734" 
            height="500px" 
            width="100%"
          ></iframe>`,
        }}
      />
  );
}

export default ContactUs;
