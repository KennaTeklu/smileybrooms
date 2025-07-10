export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Welcome to Smiley Brooms! This Privacy Policy describes how Smiley Brooms ("we," "us," or "our") collects,
          uses, and discloses your personal information when you visit or make a purchase from{" "}
          <a href="https://www.smileybrooms.com" className="text-primary hover:underline">
            www.smileybrooms.com
          </a>{" "}
          (the "Site").
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We collect various types of information in connection with the services we provide, including:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            <strong>Personal Information:</strong> This includes your name, email address, phone number, billing and
            shipping addresses, and payment information (e.g., credit card details). We collect this when you make a
            purchase, create an account, or contact us.
          </li>
          <li>
            <strong>Usage Data:</strong> We automatically collect information about how you access and use the Site,
            such as your IP address, browser type, operating system, referring URLs, pages viewed, and the dates/times
            of your visits.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to
            track activity on our Site and hold certain information. You can instruct your browser to refuse all cookies
            or to indicate when a cookie is being sent.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We use the collected information for various purposes, including:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>To provide and maintain our Service.</li>
          <li>To process your orders and manage your account.</li>
          <li>To communicate with you, including sending order confirmations and updates.</li>
          <li>To improve and personalize your experience on the Site.</li>
          <li>To monitor the usage of our Service.</li>
          <li>To detect, prevent, and address technical issues.</li>
          <li>For marketing and promotional purposes, with your consent where required.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We may share your personal information with third parties in the following situations:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            <strong>Service Providers:</strong> We may share your data with third-party vendors, consultants, and other
            service providers who perform services on our behalf (e.g., payment processing, website hosting, analytics).
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
            response to valid requests by public authorities (e.g., a court or a government agency).
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or
            acquisition of all or a portion of our business to another company.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Data Protection Rights</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>The right to access, update, or delete the information we have on you.</li>
          <li>The right to object to our processing of your Personal Data.</li>
          <li>The right to request that we restrict the processing of your personal information.</li>
          <li>The right to data portability.</li>
          <li>The right to withdraw consent.</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
          To exercise any of these rights, please contact us using the details below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Security of Data</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          The security of your data is important to us, but remember that no method of transmission over the Internet or
          method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect
          your Personal Data, we cannot guarantee its absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          Changes to this Privacy Policy are effective when they are posted on this page.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-2">
          <li>By email: privacy@smileybrooms.com</li>
          <li>
            By visiting this page on our website:{" "}
            <a href="/contact" className="text-primary hover:underline">
              www.smileybrooms.com/contact
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
