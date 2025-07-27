import { Cookie, ShieldCheck, Settings, Globe, Mail } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 bg-white rounded-2xl shadow-2xl space-y-10 leading-relaxed">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-2">Cookie Policy</h1>
      <p className="text-center text-sm text-gray-500">Effective Date: 01/08/2025</p>

      {/* Introduction */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Cookie className="text-blue-600" size={20} /> 1. What Are Cookies?
        </h2>
        <p>
          Cookies are small text files stored on your device when you visit websites. They help websites function,
          remember preferences, and collect analytics data to improve user experience.
        </p>
      </section>

      {/* How We Use Cookies */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Settings className="text-blue-600" size={20} /> 2. How We Use Cookies
        </h2>
        <ul className="list-disc list-inside pl-4 space-y-2">
          <li>Remember user preferences and settings</li>
          <li>Maintain authentication and session state</li>
          <li>Enable core features of our CRM interface</li>
          <li>Analyze site usage and performance</li>
        </ul>
      </section>

      {/* Types of Cookies */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Globe className="text-blue-600" size={20} /> 3. Types of Cookies We Use
        </h2>
        <ul className="list-disc list-inside pl-4 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for the basic operation of our CRM.</li>
          <li><strong>Functional Cookies:</strong> Help personalize your experience and remember preferences.</li>
          <li><strong>Analytics Cookies:</strong> Collect anonymous data to improve functionality and performance.</li>
        </ul>
      </section>

      {/* Managing Cookies */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <ShieldCheck className="text-blue-600" size={20} /> 4. Managing Cookies
        </h2>
        <p>
          You can control and delete cookies through your browser settings. Disabling some cookies may affect your
          experience and limit access to parts of our CRM.
        </p>
        <p className="mt-2">
          To learn more, visit:{" "}
          <a
            href="https://www.allaboutcookies.org"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.allaboutcookies.org
          </a>
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <Mail className="text-blue-600" size={20} /> 5. Contact Us
        </h2>
        <p>
          If you have questions about this Cookie Policy or how we use cookies, please contact us at:{" "}
          <a href="mailto:crm@purpleradiance.com" className="text-blue-600 underline">crm@purpleradiance.com</a>
        </p>
      </section>
    </div>
  );
};

export default CookiePolicy;
