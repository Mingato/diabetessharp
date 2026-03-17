import { useState } from "react";
import { ChevronLeft, Mail, MessageSquare, RefreshCw, Lock, Zap, HelpCircle, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "refund", label: "Refund Request", icon: "💰", description: "Request a refund within 7 days" },
  { value: "access", label: "Access / Login Issue", icon: "🔑", description: "Can't log in or access content" },
  { value: "billing", label: "Billing Question", icon: "💳", description: "Charges, duplicate payments" },
  { value: "technical", label: "Technical Problem", icon: "⚙️", description: "App not working, errors" },
  { value: "general", label: "General Question", icon: "💬", description: "Questions about the program" },
  { value: "other", label: "Other", icon: "📋", description: "Anything else" },
];

const QUICK_TOPICS = [
  { label: "I want a refund", category: "refund", subject: "Refund Request — 7-Day Guarantee" },
  { label: "I can't access my account", category: "access", subject: "Cannot Access My Account" },
  { label: "I was charged twice", category: "billing", subject: "Duplicate Charge on My Account" },
  { label: "The app isn't working", category: "technical", subject: "Technical Issue — App Not Working" },
  { label: "How do I start the program?", category: "general", subject: "Getting Started with Vigronex" },
];

const RESPONSE_TIMES = [
  { category: "refund", time: "< 2 hours", color: "text-green-400" },
  { category: "billing", time: "< 2 hours", color: "text-green-400" },
  { category: "access", time: "< 4 hours", color: "text-amber-400" },
  { category: "technical", time: "< 8 hours", color: "text-amber-400" },
  { category: "general", time: "< 24 hours", color: "text-white/50" },
  { category: "other", time: "< 24 hours", color: "text-white/50" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    orderId: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<number | null>(null);

  const submit = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSubmitted(true);
        setTicketId(data.id ?? null);
      } else {
        toast.error("Something went wrong. Please try again or email us directly.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send message. Please try again.");
    },
  });

  function handleQuickTopic(topic: typeof QUICK_TOPICS[0]) {
    setForm((f) => ({ ...f, category: topic.category, subject: topic.subject }));
    document.getElementById("message")?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category) { toast.error("Please select a category."); return; }
    submit.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      category: form.category as "refund" | "access" | "billing" | "technical" | "general" | "other",
      subject: form.subject.trim(),
      message: form.message.trim(),
      orderId: form.orderId.trim() || undefined,
    });
  }

  const responseTime = RESPONSE_TIMES.find((r) => r.category === form.category);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-1.5 text-green-400 text-xs font-black mb-4">
            ✅ MESSAGE RECEIVED
          </div>
          <h2 className="text-white font-black text-2xl mb-2">We've Got Your Message</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Our support team will get back to you at <span className="text-white font-bold">{form.email}</span> as soon as possible.
          </p>
          {ticketId && (
            <div className="bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-3 mb-6">
              <p className="text-white/40 text-xs mb-1">Your Ticket Number</p>
              <p className="text-white font-black text-lg">#{String(ticketId).padStart(5, "0")}</p>
              <p className="text-white/30 text-xs mt-1">Save this for reference</p>
            </div>
          )}
          <div className="space-y-3">
            <a
              href="/checkout"
              className="block w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-sm py-3 rounded-xl transition-colors text-center"
            >
              Back to Checkout
            </a>
            <a
              href="/"
              className="block w-full bg-white/5 hover:bg-white/10 text-white/70 font-bold text-sm py-3 rounded-xl transition-colors text-center"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Sticky Header */}
      <div className="bg-[#0d0d1a] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="text-white/40 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <h1 className="text-white font-black text-base">Contact Support</h1>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-green-400 text-xs font-bold">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Support Online
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-white font-black text-2xl mb-2">How Can We Help You?</h2>
          <p className="text-white/50 text-sm">
            We respond to every message. Average response time:{" "}
            <span className="text-amber-400 font-bold">under 4 hours</span> on business days.
          </p>
        </div>

        {/* Quick contact info bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <Mail className="w-4 h-4" />, label: "Email", value: "support@vigronex.com", color: "text-blue-400" },
            { icon: <Clock className="w-4 h-4" />, label: "Hours", value: "Mon–Fri 9am–6pm EST", color: "text-amber-400" },
            { icon: <RefreshCw className="w-4 h-4" />, label: "Refunds", value: "7-Day Guarantee", color: "text-green-400" },
          ].map((item, i) => (
            <div key={i} className="bg-[#0d0d1a] border border-white/10 rounded-xl p-3 text-center">
              <div className={`flex justify-center mb-1 ${item.color}`}>{item.icon}</div>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-wide">{item.label}</p>
              <p className="text-white text-xs font-bold mt-0.5 leading-tight">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Topics */}
        <div className="mb-6">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wide mb-3">Quick Topics</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TOPICS.map((topic, i) => (
              <button
                key={i}
                onClick={() => handleQuickTopic(topic)}
                className={`text-xs px-3 py-1.5 rounded-full border font-bold transition-all ${
                  form.category === topic.category && form.subject === topic.subject
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-wide mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                  className={`flex items-start gap-2 p-3 rounded-xl border text-left transition-all ${
                    form.category === cat.value
                      ? "bg-amber-500/10 border-amber-500/50"
                      : "bg-[#0d0d1a] border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{cat.icon}</span>
                  <div>
                    <p className={`text-xs font-bold leading-tight ${form.category === cat.value ? "text-amber-400" : "text-white"}`}>
                      {cat.label}
                    </p>
                    <p className="text-white/30 text-[10px] leading-tight mt-0.5">{cat.description}</p>
                  </div>
                </button>
              ))}
            </div>
            {form.category && responseTime && (
              <div className="flex items-center gap-1.5 mt-2">
                <Clock className="w-3 h-3 text-white/30" />
                <span className="text-white/30 text-xs">Expected response time:</span>
                <span className={`text-xs font-bold ${responseTime.color}`}>{responseTime.time}</span>
              </div>
            )}
          </div>

          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wide mb-1.5">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="John Smith"
                className="w-full bg-[#0d0d1a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wide mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="john@email.com"
                className="w-full bg-[#0d0d1a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-wide mb-1.5">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={200}
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Brief description of your issue"
              className="w-full bg-[#0d0d1a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-colors"
            />
          </div>

          {/* Order ID (optional) */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-wide mb-1.5">
              Order ID <span className="text-white/20 font-normal normal-case">(optional — found in your confirmation email)</span>
            </label>
            <input
              type="text"
              maxLength={100}
              value={form.orderId}
              onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))}
              placeholder="e.g. VGX-00123"
              className="w-full bg-[#0d0d1a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-white/60 text-xs font-bold uppercase tracking-wide mb-1.5">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Please describe your issue in detail. The more information you provide, the faster we can help you."
              className="w-full bg-[#0d0d1a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
            />
            <p className="text-white/20 text-xs mt-1 text-right">{form.message.length}/5000</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submit.isPending}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-sm py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {submit.isPending ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-black/40 border-t-black animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>

          <p className="text-white/20 text-xs text-center">
            You'll receive a confirmation email at the address provided. We respond to every message.
          </p>
        </form>

        {/* Alternative contact */}
        <div className="mt-8 bg-[#0d0d1a] border border-white/10 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-bold text-sm mb-1">Prefer to email directly?</p>
              <p className="text-white/50 text-xs leading-relaxed">
                You can also reach us at{" "}
                <a href="mailto:support@vigronex.com" className="text-amber-400 underline hover:text-amber-300 transition-colors">
                  support@vigronex.com
                </a>
                . Include your order number and the email used at checkout for faster service.
              </p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { icon: <RefreshCw className="w-3.5 h-3.5" />, label: "Refund Policy", href: "/refund-policy" },
            { icon: <HelpCircle className="w-3.5 h-3.5" />, label: "FAQ", href: "/checkout#faq" },
            { icon: <Lock className="w-3.5 h-3.5" />, label: "Privacy Policy", href: "/privacy" },
            { icon: <Zap className="w-3.5 h-3.5" />, label: "Back to Checkout", href: "/checkout" },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="flex items-center gap-2 bg-[#0d0d1a] border border-white/10 rounded-xl px-3 py-2.5 text-white/40 text-xs font-bold hover:border-white/30 hover:text-white/70 transition-all"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/20 text-xs">
            <a href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="/terms" className="hover:text-white/50 transition-colors">Terms of Use</a>
            <span>·</span>
            <a href="/refund-policy" className="hover:text-white/50 transition-colors">Refund Policy</a>
          </div>
          <p className="text-white/10 text-xs mt-2">© 2026 Vigronex, LLC · All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
