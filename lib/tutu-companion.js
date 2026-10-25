/*!
 * tutu-companion.js — Zugee "Tutu" live mascot (v2.3.0)
 * Zero dependencies. Framework-agnostic Web Component.
 *
 *   <script type="module" src="/tutu-companion.js"></script>
 *   <tutu-companion label="Ask Tutu"></tutu-companion>
 *
 * Page hooks (plain data attributes):
 *   data-tutu-perch            spot where Tutu flies to while that part of the page is in view
 *     data-tutu-say="..."      speech bubble shown once when Tutu lands there
 *     data-tutu-mood="happy"   mood shown for a moment on landing
 *   data-tutu-react="happy"    hovering / focusing this element sets the mood (happy | wink | surprised …)
 *   data-tutu-think            typing inside this element makes Tutu "think"
 *
 * Attributes on <tutu-companion>:
 *   src="/tutu-genie.webp"      use the genie Tutu illustration (live eyes are drawn over its visor)
 *   size="96"                  px width, desktop (phones use 72%)
 *   label="Ask Tutu"           text on the docked pill
 *   idle-sleep="9000"          ms of inactivity before Tutu falls asleep (0 = never)
 *   mobile-mode="dock|perch"   phones: stay docked (default) or travel like desktop
 *   theme="auto|light|dark"     auto follows <html data-theme> / .light/.dark class, then OS
 *   no-click-react             don't look surprised on random page clicks
 *   no-exit-intent             don't show the sad 'leaving already?' bubble
 *   exit-message="..."         custom text for that bubble
 *   always-dock                never travel; stay on the pill
 *   perch-top="180"            px from the top of the viewport above which perches are ignored (default 8%; zugee addition)
 *
 * Moods:   neutral happy wink surprised thinking sleepy curious love laugh excited sad dizzy
 * JS API:  el.setMood('happy', 1500) · el.setMood('thinking') · el.clearMood() · el.celebrate('Done!')
 *          el.say('Hello!', 3500) · el.dock(true|false)
 * Events:  'tutu-open'  (Tutu or pill clicked — open your chat here)
 *          'tutu-mood'  (detail: { mood })
 *
 * Theme with CSS custom properties on the element:
 *   --tutu-cyan, --tutu-blue, --tutu-navy, --tutu-font, --tutu-z
 */

const MOODS = ['neutral', 'happy', 'wink', 'surprised', 'thinking', 'sleepy', 'curious', 'love', 'laugh', 'excited', 'sad', 'dizzy'];
/* the vector robot only draws the first six; the rest map to the nearest face */
const ROBOT_FACE = { curious: 'surprised', love: 'happy', laugh: 'happy', excited: 'happy', sad: 'sleepy', dizzy: 'surprised' };
const POKE_LINES = ['Hehe, that tickles!', 'Hi! How can I help?', 'Vanakkam! Ask me anything.', 'You found me!'];
const DIZZY_LINES = ['Whoa, I\'m dizzy!', 'Easy, easy!', 'Everything is spinning...'];

const SVG = /* html */ `
<svg class="tt" viewBox="0 0 200 230" data-mood="neutral" aria-hidden="true" focusable="false">
 <defs>
  <radialGradient id="hg" cx=".34" cy=".22" r=".9"><stop offset="0" stop-color="#A8DEFF"/><stop offset=".32" stop-color="#4C94FF"/><stop offset=".72" stop-color="#1F52D8"/><stop offset="1" stop-color="#132F8C"/></radialGradient>
  <linearGradient id="bz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F8FF"/><stop offset="1" stop-color="#86B6FF"/></linearGradient>
  <radialGradient id="vz" cx=".42" cy=".28" r=".95"><stop offset="0" stop-color="#16397A"/><stop offset=".55" stop-color="#081A3D"/><stop offset="1" stop-color="#040B1F"/></radialGradient>
  <linearGradient id="tf" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#1E5BFF"/><stop offset=".55" stop-color="#3FA2FF"/><stop offset="1" stop-color="#8BE4FF"/></linearGradient>
  <radialGradient id="ear" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7FC4FF"/><stop offset="1" stop-color="#1B44C2"/></radialGradient>
  <linearGradient id="tor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A4494"/><stop offset="1" stop-color="#0A1D49"/></linearGradient>
  <radialGradient id="sh" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#86CBFF"/><stop offset="1" stop-color="#1E53D6"/></radialGradient>
  <filter id="g" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 </defs>
 <g class="rig">
  <!-- body -->
  <g class="arm"><ellipse cx="50" cy="184" rx="9" ry="15" transform="rotate(22 50 184)" fill="url(#sh)"/></g>
  <g class="arm arm-r"><ellipse cx="150" cy="182" rx="9" ry="15" transform="rotate(-22 150 182)" fill="url(#sh)"/></g>
  <path d="M64 162 Q100 146 136 162 L140 200 Q100 216 60 200 Z" fill="url(#tor)"/>
  <ellipse cx="68" cy="168" rx="16" ry="12" fill="url(#sh)"/>
  <ellipse cx="132" cy="168" rx="16" ry="12" fill="url(#sh)"/>
  <path d="M90 178 H110 L90 196 H110" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <ellipse cx="100" cy="155" rx="32" ry="6" fill="#06122E" opacity=".45"/>
  <!-- head -->
  <g class="head">
   <path d="M90 52 C84 32 96 12 120 9 C135 7 148 13 153 23 C142 18 130 20 124 28 C118 36 120 46 114 53 Z" fill="url(#tf)"/>
   <path d="M98 42 C98 28 108 19 123 16" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>
   <path class="spark" d="M160 30 L163.5 40 L173 43.5 L163.5 47 L160 57 L156.5 47 L147 43.5 L156.5 40 Z" fill="#2E6BFF"/>
   <circle cx="32" cy="106" r="14" fill="url(#ear)"/><circle cx="32" cy="106" r="6.5" fill="#1236A0"/>
   <circle cx="168" cy="106" r="14" fill="url(#ear)"/><circle cx="168" cy="106" r="6.5" fill="#1236A0"/>
   <ellipse cx="100" cy="102" rx="68" ry="60" fill="url(#hg)"/>
   <path d="M48 84 C55 58 80 45 108 44" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".65"/>
   <ellipse cx="57" cy="70" rx="5" ry="3" fill="#fff" opacity=".7" transform="rotate(-35 57 70)"/>
   <rect x="41" y="64" width="118" height="82" rx="39" fill="url(#bz)"/>
   <rect x="47" y="70" width="106" height="70" rx="33" fill="url(#vz)"/>
   <rect class="visor-glow" x="47" y="70" width="106" height="70" rx="33" fill="none" stroke="#39E6FF" stroke-opacity=".25" stroke-width="1.5"/>
   <path d="M60 83 Q76 74 98 74" stroke="#fff" stroke-opacity=".22" stroke-width="4" fill="none" stroke-linecap="round"/>
   <g class="face">
    <g class="mood s-happy s-wink"><ellipse cx="63" cy="121" rx="8" ry="4.5" fill="#FF7AB8" opacity=".55"/><ellipse cx="137" cy="121" rx="8" ry="4.5" fill="#FF7AB8" opacity=".55"/></g>
    <g filter="url(#g)" fill="none" stroke="#39E6FF" stroke-linecap="round">
     <!-- neutral: the brand's smiling arc eyes -->
     <g class="mood s-neutral" stroke-width="6.5"><path class="blinker" d="M68 108 Q78 93 88 108"/><path class="blinker" d="M112 108 Q122 93 132 108"/></g>
     <!-- happy: bigger arcs + smile -->
     <g class="mood s-happy" stroke-width="7"><path d="M66 107 Q78 89 90 107"/><path d="M110 107 Q122 89 134 107"/><path d="M91 120 Q100 129 109 120" stroke-width="4"/></g>
     <!-- wink -->
     <g class="mood s-wink" stroke-width="6.5"><path d="M66 107 Q78 89 90 107"/><path d="M112 104 Q122 110 132 104"/><path d="M92 121 Q100 127 108 121" stroke-width="4"/></g>
     <!-- surprised -->
     <g class="mood s-surprised" stroke="none" fill="#39E6FF"><ellipse class="blinker" cx="78" cy="102" rx="9" ry="11"/><ellipse class="blinker" cx="122" cy="102" rx="9" ry="11"/><circle cx="100" cy="125" r="4.5" fill="none" stroke="#39E6FF" stroke-width="3.5"/></g>
     <!-- thinking -->
     <g class="mood s-thinking" stroke="none" fill="#39E6FF"><rect class="blinker" x="71" y="94" width="13" height="18" rx="6.5"/><rect class="blinker" x="115" y="94" width="13" height="18" rx="6.5"/><path d="M95 124 H107" fill="none" stroke="#39E6FF" stroke-width="3.5"/></g>
     <!-- sleepy -->
     <g class="mood s-sleepy" stroke-width="5.5"><path d="M68 102 Q78 109 88 102"/><path d="M112 102 Q122 109 132 102"/></g>
    </g>
   </g>
   <g class="mood s-thinking" fill="#39E6FF"><circle class="dot" cx="152" cy="60" r="4"/><circle class="dot dot2" cx="164" cy="50" r="5"/><circle class="dot dot3" cx="178" cy="38" r="6"/></g>
   <g class="mood s-sleepy" fill="#7FBFFF" font-family="system-ui, sans-serif" font-weight="800">
    <text class="z" x="150" y="64" font-size="14">z</text><text class="z z2" x="158" y="56" font-size="18">z</text><text class="z z3" x="166" y="48" font-size="22">z</text>
   </g>
  </g>
 </g>
</svg>`;


/* Genie Tutu: the brand illustration (src image, baked eyes removed) + live eyes drawn over its visor.
   Coordinates are calibrated to tutu-genie.webp (364 x 597 logical px). In this repo the visor ellipse
   (translate, rotate, clip rx/ry) comes from scripts/make-tutu-genie.mjs; re-run it if the art changes. */
const GENIE_FACE = /* html */ `
<svg class="tt" viewBox="0 0 364 597" preserveAspectRatio="none" data-mood="neutral" aria-hidden="true" focusable="false">
 <defs>
  <clipPath id="vc"><ellipse cx="0" cy="0" rx="99.4" ry="59.9"/></clipPath>
  <filter id="g" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 </defs>
 <g transform="translate(181.4 182.2) rotate(16.2)">
  <g clip-path="url(#vc)">
   <g class="face">
    <g class="mood s-happy s-wink"><ellipse cx="-84" cy="30" rx="14" ry="7" fill="#FF7AB8" opacity=".5"/><ellipse cx="84" cy="30" rx="14" ry="7" fill="#FF7AB8" opacity=".5"/></g>
    <g filter="url(#g)" fill="none" stroke="#2CEFFF" stroke-linecap="round">
     <g class="mood s-neutral" stroke-width="11"><path class="blinker" d="M-76 15 Q-52 -20 -28 15"/><path class="blinker" d="M28 15 Q52 -20 76 15"/></g>
     <g class="mood s-happy" stroke-width="12"><path d="M-78 16 Q-52 -26 -26 16"/><path d="M26 16 Q52 -26 78 16"/><path d="M-18 34 Q0 50 18 34" stroke-width="7"/></g>
     <g class="mood s-wink" stroke-width="11"><path d="M-78 16 Q-52 -26 -26 16"/><path d="M28 8 Q52 22 76 8" stroke-width="10"/><path d="M-14 36 Q0 46 14 36" stroke-width="6"/></g>
     <g class="mood s-surprised" stroke="none" fill="#2CEFFF"><ellipse class="blinker" cx="-52" cy="2" rx="15" ry="20"/><ellipse class="blinker" cx="52" cy="2" rx="15" ry="20"/><circle cx="0" cy="40" r="8" fill="none" stroke="#2CEFFF" stroke-width="6"/></g>
     <g class="mood s-thinking" stroke="none" fill="#2CEFFF"><rect class="blinker" x="-62" y="-14" width="20" height="32" rx="10"/><rect class="blinker" x="42" y="-14" width="20" height="32" rx="10"/><path d="M-10 38 H10" fill="none" stroke="#2CEFFF" stroke-width="6"/></g>
     <g class="mood s-sleepy" stroke-width="9"><path d="M-76 4 Q-52 20 -28 4"/><path d="M28 4 Q52 20 76 4"/></g>
     <!-- curious: big shiny eyes -->
     <g class="mood s-curious" stroke="none" fill="#2CEFFF"><ellipse class="blinker" cx="-52" cy="0" rx="19" ry="23"/><ellipse class="blinker" cx="52" cy="0" rx="19" ry="23"/><circle cx="-45" cy="-8" r="6" fill="#fff"/><circle cx="59" cy="-8" r="6" fill="#fff"/><path d="M-10 38 Q0 44 10 38" fill="none" stroke="#2CEFFF" stroke-width="5"/></g>
     <!-- laugh: squeezed eyes + open mouth -->
     <g class="mood s-laugh" stroke-width="10" stroke-linejoin="round"><path d="M-74 -12 L-36 3 L-74 18"/><path d="M74 -12 L36 3 L74 18"/><path d="M-24 26 Q0 60 24 26 Z" fill="#2CEFFF" stroke-width="4"/></g>
     <!-- sad: droopy eyes, brows, frown -->
     <g class="mood s-sad" stroke-width="7"><ellipse class="blinker" cx="-52" cy="8" rx="11" ry="13" fill="#2CEFFF" stroke="none"/><ellipse class="blinker" cx="52" cy="8" rx="11" ry="13" fill="#2CEFFF" stroke="none"/><path d="M-78 -12 L-36 -24"/><path d="M36 -24 L78 -12"/><path d="M-16 44 Q0 32 16 44" stroke-width="6"/></g>
     <!-- dizzy: spinning spirals -->
     <g class="mood s-dizzy" stroke-width="5.5"><path class="spin" d="M-52 3 m-3 0 a3 3 0 1 1 6 0 a7 7 0 1 1 -14 0 a11 11 0 1 1 22 0 a15 15 0 1 1 -30 0"/><path class="spin" d="M52 3 m-3 0 a3 3 0 1 1 6 0 a7 7 0 1 1 -14 0 a11 11 0 1 1 22 0 a15 15 0 1 1 -30 0"/><path d="M-20 40 q5 -6 10 0 t10 0 t10 0 t10 0" stroke-width="5"/></g>
    </g>
    <g class="mood s-love" filter="url(#g)"><path class="pulse" d="M-52 18.75 C-85.75 -1.25 -74.5 -32.5 -52 -13.75 C-29.5 -32.5 -18.25 -1.25 -52 18.75 Z" fill="#FF5FA8"/><path class="pulse" d="M52 18.75 C18.25 -1.25 29.5 -32.5 52 -13.75 C74.5 -32.5 85.75 -1.25 52 18.75 Z" fill="#FF5FA8"/><path d="M-20 34 Q0 52 20 34" fill="none" stroke="#2CEFFF" stroke-width="7" stroke-linecap="round"/></g>
    <g class="mood s-excited" filter="url(#g)"><path class="pulse" d="M-52.0 -22.0 L-46.1 -6.1 L-29.2 -5.4 L-42.5 5.1 L-37.9 21.4 L-52.0 12.0 L-66.1 21.4 L-61.5 5.1 L-74.8 -5.4 L-57.9 -6.1 Z" fill="#FFD84D"/><path class="pulse" d="M52.0 -22.0 L57.9 -6.1 L74.8 -5.4 L61.5 5.1 L66.1 21.4 L52.0 12.0 L37.9 21.4 L42.5 5.1 L29.2 -5.4 L46.1 -6.1 Z" fill="#FFD84D"/><path d="M-24 28 Q0 60 24 28 Z" fill="#2CEFFF"/></g>
    <g class="mood s-sad"><path class="tear" d="M-62 26 q-6 10 0 14 q6 -4 0 -14 Z" fill="#9FDBFF"/></g>
    <g class="mood s-love s-excited s-laugh s-curious"><ellipse cx="-84" cy="30" rx="14" ry="7" fill="#FF7AB8" opacity=".5"/><ellipse cx="84" cy="30" rx="14" ry="7" fill="#FF7AB8" opacity=".5"/></g>
   </g>
  </g>
 </g>
 <g class="mood s-thinking" fill="#2CEFFF"><circle class="dot" cx="86" cy="96" r="7"/><circle class="dot dot2" cx="64" cy="70" r="9"/><circle class="dot dot3" cx="40" cy="42" r="11"/></g>
 <g class="mood s-sleepy" fill="#7FCBFF" font-family="system-ui, sans-serif" font-weight="800">
  <text class="z" x="70" y="100" font-size="26">z</text><text class="z z2" x="54" y="76" font-size="32">z</text><text class="z z3" x="36" y="50" font-size="40">z</text>
 </g>
</svg>`;

const CSS = /* css */ `
:host{
  --c:var(--tutu-cyan,#00E5FF); --b:var(--tutu-blue,#2563FF); --n:var(--tutu-navy,#0A0F24);
  --s:96px;
  position:fixed; left:0; top:0; width:0; height:0;
  z-index:var(--tutu-z,60); pointer-events:none;
  font-family:var(--tutu-font, "Sora", "Segoe UI", system-ui, sans-serif);
}
:host([hidden]){display:none}
@media print{:host{display:none}}
*{box-sizing:border-box}

.pill{
  position:fixed;
  right:calc(20px + env(safe-area-inset-right,0px));
  bottom:calc(20px + env(safe-area-inset-bottom,0px));
  height:calc(var(--s)*.62);
  padding:0 22px 0 calc(var(--s)*.98);
  display:flex; align-items:center;
  border-radius:999px; border:3px solid rgba(140,220,245,.75);
  background:linear-gradient(90deg,#07A6C9,#1F6BFF);
  color:#fff; font-family:inherit; font-weight:700; font-size:16px; line-height:1; letter-spacing:.01em; white-space:nowrap;
  box-shadow:0 12px 36px rgba(37,99,255,.45);
  cursor:pointer; opacity:0; transform:translateY(14px) scale(.96);
  transition:opacity .25s ease, transform .3s cubic-bezier(.2,.9,.3,1.3);
  pointer-events:none;
}
.pill.on{opacity:1; transform:none; pointer-events:auto}
.pill:hover{filter:brightness(1.08)}
.pill:focus-visible,.me:focus-visible{outline:3px solid var(--c); outline-offset:4px}

.body{
  position:fixed; left:0; top:0;
  width:var(--s); height:calc(var(--s)*var(--ar,1.15));
  will-change:transform; pointer-events:auto;
  transition:opacity .25s ease;
}
.body.ghost{opacity:0}
.me{
  appearance:none; background:none; border:0; padding:0; margin:0;
  display:block; width:100%; height:100%; cursor:pointer;
  perspective:520px; border-radius:42%;
}
.art{position:relative; width:100%; height:100%}
.art.bob{animation:bob 3.4s ease-in-out infinite}
.pic{position:absolute; inset:0; width:100%; height:100%; object-fit:fill; user-select:none; -webkit-user-drag:none; pointer-events:none}
.art .tt{position:absolute; inset:0}
.ring{position:absolute; left:8%; right:8%; bottom:-5%; height:12%; border-radius:50%;
  background:radial-gradient(ellipse at center, rgba(60,210,255,.75) 0%, rgba(40,120,255,.35) 40%, transparent 70%);
  opacity:0; transform:scale(.6); transition:opacity .4s ease, transform .5s ease; filter:blur(1px)}
.body.perched .ring{opacity:1; transform:none}
.tilt{width:100%; height:100%; transform-style:preserve-3d; filter:drop-shadow(0 10px 16px rgba(0,25,80,.45))}

.bubble{
  position:absolute; bottom:96%;
  width:max-content; max-width:min(260px, 70vw);
  padding:10px 14px; border-radius:16px;
  background:#fff; color:#0A0F24;
  font-family:inherit; font-weight:600; font-size:14px; line-height:1.4;
  box-shadow:0 12px 30px rgba(0,0,0,.35);
  opacity:0; transform:translateY(6px) scale(.95);
  transition:opacity .2s ease, transform .25s cubic-bezier(.2,.9,.3,1.3);
  pointer-events:none;
}
.bubble.right{left:62%; border-bottom-left-radius:4px}
.bubble.left{right:62%; border-bottom-right-radius:4px}
.bubble.below{bottom:auto; top:100%}
.bubble.show{opacity:1; transform:none}
:host([data-mode="light"]) .bubble{background:#0A0F24; color:#fff; box-shadow:0 12px 30px rgba(10,15,36,.22)}
:host([data-mode="light"]) .tilt{filter:drop-shadow(0 10px 14px rgba(30,70,170,.28))}
:host([data-mode="light"]) .pill{box-shadow:0 10px 28px rgba(31,107,255,.30)}

.tt{display:block; width:100%; height:100%; overflow:visible}
.tt .mood{opacity:0; transition:opacity .16s ease}
.tt[data-mood="neutral"] .s-neutral,.tt[data-mood="happy"] .s-happy,.tt[data-mood="wink"] .s-wink,
.tt[data-mood="surprised"] .s-surprised,.tt[data-mood="thinking"] .s-thinking,.tt[data-mood="sleepy"] .s-sleepy,
.tt[data-mood="curious"] .s-curious,.tt[data-mood="love"] .s-love,.tt[data-mood="laugh"] .s-laugh,
.tt[data-mood="excited"] .s-excited,.tt[data-mood="sad"] .s-sad,.tt[data-mood="dizzy"] .s-dizzy{opacity:1}
.tt .blinker{transform-box:fill-box; transform-origin:center; transition:transform .07s ease}
.tt.blink .blinker{transform:scaleY(.08)}
.tt .rig{animation:bob 3.4s ease-in-out infinite}
.tt[data-mood="sleepy"] .rig{animation-duration:5.5s}
.tt .spark{transform-box:fill-box; transform-origin:center; animation:twinkle 2.6s ease-in-out infinite}
.tt .arm-r{transform-box:fill-box; transform-origin:15% 10%}
.tt[data-mood="happy"] .arm-r{animation:wave .7s ease-in-out infinite alternate}
.tt .z{animation:zz 2.4s linear infinite; opacity:0}
.tt .z2{animation-delay:.8s} .tt .z3{animation-delay:1.6s}
.tt .dot{animation:dotp 1.1s ease-in-out infinite}
.tt .dot2{animation-delay:.18s} .tt .dot3{animation-delay:.36s}
.tt[data-mood="sleepy"] .visor-glow{opacity:.35}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes twinkle{0%,100%{transform:scale(.7) rotate(0);opacity:.6}50%{transform:scale(1.1) rotate(20deg);opacity:1}}
@keyframes wave{from{transform:rotate(-8deg)}to{transform:rotate(-38deg)}}
@keyframes zz{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}100%{opacity:0;transform:translate(14px,-26px)}}
@keyframes dotp{0%,100%{opacity:.3}50%{opacity:1}}
.tt .pulse{transform-box:fill-box; transform-origin:center; animation:pulse .7s ease-in-out infinite}
.tt .spin{transform-box:fill-box; transform-origin:center; animation:spin .9s linear infinite}
.tt .tear{animation:tear 1.5s ease-in infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes tear{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(26px);opacity:0}}
/* whole-body reactions */
:host([data-m="laugh"]) .art, :host([data-m="laugh"]) .tt .rig,
:host([data-m="excited"]) .art, :host([data-m="excited"]) .tt .rig{animation:jump .48s ease-in-out infinite}
:host([data-m="dizzy"]) .art, :host([data-m="dizzy"]) .tt .rig{animation:wobble .55s ease-in-out infinite}
:host([data-m="love"]) .art, :host([data-m="love"]) .tt .rig{animation:throb .8s ease-in-out infinite}
:host([data-m="sad"]) .art, :host([data-m="sad"]) .tt .rig{animation:none; transform:translateY(5px) rotate(-3deg); transition:transform .4s}
:host([data-m="curious"]) .art{animation:none; transform:translateY(-4px) scale(1.04); transition:transform .3s}
@keyframes jump{0%,100%{transform:translateY(0) scale(1,1)}30%{transform:translateY(-14px) scale(.96,1.04)}60%{transform:translateY(0) scale(1.05,.95)}}
@keyframes wobble{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg)}75%{transform:rotate(9deg)}}
@keyframes throb{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.fx{position:absolute; left:50%; top:30%; width:0; height:0; pointer-events:none}
.fx span{position:absolute; left:0; top:0; font-size:16px; line-height:1; transform:translate(-50%,-50%); animation:burst .9s ease-out forwards; text-shadow:0 0 8px currentColor}
@keyframes burst{0%{opacity:1; transform:translate(-50%,-50%) scale(.4)}100%{opacity:0; transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.1) rotate(var(--r))}}
@media (prefers-reduced-motion: reduce){
  .art,.tt .rig,.tt .pulse,.tt .spin,.tt .tear,.fx span{animation:none!important}
  .art.bob,.tt .rig,.tt .spark,.tt[data-mood="happy"] .arm-r,.tt .z,.tt .dot{animation:none}
  .tt .z{opacity:1}
  .bubble,.pill{transition:opacity .2s ease}
}
`;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const now = () => performance.now();

class TutuCompanion extends HTMLElement {
  static get observedAttributes() { return ['size', 'label', 'theme']; }

  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._p = { x: -150, y: 260 };      // current centre (px, viewport)
    this._v = { x: 0, y: 0 };           // velocity px/s
    this._t = { x: -150, y: 260 };      // target centre
    this._face = { x: 0, y: 0 };
    this._tilt = { x: 0, y: 0 };
    this._ptr = { x: 0, y: 0, at: -1e9 };
    this._sacc = { x: 0, y: 0, at: 0 };
    this._forced = null; this._temp = null; this._tempUntil = 0;
    this._hover = null; this._typing = false; this._asleep = false;
    this._mood = '';
    this._last = now(); this._busyUntil = 0;
    this._raf = 0; this._idleTimer = 0; this._prevT = 0;
    this._perches = []; this._perchAt = 0;
    this._perch = null; this._pending = null; this._said = new WeakSet();
    this._forceDock = false; this._docked = false; this._sc = 1;
    this._timers = new Set();
  }

  /* ---------- lifecycle ---------- */
  connectedCallback() {
    if (!this._built) this._build();
    this._mqMobile = matchMedia('(max-width: 640px)');
    this._mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
    this._applySize();
    this._applyTheme();
    this._themeObs = new MutationObserver(() => this._applyTheme());
    this._themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    this._mqLight = matchMedia('(prefers-color-scheme: light)');
    this._mqLight.addEventListener('change', this._applyThemeBound = () => this._applyTheme());
    this._p = { x: -this._s, y: innerHeight * 0.3 };
    this._ptr = { x: innerWidth * 0.5, y: innerHeight * 0.35, at: -1e9 };
    this._listen(true);
    this._blinkLoop();
    this._wake();
  }

  disconnectedCallback() {
    this._listen(false);
    if (this._themeObs) this._themeObs.disconnect();
    if (this._mqLight) this._mqLight.removeEventListener('change', this._applyThemeBound);
    cancelAnimationFrame(this._raf); this._raf = 0;
    clearTimeout(this._idleTimer);
    this._timers.forEach(clearTimeout); this._timers.clear();
  }

  attributeChangedCallback(name) {
    if (!this._built) return;
    if (name === 'label') this._pill.querySelector('span').textContent = this.label;
    if (name === 'size') { this._applySize(); this._wake(); }
    if (name === 'theme') this._applyTheme();
  }

  get label() { return this.getAttribute('label') || 'Ask Tutu'; }

  _build() {
    this._built = true;
    const src = this.getAttribute('src');
    this._genie = !!src;
    this._ar = this._genie ? 597 / 364 : 1.15;
    const esc = (v) => String(v).replace(/[&"<>]/g, (c) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' }[c]));
    const art = this._genie
      ? `<div class="art bob"><div class="ring"></div><img class="pic" src="${esc(src)}" alt="" draggable="false" decoding="async">${GENIE_FACE}</div>`
      : SVG;
    this._root.innerHTML = `<style>${CSS}</style>
      <button class="pill" type="button" part="pill" tabindex="-1"><span></span></button>
      <div class="body" part="tutu">
        <div class="bubble" part="bubble" role="status" aria-live="polite"></div>
        <div class="fx" aria-hidden="true"></div>
        <button class="me" type="button" aria-label="Open Tutu chat"><div class="tilt">${art}</div></button>
      </div>`;
    const $ = (s) => this._root.querySelector(s);
    this._pill = $('.pill'); this._bodyEl = $('.body'); this._tiltEl = $('.tilt');
    this._svg = $('svg'); this._faceEl = $('.face'); this._bubble = $('.bubble');
    this._pill.querySelector('span').textContent = this.label;
    this._pill.setAttribute('aria-label', this.label);
    this._fx = $('.fx');
    $('.me').addEventListener('click', () => this._poke());
    this._pill.addEventListener('click', () => { this.setMood('happy', 1200); this._emitOpen(); });
  }

  _emitOpen() { this.dispatchEvent(new CustomEvent('tutu-open', { bubbles: true, composed: true })); }

  /** tap on Tutu: giggle + open chat; three quick taps make it dizzy */
  _poke() {
    const t = now();
    this._pokes = (this._pokes || []).filter((x) => t - x < 1500);
    this._pokes.push(t);
    if (this._pokes.length >= 3) {
      this._pokes = [];
      this.setMood('dizzy', 1700);
      this.say(DIZZY_LINES[Math.floor(Math.random() * DIZZY_LINES.length)], 1800);
      return;
    }
    this.setMood('laugh', 900);
    this._burst('✦', 6, '#3FE3FF');
    if (this._pokes.length === 1) {
      this.say(POKE_LINES[Math.floor(Math.random() * POKE_LINES.length)], 1700);
      this._later(() => this._emitOpen(), 450);
    }
  }

  _burst(ch, n, color) {
    if (!this._fx || this._mqReduce.matches) return;
    for (let i = 0; i < n; i++) {
      const sp = document.createElement('span');
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.6, d = this._s * (0.55 + Math.random() * 0.35);
      sp.textContent = ch;
      sp.style.color = color;
      sp.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px');
      sp.style.setProperty('--dy', (Math.sin(a) * d - 10).toFixed(0) + 'px');
      sp.style.setProperty('--r', ((Math.random() - 0.5) * 120).toFixed(0) + 'deg');
      sp.style.fontSize = (12 + Math.random() * 10).toFixed(0) + 'px';
      this._fx.appendChild(sp);
      this._later(() => sp.remove(), 950);
    }
  }

  /** theme="light|dark|auto" (default auto: follows <html> data-theme / class, then the OS setting) */
  _applyTheme() {
    let mode = this.getAttribute('theme') || 'auto';
    if (mode === 'auto') {
      const h = document.documentElement, t = h.getAttribute('data-theme');
      if (t === 'light' || t === 'dark') mode = t;
      else if (h.classList.contains('light')) mode = 'light';
      else if (h.classList.contains('dark')) mode = 'dark';
      else mode = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    if (this.getAttribute('data-mode') !== mode) this.setAttribute('data-mode', mode);
  }

  _applySize() {
    const base = parseFloat(this.getAttribute('size')) || 96;
    this._s = Math.round(this._mqMobile && this._mqMobile.matches ? base * 0.72 : base);
    this.style.setProperty('--s', this._s + 'px');
    this.style.setProperty('--ar', String(this._ar || 1.15));
  }

  /* ---------- events ---------- */
  _listen(on) {
    const m = on ? 'addEventListener' : 'removeEventListener';
    if (!this._h) {
      this._h = {
        move: (e) => { this._ptr = { x: e.clientX, y: e.clientY, at: now() }; this._activity(); },
        down: (e) => {
          this._ptr = { x: e.clientX, y: e.clientY, at: now() };
          const woke = this._activity();
          if (woke || this.hasAttribute('no-click-react')) return;
          if (e.composedPath().includes(this)) return;
          const t = e.target;
          if (t && t.closest && t.closest('a,button,input,textarea,select,label,[role="button"],[data-tutu-react],[contenteditable]')) return;
          this.setMood('surprised', 650);
        },
        scroll: () => {
          const y = window.scrollY, t = now();
          if (this._sy != null && t > this._st) {
            const v = Math.abs(y - this._sy) / (t - this._st) * 1000;
            if (v > 6000 && t - (this._dizzyAt || 0) > 5000 && !this._mqReduce.matches) { this._dizzyAt = t; this.setMood('dizzy', 900); }
          }
          this._sy = y; this._st = t;
          this._activity();
        },
        out: (e) => {
          if (e.relatedTarget || e.clientY > 0 || this.hasAttribute('no-exit-intent')) return;
          let seen = false;
          try { seen = sessionStorage.getItem('tutu-exit') === '1'; sessionStorage.setItem('tutu-exit', '1'); } catch (_) { seen = !!this._exitShown; }
          if (seen || this._exitShown) return;
          this._exitShown = true;
          this.setMood('sad', 2800);
          this.say(this.getAttribute('exit-message') || 'Leaving already? Ask me anything first!', 3400);
        },
        key: () => this._activity(),
        resize: () => { this._applySize(); this._perchAt = 0; this._wake(); },
        over: (e) => {
          const el = e.target && e.target.closest ? e.target.closest('[data-tutu-react]') : null;
          const m = el ? el.getAttribute('data-tutu-react') : null;
          if (m !== this._hover) { this._hover = MOODS.includes(m) ? m : null; this._wake(); }
        },
        input: (e) => {
          if (!(e.target && e.target.closest && e.target.closest('[data-tutu-think]'))) return;
          this._typing = !!(e.target.value === undefined || String(e.target.value).length);
          clearTimeout(this._typeT);
          this._typeT = setTimeout(() => { this._typing = false; this._wake(); }, 1400);
          this._activity();
        },
        vis: () => {
          if (document.hidden) { cancelAnimationFrame(this._raf); this._raf = 0; this._hiddenAt = now(); return; }
          const t = now();
          if (this._hiddenAt && t - this._hiddenAt > 20000 && t - (this._welcomeAt || -1e9) > 120000) {
            this._welcomeAt = t; this._asleep = false;
            this.setMood('happy', 1800); this.say('Welcome back!', 2200);
          }
          this._wake();
        },
        mq: () => { this._applySize(); this._wake(); },
      };
    }
    const h = this._h;
    window[m]('pointermove', h.move, { passive: true });
    window[m]('pointerdown', h.down, { passive: true });
    window[m]('scroll', h.scroll, { passive: true, capture: true });
    window[m]('keydown', h.key);
    window[m]('resize', h.resize);
    document[m]('pointerover', h.over);
    document[m]('focusin', h.over);
    document[m]('input', h.input);
    document[m]('visibilitychange', h.vis);
    document[m]('mouseout', h.out);
    if (this._mqMobile) this._mqMobile[m]('change', h.mq);
  }

  /** marks user activity; returns true if it woke Tutu up */
  _activity() {
    this._last = now();
    let woke = false;
    if (this._asleep) { this._asleep = false; this.setMood('surprised', 800); woke = true; }
    this._wake();
    return woke;
  }

  _later(fn, ms) {
    const id = setTimeout(() => { this._timers.delete(id); fn(); }, ms);
    this._timers.add(id);
    return id;
  }

  _blinkLoop() {
    this._later(() => {
      if (!document.hidden) {
        this._svg.classList.add('blink');
        this._later(() => {
          this._svg.classList.remove('blink');
          if (Math.random() < 0.25) this._later(() => {
            this._svg.classList.add('blink');
            this._later(() => this._svg.classList.remove('blink'), 110);
          }, 160);
        }, 120);
      }
      this._blinkLoop();
    }, 2200 + Math.random() * 3400);
  }

  /* ---------- public API ---------- */
  setMood(mood, ms) {
    if (mood === 'auto' || mood == null) { this._forced = null; this._wake(); return; }
    if (!MOODS.includes(mood)) return;
    if (ms == null) this._forced = mood;
    else { this._temp = mood; this._tempUntil = now() + ms; }
    if (mood !== 'sleepy') this._asleep = false;
    this._wake();
  }
  clearMood() { this._forced = null; this._temp = null; this._wake(); }

  say(text, ms = 3800) {
    if (!text) return;
    this._bubble.textContent = text;
    this._bubble.classList.add('show');
    clearTimeout(this._sayT);
    this._sayT = setTimeout(() => this._bubble.classList.remove('show'), ms);
    this._wake();
  }

  dock(force = true) { this._forceDock = !!force; this._wake(); }

  /** happy jump with sparkles, e.g. after a form is submitted successfully */
  celebrate(text, ms = 2200) {
    this.setMood('excited', ms);
    this._burst('✦', 10, '#FFD84D');
    this._later(() => this._burst('✦', 8, '#3FE3FF'), 220);
    if (text) this.say(text, ms + 800);
  }

  /* ---------- loop ---------- */
  _wake() {
    clearTimeout(this._idleTimer);
    if (this._raf || document.hidden || !this.isConnected) return;
    this._prevT = now();
    this._raf = requestAnimationFrame(this._tick);
  }

  _resolveMood(t) {
    if (this._forced) return this._forced;
    if (this._temp && t < this._tempUntil) return this._temp;
    if (this._typing) return 'thinking';
    if (this._asleep) return 'sleepy';
    if (this._hover) return this._hover;
    if (this._near) return 'curious';
    return 'neutral';
  }

  _pickPerch(t) {
    if (t - this._perchAt > 500) {
      this._perches = Array.from(document.querySelectorAll('[data-tutu-perch]'));
      this._perchAt = t;
    }
    const vh = innerHeight, line = vh * 0.42;
    /* zugee: perch-top="180" ignores perches closer than 180 px to the top, so Tutu never sits under the sticky header */
    const top = Math.max(vh * 0.08, parseFloat(this.getAttribute('perch-top')) || 0);
    let best = null, bestD = Infinity;
    for (const el of this._perches) {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height && !r.top && !r.left) continue;            // display:none
      const cy = r.top + r.height / 2;
      if (cy < top || cy > vh * 0.88) continue;                                // not in view
      const d = Math.abs(cy - line);
      if (d < bestD) { bestD = d; best = { el, x: r.left + r.width / 2, y: cy }; }
    }
    return best;
  }

  _tick = (t) => {
    this._raf = 0;
    const dt = clamp((t - this._prevT) / 1000, 0.001, 0.05);
    this._prevT = t;
    const s = this._s, reduce = this._mqReduce.matches;
    const sleepMs = this.hasAttribute('idle-sleep') ? +this.getAttribute('idle-sleep') : 9000;

    if (sleepMs > 0 && !this._asleep && !this._forced && !this._typing && t - this._last > sleepMs) this._asleep = true;

    /* where to go */
    const mobileDock = this._mqMobile.matches && this.getAttribute('mobile-mode') !== 'perch';
    const perch = (this._forceDock || mobileDock || this.hasAttribute('always-dock')) ? null : this._pickPerch(t);
    if (perch) {
      this._t = { x: perch.x, y: perch.y };
      if (perch.el !== this._perch) { this._perch = perch.el; this._pending = perch.el; }
      this._docked = false;
    } else {
      const r = this._pill.getBoundingClientRect();
      this._t = this._genie
        ? { x: r.left + s * 0.46, y: r.top + r.height / 2 - s * this._ar * 0.24 }
        : { x: r.left + s * 0.5, y: r.top + r.height / 2 - s * 0.16 };
      this._perch = null; this._pending = null;
      this._docked = true;
    }

    /* move (critically-damped-ish spring) */
    const dx = this._t.x - this._p.x, dy = this._t.y - this._p.y;
    const dist = Math.hypot(dx, dy);
    if (reduce) {
      if (dist > 4) {
        this._bodyEl.classList.add('ghost');
        this._p = { ...this._t }; this._v = { x: 0, y: 0 };
        this._later(() => this._bodyEl.classList.remove('ghost'), 180);
      }
    } else {
      const k = 70, c = 13;
      this._v.x += (k * dx - c * this._v.x) * dt;
      this._v.y += (k * dy - c * this._v.y) * dt;
      this._p.x += this._v.x * dt;
      this._p.y += this._v.y * dt;
    }
    const speed = Math.hypot(this._v.x, this._v.y);

    /* arrival → bubble + mood once per perch */
    if (this._pending && dist < 40 && speed < 300) {
      const el = this._pending; this._pending = null;
      if (!this._said.has(el)) {
        this._said.add(el);
        const m = el.getAttribute('data-tutu-mood'); if (m) this.setMood(m, 2200);
        const msg = el.getAttribute('data-tutu-say'); if (msg) this.say(msg);
      }
    }

    /* pointer close to Tutu's head → curious */
    {
      const hx = this._p.x, hy = this._p.y - s * (this._genie ? this._ar * 0.17 : 0.1);
      this._near = !this._docked && t - this._ptr.at < 1500 && Math.hypot(this._ptr.x - hx, this._ptr.y - hy) < s * 1.15;
    }

    /* mood */
    const mood = this._resolveMood(t);
    if (mood !== this._mood) {
      this._mood = mood;
      this._svg.setAttribute('data-mood', this._genie ? mood : (ROBOT_FACE[mood] || mood));
      this.setAttribute('data-m', mood);
      if (mood === 'love') this._burst('♥', 5, '#FF5FA8');
      this.dispatchEvent(new CustomEvent('tutu-mood', { detail: { mood }, bubbles: true, composed: true }));
    }

    /* where to look (-1..1) */
    let lx, ly;
    if (mood === 'sleepy') { lx = 0; ly = 0.6; }
    else if (mood === 'thinking') { lx = -0.8; ly = -0.8; }
    else if (t - this._ptr.at < 2500) {
      const ex = this._ptr.x - this._p.x, ey = this._ptr.y - (this._p.y - s * (this._genie ? this._ar * 0.17 : 0.1));
      const d = Math.hypot(ex, ey) || 1, kk = Math.min(d / 160, 1);
      lx = ex / d * kk; ly = ey / d * kk;
    } else if (speed > 160) {
      lx = this._v.x / speed; ly = this._v.y / speed;
    } else {
      if (t > this._sacc.at) {
        this._sacc = { x: (Math.random() * 2 - 1) * 0.7, y: (Math.random() * 2 - 1) * 0.5, at: t + 1400 + Math.random() * 1800 };
        this._busyUntil = t + 700;
      }
      lx = this._sacc.x; ly = this._sacc.y;
    }
    if (mood === 'surprised') { lx *= 0.4; ly *= 0.4; }

    const fs = mood === 'sleepy' ? 0.05 : 0.18;
    const fk = this._genie ? 2.6 : 1;
    const fx = lx * 9 * fk, fy = ly * 7 * fk;
    this._face.x += (fx - this._face.x) * fs;
    this._face.y += (fy - this._face.y) * fs;
    const ry = reduce ? 0 : lx * 16, rx = reduce ? 0 : -ly * 12;
    this._tilt.x += (rx - this._tilt.x) * fs;
    this._tilt.y += (ry - this._tilt.y) * fs;
    const scT = this._docked && this._genie ? 0.8 : 1;
    this._sc += (scT - this._sc) * (reduce ? 1 : 0.12);
    const lean = reduce ? 0 : clamp(this._v.x * 0.025, -16, 16) + (mood === 'sleepy' ? 6 : 0);

    /* paint */
    this._bodyEl.style.transform =
      `translate3d(${(this._p.x - s / 2).toFixed(1)}px, ${(this._p.y - s * this._ar / 2).toFixed(1)}px, 0) rotate(${lean.toFixed(2)}deg) scale(${this._sc.toFixed(3)})`;
    this._tiltEl.style.transform = `rotateX(${this._tilt.x.toFixed(2)}deg) rotateY(${this._tilt.y.toFixed(2)}deg)`;
    this._faceEl.setAttribute('transform', `translate(${this._face.x.toFixed(2)} ${this._face.y.toFixed(2)})`);

    const right = this._p.x > innerWidth * 0.55;
    this._bubble.classList.toggle('left', right);
    this._bubble.classList.toggle('right', !right);
    this._bubble.classList.toggle('below', this._p.y < s * this._ar * 1.2);
    this._bodyEl.classList.toggle('perched', !this._docked && dist < 20 && speed < 40);

    const arrived = this._docked && dist < 30;
    this._pill.classList.toggle('on', arrived);
    this._pill.tabIndex = arrived ? 0 : -1;

    /* keep running only while something is moving */
    const faceDelta = Math.abs(fx - this._face.x) + Math.abs(fy - this._face.y) + Math.abs(scT - this._sc) * 50;
    const busy = dist > 0.5 || speed > 2 || faceDelta > 0.05 || t - this._ptr.at < 300 ||
      t < this._busyUntil || (this._temp && t < this._tempUntil);
    if (busy) this._raf = requestAnimationFrame(this._tick);
    else this._idleTimer = setTimeout(() => this._wake(), 1000);   // cheap 1 Hz check for sleep / glances
  };
}

if (typeof window !== 'undefined' && window.customElements && !customElements.get('tutu-companion')) {
  customElements.define('tutu-companion', TutuCompanion);
}
export { TutuCompanion };
