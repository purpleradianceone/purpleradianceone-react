import { motion } from "framer-motion";
import { useEffect } from "react";

function ContactUs() {
  useEffect(() => {
    const iframe = document.getElementById(
      "contact-form-iframe"
    ) as HTMLIFrameElement;
    const iframeOrigin = "http://127.0.0.1:5500"; 
    // const iframeOrigin = "https://web-lead.netlify.app";

    if (iframe && iframe.contentWindow) {
      iframe.onload = () => {
        console.log(iframe.contentWindow);
        iframe.contentWindow!.postMessage(
          window.location.origin, // Send the origin of the React page
          iframeOrigin // Target origin to prevent security errors
        );
      };
    }
  }, []);

  return (
    <div
      id="contactUs"
      className="bg-gradient-to-t from-blue-200 via-blue-100 to-blue-50 py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-2"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h2>
          <p className="text-xl text-gray-600">
            Have questions? Get in touch with us!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="bg-transparent p-1 min-w-full flex justify-center rounded-xl">
            {/* <iframe
            id="contact-form-iframe"
          src="https://web-lead.netlify.app/contact-us-form.html?client_id=395619cb-17b4-4b4a-9d8a-c6e18e7e2201"
              width="900px"
              height="650px"
              className="rounded-xl shadow-lg border border-gray-200"
            ></iframe> */}
            <iframe
              id="contact-form-iframe"
              src={`http://127.0.0.1:5500/contact-us-form.html?client_id=8c1a4f2b-5184-40bd-8c6f-4ca0a144b367`}
              width="900px"
              height="650px"
              className="rounded-xl shadow-lg border border-gray-200"
            ></iframe>
            {/* <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-3 animate-fade-in-down">
        <h2 className="text-2xl font-extrabold text-center text-blue-700 mb-2">Get in Touch</h2>
        <form action="#" method="POST" className="space-y-1">
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" name="user_name"
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"/>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" name="user_email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"/>
            </div>

            <div>
                <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" id="mobile" name="user_mobile"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"/>
            </div>

            <div>
                <label htmlFor="requirements" className="block text-sm font-semibold text-gray-700 mb-1">Requirements</label>
                <textarea id="requirements" name="user_requirements" 
                    className="w-full px-4 py-3 h-32 rounded-lg border border-gray-300 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"></textarea>
            </div>

            <button type="button"
            
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg text-lg">
                Contact Us
            </button>
        </form>
    </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactUs;
