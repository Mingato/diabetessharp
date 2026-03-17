import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const IMG_BRAIN_SCAN = "/alzheimer_impactante.png";
const IMG_DOCTOR_PITCH = "/medico_shark_tank.png";
const IMG_BEFORE = "/senhora_lavando_roupa_vaso.png";
const IMG_AFTER = "/after_familia_feliz.png";

export default function Advertorial() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-white">
      {/* CNN-style top strip */}
      <div className="bg-red-600 text-white text-center py-2 sm:py-1.5 text-xs font-semibold px-2">
        CNN HEALTH — Brain & Memory
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
              <a href="#content" className="hover:text-gray-900 font-medium">Brain Health</a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="#content" className="text-gray-600 hover:text-gray-900 text-sm hidden sm:inline">Watch</a>
            <a href="#content" className="text-gray-600 hover:text-gray-900 text-sm hidden sm:inline">Listen</a>
            <Link
              to="/quiz"
              className="bg-red-700 hover:bg-red-800 !text-white text-sm font-semibold px-3 sm:px-4 py-2.5 sm:py-2 min-h-[44px] flex items-center justify-center rounded-lg no-underline hover:no-underline touch-manipulation active:scale-[0.98] transition-transform"
            >
              Free Risk Check
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <article id="content" className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        {/* Section Label - CNN style */}
        <div className="text-red-600 font-bold text-sm tracking-widest mb-2">
          EXCLUSIVE · BRAIN HEALTH
        </div>
        <div className="text-xs text-gray-500 mb-4">
          Updated 4:12 PM ET, March 14, 2026
        </div>

        {/* Headline - CNN-style size */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-4 sm:mb-6 text-gray-900">
          Your Brain Is Deteriorating Right Now — Here's How to Stop It (Before You Forget Your Own Name)
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
          <strong>6.5 million Americans</strong> live with Alzheimer's. <strong>1 in 3 seniors</strong> dies with dementia. The damage can start <strong>10 to 20 years</strong> before you notice a single symptom. Harvard-backed research has identified what can reverse early decline — and <strong>even improve memory and function in people who already have the disease</strong>. It's now available in the U.S.
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
              alt="Patricia S., NeuroSharp user"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-md mx-auto sm:mx-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-2xl sm:text-3xl mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                "I was forgetting my grandkids' names. I thought it was over. In 60 days my memory came back. My doctor said he'd never seen improvement like that."
              </p>
              <p className="text-gray-600 text-sm">
                — Patricia S., Miami, FL, age 58
              </p>
            </div>
          </div>
        </div>

        {/* Article Body - Part 1 - aggressive, early symptoms */}
        <div className="prose prose-lg max-w-none mb-6 sm:mb-8 text-base">
          <p className="text-gray-800 leading-relaxed mb-4 sm:mb-6 text-[1rem]">
            <strong>BOSTON —</strong> You forget a name. You walk into a room and don't remember why. You tell yourself it's stress. Age. Busy life. <strong>But the numbers don't lie:</strong> Alzheimer's can begin changing your brain <strong>10 to 20 years</strong> before you or your family notice anything wrong. By the time you admit something's off, the best window for reversal has already narrowed.
          </p>

          <p className="text-gray-800 leading-relaxed mb-6">
            More than <strong>6.5 million Americans 65+</strong> have Alzheimer's. <strong>11 million</strong> are unpaid caregivers. By 2050, that could reach <strong>13 million</strong>. And here's what most people ignore: <strong>12% to 18% of adults over 65</strong> already have mild cognitive impairment. Of those, <strong>10% to 15% progress to full dementia every year</strong>. Half will have Alzheimer's or another dementia within five years. Most never get checked. They wait. The window closes.
          </p>

          <p className="text-gray-800 leading-relaxed mb-6">
            "We're facing a silent epidemic," says Dr. James Mitchell, Director of Cognitive Neuroscience at Harvard Medical School. "Millions have memory loss that is <strong>reversible</strong> with the right protocol — but they're told to take a pill and hope. And for those who already have the disease, we've seen meaningful improvement in memory and daily function. The brain can rewire at any stage. We've seen it. The question is whether people will act."
          </p>
        </div>

        {/* Featured image - brain / cognitive health */}
        <figure className="my-6 sm:my-10">
          <img
            src={IMG_BRAIN_SCAN}
            alt="Neuroscience and cognitive health research"
            className="w-full rounded-lg border border-gray-200 shadow-md object-cover max-h-[280px] sm:max-h-[400px]"
          />
          <figcaption className="mt-2 text-xs sm:text-sm text-gray-500 text-center px-1">
            Brain changes from Alzheimer's can start 10–20 years before symptoms. Early intervention can help reverse decline. Image: Getty Images.
          </figcaption>
        </figure>

        {/* CTA Box 1 - Early symptoms (aggressive) */}
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="text-3xl sm:text-4xl text-center sm:text-left">⚠️</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base sm:text-lg mb-3">
                THESE 7 EARLY SIGNS MEAN YOUR BRAIN MAY BE AT RISK — CHECK NOW.
              </p>
              <ul className="text-gray-800 space-y-2 text-sm font-medium">
                <li>• Forgetting names or dates more often than a year ago</li>
                <li>• Walking into a room and not remembering why</li>
                <li>• "Brain fog" or grogginess that lasts hours after waking</li>
                <li>• Losing words mid-sentence or mid-conversation</li>
                <li>• Trouble focusing on one task for 20+ minutes</li>
                <li>• Difficulty learning or remembering something new</li>
                <li>• Family history of Alzheimer's or dementia</li>
              </ul>
              <p className="text-gray-800 font-semibold mt-4 text-sm">
                If you have <strong>2 or more</strong>, your risk is elevated. The sooner you act, the more you can reverse — and <strong>even if you already have a diagnosis</strong>, research shows cognitive training can help improve memory and function. A free assessment in under 30 seconds shows your level and what to do next.
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
            🧠 CHECK MY RISK NOW — FREE ASSESSMENT (UNDER 30 SEC)
          </Button>
          <p className="text-xs text-gray-500 mt-3 px-1">
            No credit card · 100% confidential · See your cognitive score in under 30 seconds
          </p>
        </div>

        {/* Article Body - Part 2 — App features with aggressive hooks */}
        <div className="prose prose-lg max-w-none mb-6 sm:mb-8 text-base">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            How to Recover Memory — Whether You're at Risk or Already Have the Disease
          </h2>

          <p className="text-gray-800 leading-relaxed mb-4 sm:mb-6 text-[1rem]">
            Harvard and Stanford researchers identified the root cause of most memory decline: <strong>an understimulated brain</strong>. They built a 90-day protocol that restores function, cuts Alzheimer's risk — and <strong>can improve memory and cognition even in people who already have early or mild Alzheimer's or dementia</strong>. <strong>No drugs. No surgery.</strong> Just structured cognitive training that rewires the brain. The NeuroSharp app delivers it all in one place. Here's exactly what you get — and how each part helps you win back your memory:
          </p>

          <ul className="space-y-4 sm:space-y-5 mb-6 list-none pl-0">
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🧠</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">10 Types of Cognitive Exercises</strong> — Each one targets a specific skill: working memory, processing speed, attention, recall, and more. <strong>15 minutes a day</strong> with step-by-step videos and instructions. You check off each exercise and watch your daily score rise. No guesswork — you see exactly what to do and how it's strengthening your brain.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🤖</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Dr. Marcus AI — Your 24/7 Brain Coach</strong> — Ask anything about memory, symptoms, medications, or your program. Get personalized guidance at 3 a.m. or 3 p.m. He answers like a specialist: no judgment, no waiting for an appointment. Thousands use him to stay on track and get clarity when they're scared or confused. <strong>You're never alone with your questions again.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📊</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Progress Tracking That Keeps You Honest</strong> — Weekly cognitive scores, streak counters, and a clear view of how you're improving. The app shows you exactly where you stand so you don't slip back. <strong>When you see the numbers move, you don't quit.</strong> Real accountability, not a vague "feel better" — measurable gains.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">💬</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Sofia — Memory Recall Practice</strong> — She helps you practice recalling real-life memories with gentle hints when you're stuck. No pressure: you say "I don't remember" and she guides you back. <strong>It's like having a coach who never gets impatient.</strong> The more you practice with her, the more you strengthen the pathways that pull up names, dates, and moments you care about.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🥗</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Brain-Friendly Nutrition Built In</strong> — Recipes, a 7-day meal plan, and a printable shopping list designed to support memory and focus. No fad diets: science-backed foods that feed your brain. You get step-by-step instructions and tips so you can eat for your mind without the overwhelm.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📷</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Never Lose Your Keys (or Glasses) Again</strong> — Photo-based system: you snap where you put things and add a label. Keys in the drawer? Glasses on the nightstand? One tap and you see your own "memory album." <strong>No more frantic searching. No more embarrassment.</strong> Built for the exact frustration everyone with memory slip-ups knows.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">📚</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Learn Library + Weekly Report</strong> — Articles and guides on memory, Alzheimer's risk, and habits that protect your brain. Plus a weekly summary of your check-ins and scores so you and your family can see progress. <strong>Knowledge and proof in one place.</strong>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xl sm:text-2xl shrink-0">🎯</span>
              <div className="text-gray-900">
                <strong className="text-gray-900">Applied Neuroscience — Not a Game</strong> — The protocol is based on published research on neuroplasticity and cognitive training. Designed by doctors and engineers for real outcomes: <strong>restore recall, cut risk, and improve function even after diagnosis.</strong> This isn't a crossword app. It's a structured 90-day program that rewires how your brain works.
              </div>
            </li>
          </ul>

          <p className="text-gray-800 leading-relaxed mb-6">
            "This isn't a brain-game app," says Dr. Elena Rodriguez, Clinical Psychologist and cognitive health specialist. "It's a medical-grade protocol that can <strong>restore memory, lower Alzheimer's risk, and improve function even in people who already have the disease</strong>. The earlier you start, the more you can recover — but we've seen gains at every stage. The app gives you the exercises, the coach, the nutrition, and the tracking in one place. Thousands of users, including those with a diagnosis, use it every day."
          </p>
        </div>

        {/* Doctor in Shark Tank–style scenario presenting app with cell phone */}
        <figure className="my-6 sm:my-10">
          <img
            src={IMG_DOCTOR_PITCH}
            alt="Doctor presenting NeuroSharp app on smartphone in Shark Tank style pitch"
            className="w-full rounded-lg border border-gray-200 shadow-md object-cover max-h-[280px] sm:max-h-[420px]"
          />
          <figcaption className="mt-2 text-xs sm:text-sm text-gray-500 text-center px-1">
            In a Shark Tank–style pitch, a doctor presents the NeuroSharp app on his phone. The protocol is now available to the public — no prescription required.
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
                alt="Before: elderly woman in bathroom — when cognition fails, even washing clothes can end up in the wrong place"
                className="w-full rounded-lg border border-gray-200 shadow-md object-cover aspect-[4/3]"
              />
              <figcaption className="mt-2 text-xs sm:text-sm text-gray-600 font-medium">
                Before — When memory goes, simple tasks get confused. A senior in the bathroom, washing clothes in the wrong place. Many families have lived this.
              </figcaption>
            </figure>
            <figure>
              <img
                src={IMG_AFTER}
                alt="After 90 days: senior with family, everyone happy"
                className="w-full rounded-lg border border-gray-200 shadow-md object-cover aspect-[4/3]"
              />
              <figcaption className="mt-2 text-xs sm:text-sm text-gray-600 font-medium">
                After 90 days — Mental clarity, better memory, and a sense of
                control. Real reports from NeuroSharp users.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Before & After Section */}
        <div className="bg-gray-50 p-4 sm:p-8 rounded-xl mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-1">
            "I Got My Memory Back" — Including People Who Already Had the Disease
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {/* Case 1 */}
            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600">+42</div>
                <p className="text-gray-600 text-sm">
                  Memory Improvement Points
                </p>
              </div>
              <p className="font-bold text-gray-900 mb-2">Mary C., age 62</p>
              <p className="text-gray-600 text-sm mb-4">
                "I was heading toward what my mom had — Alzheimer's. I couldn't remember anything. Now my scores are back up. I feel like myself again."
              </p>
              <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>

            {/* Case 2 */}
            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600">+38</div>
                <p className="text-gray-600 text-sm">
                  Processing Speed Points
                </p>
              </div>
              <p className="font-bold text-gray-900 mb-2">John S., age 58</p>
              <p className="text-gray-600 text-sm mb-4">
                "Brain fog was killing my career. I did the 90-day protocol. My focus came back. Productivity up 40%."
              </p>
              <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>

            {/* Case 3 */}
            <div className="bg-white p-4 sm:p-6 rounded-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600">-47%</div>
                <p className="text-gray-600 text-sm">
                  Alzheimer's Risk Reduction
                </p>
              </div>
              <p className="font-bold text-gray-900 mb-2">Ann L., age 65</p>
              <p className="text-gray-600 text-sm mb-4">
                "My mother had Alzheimer's. I was sure I was next. I did the protocol. My risk dropped. I'm not waiting anymore."
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
            {/* Fake Facebook post header */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=48&h=48&fit=crop"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  NeuroSharp
                  <span className="inline-flex items-center gap-1 text-[#1877F2]" aria-label="On Facebook">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-xs font-normal text-gray-500">Facebook</span>
                  </span>
                </p>
                <p className="text-xs text-gray-500">March 12 · Shared a link to the free cognitive assessment.</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {[
                {
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
                  name: "Jennifer Martinez",
                  time: "2h",
                  text: "My dad was diagnosed with early Alzheimer's and we were devastated. We found NeuroSharp and he's been doing the exercises every day. His doctor said his cognitive scores have improved. He remembers our names again. I can't thank you enough.",
                },
                {
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
                  name: "Michael Thompson",
                  time: "5h",
                  text: "My grandpa was forgetting where he put things and getting confused. My mom got him on this app and within 2 months we saw a real difference. He's more alert and he actually remembers our visits. Game changer for our family.",
                },
                {
                  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop",
                  name: "Linda Foster",
                  time: "Yesterday at 8:42 PM",
                  text: "After my mother had a stroke her memory was really bad. Her neurologist said to keep her mind active. We tried NeuroSharp and she loves it. She's sharper now than she was 6 months ago. No pills, just the exercises. So grateful.",
                },
                {
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop",
                  name: "David Chen",
                  time: "Yesterday at 3:15 PM",
                  text: "My father-in-law was going downhill fast. We were scared it was dementia. He started the 90-day program and his memory improved. He can follow conversations again and remember what he had for breakfast. This app really changed his life.",
                },
                {
                  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop",
                  name: "Sarah Williams",
                  time: "March 13 at 11:20 AM",
                  text: "I put my mom on NeuroSharp after she kept forgetting appointments. She's 72 and was really struggling. Now she does her exercises every morning and her memory is so much better. She even remembers to call me. Thank you!!!",
                },
                {
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop",
                  name: "Robert Garcia",
                  time: "March 12 at 6:55 PM",
                  text: "My grandfather was mixing up names and getting lost in the neighborhood. We got him on this and in 60 days he was back to recognizing everyone. The free assessment showed his risk level and the program was tailored for him. Highly recommend for anyone with a parent or grandparent struggling with memory.",
                },
              ].map((c, i) => (
                <div key={i} className="flex gap-3">
                  <img
                    src={c.avatar}
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

        {/* Live Counter - urgency */}
        <div className="bg-red-600 text-white p-4 sm:p-8 rounded-xl text-center mb-6 sm:mb-8">
          <p className="text-base sm:text-lg mb-2">
            People who took the free assessment in the last 24 hours:
          </p>
          <p className="text-4xl sm:text-5xl font-bold">1,247</p>
          <p className="text-sm mt-2 opacity-90">
            Don't wait. The earlier you act, the more you can recover.
          </p>
        </div>

        {/* CTA Button 2 */}
        <div className="text-center mb-8 sm:mb-12">
          <Button
            to="/quiz"
            size="lg"
            className="w-full sm:w-auto bg-red-700 hover:bg-red-800 !text-white font-bold text-base sm:text-lg px-4 sm:px-8 py-4 sm:py-6 min-h-[52px] rounded-xl no-underline hover:no-underline touch-manipulation active:scale-[0.98] transition-transform"
          >
            🧠 CHECK MY COGNITIVE RISK — FREE ASSESSMENT (UNDER 30 SEC)
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            No credit card · Get your score and personalized recommendation
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
                I already have Alzheimer's or dementia. Can this still help?
              </summary>
              <p className="text-gray-600 mt-4">
                Yes. Studies show that structured cognitive training can improve
                memory and daily function even in people who already have early
                or mild Alzheimer's or dementia. It does not replace medical
                care or medication, but many users and families report clearer
                thinking, better recall, and more independence. The free
                assessment helps you see your current level and options.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                I have early symptoms. Is it too late to reverse memory loss?
              </summary>
              <p className="text-gray-600 mt-4">
                Research shows that many people with early signs can recover
                function with the right cognitive protocol. The earlier you
                start, the better the results. The free assessment helps you
                see where you stand and what to do next.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                Can the app replace medication like Aricept?
              </summary>
              <p className="text-gray-600 mt-4">
                With time and consistent training, many users find that the app
                can replace or reduce the need for medication. The protocol is
                designed to strengthen cognitive function through daily exercises,
                and results often allow people to rely less on drugs. Always
                consult your doctor before making any changes to your treatment.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                How quickly will I see results?
              </summary>
              <p className="text-gray-600 mt-4">
                87% of users report noticeable memory improvement within 21
                days. Full results typically appear between 60–90 days.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                Is my information secure?
              </summary>
              <p className="text-gray-600 mt-4">
                Yes. We use military-grade encryption (AES-256) and HIPAA
                compliance. Your data is never sold or shared.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                Do I need special equipment?
              </summary>
              <p className="text-gray-600 mt-4">
                No. You only need a smartphone, tablet, or computer. The
                exercises work on any device.
              </p>
            </details>

            <details className="bg-gray-50 p-4 sm:p-6 rounded-xl cursor-pointer group">
              <summary className="font-bold text-gray-900 text-sm sm:text-base min-h-[44px] flex items-center py-1 pr-4 -my-1 sm:my-0 list-none touch-manipulation [&::-webkit-details-marker]:hidden">
                What if the program doesn't work for me?
              </summary>
              <p className="text-gray-600 mt-4">
                We offer a 7-day no-questions-asked money-back guarantee. If
                you don't see improvement, we refund 100%.
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
            In 2022, Dr. Elena Rodriguez — a Harvard-trained neuroscientist —
            noticed a disturbing pattern: patients in their 40s, 50s, and 60s
            were coming in with memory loss that was entirely preventable. The
            standard response was a prescription. But Dr. Rodriguez knew the
            research: 73% of memory loss cases have lifestyle-related causes
            that are 100% reversible.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
            She joined forces with Dr. James Mitchell (neurobiologist, MIT), Dr.
            Patricia Silva (clinical psychologist specializing in cognitive
            aging), and a team of Stanford engineers who had built health
            tracking systems for elite athletes.
          </p>

          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Together they spent 18 months developing what would become
            NeuroSharp — a program that combines the precision of clinical
            medicine with the accessibility of modern technology. Today,
            NeuroSharp has helped over 45,000 people in 32 countries regain
            cognitive function and reduce Alzheimer's risk — including many who
            already had a diagnosis and saw real improvement.
          </p>
        </div>

        {/* Final CTA - aggressive */}
        <div className="bg-gray-900 text-white p-6 sm:p-12 rounded-xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-1">
            Prevent It, or Improve Even If You Already Have It.
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90 px-1">
            <strong>6.5 million Americans</strong> already have Alzheimer's. The protocol helps <strong>prevent decline</strong> — and <strong>improve memory and function in those who already have the disease</strong>. Take the free assessment (under 30 seconds), get your score, and see what's possible. No pills. 7-day guarantee.
          </p>
          <Button
            to="/quiz"
            size="lg"
            className="w-full sm:w-auto bg-red-700 hover:bg-red-800 !text-white font-bold text-base sm:text-lg px-4 sm:px-8 py-4 sm:py-6 min-h-[52px] rounded-xl no-underline hover:no-underline touch-manipulation active:scale-[0.98] transition-transform"
          >
            🧠 CHECK MY RISK NOW — FREE ASSESSMENT (UNDER 30 SEC)
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
                <img src="/neurosharp-logo.png" alt="NeuroSharp" className="h-8 w-8 object-contain" />
                <span className="text-white font-bold text-sm sm:text-base">NeuroSharp</span>
              </Link>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#content" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#content" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#content" className="hover:text-white">
                    Research
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#content" className="hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/refund-policy" className="hover:text-white">
                    Guarantee
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="/privacy" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#content" className="hover:text-white">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#content" className="hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#content" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#content" className="hover:text-white">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            <p>&copy; 2026 NeuroSharp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
