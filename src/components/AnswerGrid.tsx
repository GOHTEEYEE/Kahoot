"use client";

const SHAPES = [
  {
    label: "三角",
    bg: "bg-[var(--red)]",
    shape: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
        <polygon points="12,4 22,20 2,20" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "菱形",
    bg: "bg-[var(--blue)]",
    shape: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
        <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "圆形",
    bg: "bg-[var(--orange)]",
    shape: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "方块",
    bg: "bg-[var(--green)]",
    shape: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />
      </svg>
    ),
  },
] as const;

type Props = {
  options: [string, string, string, string];
  disabled?: boolean;
  selectedIndex?: number | null;
  correctIndex?: number | null;
  reveal?: boolean;
  dealKey?: string | number;
  onSelect: (index: number) => void;
};

export function AnswerGrid({
  options,
  disabled,
  selectedIndex,
  correctIndex,
  reveal,
  dealKey = 0,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option, index) => {
        const meta = SHAPES[index];
        let feedback = "";
        let ring = "ring-transparent";

        if (reveal && correctIndex === index) {
          ring = "ring-4 ring-white";
          feedback = "animate-correct";
        } else if (reveal && selectedIndex === index && selectedIndex !== correctIndex) {
          ring = "ring-4 ring-black/30 opacity-70";
          feedback = "animate-wrong";
        } else if (!reveal && selectedIndex === index) {
          ring = "ring-4 ring-white/80";
        }

        return (
          <button
            key={`${dealKey}-${option}-${index}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(index)}
            style={{ animationDelay: `${index * 0.07}s` }}
            className={`${meta.bg} ${ring} ${feedback} pressable animate-card-deal flex min-h-[4.5rem] items-center gap-3 rounded-2xl px-4 py-4 text-left text-xl font-extrabold text-white shadow-[var(--shadow)] disabled:cursor-not-allowed`}
            aria-label={`${meta.label}：${option}`}
          >
            <span className="shrink-0 opacity-90">{meta.shape}</span>
            <span className="leading-snug">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
