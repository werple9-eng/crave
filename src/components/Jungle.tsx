/**
 * The rainforest background.
 *
 * Flat shapes, no gradients except the sky, drawn once and never animated —
 * an animated background here previously took the whole app to about one
 * frame per second.
 *
 * The composition is doing a job, not just decoration. Depth runs light at
 * the top and dark at the edges, because every screen puts its headline near
 * the top and its cards lower down: headlines land on open sky where dark
 * green text still reads, and the dense canopy sits behind opaque cards where
 * it cannot hurt legibility. Keep that arrangement if you redraw it.
 *
 * `slice` means the middle of the scene is always what survives a crop, so
 * the sky band has to stay tall enough to cover a short landscape viewport.
 */
export function Jungle() {
  return (
    <div className="ambient" aria-hidden="true">
      <svg
        className="jungle"
        viewBox="0 0 1200 820"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7d9bd" />
            <stop offset="55%" stopColor="#fbe8ce" />
            <stop offset="100%" stopColor="#fdf3e3" />
          </linearGradient>
        </defs>

        <rect width="1200" height="820" fill="url(#sky)" />

        {/* Clouds: dusty mauve, the one cool note in the whole scene. */}
        <g fill="#cbb6b2" opacity="0.55">
          <ellipse cx="250" cy="96" rx="132" ry="30" />
          <ellipse cx="330" cy="80" rx="86" ry="24" />
          <ellipse cx="880" cy="70" rx="150" ry="28" />
          <ellipse cx="790" cy="86" rx="92" ry="22" />
          <ellipse cx="600" cy="140" rx="110" ry="20" opacity="0.6" />
        </g>

        {/* Far hills, hazed toward the sky. */}
        <path d="M0 372 Q 170 330 340 356 Q 520 384 700 350 Q 900 314 1200 352 L1200 470 L0 470 Z" fill="#a9c08d" opacity="0.75" />
        <path d="M0 404 Q 220 366 420 396 Q 640 428 860 392 Q 1040 362 1200 398 L1200 500 L0 500 Z" fill="#8aa871" />

        {/* Middle canopy: rounded crowns in two greens, lime where light hits. */}
        <g fill="#5f8f4a">
          {[
            [70, 470, 78], [190, 452, 62], [300, 476, 84], [430, 458, 66], [545, 480, 74],
            [665, 456, 70], [790, 478, 82], [910, 458, 64], [1030, 480, 78], [1150, 462, 68],
          ].map(([cx, cy, r]) => <circle key={`c${cx}`} cx={cx} cy={cy} r={r} />)}
        </g>
        {/* Tall enough to meet the lower canopy — a short one leaves a band of
          * sky showing through between the layers. */}
        <rect y="470" width="1200" height="140" fill="#5f8f4a" />
        <g fill="#8fb43c" opacity="0.9">
          {[[140, 470, 44], [385, 476, 38], [610, 468, 46], [855, 474, 40], [1090, 470, 42]]
            .map(([cx, cy, r]) => <circle key={`l${cx}`} cx={cx} cy={cy} r={r} />)}
        </g>

        {/* The river, catching the sky. Drawn as a tapering stroke rather than
          * a filled slab — a wide shape reads as a stray paper cutout once a
          * narrow viewport crops in on it. */}
        <g fill="none" stroke="#cfe6f0" strokeLinecap="round" opacity="0.9">
          <path d="M714 500 Q 690 560 706 612 Q 722 668 692 720 Q 664 772 678 820" strokeWidth="26" />
          <path d="M714 500 Q 690 560 706 612 Q 722 668 692 720 Q 664 772 678 820" strokeWidth="12" stroke="#e6f2f7" />
        </g>

        {/* Lower canopy, darker and closer. */}
        <g fill="#3f7440">
          {[
            [40, 566, 92], [160, 588, 72], [285, 562, 88], [410, 590, 70], [520, 566, 80],
            [880, 570, 84], [1000, 592, 72], [1120, 564, 90],
          ].map(([cx, cy, r]) => <circle key={`d${cx}`} cx={cx} cy={cy} r={r} />)}
        </g>
        <rect y="596" width="1200" height="224" fill="#3f7440" />

        {/* Foreground floor. */}
        <g fill="#2c5c3a">
          {[[110, 672, 108], [300, 690, 96], [500, 676, 104], [900, 682, 100], [1110, 670, 112]]
            .map(([cx, cy, r]) => <circle key={`f${cx}`} cx={cx} cy={cy} r={r} />)}
        </g>
        <rect y="700" width="1200" height="120" fill="#2c5c3a" />

        {/* Palm fronds breaking up the canopy, so it reads as leaves rather
          * than as a row of circles. */}
        <g fill="#356b3c" opacity="0.85">
          {[[210, 618], [470, 606], [760, 620], [1015, 604]].map(([x, y]) => (
            <g key={`p${x}`} transform={`translate(${x} ${y})`}>
              <path d="M0 0 Q -46 -30 -92 -16 Q -50 12 0 0 Z" />
              <path d="M0 0 Q -30 -46 -6 -88 Q 22 -46 0 0 Z" />
              <path d="M0 0 Q 46 -30 92 -16 Q 50 12 0 0 Z" />
            </g>
          ))}
        </g>

        {/* Big fronds framing the bottom corners. */}
        <g fill="#24502f">
          <path d="M-10 820 Q 60 720 172 690 Q 118 762 96 820 Z" />
          <path d="M96 820 Q 168 736 286 714 Q 214 774 190 820 Z" />
          <path d="M1210 820 Q 1140 716 1024 688 Q 1084 760 1108 820 Z" />
          <path d="M1108 820 Q 1032 738 916 716 Q 990 776 1012 820 Z" />
        </g>

        {/* Trunks at the very edges, with a vine off the left one. */}
        <path d="M0 210 L74 210 L60 820 L0 820 Z" fill="#7d5535" />
        <path d="M1128 180 L1200 180 L1200 820 L1146 820 Z" fill="#6d4a2f" />
        <path
          d="M62 268 Q 132 316 96 386 Q 60 456 128 508 Q 190 556 150 626"
          fill="none"
          stroke="#c9a06a"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* A few pops, the way the reference scatters flowers and wings. */}
        <g>
          <circle cx="148" cy="742" r="13" fill="#e06b96" />
          <circle cx="148" cy="742" r="5" fill="#f7d774" />
          <circle cx="1052" cy="756" r="11" fill="#f5a623" />
          <circle cx="236" cy="792" r="10" fill="#f7d774" />
          <circle cx="972" cy="716" r="9" fill="#e06b96" />
          <circle cx="418" cy="762" r="9" fill="#4a7fa8" />
          <circle cx="742" cy="772" r="10" fill="#e06b96" />
        </g>
      </svg>
    </div>
  )
}
