function ContactUs() {
    return (
        <div className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h2>
                    <p className="text-xl text-gray-600">
                        Have questions? Get in touch with us!
                    </p>
                </div>

                <div className="flex justify-center"> {/* Center the iframe */}
                    <div className="bg-transparent p-6 rounded-xl"> {/* Optional styling container */}
                        <iframe
                            src="http://127.0.0.1:5500/contact-us-form.html?client_id=React"
                            width="600px"
                            height="650px"
                        ></iframe>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ContactUs;