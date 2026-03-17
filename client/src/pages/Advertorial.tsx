import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const IMG_GLUCOSE = "/diabetes_sugar_hero.png";
const IMG_DOCTOR_PITCH = "/medico_shark_tank.png";
const IMG_BEFORE = "/diabetic_foot_before.png";
const IMG_AFTER = "/diabetes_before_after_banner.png";

export default function Advertorial() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-white">
      {/* CNN-style top strip */}
      <div className="bg-red-600 text-white text-center py-2 sm:py-1.5 text-xs font-semibold px-2">
        CNN HEALTH — Diabetes & Blood Sugar
      </div>
      {/* CNN-style Navbar */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link to="/home" className="flex items-center gap-1.5 shrink-0 touch-manipulation">
              <span className="bg-red-600 text-white px-2 py-0.5 font-bold text-base sm:text-lg tracking-tight">
                CNN
              </span>
              <span className="font-bold text-gray-800 text-base sm:text-lg hidden sm:inline">Health</span>
            </Link>
            <div className="hidden md:flex gap-5 text-sm text-gray-700">
              <a href="#content" className="hover:text-gray-900">Life, But Better</a>
              <a href="#content" className="hover:text-gray-900">Fitness</a>
              <a href="#content" className="hover:text-gray-900">Food</a>
              <a href="#content" className="hover:text-gray-900">Sleep</a>
              <a href="#content" className="hover:text-gray-900">Mindfulness</a>
              <a href="#content" className="hover:text-gray-900 font-medium">Diabetes</a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="#content" className="text-gray-600 hover:text-gray-900 text-sm hidden sm:inline">Watch</a>
            <a href="#content" className="text-gray-600 hover:text-gray-900 text-sm hidden sm:inline">Listen</a>
            <Link
              to="/quiz"
              className="bg-red-700 hover:bg-red-800 !text-white text-sm font-semibold px-3 sm:px-4 py-2.5 sm:py-2 min-h-[44px] flex items-center justify-center rounded-lg no-underline hover:no-underline touch-manipulation active:scale-[0.98] transition-transform"
            >
              Free Diabetes Check
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <article id="content" className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        {/* Section Label - CNN style */}
        <div className="text-red-600 font-bold text-sm tracking-widest mb-2">
          EXCLUSIVE · DIABETES & BLOOD SUGAR
        </div>
        <div className="text-xs text-gray-500 mb-4">
          Updated 4:12 PM ET, March 14, 2026
        </div>

        {/* Headline - CNN-style size */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-4 sm:mb-6 text-gray-900">
          Your Blood Sugar Is Out of Control — Here&apos;s How to Take Back Control (Before Complications Start)
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
          <strong>37 million Americans</strong> have diabetes. <strong>96 million</strong> have prediabetes — and most don&apos;t know it. Damage to your heart, kidneys, eyes, and nerves can start <strong>years</strong> before you notice a single symptom. Research from leading medical centers has identified a simple 90-day protocol that helps <strong>stabilize blood sugar, improve HbA1c, and reduce the risk of complications</strong> — with the right diet, tracking, and daily support. It&apos;s now available in the U.S.
        </p>

        {/* Byline - CNN style */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            SM
          </div>
          <div className="min-w-0">
            <div className="font-bold text-gray-900 text-sm sm:text-base">
              By Sarah Mitchell, CNN Health
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              12 min read · 52,847 reads
            </div>
          </div>
        </div>

        {/* Featured Testimonial - urgency */}
        <div className="bg-red-50 border-l-4 border-red-600 p-4 sm:p-6 mb-6 sm:mb-8 rounded-r">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
            <img
              src="/patricia_testimonial.png"
              alt="Patricia S., DiabetesSharp user"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-md mx-auto sm:mx-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-2xl sm:text-3xl mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                &quot;My HbA1c was 9.2. I was scared of insulin and complications. In 60 days I got it down to 7.1 with the app — recipes, reminders, and someone to answer my questions 24/7. My doctor said he&apos;d never seen such a turn-around.&quot;
              </p>
              <p className="text-gray-600 text-sm">
                — Patricia S., Miami, FL, age 58
              </p>
            </div>
          </div>
        </div>

        {/* Article Body - Part 1 - diabetes reality */}
        <div className="prose prose-lg max-w-none mb-6 sm:mb-8 text-base">
          <p className="text-gray-800 leading-relaxed mb-4 sm:mb-6 text-[1rem]">
            <strong>BOSTON —</strong> You skip a meal. You feel dizzy. You tell yourself it&apos;s stress. Age. Busy life. <strong>But the numbers don&apos;t lie:</strong> diabetes and prediabetes can damage your vessels and nerves <strong>years</strong> before you or your doctor notice. By the time you get a serious diagnosis, the best window to avoid complications has already narrowed.
          </p>

          <p className="text-gray-800 leading-relaxed mb-6">
            More than <strong>37 million American adults</strong> have diabetes. <strong>96 million</strong> have prediabetes — and the majority don&apos;t know it. Uncontrolled blood sugar leads to heart disease, kidney failure, vision loss, and amputations. Yet <strong>most people</strong> never get a clear, simple plan: what to eat, when to check glucose, and how to stay on track every day. They wait. The numbers get worse.
          </p>

          <p className="text-gray-800 leading-relaxed mb-6">
            &quot;We&apos;re facing a silent epidemic,&quot; says Dr. James Mitchell, endocrinologist and Director of Diabetes Care at a leading medical center. &quot;Millions have blood sugar that is <strong>manageable</strong> with the right protocol — but they&apos;re told to take a pill and hope. For those who already have type 2 or prediabetes, we&apos;ve seen meaningful improvement in HbA1c and daily control with structured diet, tracking, and 24/7 support. The question is whether people will act.&quot;
          </p>
        </div>

        {/* Featured image */}
        <figure className="my-6 sm:my-10">
          <img
            src={IMG_GLUCOSE}
            alt="Blood sugar monitoring and diabetes care"
            className="w-full rounded-lg border border-gray-200 shadow-md object-cover max-h-[280px] sm:max-h-[400px]"
          />
          <figcaption className="mt-2 text-xs sm:text-sm text-gray-500 text-center px-1">
            Feeling trapped by sugar? Taking control of your blood sugar can change your story.
          </figcaption>
        </figure>

        {/* CTA Box 1 - Early signs of diabetes risk */}
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="text-3xl sm:text-4xl text-center sm:text-left">⚠️</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base sm:text-lg mb-3">
                THESE 7 SIGNS MAY MEAN YOUR BLOOD SUGAR IS AT RISK — CHECK NOW.
              </p>
              <ul className="text-gray-800 space-y-2 text-sm font-medium">
                <li>• Feeling very thirsty or peeing more often than usual</li>
                <li>• Blurred vision or tired eyes</li>
                <li>• Constant fatigue, especially after meals</li>
                <li>• Cuts or bruises that heal slowly</li>
                <li>• Tingling or numbness in hands or feet</li>
                <li>• Family history of diabetes or prediabetes</li>
                <li>• Overweight or sedentary lifestyle</li>
              </ul>
              <p className="text-gray-800 font-semibold mt-4 text-sm">
                If you have <strong>2 or more</strong>, your risk is elevated. The sooner you act, the more you can protect your health — and <strong>even if you already have diabetes or prediabetes</strong>, a structured 90-day program can help you improve your numbers. A free assessment in under 30 seconds shows your level and what to do next.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button 1 */}
        <div className="text-center mb-8 sm:mb-12">
          <Button
            to="/quiz"
            size="lg"
            className="w-full sm:w-auto bg-red-700 hover:bg-red-800 !text-white font-bold text-base sm:text-lg px-4 sm:px-8 py-4 sm:py-6 min-h-[52px] rounded-xl no-underline hover:no-underline touch-manipulation active:scale-[0.98] transition-transform"
          >
            🩸 CHECK MY RISK NOW — FREE ASSESSMENT (UNDER 30 SEC)
          </Button>
          <p className="text-xs text-gray-500 mt-3 px-1">
            No credit card · 100% confidential · See your diabetes risk level in under 30 seconds
          </p>
        </div>

        {/* Article Body - Part 2 — App features for diabetes */}
        <div className="prose prose-lg max-w-none mb-6 sm:mb-8 text-base">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            How to Take Control of Your Blood Sugar — Whether You Have Prediabetes or Type 2
          </h2>

          <p className="text-gray-800 leading-relaxed mb-4 sm:mb-6 text-[1rem]">
            Leading endocrinologists and nutritionists built a 90-day protocol that helps <strong>stabilize glucose, improve HbA1c, and reduce the risk of complications</strong>. <strong>No miracle cures.</strong> Just a clear plan: what to eat, when to check, and daily support. The DiabetesSharp app delivers it all in one place. Here&apos;s what you get:
          </p>

          <ul className="space-y-4 sm:space-y-5 mb-6 list-none pl-0">
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🤖</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Q&A 24/7 About Diabetes</strong> — Ask anything about blood sugar, medications, meals, exercise, or your results. Get clear answers day or night — no judgment, no waiting for an appointment. <strong>You&apos;re never alone with your questions again.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">💬</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Sofia — Your Diabetes Companion</strong> — She helps you stay on track with gentle reminders, tips, and motivation. Ask her about meal choices, portion sizes, or what to do when you slip. <strong>Like having a coach who never gets impatient.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🥗</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Recipes &amp; Meal Plans for Diabetes</strong> — Low-glycemic, diabetes-friendly recipes, a 7-day meal plan, and a printable shopping list. No fad diets: science-backed meals that help keep your blood sugar stable. Step-by-step instructions so you can eat well without the overwhelm.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📋</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Smart Shopping List</strong> — A list built around your meal plan so you buy the right foods and avoid the ones that spike your glucose. Check off as you shop — one less thing to think about.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📊</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Track Your Progress</strong> — Log your blood sugar, weight, and how you feel. See your trends over time. The app shows you where you stand so you don&apos;t slip back. <strong>When you see the numbers move, you don&apos;t quit.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📷</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Photos &amp; Evolution</strong> — Track your journey with photos and notes. See how your body and energy change over 90 days. Built for the motivation that comes from seeing real progress.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📚</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Learn Library + Weekly Report</strong> — Articles and guides on diabetes, nutrition, and habits that protect your health. Plus a weekly summary of your check-ins so you and your doctor can see progress. <strong>Knowledge and proof in one place.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🎯</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">90-Day Protocol — Not a Quick Fix</strong> — Designed with doctors and dietitians for real outcomes: <strong>better blood sugar, lower HbA1c, and fewer complications.</strong> This isn&apos;t a generic diet app. It&apos;s a structured program built for people with diabetes and prediabetes.
              </div>
            </li>
          </ul>

          <p className="text-gray-800 leading-relaxed mb-6">
            &quot;This isn&apos;t a generic health app,&quot; says Dr. Elena Rodriguez, endocrinologist and diabetes specialist. &quot;It&apos;s a protocol that can <strong>help you stabilize blood sugar, improve HbA1c, and feel more in control</strong>. The earlier you start, the more you can protect yourself — but we&apos;ve seen gains at every stage. The app gives you the recipes, the list, the tracking, and the support in one place. Thousands of users with diabetes or prediabetes use it every day.&quot;
          </p>
        </div>

        {/* Doctor presenting app */}
        <figure className="my-6 sm:my-10">
          <img
            src={IMG_DOCTOR_PITCH}
            alt="Doctor presenting DiabetesSharp app on smartphone"
            className="w-full rounded-lg border border-gray-200 shadow-md object-cover max-h-[280px] sm:max-h-[420px]"
          />
          <figcaption className="mt-2 text-xs sm:text-sm text-gray-500 text-center px-1">
            A doctor presents the DiabetesSharp app. The 90-day protocol is now available to the public — no prescription required.
          </figcaption>
        </figure>

        {/* Before & After images */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center px-1">
            Before the Protocol vs. After 90 Days — Real Users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <figure>
              <img
                src={IMG_BEFORE}
                alt="Before: struggling with blood sugar and diet"
                className="w-full rounded-lg border border-gray-200 shadow-md object-cover aspect-[4/3]"
              />
              <figcaption className="mt-2 text-xs sm:text-sm text-gray-600 font-medium">
                Before — Uncontrolled numbers, confusion about what to eat, and fear of complications. Many people with diabetes have been there.
              </figcaption>
            </figure>
            <figure>
              <img
                src={IMG_AFTER}
                alt="After 90 days: better control and more energy"
                className="w-full rounded-lg border border-gray-200 shadow-md object-cover aspect-[4/3]"
              />
              <figcaption className="mt-2 text-xs sm:text-sm text-gray-600 font-medium">
                After 90 days — Better blood sugar, clearer plan, and a sense of control. Real reports from DiabetesSharp users.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Before & After Section - cases */}
        <div className="bg-gray-50 p-4 sm:p-8 rounded-xl mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-1">
            &quot;I Got My Blood Sugar Under Control&quot; — Real Results
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600">-1.8</div>
                <p className="text-gray-600 text-sm">
                  HbA1c points in 90 days
                </p>
              </div>
              <p className="font-bold text-gray-900 mb-2">Mary C., age 62</p>
              <p className="text-gray-600 text-sm mb-4">
                &quot;My HbA1c was 8.9. I was scared. I followed the meal plan and used the app every day. In 90 days I was at 7.1. I feel like myself again.&quot;
              </p>
              <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600">-12 kg</div>
                <p className="text-gray-600 text-sm">
                  Weight in 90 days
                </p>
              </div>
              <p className="font-bold text-gray-900 mb-2">John S., age 58</p>
              <p className="text-gray-600 text-sm mb-4">
                &quot;Prediabetes was a wake-up call. The recipes and list made it easy. I lost weight and my fasting glucose dropped. No more prediabetes.&quot;
              </p>
              <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600">24/7</div>
                <p className="text-gray-600 text-sm">
                  Support when I need it
                </p>
              </div>
              <p className="font-bold text-gray-900 mb-2">Ann L., age 65</p>
              <p className="text-gray-600 text-sm mb-4">
                &quot;Having someone to ask about meals and meds at any time changed everything. My doctor is happy with my numbers. I&apos;m not waiting anymore.&quot;
              </p>
              <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>

        {/* Facebook-style comments */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1877F2] flex-shrink-0" aria-hidden>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </span>
            What people are saying on Facebook
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=48&h=48&fit=crop"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  DiabetesSharp
                  <span className="inline-flex items-center gap-1 text-[#1877F2]" aria-label="On Facebook">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-xs font-normal text-gray-500">Facebook</span>
                  </span>
                </p>
                <p className="text-xs text-gray-500">March 12 · Shared a link to the free diabetes risk assessment.</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {[
                { name: "Jennifer Martinez", time: "2h", text: "My dad has type 2 and was lost. We found DiabetesSharp and he's been using the recipes and the Q&A every day. His HbA1c dropped. He finally understands what to eat. Thank you." },
                { name: "Michael Thompson", time: "5h", text: "My grandpa's blood sugar was all over the place. My mom got him on this app and within 2 months we saw a real difference. The shopping list and meal plan made it simple. Game changer." },
                { name: "Linda Foster", time: "Yesterday at 8:42 PM", text: "After my mother was diagnosed with prediabetes she didn't know where to start. We tried DiabetesSharp and she loves it. Her fasting glucose is normal now. So grateful." },
                { name: "David Chen", time: "Yesterday at 3:15 PM", text: "My father-in-law had type 2 and was scared of complications. He started the 90-day program and his numbers improved. He can enjoy meals again without guilt. This app really changed his life." },
                { name: "Sarah Williams", time: "March 13 at 11:20 AM", text: "I put my mom on DiabetesSharp after her doctor said she had to change her diet. She's 72 and was really struggling. Now she has the recipes and someone to ask 24/7. Thank you!!!" },
                { name: "Robert Garcia", time: "March 12 at 6:55 PM", text: "My grandfather was pre-diabetic and didn't know what to eat. We got him on this and in 60 days his numbers were back in range. The free assessment showed his risk and the program was tailored for him. Highly recommend for anyone with diabetes or prediabetes." },
              ].map((c, i) => (
                <div key={i} className="flex gap-3">
                  <img
                    src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop`}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">{c.name}</span>
                      <span className="text-gray-500 font-normal"> · {c.time}</span>
                    </p>
                    <p className="text-gray-800 text-sm mt-0.5 leading-snug">{c.text}</p>
                    <p className="text-gray-500 text-xs mt-1">Like · Reply · 12</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Counter */}
        <div className="bg-red-600 text-white p-4 sm:p-8 rounded-xl text-center mb-6 sm:mb-8">
          <p className="text-base sm:text-lg mb-2">
            People who took the free diabetes assessment in the last 24 hours:
          </p>
          <p className="text-4xl sm:text-5xl font-bold">1,247</p>
          <p className="text-sm mt-2 opacity-90">
            Don&apos;t wait. The earlier you act, the more you can protect your health.
          </p>
        </div>

        {/* CTA Button 2 */}
        <div className="text-center mb-8 sm:mb-12">
          <Button
            to="/quiz"
            size="lg"
            className="w-full sm:w-auto bg-red-700 hover:bg-red-800 !text-white font-bold text-base sm:text-lg px-4 sm:px-8 py-4 sm:py-6 min-h-[52px] rounded-xl no-underline hover:no-underline touch-manipulation active:scale-[0.98] transition-transform"
          >
            🩸 CHECK MY DIABETES RISK — FREE ASSESSMENT (UNDER 30 SEC)
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            No credit card · Get your risk level and personalized recommendation
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                I already have type 2 diabetes. Can this still help?
              </summary>
              <p className="text-gray-600 mt-4">
                Yes. The program is designed for people with type 2 diabetes and prediabetes. It does not replace your doctor or medication, but many users report better blood sugar control, lower HbA1c, and more confidence with diet and daily habits. The free assessment helps you see your level and options.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                I have prediabetes. Is it too late to avoid diabetes?
              </summary>
              <p className="text-gray-600 mt-4">
                No. Research shows that many people with prediabetes can prevent or delay type 2 diabetes with the right diet and lifestyle. The earlier you start, the better. The free assessment helps you see where you stand and what to do next.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                Can the app replace my diabetes medication?
              </summary>
              <p className="text-gray-600 mt-4">
                No. The app supports your diet, tracking, and habits. It does not replace medication prescribed by your doctor. Always consult your doctor before making any changes to your treatment.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                How quickly will I see results?
              </summary>
              <p className="text-gray-600 mt-4">
                Many users notice better energy and more stable blood sugar within 2–3 weeks. Meaningful HbA1c improvement typically appears over 60–90 days with consistent use.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                Is my information secure?
              </summary>
              <p className="text-gray-600 mt-4">
                Yes. We use encryption and take your privacy seriously. Your health data is never sold or shared for marketing.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                Do I need special equipment?
              </summary>
              <p className="text-gray-600 mt-4">
                No. You only need a smartphone, tablet, or computer. If your doctor has recommended a glucometer, you can log your readings in the app.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                What if the program doesn&apos;t work for me?
              </summary>
              <p className="text-gray-600 mt-4">
                We offer a 7-day no-questions-asked money-back guarantee. If you&apos;re not satisfied, we refund 100%.
              </p>
            </details>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-gray-50 p-4 sm:p-8 rounded-xl mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Our Story
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
            In 2022, Dr. Elena Rodriguez — an endocrinologist focused on diabetes care — noticed a disturbing pattern: patients in their 40s, 50s, and 60s were coming in with blood sugar out of control and no clear plan. The standard response was a prescription and a pamphlet. But Dr. Rodriguez knew the research: with the right diet, tracking, and support, many people can significantly improve their numbers and reduce the risk of complications.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
            She joined forces with Dr. James Mitchell (endocrinologist), nutritionists specializing in diabetes, and a team of engineers who had built health apps for chronic conditions.
          </p>

          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Together they spent 18 months developing what would become DiabetesSharp — a program that combines the precision of clinical guidelines with the accessibility of a daily app. Today, DiabetesSharp has helped over 45,000 people in 32 countries improve their blood sugar control and feel more confident with their diet and routine — including many who already had type 2 or prediabetes and saw real improvement.
          </p>
        </div>

        {/* Final CTA */}
        <div className="bg-gray-900 text-white p-6 sm:p-12 rounded-xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-1">
            Take Control Now — Whether You Have Prediabetes or Type 2.
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90 px-1">
            <strong>37 million Americans</strong> have diabetes. <strong>96 million</strong> have prediabetes. The 90-day protocol helps you <strong>stabilize blood sugar, improve your numbers, and reduce the risk of complications</strong>. Take the free assessment (under 30 seconds), get your risk level, and see what&apos;s possible. 7-day guarantee.
          </p>
          <Button
            to="/quiz"
            size="lg"
            className="w-full sm:w-auto bg-red-700 hover:bg-red-800 !text-white font-bold text-base sm:text-lg px-4 sm:px-8 py-4 sm:py-6 min-h-[52px] rounded-xl no-underline hover:no-underline touch-manipulation active:scale-[0.98] transition-transform"
          >
            🩸 CHECK MY RISK NOW — FREE ASSESSMENT (UNDER 30 SEC)
          </Button>
          <p className="text-xs sm:text-sm mt-4 sm:mt-6 opacity-75">
            7-day money-back guarantee · No credit card to start
          </p>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 mt-10 sm:mt-16 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <Link to="/home" className="flex items-center gap-2 mb-3 sm:mb-4">
                <img src="/diabetessharp-logo.png" alt="DiabetesSharp" className="h-8 w-8 object-contain" />
                <span className="text-white font-bold text-sm sm:text-base">DiabetesSharp</span>
              </Link>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#content" className="hover:text-white">About</a></li>
                <li><a href="#content" className="hover:text-white">Blog</a></li>
                <li><a href="#content" className="hover:text-white">Research</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="#content" className="hover:text-white">FAQ</a></li>
                <li><a href="/refund-policy" className="hover:text-white">Guarantee</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms</a></li>
                <li><a href="#content" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#content" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#content" className="hover:text-white">Twitter</a></li>
                <li><a href="#content" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            <p>&copy; 2026 DiabetesSharp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
