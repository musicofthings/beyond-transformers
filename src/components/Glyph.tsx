import type { GlyphType } from "../data/architectures";

interface GlyphProps {
  type: GlyphType;
}

/** Decorative architecture glyphs; hidden from assistive technology. */
export function Glyph({ type }: GlyphProps) {
  const common = {
    viewBox: "0 0 120 72",
    "aria-hidden": true as const,
    focusable: false as const,
  };

  if (type === "router") {
    return (
      <svg {...common}>
        <circle cx="60" cy="36" r="12" />
        <path d="M8 8h16M8 22h16M8 36h16M8 50h16M8 64h16M96 8h16M96 25h16M96 47h16M96 64h16M24 8l25 22M24 22l25 10M24 36h25M24 50l25-10M24 64l25-22M71 31L96 8M72 34l24-9M72 39l24 8M71 42l25 22" />
      </svg>
    );
  }
  if (type === "matrix") {
    return (
      <svg {...common}>
        <path d="M14 11h92v50H14zM37 11v50M60 11v50M83 11v50M14 28h92M14 45h92" />
        <path className="accent" d="M16 58L35 47 58 42 81 25 104 14" />
      </svg>
    );
  }
  if (type === "loop") {
    return (
      <svg {...common}>
        <path d="M10 36h30M80 36h30M40 18h40v36H40zM60 18V7h31v20" />
        <path className="accent" d="M88 20l3 7-7-2" />
        <text x="52" y="41">
          hₜ
        </text>
      </svg>
    );
  }
  if (type === "spike") {
    return (
      <svg {...common}>
        <path d="M5 52h15l5-11 7 11h12l7-38 9 52 8-35 8 21h13l5-14 7 14h15" />
      </svg>
    );
  }
  if (type === "symbol") {
    return (
      <svg {...common}>
        <path d="M8 13h40v46H8zM72 12l32 18v30H72L56 36zM48 36h8M72 30l-16 6M72 60L56 36" />
        <text x="16" y="31">
          IF
        </text>
        <text x="16" y="48">
          THEN
        </text>
      </svg>
    );
  }
  if (type === "retention") {
    return (
      <svg {...common}>
        <path d="M7 56h106M14 50c14 0 15-30 30-30s15 24 29 24 15-17 36-31" />
        <path className="accent" d="M15 58V18M38 58V23M61 58V31M84 58V39M107 58V45" />
      </svg>
    );
  }
  if (type === "liquid") {
    return (
      <svg {...common}>
        <path d="M20 18c18 0 18 36 36 36s18-36 36-36 18 36 28 36" />
        <path className="accent" d="M12 52c22-8 28 10 48 0s30 12 48 2" />
      </svg>
    );
  }
  // wave / filter default
  return (
    <svg {...common}>
      <path d="M5 42c12-35 24 28 36-6s24 25 37-7 22 22 37-9" />
      <path className="accent" d="M5 52c17-10 24 8 40-2s25 9 40-4 20 4 30-6" />
    </svg>
  );
}
