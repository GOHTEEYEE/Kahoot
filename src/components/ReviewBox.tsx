"use client";

import { useEffect, useState } from "react";
import type { Question } from "../lib/questions";
import type { SubjectId } from "../lib/curriculum";

export type ReviewItem = {
  question: Question;
  playerChoice: number | null;
  points: number;
};

type Props = {
  open: boolean;
  subject: SubjectId;
  items: ReviewItem[];
  onClose: () => void;
};

export function ReviewBox({ open, subject, items, onClose }: Props) {
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setExplanations({});
      setLoadingId(null);
    }
  }, [open]);

  if (!open) return null;

  async function explain(item: ReviewItem) {
    const id = item.question.id;
    if (explanations[id] || loadingId === id) return;
    setLoadingId(id);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          prompt: item.question.prompt,
          options: item.question.options,
          correctIndex: item.question.correctIndex,
          playerChoice: item.playerChoice,
        }),
      });
      const data = (await res.json()) as { explanation?: string };
      setExplanations((prev) => ({
        ...prev,
        [id]: data.explanation ?? "暂时无法生成讲解，请稍后再试。",
      }));
    } catch {
      setExplanations((prev) => ({
        ...prev,
        [id]: "网络出错，请稍后再试。",
      }));
    } finally {
      setLoadingId(null);
    }
  }

  const correctCount = items.filter(
    (i) => i.playerChoice === i.question.correctIndex,
  ).length;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div className="animate-banner-drop max-h-[88vh] w-full max-w-lg overflow-hidden rounded-[1.8rem] bg-white shadow-[var(--shadow)]">
        <div className="flex items-start justify-between gap-3 border-b border-black/5 px-5 py-4">
          <div>
            <p className="text-xs font-extrabold tracking-wide text-[var(--brand-deep)] uppercase">
              Loot Review Box
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--ink)]">
              复盘宝箱
            </h2>
            <p className="text-sm font-bold text-[var(--ink-soft)]">
              答对 {correctCount}/{items.length} · 点题目可看 AI 讲解
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[var(--bg-top)] px-3 py-1.5 text-sm font-extrabold text-[var(--ink)]"
          >
            关闭
          </button>
        </div>

        <div className="max-h-[70vh] space-y-3 overflow-y-auto px-5 py-4">
          {items.map((item, index) => {
            const correct = item.playerChoice === item.question.correctIndex;
            const chosen =
              item.playerChoice == null
                ? "未作答"
                : item.question.options[item.playerChoice];
            const answer = item.question.options[item.question.correctIndex];
            const explanation = explanations[item.question.id];

            return (
              <div
                key={item.question.id}
                className={`rounded-3xl px-4 py-3 ${
                  correct ? "bg-emerald-50" : "bg-rose-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-extrabold text-[var(--ink)]">
                    第 {index + 1} 题 · {correct ? "正确" : "错误"}
                    {item.points > 0 ? ` · +${item.points}` : ""}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white ${
                      correct ? "bg-[var(--green)]" : "bg-[var(--red)]"
                    }`}
                  >
                    {correct ? "OK" : "错"}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-[var(--ink)]">{item.question.prompt}</p>
                <p className="mt-2 text-xs font-bold text-[var(--ink-soft)]">
                  你的答案：{chosen}
                </p>
                <p className="text-xs font-bold text-[var(--brand-deep)]">正确答案：{answer}</p>

                <button
                  type="button"
                  onClick={() => explain(item)}
                  className="pressable mt-3 rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-extrabold text-white"
                >
                  {loadingId === item.question.id
                    ? "AI 讲解中…"
                    : explanation
                      ? "再看一遍讲解"
                      : "AI 讲解"}
                </button>

                {explanation ? (
                  <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-white/80 px-3 py-2 text-sm font-semibold leading-relaxed text-[var(--ink)]">
                    {explanation}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
