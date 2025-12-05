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


    <div className="contact-form-container">
      <h2>Contact Form - Lead</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: `<iframe 
            id="contact-form-iframe" 
           src="${BASE_URL_FOR_FORM_INTEGRATION}/embed/contact_us_form.html?client_id=ac028b51-c7d1-4599-a730-e7d7dfa80575" 

            width="50%" 
            height="700px" 
            frameborder="0"
          ></iframe>`,
        }}
      />
    </div>
  );
}

export default ContactUs;
