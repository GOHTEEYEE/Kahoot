"use client";

type Props = {
  subject: string;
  prompt: string;
  badge?: string;
};

export function QuestionCard({ subject, prompt, badge }: Props) {
  return (
    <article className="shrink-0 rounded-[1.2rem] bg-white px-3.5 py-2.5 shadow-[0_3px_0_rgba(90,60,20,0.1)] ring-1 ring-[#ead7a8]/90">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="rounded-full bg-[#ffe9a8] px-2 py-0.5 text-[10px] font-black text-[#6b4525]">
          {subject}
        </span>
        {badge ? (
          <span className="rounded-full bg-[#ff7a4a] px-2 py-0.5 text-[10px] font-black text-white">{badge}</span>
        ) : null}
      </div>
      <p className="font-[family-name:var(--font-display)] text-[clamp(1.12rem,4.8vw,1.5rem)] font-bold leading-snug text-[#2a2118]">
        {prompt}
      </p>
    </article>
  );
}
