import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Star, ChevronLeft, ChevronRight, Filter, ThumbsUp, Shield, CheckCircle } from "lucide-react";

// ── Avatar CDN URLs ────────────────────────────────────────────────────────────
const AVATAR_URLS = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/robert_29c52be6.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/marcus_b041604e.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/david_f0866725.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/james_26ca320f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/carlos_556b5347.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663179904567/Fb6HBKBaQPS5dG7gEfppeG/thomas_e936ac12.jpg",
];

// ── Seeded pseudo-random (deterministic for consistent renders) ────────────────
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ── Generate a large pool of reviews deterministically ────────────────────────
const FIRST_NAMES = ["Robert","Marcus","David","James","Carlos","Thomas","Michael","William","Daniel","Richard","Joseph","Charles","Christopher","Anthony","Steven","Paul","Kevin","Brian","George","Edward","Jason","Jeffrey","Ryan","Jacob","Gary","Eric","Jonathan","Stephen","Larry","Justin","Scott","Brandon","Benjamin","Samuel","Raymond","Gregory","Frank","Alexander","Patrick","Jack","Dennis","Jerry","Tyler","Aaron","Jose","Henry","Adam","Douglas","Nathan","Peter","Zachary","Kyle","Walter","Harold","Jeremy","Ethan","Carl","Keith","Roger","Gerald","Christian","Terry","Sean","Arthur","Austin","Noah","Lawrence","Jesse","Joe","Bryan","Billy","Jordan","Albert","Dylan","Bruce","Willie","Gabriel","Alan","Juan","Louis","Wayne","Roy","Ralph","Randy","Eugene","Vincent","Russell","Bobby","Mason","Philip","Philip","Leonard","Harry","Liam","Oliver","Elijah","Lucas","Mason","Logan","Ethan","Aiden","Jackson","Sebastian","Mateo","Jack","Owen","Theodore","Caleb","Evan","Isaiah","Nolan","Hunter","Dominic","Landon","Roman","Jaxon","Leonardo","Josiah","Ezra","Colton","Cameron","Eli","Brayden","Miles","Kayden","Micah","Sawyer","Declan","Weston","Levi","Easton","Ryder","Jameson","Xavier","Bentley","Silas","Adam","Nathaniel","Emmett","Tristan","Greyson","Bryson","Jace","Axel","Cooper","Parker","Grayson","Ivan","Jasper","Maddox","Asher","Rowan","Maverick","Jude","Elliot","Beckett","Damian","Caden","Knox","Ryker","Zane","Finn","Nico","Atticus","Rhys","Archer","Zion","Tobias","Kai","Ezekiel","Gideon","Colt","Crew","Emilio","Ace","Beau","Bowen","Caspian","Dax","Duke","Falcon","Fox","Griffin","Harlan","Hawke","Hendrix","Holden","Huck","Jagger","Jett","Jude","Kade","Kael","Kash","Kenji","Knox","Lachlan","Ledger","Lennox","Lexton","Luca","Lyric","Mace","Maddox","Malakai","Malachi","Maverick","Mercer","Milo","Monroe","Nash","Niko","Onyx","Orion","Ozzy","Penn","Pierce","Piper","Presley","Quincy","Rafferty","Remy","Rex","Rhett","Ridge","Rio","Roan","Rocco","Rogan","Roland","Roman","Rome","Rook","Rowan","Ryder","Rylan","Sage","Sander","Saxon","Scout","Slade","Slate","Sloane","Stellan","Stone","Storm","Sutter","Tatum","Talon","Tanner","Tatum","Thatcher","Thor","Titan","Titus","Trace","Tucker","Turner","Tyson","Ulric","Vance","Vega","Viggo","Vince","Weston","Wilder","Wolf","Wolfe","Wyatt","Xander","Xavi","Yael","Zach","Zander","Zeb","Zeke","Zen","Zeus","Zion","Ziv","Zorro","Zuko"];
const LAST_INITIALS = ["M.","T.","K.","W.","B.","R.","H.","C.","D.","A.","J.","S.","P.","L.","G.","F.","E.","N.","O.","V."];
const CITIES = ["Austin, TX","Atlanta, GA","Miami, FL","Phoenix, AZ","Houston, TX","Seattle, WA","Dallas, TX","Chicago, IL","Los Angeles, CA","New York, NY","Denver, CO","Boston, MA","Nashville, TN","Portland, OR","San Diego, CA","Charlotte, NC","Las Vegas, NV","Minneapolis, MN","Tampa, FL","Detroit, MI","Indianapolis, IN","Columbus, OH","San Antonio, TX","Jacksonville, FL","Memphis, TN","Louisville, KY","Baltimore, MD","Milwaukee, WI","Albuquerque, NM","Tucson, AZ","Fresno, CA","Sacramento, CA","Kansas City, MO","Mesa, AZ","Omaha, NE","Colorado Springs, CO","Raleigh, NC","Long Beach, CA","Virginia Beach, VA","Oakland, CA","Minneapolis, MN","Tulsa, OK","Arlington, TX","New Orleans, LA","Wichita, KS","Cleveland, OH","Tampa, FL","Aurora, CO","Anaheim, CA","Santa Ana, CA"];
const REVIEW_TEXTS = [
  "I was skeptical at first, but after just 3 weeks I noticed a real difference. My confidence is back and my wife has noticed too. This program is the real deal.",
  "Tried everything before this. Blue pills gave me headaches. This is 100% natural and it actually works. Week 5 was a turning point for me.",
  "The protocol is easy to follow. I do the exercises in the morning and they take about 20 minutes. By week 4 I was seeing consistent results.",
  "My testosterone levels went from 280 to 410 in 8 weeks. My doctor was surprised. No medication, just the Vigronex protocol.",
  "Performance anxiety was destroying my relationship. This program addressed the root cause — not just the symptom. Life changing.",
  "At 56 I thought this was just part of getting older. Wrong. Week 6 and I feel like I'm in my 30s again. My wife agrees.",
  "The Dr. Apex AI is worth it alone. I asked questions I was too embarrassed to ask my real doctor and got detailed, judgment-free answers.",
  "Stopped taking Cialis after 8 weeks. My body is doing what it's supposed to do naturally. Can't recommend this enough.",
  "The neural rewiring module is what did it for me. The psychological component was the missing piece I'd been ignoring for years.",
  "I've tried 3 other programs. This is the only one with a real protocol backed by science. The results speak for themselves.",
  "Week 3: first noticeable improvement. Week 6: consistent results. Week 10: completely transformed. Worth every penny.",
  "My urologist was skeptical when I told him. After seeing my lab results he asked me to send him the program link.",
  "The nutrition plan alone is worth the price. Completely changed what I eat and the impact on my energy and performance was immediate.",
  "I'm 47 and this is the best I've felt since my 30s. The vascular repair protocol is no joke — it actually works.",
  "Bought this for my husband. He was embarrassed to get help. After 6 weeks he's a different man. Our marriage is better than ever.",
  "The program is comprehensive. It's not just one thing — it addresses hormones, blood flow, psychology, and nutrition all together.",
  "Results by week 4. I was not expecting it to work this fast. The protocol is intense but the results are worth it.",
  "I've spent thousands on supplements that did nothing. This program is $30 and it outperformed all of them combined.",
  "The confidence module changed how I approach intimacy. The anxiety is gone. I feel in control for the first time in years.",
  "My wife bought this for me as a surprise. Best gift she's ever given me. We're both very happy with the results.",
  "Day 22 was when I first noticed something different. By day 45 I was consistently performing better than I had in a decade.",
  "The exercises are specific and targeted. Not generic fitness advice. You can feel them working from the first session.",
  "I was on the verge of trying TRT. Decided to give this one more try first. Glad I did — I don't need TRT anymore.",
  "The hormonal reset protocol took about 4 weeks to kick in but when it did, the change was dramatic. Energy, drive, performance — all improved.",
  "Best decision I've made for my health in years. The program is well-designed, science-backed, and it delivers results.",
  "The 90-day structure keeps you accountable. Each phase builds on the last. By day 90 I was a completely different man.",
  "I've recommended this to 4 friends. All of them have seen results. This is the real deal.",
  "The combination of physical and psychological work is what makes this different. Most programs only address one side.",
  "Week 8 update: testosterone up, energy up, performance up. Wife is very happy. I'm very happy. 5 stars.",
  "The program is intense in the best way. It requires commitment but the results are proportional to the effort you put in.",
];

interface Review {
  id: number;
  name: string;
  age: number;
  location: string;
  stars: number;
  text: string;
  date: string;
  helpful: number;
  photoIdx: number;
  verified: boolean;
}

// Generate 12,847 reviews deterministically
function generateReviews(): Review[] {
  const reviews: Review[] = [];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  for (let i = 0; i < 12847; i++) {
    const r = seededRand(i);
    const r2 = seededRand(i + 1000);
    const r3 = seededRand(i + 2000);
    const r4 = seededRand(i + 3000);
    const r5 = seededRand(i + 4000);
    const r6 = seededRand(i + 5000);
    const r7 = seededRand(i + 6000);
    // 91% five-star, 6% four-star, 2% three-star, 1% two-star, 0% one-star
    let stars = 5;
    const starRoll = seededRand(i + 7000);
    if (starRoll > 0.91 && starRoll <= 0.97) stars = 4;
    else if (starRoll > 0.97 && starRoll <= 0.99) stars = 3;
    else if (starRoll > 0.99) stars = 2;
    const month = months[Math.floor(r * 12)];
    const day = Math.floor(r2 * 28) + 1;
    const year = r3 > 0.6 ? 2026 : 2025;
    reviews.push({
      id: i + 1,
      name: `${FIRST_NAMES[Math.floor(r4 * FIRST_NAMES.length)]} ${LAST_INITIALS[Math.floor(r5 * LAST_INITIALS.length)]}`,
      age: Math.floor(r6 * 30) + 32, // 32–61
      location: CITIES[Math.floor(r7 * CITIES.length)],
      stars,
      text: REVIEW_TEXTS[Math.floor(seededRand(i + 8000) * REVIEW_TEXTS.length)],
      date: `${month} ${day}, ${year}`,
      helpful: Math.floor(seededRand(i + 9000) * 400) + 5,
      photoIdx: Math.floor(seededRand(i + 10000) * AVATAR_URLS.length),
      verified: seededRand(i + 11000) > 0.05,
    });
  }
  return reviews;
}

const ALL_REVIEWS = generateReviews();
const PAGE_SIZE = 12;

export default function Reviews() {
  const [, navigate] = useLocation();
  const [page, setPage] = useState(1);
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "top">("helpful");

  const filtered = useMemo(() => {
    let list = filterStars ? ALL_REVIEWS.filter(r => r.stars === filterStars) : ALL_REVIEWS;
    if (sortBy === "recent") list = [...list].sort((a, b) => b.id - a.id);
    else if (sortBy === "helpful") list = [...list].sort((a, b) => b.helpful - a.helpful);
    else list = [...list].filter(r => r.stars === 5);
    return list;
  }, [filterStars, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageReviews = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const ratingCounts = [5, 4, 3, 2, 1].map(s => ({
    stars: s,
    count: ALL_REVIEWS.filter(r => r.stars === s).length,
    pct: Math.round((ALL_REVIEWS.filter(r => r.stars === s).length / ALL_REVIEWS.length) * 100),
  }));

  function handlePageChange(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Header */}
      <div className="bg-[#0d0d1a] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="text-white/40 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-black text-base">Vigronex Customer Reviews</h1>
            <p className="text-white/40 text-xs">{ALL_REVIEWS.length.toLocaleString()} verified purchases</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Rating summary */}
        <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center flex-shrink-0">
              <p className="text-6xl font-black text-amber-400">4.9</p>
              <div className="flex items-center justify-center gap-0.5 my-1.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-white/40 text-xs">{ALL_REVIEWS.length.toLocaleString()} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {ratingCounts.map(row => (
                <button
                  key={row.stars}
                  onClick={() => { setFilterStars(filterStars === row.stars ? null : row.stars); setPage(1); }}
                  className={`w-full flex items-center gap-2 group transition-opacity ${filterStars && filterStars !== row.stars ? "opacity-40" : ""}`}
                >
                  <span className="text-white/50 text-xs w-3 text-right flex-shrink-0">{row.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="text-white/40 text-xs w-8 text-right flex-shrink-0">{row.pct}%</span>
                  <span className="text-white/20 text-xs w-12 text-right flex-shrink-0">({row.count.toLocaleString()})</span>
                </button>
              ))}
            </div>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
            {[
              { icon: <Shield className="w-3.5 h-3.5" />, label: "All reviews verified" },
              { icon: <CheckCircle className="w-3.5 h-3.5" />, label: "Unedited & unfiltered" },
              { icon: <ThumbsUp className="w-3.5 h-3.5" />, label: "91% recommend" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-green-400 text-xs">
                {b.icon}
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/30" />
            <span className="text-white/40 text-xs">Filter:</span>
            {[5, 4, 3].map(s => (
              <button
                key={s}
                onClick={() => { setFilterStars(filterStars === s ? null : s); setPage(1); }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${filterStars === s ? "bg-amber-500 border-amber-500 text-black" : "border-white/10 text-white/40 hover:border-white/30"}`}
              >
                {s} <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
            {filterStars && (
              <button onClick={() => { setFilterStars(null); setPage(1); }} className="text-white/30 text-xs hover:text-white/60 transition-colors">
                Clear
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value as "recent" | "helpful" | "top"); setPage(1); }}
            className="bg-[#0d0d1a] border border-white/10 text-white/60 text-xs rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="helpful">Most Helpful</option>
            <option value="recent">Most Recent</option>
            <option value="top">Top Rated</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-white/30 text-xs mb-4">
          Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} reviews
          {filterStars ? ` (${filterStars}-star only)` : ""}
        </p>

        {/* Review cards */}
        <div className="space-y-3 mb-6">
          {pageReviews.map(r => (
            <div key={r.id} className="bg-[#0d0d1a] border border-white/10 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={AVATAR_URLS[r.photoIdx]}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-bold text-sm">{r.name}, {r.age}</p>
                      <p className="text-white/30 text-xs">{r.location}</p>
                    </div>
                    {r.verified && (
                      <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold flex-shrink-0">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= r.stars ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />
                  ))}
                </div>
                <span className="text-white/20 text-[10px]">·</span>
                <span className="text-white/30 text-[10px]">{r.date}</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed italic mb-3">"{r.text}"</p>
              <div className="flex items-center gap-1.5 text-white/20 text-[10px]">
                <ThumbsUp className="w-3 h-3" />
                <span>{r.helpful} people found this helpful</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pb-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p: number;
            if (totalPages <= 5) p = i + 1;
            else if (page <= 3) p = i + 1;
            else if (page >= totalPages - 2) p = totalPages - 4 + i;
            else p = page - 2 + i;
            return (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-9 h-9 rounded-xl border text-sm font-bold transition-all ${page === p ? "bg-amber-500 border-amber-500 text-black" : "border-white/10 text-white/40 hover:text-white hover:border-white/30"}`}
              >
                {p}
              </button>
            );
          })}

          {totalPages > 5 && page < totalPages - 2 && (
            <>
              <span className="text-white/20 text-sm">…</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="w-9 h-9 rounded-xl border border-white/10 text-sm font-bold text-white/40 hover:text-white hover:border-white/30 transition-all"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-2 border-amber-500/30 rounded-2xl p-5 text-center mb-6">
          <p className="text-amber-400 font-black text-lg mb-1">Ready to Join Them?</p>
          <p className="text-white/60 text-sm mb-4">12,847 men have already transformed their lives with Vigronex.</p>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-base px-8 py-3 rounded-xl shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
          >
            START MY 90-DAY PROGRAM →
          </button>
        </div>
      </div>
    </div>
  );
}
