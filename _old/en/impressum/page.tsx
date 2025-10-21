"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ImpressumPageEN() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="impressum" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Legal Notice
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Legal information according to German law
          </p>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Information according to § 5 TMG */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Information according to § 5 TMG (German Telemedia Act)</h2>
              <div className="space-y-4 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Website Operator</h3>
                  <p>
                    Michael Heiduk<br />
                    Ranharzweg 18<br />
                    85521 Ottobrunn<br />
                    Germany
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Contact</h3>
                  <p>
                    Phone: +49 179 699 0707<br />
                    Email: info@pepearts.de
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">VAT ID</h3>
                  <p>
                    VAT identification number according to § 27 a of the Value Added Tax Act:<br />
                    DE123456789 (placeholder)
                  </p>
                </div>
              </div>
            </div>

            {/* EU Dispute Resolution */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">EU Dispute Resolution</h2>
              <div className="space-y-4 text-white/80">
                <p>
                  The European Commission provides a platform for online dispute resolution (ODR):
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline ml-1">
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p>
                  You can find our email address in the legal notice above.
                </p>
              </div>
            </div>

            {/* Consumer Dispute Resolution */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Consumer Dispute Resolution/Universal Arbitration Board</h2>
              <div className="space-y-4 text-white/80">
                <p>
                  We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                </p>
              </div>
            </div>

            {/* Liability for Contents */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Liability for Contents</h2>
              <div className="space-y-4 text-white/80">
                <p>
                  As service providers, we are liable for our own content on these pages in accordance with general law.
                  However, we are not under obligation to monitor third party information transmitted or stored on our website
                  or to investigate circumstances that indicate illegal activity.
                </p>
                <p>
                  Obligations to remove or block the use of information under the general laws remain unaffected.
                  However, a relevant liability is only possible from the point in time at which a concrete infringement
                  of law becomes known. If we become aware of such infringements, we will remove the relevant content immediately.
                </p>
              </div>
            </div>

            {/* Liability for Links */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Liability for Links</h2>
              <div className="space-y-4 text-white/80">
                <p>
                  Our website contains links to external websites, over whose contents we have no control.
                  Therefore, we cannot assume any liability for these external contents. The respective provider
                  or operator of the pages is always responsible for the contents of the linked pages.
                </p>
                <p>
                  The linked pages were checked for possible legal violations at the time of linking.
                  Illegal contents were not recognizable at the time of linking. However, permanent monitoring
                  of the contents of the linked pages is not reasonable without concrete evidence of a violation of the law.
                  If we become aware of legal violations, we will remove such links immediately.
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Copyright</h2>
              <div className="space-y-4 text-white/80">
                <p>
                  The content and works created by the site operators on these pages are subject to German copyright law.
                  The reproduction, editing, distribution and any kind of utilization outside the limits of copyright
                  require the written consent of the respective author or creator.
                </p>
                <p>
                  Downloads and copies of these pages are only permitted for private, non-commercial use.
                  Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected.
                  In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright
                  infringement, please inform us accordingly. If we become aware of legal violations, we will remove such content immediately.
                </p>
              </div>
            </div>

            {/* Contact for Legal Matters */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Contact for Legal Matters</h2>
              <div className="space-y-4 text-white/80">
                <p>
                  For legal inquiries or notices regarding this website, please contact:
                </p>
                <div className="font-mono text-sm bg-black/30 p-4 rounded-lg">
                  Email: info@pepearts.de<br />
                  Phone: +49 179 699 0707<br />
                  <br />
                  Postal Address:<br />
                  Michael Heiduk<br />
                  Ranharzweg 18<br />
                  85521 Ottobrunn<br />
                  Germany
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