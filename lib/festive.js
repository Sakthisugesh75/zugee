// lib/festive.js
// Festival greetings shown as a one-time popup on the public site (components/layout/FestiveGreeting.jsx).
// Each greeting has a date window in India time (IST): it appears only between `from` and `to`
// (inclusive) and switches itself off afterwards, so nothing has to be removed after the festival.
// A visitor sees each greeting once; their browser remembers it under the greeting's id.
// No JSX and relative imports only, so `node --test` can load this file.
//
// `theme` picks the scene at the top of the popup (FestiveGreeting.jsx THEMES):
//   diwali     night sky with fireworks, toran lights, a turning rangoli and a lit diya
//   christmas  falling snow, fairy lights, a Christmas tree, Tutu in a Santa hat
//   newyear    fireworks, gold lights, the new year's number, Tutu in a party hat (`year` is shown)
//
// To add the next festival (Pongal, for example): add an entry with a new id, its dates and one of
// the themes. Windows must not overlap (tests/festive.test.mjs checks).

export const FESTIVE_THEMES = ["diwali", "christmas", "newyear"];

export const FESTIVE_GREETINGS = [
  {
    // Deepavali 2026 falls on Sunday 8 November. Shown from Dhanteras to a few days after.
    id: "diwali-2026",
    theme: "diwali",
    from: "2026-11-06",
    to: "2026-11-11",
    tamil: "இனிய தீபாவளி நல்வாழ்த்துக்கள்",
    heading: "Happy Diwali!",
    message:
      "Wishing you and your family a bright, joyful and prosperous Diwali. May the festival of lights bring happiness to your home and success to your business.",
    signature: "Warm wishes from Team ZUGEE, Salem",
    button: "Thank you",
    // What Tutu says in the popup: the first line on opening, the next one on each tap.
    tutuLines: [
      "Happy Diwali!",
      "Vanakkam! Sweets ready?",
      "May your home glow like this diya!",
      "Wishing you a sparkling year ahead!",
      "Have a safe and happy Deepavali!"
    ],
    tutuHint: "Tap Tutu or the sky for fireworks"
  },
  {
    id: "christmas-2026",
    theme: "christmas",
    from: "2026-12-23",
    to: "2026-12-27",
    tamil: "இனிய கிறிஸ்துமஸ் நல்வாழ்த்துக்கள்",
    heading: "Merry Christmas!",
    message:
      "Wishing you and your family a joyful Christmas, filled with peace, warmth and happy moments together.",
    signature: "Warm wishes from Team ZUGEE, Salem",
    button: "Thank you",
    tutuLines: [
      "Merry Christmas!",
      "Ho ho ho! Plum cake ready?",
      "Wishing you peace and joy!",
      "May your home be merry and bright!",
      "Season's greetings from ZUGEE!"
    ],
    tutuHint: "Tap Tutu or the sky for some sparkle"
  },
  {
    id: "new-year-2027",
    theme: "newyear",
    year: "2027",
    from: "2026-12-31",
    to: "2027-01-03",
    tamil: "இனிய புத்தாண்டு நல்வாழ்த்துக்கள்",
    heading: "Happy New Year!",
    message:
      "Wishing you and your family a healthy, happy and prosperous 2027. May the new year bring fresh ideas and steady growth to your business.",
    signature: "Warm wishes from Team ZUGEE, Salem",
    button: "Thank you",
    tutuLines: [
      "Happy New Year!",
      "Hello, 2027!",
      "Wishing you a year of growth!",
      "New year, new goals!",
      "Cheers to a great year ahead!"
    ],
    tutuHint: "Tap Tutu or the sky for fireworks"
  }
];

/** The date in India ("2026-11-08") for a moment in time, whatever the visitor's own time zone. */
export function indiaDate(date = new Date()) {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);
}

/** The greeting whose window includes this moment (in India time), or null. */
export function activeGreeting(date = new Date()) {
  const today = indiaDate(date);
  return FESTIVE_GREETINGS.find((g) => today >= g.from && today <= g.to) || null;
}

/** The localStorage key that remembers a visitor has seen this greeting. */
export function greetingSeenKey(greeting) {
  return `zugee-greeting-${greeting.id}`;
}
