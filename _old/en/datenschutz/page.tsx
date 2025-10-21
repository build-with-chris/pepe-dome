"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PrivacyPageEN() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="datenschutz" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Information on handling your personal data
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Introduction */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">1. Data Protection at a Glance</h2>

              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">General Information</h3>
                  <p>
                    The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you. For detailed information on data protection, please refer to our privacy policy listed below this text.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Data Collection on This Website</h3>
                  <p className="font-semibold text-white mb-2">Who is responsible for data collection on this website?</p>
                  <p>
                    Data processing on this website is carried out by the website operator. You can find their contact details in the imprint of this website.
                  </p>

                  <p className="font-semibold text-white mb-2 mt-4">How do we collect your data?</p>
                  <p>
                    Your data is collected when you provide it to us. This could be data you enter in a contact form, for example. Other data is automatically collected or collected after your consent when visiting the website by our IT systems. This is mainly technical data (e.g. internet browser, operating system or time of page access).
                  </p>

                  <p className="font-semibold text-white mb-2 mt-4">What do we use your data for?</p>
                  <p>
                    Part of the data is collected to ensure error-free provision of the website. Other data may be used to analyze your user behavior.
                  </p>

                  <p className="font-semibold text-white mb-2 mt-4">What rights do you have regarding your data?</p>
                  <p>
                    You have the right to receive information about the origin, recipient and purpose of your stored personal data free of charge at any time. You also have the right to request correction or deletion of this data. If you have consented to data processing, you can revoke this consent at any time for the future. You also have the right to request restriction of processing of your personal data under certain circumstances. Furthermore, you have the right to lodge a complaint with the competent supervisory authority.
                  </p>
                </div>
              </div>
            </div>

            {/* Hosting */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">2. Hosting</h2>

              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">External Hosting</h3>
                  <p>
                    This website is hosted externally. The personal data collected on this website is stored on the servers of the hosting provider(s). This may include IP addresses, contact requests, meta and communication data, contract data, contact details, names, website accesses and other data generated via a website.
                  </p>
                  <p className="mt-4">
                    External hosting is carried out for the purpose of contract fulfillment with our potential and existing customers (Art. 6 para. 1 lit. b GDPR) and in the interest of secure, fast and efficient provision of our online offer by a professional provider (Art. 6 para. 1 lit. f GDPR).
                  </p>
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">3. General Information and Mandatory Information</h2>

              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Data Protection</h3>
                  <p>
                    The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with statutory data protection regulations and this privacy policy.
                  </p>
                  <p className="mt-4">
                    When you use this website, various personal data is collected. Personal data is data that can be used to personally identify you. This privacy policy explains what data we collect and what we use it for. It also explains how and for what purpose this happens.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Information about the Responsible Party</h3>
                  <p>
                    The responsible party for data processing on this website is:
                  </p>
                  <p className="mt-2 font-mono text-sm bg-black/30 p-4 rounded-lg">
                    PepeArts<br />
                    c/o Anna-Theresa Freeman<br />
                    Ostpark<br />
                    81925 München<br />
                    <br />
                    Phone: +49 179 699 0707<br />
                    Email: info@pepearts.de
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Revocation of Your Consent to Data Processing</h3>
                  <p>
                    Many data processing operations are only possible with your express consent. You can revoke already given consent at any time. The legality of data processing carried out until the revocation remains unaffected by the revocation.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Right to Object to Data Collection in Special Cases</h3>
                  <p>
                    If data processing is based on Art. 6 para. 1 lit. e or f GDPR, you have the right to object to processing of your personal data at any time for reasons arising from your particular situation; this also applies to profiling based on these provisions. You can find the respective legal basis on which processing is based in this privacy policy.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Right to Data Portability</h3>
                  <p>
                    You have the right to have data that we process automatically on the basis of your consent or in fulfillment of a contract handed over to you or to a third party in a common, machine-readable format.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Collection */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">4. Data Collection on This Website</h2>

              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Contact Forms</h3>
                  <p>
                    If you send us inquiries via the contact form, your data from the inquiry form including the contact details you provide there will be stored by us for the purpose of processing the inquiry and in case of follow-up questions. We do not pass on this data without your consent.
                  </p>
                  <p className="mt-4">
                    The processing of data entered in the contact form is based exclusively on your consent (Art. 6 para. 1 lit. a GDPR). You can revoke this consent at any time. The legality of data processing operations carried out until the revocation remains unaffected by the revocation.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Inquiry by Email, Phone or Fax</h3>
                  <p>
                    If you contact us by email, phone or fax, your inquiry including all resulting personal data (name, inquiry) will be stored and processed by us for the purpose of processing your request. We do not pass on this data without your consent.
                  </p>
                  <p className="mt-4">
                    The processing of this data is based on Art. 6 para. 1 lit. b GDPR if your inquiry is related to the fulfillment of a contract or is necessary for the implementation of pre-contractual measures. In all other cases, the processing is based on our legitimate interest in the effective processing of inquiries sent to us (Art. 6 para. 1 lit. f GDPR) or on your consent (Art. 6 para. 1 lit. a GDPR) if this was requested.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">5. Contact</h2>

              <div className="space-y-4 text-white/80">
                <p>
                  If you have questions about data protection, please contact us directly:
                </p>
                <div className="font-mono text-sm bg-black/30 p-4 rounded-lg">
                  Email: info@pepearts.de<br />
                  Phone: +49 179 699 0707
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}