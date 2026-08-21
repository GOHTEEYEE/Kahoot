"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { playSfx } from "../../lib/audio/sfx";
import { getProfileCopy } from "../../lib/i18n/profile";
import { getSharedLabels } from "../../lib/i18n/labels";
import { useLocale } from "../../lib/i18n/useLocale";

export function ProfileHeader() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = getProfileCopy(locale);
  const labels = getSharedLabels(locale);

  return (
    <header className="relative mb-3 flex items-center justify-between gap-2 px-0.5">
      <button
        type="button"
        aria-label={labels.back}
        onClick={() => {
          playSfx("tap");
          if (typeof window !== "undefined" && window.history.length > 1) router.back();
          else router.push("/");
        }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff8ea]/92 text-lg font-black text-[#5a3a18] shadow-[0_3px_0_rgba(90,50,10,0.18)] ring-1 ring-[#e8c98a]/70"
      >
        ←
      </button>

      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="wood-plaque plaque-glint relative mx-auto inline-flex overflow-hidden rounded-[1.15rem] px-5 py-1.5 ring-1 ring-[#ffe7b4]/80"
      >
        <h1 className="font-[family-name:var(--font-display)] text-[20px] font-bold leading-tight text-[#fff8ea] drop-shadow-[0_2px_0_rgba(90,40,10,0.45)]">
          {copy.pageTitle}
        </h1>
      </motion.div>

      <span className="h-10 w-10 shrink-0" aria-hidden />
    </header>
  );
}
