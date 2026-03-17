import { useEffect } from "react";
import { FileText, ChevronLeft, AlertTriangle, CheckCircle } from "lucide-react";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Vigronex website (vigronex.com) or purchasing the Vigronex 90-Day Recovery Program (collectively, the "Service"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, do not use the Service.

These Terms constitute a legally binding agreement between you ("User," "you," or "your") and Vigronex, LLC ("Company," "we," "us," or "our"). We reserve the right to modify these Terms at any time. Continued use of the Service after any modifications constitutes your acceptance of the updated Terms.`,
  },
  {
    id: "service-description",
    title: "2. Description of Service",
    content: `Vigronex provides a digital health and wellness program designed to support male sexual performance and hormonal health through structured exercise protocols, lifestyle guidance, and educational content. The Service includes:

• The Vigronex 90-Day Recovery Program (digital access)
• Optional add-on products (Testosterone Boost Recipe Bible, Dr. Apex AI Coach, Sofia Intimacy Assistant)
• Access to the Vigronex member portal via web browser or mobile device
• Customer support via email

The Service is provided "as is" and is subject to change without notice. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.`,
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    content: `To use the Service, you must:

• Be at least 18 years of age
• Have the legal capacity to enter into a binding contract
• Not be prohibited from using the Service under applicable law
• Provide accurate and complete registration and billing information

By using the Service, you represent and warrant that you meet all eligibility requirements. We reserve the right to terminate accounts that do not meet these requirements.`,
  },
  {
    id: "medical-disclaimer",
    title: "4. Medical Disclaimer",
    content: `**IMPORTANT: The Vigronex program is not medical advice and is not intended to diagnose, treat, cure, or prevent any disease or medical condition.**

The content provided through the Service is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider before beginning any new exercise program, dietary regimen, or health protocol — especially if you have a pre-existing medical condition, are taking prescription medications, or have had recent surgery.

We are not responsible for any adverse effects or consequences resulting from the use of any suggestions, recommendations, or procedures described in the Service. Individual results may vary. Testimonials and success stories featured on our website represent exceptional results and are not typical. Most users can expect to see improvement within 4–12 weeks with consistent adherence to the protocol.

The statements made about the Service have not been evaluated by the Food and Drug Administration (FDA).`,
  },
  {
    id: "account",
    title: "5. Account Registration and Security",
    content: `To access the full Service, you must create an account. You agree to:

• Provide accurate, current, and complete information during registration
• Maintain and promptly update your account information
• Keep your password confidential and not share it with any third party
• Notify us immediately of any unauthorized use of your account
• Be responsible for all activity that occurs under your account

You may not create more than one account per person. Accounts are non-transferable. We reserve the right to suspend or terminate accounts that violate these Terms.`,
  },
  {
    id: "purchases-refunds",
    title: "6. Purchases and Refund Policy",
    content: `**Payment:** All purchases are processed through our third-party payment processor. By making a purchase, you authorize us to charge your payment method for the full amount of your order.

**Pricing:** All prices are listed in US Dollars (USD) and are subject to change without notice. Applicable taxes may be added at checkout.

**7-Day Money-Back Guarantee:** We offer a 7-day money-back guarantee on the Vigronex 90-Day Recovery Program. If you are not satisfied with the program within 7 days of your purchase date, contact us at support@vigronex.com for a full refund. To qualify:
• Your refund request must be submitted within 7 days of the original purchase date
• You must contact us via email with your order number
• Refunds are processed within 5–10 business days to your original payment method

**Non-Refundable Items:** Add-on products (Recipe Bible, Dr. Apex, Sofia) are non-refundable once accessed. Digital content that has been downloaded or streamed is non-refundable.

**Chargebacks:** If you initiate a chargeback without first contacting us for a refund, we reserve the right to dispute the chargeback and may permanently ban your account from the Service.`,
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: `All content included in or made available through the Service — including text, graphics, logos, images, audio clips, video, digital downloads, data compilations, and software — is the property of Vigronex, LLC or its content suppliers and is protected by applicable intellectual property laws.

You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal, non-commercial use only. You may not:

• Copy, reproduce, distribute, or create derivative works from any content
• Use the content for commercial purposes without our express written consent
• Remove any copyright, trademark, or other proprietary notices
• Reverse engineer, decompile, or disassemble any software component of the Service
• Share your login credentials or allow others to access the Service through your account

Unauthorized use of our intellectual property may result in account termination and legal action.`,
  },
  {
    id: "prohibited-conduct",
    title: "8. Prohibited Conduct",
    content: `You agree not to use the Service to:

• Violate any applicable local, state, national, or international law or regulation
• Transmit any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable
• Impersonate any person or entity or falsely represent your affiliation with any person or entity
• Attempt to gain unauthorized access to any portion of the Service or any other systems or networks
• Use any automated means (bots, scrapers, crawlers) to access the Service
• Interfere with or disrupt the integrity or performance of the Service
• Upload or transmit viruses or any other malicious code
• Collect or harvest any personally identifiable information from the Service`,
  },
  {
    id: "limitation-liability",
    title: "9. Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VIGRONEX, LLC AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:

• YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICE
• ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE
• ANY CONTENT OBTAINED FROM THE SERVICE
• UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT

IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN WARRANTIES OR LIABILITY, SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.`,
  },
  {
    id: "disclaimer",
    title: "10. Disclaimer of Warranties",
    content: `THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT THE ACCURACY, COMPLETENESS, OR USEFULNESS OF ANY INFORMATION PROVIDED THROUGH THE SERVICE.`,
  },
  {
    id: "governing-law",
    title: "11. Governing Law and Dispute Resolution",
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.

Any dispute arising out of or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association (AAA), with proceedings conducted in English.

You waive any right to participate in a class action lawsuit or class-wide arbitration. Nothing in this section prevents either party from seeking injunctive or other equitable relief from a court of competent jurisdiction.`,
  },
  {
    id: "termination",
    title: "12. Termination",
    content: `We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Reasons for termination may include, but are not limited to, violation of these Terms, fraudulent activity, or abuse of the Service.

Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`,
  },
  {
    id: "contact",
    title: "13. Contact Information",
    content: `If you have any questions about these Terms of Use, please contact us:

**Email:** support@vigronex.com
**Website:** vigronex.com
**Response Time:** Within 5 business days

For urgent matters related to account security or unauthorized charges, please include "URGENT" in your email subject line.`,
  },
];

export default function TermsOfUse() {
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
            <FileText className="w-4 h-4 text-purple-400" />
            <h1 className="text-white font-black text-base">Terms of Use</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 mb-8 text-center">
          <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7 text-purple-400" />
          </div>
          <h2 className="text-white font-black text-2xl mb-2">Terms of Use</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-lg mx-auto">
            Please read these terms carefully before using the Vigronex Service. By using our Service, you agree to be bound by these terms.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {[
              { icon: <CheckCircle className="w-3.5 h-3.5" />, label: "7-Day Guarantee" },
              { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: "Medical Disclaimer" },
              { icon: <FileText className="w-3.5 h-3.5" />, label: "Delaware Law" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                {b.icon} {b.label}
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs mt-4">Last Updated: March 12, 2026 · Effective Date: March 12, 2026</p>
        </div>

        {/* Medical disclaimer callout */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-bold text-sm mb-1">Important Medical Disclaimer</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Vigronex is not medical advice and is not intended to diagnose, treat, cure, or prevent any disease. Always consult your physician before starting any new health program. See Section 4 for full details.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-8">
          <h3 className="text-white font-bold text-sm mb-3">Table of Contents</h3>
          <div className="space-y-1.5">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-purple-400/70 text-xs hover:text-purple-400 transition-colors"
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

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs mb-2">Questions about these terms?</p>
          <a
            href="mailto:support@vigronex.com"
            className="text-purple-400 text-sm font-bold hover:text-purple-300 transition-colors"
          >
            support@vigronex.com
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-white/20 text-xs">
            <a href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</a>
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
