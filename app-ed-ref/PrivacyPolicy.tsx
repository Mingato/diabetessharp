import { useEffect } from "react";
import { Shield, Lock, Eye, Mail, ChevronLeft } from "lucide-react";

const SECTIONS = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `Vigronex ("Company," "we," "us," or "our") operates the website vigronex.com and the Vigronex 90-Day Recovery Program (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or purchase our program.

Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service. We reserve the right to make changes to this policy at any time. We will notify you of any changes by updating the "Last Updated" date at the top of this page.`,
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    content: `We may collect the following categories of information:

**Personal Identification Information:** Name, email address, phone number, billing address, and payment information (processed securely by our payment processor — we never store full card numbers).

**Account Information:** Username, password (hashed), and program progress data you voluntarily provide.

**Usage Data:** IP address, browser type, operating system, referring URLs, pages visited, time spent on pages, and other diagnostic data collected automatically via cookies and similar tracking technologies.

**Communications:** Any messages you send us via email or support channels.

**Health-Related Information:** Any health information you voluntarily provide when completing our onboarding questionnaire. This information is used solely to personalize your program experience and is never sold or shared with third parties.`,
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: `We use the information we collect for the following purposes:

• **To provide and maintain the Service:** Process your order, create your account, and deliver program content.
• **To personalize your experience:** Tailor the program recommendations based on your onboarding responses.
• **To communicate with you:** Send order confirmations, program updates, support responses, and (with your consent) marketing communications.
• **To process payments:** Facilitate secure payment processing through our third-party payment processor.
• **To improve our Service:** Analyze usage patterns to enhance features, fix bugs, and optimize the user experience.
• **To comply with legal obligations:** Respond to legal requests, enforce our terms, and protect the rights of our users and the Company.
• **To run advertising campaigns:** We may use anonymized or aggregated data to measure the effectiveness of our advertising and to create lookalike audiences on platforms such as Facebook and Google. We do not share personally identifiable information with these platforms without your consent.`,
  },
  {
    id: "cookies",
    title: "4. Cookies and Tracking Technologies",
    content: `We use cookies, web beacons, pixels, and similar tracking technologies to collect and store information about your interactions with our Service.

**Essential Cookies:** Required for the Service to function (e.g., session authentication, shopping cart).

**Analytics Cookies:** Help us understand how visitors interact with our website (e.g., Google Analytics). Data is anonymized and aggregated.

**Marketing Pixels:** We may use the Facebook Pixel and/or TikTok Pixel to measure ad performance and build custom audiences. These pixels may collect your IP address, browser information, and pages visited. You can opt out of interest-based advertising through your Facebook or TikTok account settings.

**Managing Cookies:** Most browsers allow you to refuse or delete cookies. Disabling cookies may affect the functionality of certain parts of the Service. You can also opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.`,
  },
  {
    id: "sharing",
    title: "5. Sharing Your Information",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:

**Service Providers:** We share data with trusted third-party vendors who assist us in operating the Service (e.g., payment processors, email delivery services, cloud hosting providers). These parties are contractually obligated to keep your information confidential and use it only for the services they provide to us.

**Legal Requirements:** We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).

**Business Transfers:** In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.

**Protection of Rights:** We may disclose information where we believe it is necessary to investigate, prevent, or take action regarding illegal activities, suspected fraud, or violations of our Terms of Use.`,
  },
  {
    id: "data-security",
    title: "6. Data Security",
    content: `We implement industry-standard security measures to protect your personal information, including:

• SSL/TLS encryption for all data transmitted between your browser and our servers
• Encrypted storage of passwords using bcrypt hashing
• PCI-DSS Level 1 compliant payment processing (we never store full card numbers)
• Regular security audits and vulnerability assessments
• Access controls limiting employee access to personal data on a need-to-know basis

Despite these measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security and encourage you to use strong, unique passwords for your account.`,
  },
  {
    id: "retention",
    title: "7. Data Retention",
    content: `We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law.

• **Account data:** Retained for the duration of your account and for up to 3 years after account closure for legal and business purposes.
• **Payment records:** Retained for 7 years to comply with financial regulations.
• **Marketing data:** Retained until you unsubscribe or request deletion.

You may request deletion of your personal data at any time by contacting us at support@vigronex.com. We will honor deletion requests within 30 days, subject to legal retention requirements.`,
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: `Depending on your location, you may have the following rights regarding your personal information:

**All Users:**
• **Access:** Request a copy of the personal data we hold about you.
• **Correction:** Request correction of inaccurate or incomplete data.
• **Deletion:** Request deletion of your personal data ("right to be forgotten").
• **Opt-out of marketing:** Unsubscribe from marketing emails at any time via the unsubscribe link in any email.

**California Residents (CCPA):**
• Right to know what personal information is collected, used, shared, or sold.
• Right to delete personal information held by businesses.
• Right to opt-out of the sale of personal information (we do not sell personal information).
• Right to non-discrimination for exercising CCPA rights.

**European Residents (GDPR):**
• Right to data portability.
• Right to restrict processing.
• Right to object to processing.
• Right to lodge a complaint with a supervisory authority.

To exercise any of these rights, contact us at support@vigronex.com.`,
  },
  {
    id: "third-party",
    title: "9. Third-Party Links",
    content: `Our Service may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies. This Privacy Policy applies only to information collected by Vigronex.`,
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: `Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us at support@vigronex.com and we will take steps to delete such information.`,
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: `If you have questions or concerns about this Privacy Policy or our data practices, please contact us:

**Email:** support@vigronex.com
**Website:** vigronex.com
**Mailing Address:** Vigronex, LLC — Available upon request

We will respond to all inquiries within 5 business days.`,
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Header */}
      <div className="bg-[#0d0d1a] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="text-white/40 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <h1 className="text-white font-black text-base">Privacy Policy</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 mb-8 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-blue-400" />
          </div>
          <h2 className="text-white font-black text-2xl mb-2">Your Privacy Matters</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-lg mx-auto">
            We are committed to protecting your personal information and your right to privacy. This policy explains exactly what data we collect, why, and how we protect it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {[
              { icon: <Shield className="w-3.5 h-3.5" />, label: "GDPR Compliant" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "CCPA Compliant" },
              { icon: <Eye className="w-3.5 h-3.5" />, label: "No Data Selling" },
              { icon: <Mail className="w-3.5 h-3.5" />, label: "Opt-out Anytime" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                {b.icon} {b.label}
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs mt-4">Last Updated: March 12, 2026 · Effective Date: March 12, 2026</p>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-8">
          <h3 className="text-white font-bold text-sm mb-3">Table of Contents</h3>
          <div className="space-y-1.5">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-blue-400/70 text-xs hover:text-blue-400 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-16">
              <h2 className="text-white font-black text-base mb-3 pb-2 border-b border-white/10">
                {section.title}
              </h2>
              <div className="text-white/60 text-sm leading-relaxed space-y-3">
                {section.content.split("\n\n").map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j} className="text-white font-bold">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs mb-2">Questions about this policy?</p>
          <a
            href="mailto:support@vigronex.com"
            className="text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors"
          >
            support@vigronex.com
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-white/20 text-xs">
            <a href="/terms" className="hover:text-white/50 transition-colors">Terms of Use</a>
            <span>·</span>
            <a href="/refund-policy" className="hover:text-white/50 transition-colors">Refund Policy</a>
            <span>·</span>
            <a href="/checkout" className="hover:text-white/50 transition-colors">Back to Checkout</a>
            <span>·</span>
            <a href="/" className="hover:text-white/50 transition-colors">Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
