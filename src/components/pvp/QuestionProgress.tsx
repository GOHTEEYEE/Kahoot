"use client";

type Props = {
  total: number;
  current: number;
  history: Array<boolean | null>;
};

export function QuestionProgress({ total, current, history }: Props) {
  return (
    <div className="flex items-center justify-center gap-1" aria-hidden>
      {Array.from({ length: total }, (_, i) => {
        const done = history[i];
        const active = i === current;
        return (
          <span
            key={i}
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-black ${
              done === true
                ? "bg-[#3cb85a] text-white"
                : done === false
                  ? "bg-[#e85a4a] text-white"
                  : active
                    ? "bg-[#f5b62b] text-[#4a3418] ring-2 ring-white"
                    : "bg-[#d8c8a8]/70 text-transparent"
            }`}
          >
            {done === true ? "✓" : done === false ? "✕" : "•"}
          </span>
        );
      })}
    </div>
  );
}
