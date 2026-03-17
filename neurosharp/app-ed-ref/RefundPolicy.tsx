import { useEffect } from "react";
import { ChevronLeft, RefreshCw, CheckCircle, XCircle, Clock, Mail, AlertTriangle, Shield } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Email Us Within 7 Days",
    description: "Send an email to support@vigronex.com with your order number and the subject line \"Refund Request.\" Your request must be submitted within 7 calendar days of your original purchase date.",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    number: "02",
    title: "We Confirm Your Request",
    description: "Our support team will confirm receipt of your request within 24 business hours and begin processing. No lengthy questionnaires, no justification required.",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    number: "03",
    title: "Refund Processed",
    description: "Your full refund is returned to your original payment method within 5–10 business days, depending on your bank or card issuer.",
    icon: <RefreshCw className="w-5 h-5" />,
  },
];

const ELIGIBLE = [
  "Vigronex 90-Day Recovery Program — within 7 days of purchase",
  "Vigronex 90-Day Recovery Program at discounted price — within 7 days of purchase",
  "Duplicate charges or billing errors — at any time",
  "Technical issues preventing access — at any time, pending investigation",
];

const NOT_ELIGIBLE = [
  "Testosterone Boost Recipe Bible — non-refundable once accessed",
  "Dr. Apex 24h Medical AI — non-refundable once accessed",
  "Sofia Fantasy & Intimacy Assistant — non-refundable once accessed",
  "Requests submitted after 7 calendar days from the original purchase date",
  "Accounts found to have violated our Terms of Use",
];

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Sticky Header */}
      <div className="bg-[#0d0d1a] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-green-400" />
            <h1 className="text-white font-black text-base">Refund Policy</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6 mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-1.5 text-green-400 text-xs font-black mb-3">
            ✅ 7-DAY IRON-CLAD MONEY-BACK GUARANTEE
          </div>
          <h2 className="text-white font-black text-2xl mb-2 leading-tight">
            We Stand Behind<br />Every Purchase
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
            If you're not satisfied within 7 days of your purchase, we'll refund 100% of your money — no questions asked, no hoops to jump through.
          </p>
          <p className="text-white/20 text-xs mt-4">
            Last Updated: March 12, 2026 · Effective Date: March 12, 2026
          </p>
        </div>

        {/* How to Request — 3 steps */}
        <div className="mb-8">
          <h2 className="text-white font-black text-lg mb-4">How to Request a Refund</h2>
          <div className="space-y-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 text-green-400">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 font-black text-xs">STEP {step.number}</span>
                  </div>
                  <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
            <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-white/60 text-xs">
              Refund email:{" "}
              <a
                href="mailto:support@vigronex.com?subject=Refund%20Request"
                className="text-green-400 font-bold hover:text-green-300 transition-colors"
              >
                support@vigronex.com
              </a>{" "}
              — Subject: <span className="text-white font-semibold">"Refund Request"</span>
            </p>
          </div>
        </div>

        {/* Eligible / Not Eligible */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {/* Eligible */}
          <div className="bg-[#0d0d1a] border border-green-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <h3 className="text-green-400 font-black text-sm">Eligible for Refund</h3>
            </div>
            <ul className="space-y-2.5">
              {ELIGIBLE.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/60 text-xs leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Eligible */}
          <div className="bg-[#0d0d1a] border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-4 h-4 text-red-400" />
              <h3 className="text-red-400 font-black text-sm">Not Eligible for Refund</h3>
            </div>
            <ul className="space-y-2.5">
              {NOT_ELIGIBLE.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/60 text-xs leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-white font-black text-sm">Refund Timeline</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Refund request submitted", time: "Day 0", color: "text-white" },
              { label: "Confirmation email from our team", time: "Within 24 business hours", color: "text-amber-400" },
              { label: "Refund initiated to your payment method", time: "Within 2 business days", color: "text-amber-400" },
              { label: "Refund visible in your account", time: "5–10 business days (bank dependent)", color: "text-green-400" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/60 text-xs">{row.label}</span>
                <span className={`text-xs font-bold ${row.color}`}>{row.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chargeback warning */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-bold text-sm mb-1">Please Contact Us Before Filing a Chargeback</p>
            <p className="text-white/50 text-xs leading-relaxed">
              If you have a billing concern, please email us first at{" "}
              <a href="mailto:support@vigronex.com" className="text-amber-400 underline">
                support@vigronex.com
              </a>
              . We resolve all legitimate issues quickly and without hassle. Chargebacks initiated without first contacting us may result in permanent account suspension and may be disputed with supporting transaction evidence.
            </p>
          </div>
        </div>

        {/* Full Policy Text */}
        <div className="space-y-6 mb-10">
          <h2 className="text-white font-black text-lg border-b border-white/10 pb-2">Full Refund Policy</h2>

          <div>
            <h3 className="text-white font-bold text-sm mb-2">1. Overview</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Vigronex, LLC ("Company") offers a 7-day money-back guarantee on the Vigronex 90-Day Recovery Program. This policy applies to purchases made directly through vigronex.com. We are committed to customer satisfaction and will process all eligible refund requests promptly and without unnecessary friction.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-2">2. Eligibility Window</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Refund requests must be submitted within 7 calendar days of the original purchase date. The purchase date is defined as the date and time the transaction was completed and confirmed via email receipt. Requests submitted on day 8 or later will not be eligible for a refund under this policy.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-2">3. Refund Process</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              To request a refund, send an email to support@vigronex.com with (a) the subject line "Refund Request," (b) your full name, (c) the email address used at checkout, and (d) your order number (found in your purchase confirmation email). No additional justification is required. Our team will confirm receipt within 24 business hours and initiate the refund within 2 business days. Refunds are returned to the original payment method and typically appear within 5–10 business days depending on your financial institution.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-2">4. Non-Refundable Products</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              The following add-on products are non-refundable once accessed, as they constitute immediately delivered digital content: (a) Testosterone Boost Recipe Bible, (b) Dr. Apex 24h Medical AI, (c) Sofia Fantasy & Intimacy Assistant. By purchasing these products, you acknowledge and agree that access constitutes delivery and waive any right to a refund for these items.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-2">5. Billing Errors</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              If you were charged incorrectly, charged more than once, or charged for a product you did not order, please contact us immediately at support@vigronex.com. Billing errors are corrected at any time, regardless of the 7-day window, and are given priority handling.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-2">6. Chargebacks and Disputes</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              We strongly encourage customers to contact us directly before initiating a chargeback with their bank or card issuer. We resolve all legitimate refund requests within our stated timeline. If a chargeback is filed without prior contact, we reserve the right to (a) dispute the chargeback with transaction evidence, (b) permanently suspend the associated account, and (c) report the dispute to fraud prevention services. This policy exists to protect our customers and the integrity of our payment processing relationships.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-2">7. Modifications</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to this page. The "Last Updated" date at the top of this page reflects the most recent revision. Continued use of the Service after any changes constitutes your acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-2">8. Contact</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              For all refund inquiries, contact us at:{" "}
              <a href="mailto:support@vigronex.com" className="text-green-400 underline hover:text-green-300 transition-colors">
                support@vigronex.com
              </a>
              . We respond to all emails within 1 business day.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6 text-center mb-8">
          <p className="text-white font-black text-base mb-1">Ready to start your recovery?</p>
          <p className="text-white/50 text-xs mb-4">You're protected by our 7-day money-back guarantee.</p>
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black text-sm px-6 py-3 rounded-xl transition-colors"
          >
            <Shield className="w-4 h-4" />
            Start Risk-Free — $29.99
          </a>
        </div>

        {/* Footer links */}
        <div className="pt-6 border-t border-white/10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/20 text-xs">
            <a href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="/terms" className="hover:text-white/50 transition-colors">Terms of Use</a>
            <span>·</span>
            <a href="/checkout" className="hover:text-white/50 transition-colors">Back to Checkout</a>
            <span>·</span>
            <a href="mailto:support@vigronex.com" className="hover:text-white/50 transition-colors">Contact Support</a>
          </div>
          <p className="text-white/10 text-xs mt-3">
            © 2026 Vigronex, LLC · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
