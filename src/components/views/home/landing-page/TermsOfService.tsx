import ROUTES_URL from "../../../../constants/Routes";

const TermsOfService = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800 min-h-screen">
      <div className="bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          Terms of Service
        </h1>
        <p className="text-sm text-center text-gray-500 mb-10">
          Effective Date: <span className="font-semibold">01/08/2025</span>
        </p>

        <section className="space-y-6 text-lg leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Purple Crm, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              If you do not agree with any part of the terms, you may not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">2. Use of Services</h2>
            <p>
              You agree to use our CRM services only for lawful purposes and in accordance with these terms. You are responsible for all activities conducted under your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">3. User Accounts</h2>
            <p>
              You may be required to create an account to access certain features. You agree to provide accurate, current, and complete information during registration and to update such information as needed.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">4. Google Integration</h2>
            <p>
              If you connect your Google account, you grant us permission to create and update events in your Google Calendar and access your email address for identification.
              We will not read or store your existing calendar events or personal data beyond what is disclosed in our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">5. Data Privacy</h2>
            <p>
              Your data privacy is governed by our{" "}
              <a href={ROUTES_URL.PRIVACY_POLICY} className="text-blue-600 underline hover:text-blue-800">
                Privacy Policy
              </a>
              . By using our services, you agree to how we handle your personal and Google data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">6. Intellectual Property</h2>
            <p>
              All content, branding, and features of Purple Crm are the intellectual property of PurpleRadiance™ Technologies Pvt. Ltd.
              You may not use, reproduce, or distribute any part without our prior written consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our services at our sole discretion, with or without notice,
              for conduct that we believe violates these Terms or is harmful to other users.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">8. Disclaimers</h2>
            <p>
              Our services are provided "as is" and "as available" without warranties of any kind. We disclaim all warranties,
              express or implied, including merchantability or fitness for a particular purpose.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, PurpleRadiance™ Technologies Pvt. Ltd. shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">10. Modifications</h2>
            <p>
              We may update these Terms from time to time. Continued use of the service constitutes acceptance of the modified terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India.
              All disputes will be subject to the jurisdiction of the courts in Pune, Maharashtra.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">12. Contact Us</h2>
            <p className="mb-2">
              Email:{" "}
              <a href="mailto:crm@purpleradiance.com" className="text-blue-600 underline hover:text-blue-800">
                crm@purpleradiance.com
              </a>
            </p>
            <p className="mb-2">
              Address: PurpleRadiance™ Technologies Pvt. Ltd., Office No. 7, Chandhere complex, Near Four Points Hotel, Nagar Road,
              Vimannagar, Pune - 411014
            </p>
            <p className="mb-2">
              Website:{" "}
              <a href="https://cdranalysis.com" className="text-blue-600 underline hover:text-blue-800">
                cdranalysis.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
