type UtilityIconName = "plus" | "close" | "arrow-left" | "arrow-right";

type Props = {
  name: UtilityIconName;
  className?: string;
};

const STROKE = "#6b5340";

/** Small HUD utility glyphs — warm rounded SVG, not website line icons. */
export function UtilityIcon({ name, className = "h-5 w-5" }: Props) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "plus":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" fill="#fff7e2" stroke={STROKE} strokeWidth="1.5" />
          <path
            d="M12 7.5v9M7.5 12h9"
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" fill="#fff7e2" stroke={STROKE} strokeWidth="1.5" />
          <path
            d="M8.5 8.5l7 7M15.5 8.5l-7 7"
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...common}>
          <path
            d="M14 6L8 12l6 6"
            stroke={STROKE}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path
            d="M10 6l6 6-6 6"
            stroke={STROKE}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
