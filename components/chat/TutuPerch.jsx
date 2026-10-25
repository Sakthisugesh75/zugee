// components/chat/TutuPerch.jsx
// An invisible spot the live mascot (lib/tutu-companion.js) flies to while that part of the page is
// in view; `say` shows once when Tutu lands, `mood` plays for about 2 seconds. Tutu picks the perch
// nearest 42% of the viewport height (only perches between 8% and 88% count) and docks on its
// "Ask Tutu" pill when none is in view (Pricing and the footer have none on purpose).
//
// Place it inside a `position: relative` parent, in empty space: genie Tutu is about 96 x 157 px
// centred on the perch. `gutter` perches sit beside the 1152 px content column and only exist from
// 1380 px wide, where the side gutters are wide enough; below that Tutu docks instead of covering text.

export default function TutuPerch({ say, mood, gutter = false, style }) {
  return (
    <span
      data-tutu-perch=""
      data-tutu-say={say}
      data-tutu-mood={mood}
      aria-hidden="true"
      className={`absolute w-0.5 h-0.5 pointer-events-none ${gutter ? "hidden min-[1380px]:block" : "block"}`}
      style={style}
    />
  );
}
