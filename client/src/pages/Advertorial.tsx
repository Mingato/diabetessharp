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
          Your blood sugar is above 180 — here&apos;s how to take back control (before it&apos;s too late!)
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
          <strong>37 million Americans</strong> have diabetes… <strong>96 million</strong> have prediabetes — and most don&apos;t even know it! According to Harvard University, damage to your heart, kidneys, eyes, and nerves can begin up to <strong>7 years</strong> before a doctor ever tells you, &quot;you have diabetes&quot;… You wake up at 3 a.m. feeling thirsty. You&apos;re urinating more often than you should. After lunch, that dizziness hits — and you blame it on the heat, the stress, your age… Meanwhile, silently, high glucose is eroding the walls of your blood vessels millimeter by millimeter. Your kidneys are filtering thicker blood than they should. The retina in your eyes is suffering micro-hemorrhages you can&apos;t even see yet! This has a name: diabetic neuropathy, nephropathy, retinopathy… Complications that cost between $13,000 and $250,000 per year to treat — and that are up to 70% preventable if you act early… The question isn&apos;t &quot;will I have complications?&quot; The question is: &quot;how do I avoid all of this?&quot; Research from leading medical centers has identified a simple 90-day protocol that helps <strong>stabilize blood sugar, improve HbA1c, and reduce the risk of complications</strong> — with the right diet, tracking, and daily support. It&apos;s now available in the U.S.
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
                &quot;My HbA1c was 9.2. I was terrified of insulin and complications. In 60 days, I got it down to 7.1 with the app — recipes, reminders, and someone answering my questions 24/7. My doctor said he had never seen a turnaround like this.&quot;
              </p>
              <p className="text-gray-600 text-sm">
                — Scarlet F., Miami, FL, 58 years old
              </p>
            </div>
          </div>
        </div>

        {/* Article Body - Part 1 - diabetes reality */}
        <div className="prose prose-lg max-w-none mb-6 sm:mb-8 text-base">
          <p className="text-gray-800 leading-relaxed mb-6">
            &quot;We&apos;re facing a silent epidemic&quot;, says Dr. James Mitchell, endocrinologist and Director of Diabetes Care at a leading medical center. &quot;Millions of people have blood sugar levels that could be controlled with the right protocol — but they&apos;re told to take a pill and wait. For those who already have type 2 or prediabetes, we&apos;ve seen meaningful improvements in HbA1c and daily control with structured diet, monitoring, and 24/7 support. The question is whether people will take action.&quot;
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
            Blood sugar monitoring and diabetes care. Feeling trapped by sugar? Taking back control of your blood sugar can change your story!
          </figcaption>
        </figure>

        {/* CTA Box 1 - Early signs of diabetes risk */}
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="text-3xl sm:text-4xl text-center sm:text-left">⚠️</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base sm:text-lg mb-3">
                THE 6 SIGNS 9 OUT OF 10 PEOPLE IGNORE
              </p>
              <p className="text-gray-800 text-sm font-medium mb-3">
                If you have 2 or more of these signs, your pancreas is already under stress:
              </p>
              <ul className="text-gray-800 space-y-2 text-sm font-medium">
                <li>• Excessive thirst or dry mouth even when you&apos;re drinking water normally</li>
                <li>• Urinating more than 6 times a day without increasing fluid intake</li>
                <li>• Vision that &quot;fluctuates&quot; — clear one moment, blurry the next — especially after meals</li>
                <li>• Unusual fatigue after eating carbs (your pancreas is screaming)</li>
                <li>• Tingling or burning sensations in your fingertips or the soles of your feet</li>
                <li>• HbA1c above 5.7% on your last test — or no test in over 2 years</li>
              </ul>
              <p className="text-gray-800 font-semibold mt-4 text-sm">
                If you ignored 2 or more: your glucose is already affecting your health. Every week without action means more damage building up in your blood vessels.
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
            🩸 CHECK MY RISK NOW — FREE ASSESSMENT (UNDER 30 SECONDS)
          </Button>
          <p className="text-xs text-gray-500 mt-3 px-1">
            No credit card · 100% confidential · See your diabetes risk level in less than 30 seconds
          </p>
        </div>

        {/* Article Body - Part 2 — App features for diabetes */}
        <div className="prose prose-lg max-w-none mb-6 sm:mb-8 text-base">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            How to Take Back Control of Your Blood Sugar — Whether You Have Prediabetes or Type 2!
          </h2>

          <p className="text-gray-800 leading-relaxed mb-4 sm:mb-6 text-[1rem]">
            Top endocrinologists and nutritionists created a 90-day protocol that helps <strong>stabilize glucose, improve HbA1c, and reduce the risk of complications</strong>… <strong>No miracle cures…</strong> Just a clear plan: what to eat, when to measure, and daily support… The DiabetesSharp app brings everything together in one place… Here&apos;s what you get:
          </p>

          <ul className="space-y-4 sm:space-y-5 mb-6 list-none pl-0">
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🤖</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">24/7 Support with responses in under 8 seconds</strong> — Ask anything about blood sugar, medications, meals, exercise, or your results. Get clear answers day or night — no judgment, no waiting for appointments. <strong>You&apos;re never alone with your questions again.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">💬</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Sofia, Your Diabetes Companion:</strong> She helps you stay on track with gentle reminders, tips, and motivation. Ask about meal choices, portion sizes, or what to do when you slip up. <strong>Like having a coach who never loses patience.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🥗</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Glycemic Index-Based Meal Plan:</strong> Not a &quot;no sugar diet&quot; — these are recipes built on the actual glycemic index of foods (not guesswork). Includes a 7-day plan with an auto-generated shopping list, portions calculated based on your body weight, and options for different budgets. No vague &quot;eat fewer carbs&quot; advice — you&apos;ll know exactly which carbs, how much, and when.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📋</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Smart Shopping List:</strong> A list based on your meal plan so you buy the right foods and avoid glucose spikes. Check items off as you shop — one less thing to worry about.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📊</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Track Your Progress:</strong> Log your blood sugar, weight, and how you feel. See your trends over time. The app shows exactly where you stand so you don&apos;t slip backward. <strong>When you see the numbers changing, you stay committed.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📷</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Photos &amp; Progress:</strong> Track your journey with photos and notes. Watch how your body and energy change over 90 days. Built for the motivation that comes from real progress.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📚</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Learning Library + Weekly Report:</strong> Articles and guides about diabetes, nutrition, and habits that protect your health. Plus a weekly summary of your logs for you and your doctor to track progress. <strong>Knowledge and proof in one place.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🎯</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">90-Day Protocol:</strong> Developed with doctors and nutritionists for real results: better blood sugar control, lower HbA1c, and fewer complications. This isn&apos;t a generic diet app — it&apos;s a structured program for people with diabetes and prediabetes.
              </div>
            </li>
          </ul>

          <p className="text-gray-800 leading-relaxed mb-6">
            &quot;DiabetesSharp is not just another diet app,&quot; says Dr. Elena Rodriguez, endocrinologist and diabetes specialist. &quot;It&apos;s a protocol designed to help stabilize blood sugar, improve HbA1c, and make people feel more in control. The earlier you start, the more you can protect yourself — but we&apos;ve seen results at every stage. The app combines recipes, tracking, and support in one place. Thousands of users with diabetes or prediabetes use it daily.&quot;
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
                Before: struggling with blood sugar and food choices. Uncontrolled numbers, confusion about what to eat, and fear of complications. Many people with diabetes have been there.
              </figcaption>
            </figure>
            <figure>
              <img
                src={IMG_AFTER}
                alt="After 90 days: better control and more energy"
                className="w-full rounded-lg border border-gray-200 shadow-md object-cover aspect-[4/3]"
              />
              <figcaption className="mt-2 text-xs sm:text-sm text-gray-600 font-medium">
                After 90 days: better control and more energy, improved blood sugar levels, a clearer plan, and a sense of control.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Before & After Section - cases */}
        <div className="bg-gray-50 p-4 sm:p-8 rounded-xl mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <p className="font-bold text-gray-900 mb-2 text-lg">&quot;I stabilized my blood sugar around 110 points&quot;</p>
              <p className="text-gray-600 text-sm mb-2">Patricia S., 58, Miami — HbA1c from 9.2 to 7.1 in 62 days</p>
              <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <p className="font-bold text-gray-900 mb-2 text-lg">&quot;My doctor said that in 22 years of practice, he had never seen such a fast reduction without adjusting insulin. I simply followed the protocol.&quot;</p>
              <p className="text-gray-600 text-sm mb-2">John S., 58 — Prediabetes reversed in 87 days</p>
              <p className="text-gray-600 text-sm mb-2">&quot;Fasting glucose from 118 to 94. I lost 26 lbs without starving. I canceled my endocrinologist appointment because there was nothing left to treat.&quot;</p>
              <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <p className="font-bold text-gray-900 mb-2 text-lg">&quot;I spent 4 years trying on my own. In 90 days with a structured protocol, I achieved more than in all those 4 years combined.&quot;</p>
              <p className="text-gray-600 text-sm mb-2">Mary C., 62 — HbA1c from 8.9 to 7.1</p>
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
                { name: "Jennifer Carter", time: "2h", text: "My dad has type 2 and was lost. We found DiabetesSharp and he's been using the recipes and the Q&A every day. His HbA1c dropped. He finally understands what to eat. Thank you." },
                { name: "Michael Reynolds", time: "5h", text: "My grandpa's blood sugar was all over the place. My mom got him on this app and within 2 months we saw a real difference. The shopping list and meal plan made it simple. Game changer." },
                { name: "Linda Brooks", time: "Yesterday at 8:42 PM", text: "After my mother was diagnosed with prediabetes she didn't know where to start. We tried DiabetesSharp and she loves it. Her fasting glucose is normal now. So grateful." },
                { name: "David Park", time: "Yesterday at 3:15 PM", text: "My father-in-law had type 2 and was scared of complications. He started the 90-day program and his numbers improved. He can enjoy meals again without guilt. This app really changed his life." },
                { name: "Sarah Williams", time: "March 13 at 11:20 AM", text: "I put my mom on DiabetesSharp after her doctor said she had to change her diet. She's 72 and was really struggling. Now she has the recipes and someone to ask 24/7. Thank you!!!" },
                { name: "Robert Mitchell", time: "March 12 at 6:55 PM", text: "My grandfather was pre-diabetic and didn't know what to eat. We got him on this and in 60 days his numbers were back in range. The free assessment showed his risk and the program was tailored for him. Highly recommend for anyone with diabetes or prediabetes." },
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
            🩸 CHECK MY RISK NOW — FREE ASSESSMENT (UNDER 30 SECONDS)
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
            🩸 CHECK MY RISK NOW — FREE ASSESSMENT (UNDER 30 SECONDS)
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
