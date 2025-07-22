import { ShieldCheck, Lock, Info, Mail, FileText, Calendar, Video } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 bg-white rounded-2xl shadow-2xl space-y-10 leading-relaxed">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-2">Privacy Policy</h1>
      <p className="text-center text-sm text-gray-500">Effective Date: 01/08/2025</p>

      {/* Section 1 */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Info className="text-blue-600" size={20} /> 1. Introduction
        </h2>
        <p>
          Welcome to <strong>Purple Crm</strong>. Your privacy is important to us. This Privacy Policy explains how we
          collect, use, store, and share your data — including limited Google and Zoom user data — in accordance with
          applicable data protection laws and third-party provider requirements.
        </p>
      </section>

      {/* Section 2 */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <FileText className="text-blue-600" size={20} /> 2. What Data We Collect
        </h2>

        <h3 className="text-lg font-medium mb-2">A. Basic Information</h3>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-6 text-gray-700">
          <li>Name</li>
          <li>Email address</li>
          <li>Company Name</li>
          <li>Mobile Number</li>
        </ul>

        <h3 className="text-lg font-medium mb-2">B. Google Data (via OAuth Consent)</h3>
        <p className="mb-2">We request permission to:</p>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-4">
          <li>Create and update events on your behalf in your Google Calendar</li>
          <li>Access your Google email address</li>
        </ul>
        <p className="mb-6">We do not access, read, or store your existing calendar events or full Google profile.</p>

        <h3 className="text-lg font-medium mb-2">C. Zoom Data (via OAuth Consent)</h3>
        <p className="mb-2">We may request permission to:</p>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-4">
          <li>Schedule and manage Zoom meetings on your behalf</li>
          <li>Access your Zoom user ID and email address</li>
        </ul>
        <p className="mb-4">
          We do not access your meeting recordings, transcripts, or participant data unless explicitly approved by you.
        </p>
      </section>

      {/* Section 3 */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Calendar className="text-blue-600" size={20} /> 3. How We Use Third-Party Data
        </h2>

        <h3 className="text-lg font-medium mb-2">3.1 Google Data</h3>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-4">
          <li>Creating or updating calendar events via CRM</li>
          <li>Associating events with your Google email</li>
        </ul>
        <p className="mb-4">We never use Google data for ads or analytics.</p>

        <h3 className="text-lg font-medium mb-2">3.2 Zoom Data</h3>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-4">
          <li>Scheduling Zoom meetings via CRM</li>
          <li>Linking meetings with related CRM activities</li>
        </ul>
        <p className="mb-4">We do not share Zoom data with third parties.</p>
      </section>

      {/* Section 4-6 */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <ShieldCheck className="text-blue-600" size={20} /> 4. Data Sharing
        </h2>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-6">
          <li>With trusted infrastructure/cloud providers under NDA</li>
          <li>When legally required</li>
        </ul>

        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Lock className="text-blue-600" size={20} /> 5. Data Security
        </h2>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-6">
          <li>Encryption (HTTPS)</li>
          <li>Secure login/auth mechanisms</li>
          <li>Role-based access control</li>
        </ul>

        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Video className="text-blue-600" size={20} /> 6. In-App Privacy Notice
        </h2>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-4">
          <li>Clear explanation of requested data</li>
          <li>Purpose of usage</li>
          <li>Revoking access instructions</li>
        </ul>
        <p className="mb-4">
          Manage access at:
          <br />
          <a href="https://myaccount.google.com/permissions" className="text-blue-600 underline">Google Permissions</a><br />
          <a href="https://marketplace.zoom.us/user/installed" className="text-blue-600 underline">Zoom Installed Apps</a>
        </p>
      </section>

      {/* Section 7-9 */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <ShieldCheck className="text-blue-600" size={20} /> 7. Your Rights
        </h2>
        <ul className="list-disc list-inside space-y-1 pl-4 mb-6">
          <li>Revoke Google or Zoom access anytime</li>
          <li>Request correction or deletion of your data</li>
          <li>Contact: <a href="mailto:crm@purpleradiance.com" className="text-blue-600 underline">crm@purpleradiance.com</a></li>
        </ul>

        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <FileText className="text-blue-600" size={20} /> 8. Changes to This Policy
        </h2>
        <p className="mb-6">
          We may update this policy. Updates will be posted here with a new date. Continued use indicates acceptance.
        </p>

        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Mail className="text-blue-600" size={20} /> 9. Contact Us
        </h2>
        <p>Email: <a href="mailto:crm@purpleradiance.com" className="text-blue-600 underline">crm@purpleradiance.com</a></p>
        <p>Address: PurpleRadiance™ Technologies Pvt. Ltd., Office No. 7, Chandhere complex, Near Four Points Hotel, Nagar Road, Vimannagar, Pune - 411014</p>
        <p>Website: <a href="https://cdranalysis.com" className="text-blue-600 underline">cdranalysis.com</a></p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
