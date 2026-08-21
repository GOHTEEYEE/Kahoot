"use client";

import { motion } from "framer-motion";
import type { ProfileSnapshot } from "../../lib/profile";
import { playSfx } from "../../lib/audio/sfx";
import { localizedGrade } from "../../lib/i18n/home";
import { getSharedLabels, localizedPlayerTitle } from "../../lib/i18n/labels";
import { getProfileCopy } from "../../lib/i18n/profile";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  profile: ProfileSnapshot;
  onEdit: () => void;
  onChangeAvatar: () => void;
};

export function UserProfileCard({ profile, onEdit, onChangeAvatar }: Props) {
  const { xp } = profile;
  const { locale } = useLocale();
  const copy = getProfileCopy(locale);
  const labels = getSharedLabels(locale);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="hud-plate relative overflow-hidden rounded-[1.5rem] p-4 ring-1 ring-[#f0d9a0]/90"
    >
      <div className="flex gap-3">
        <button
          type="button"
          aria-label={copy.changeAvatar}
          onClick={() => {
            playSfx("tap");
            onChangeAvatar();
          }}
          className="relative shrink-0"
        >
          <div className="profile-avatar relative h-[4.6rem] w-[4.6rem] overflow-hidden rounded-full ring-[3px] ring-[#ffe7b4] shadow-[0_4px_0_rgba(90,50,10,0.2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt=""
              className="h-full w-full object-cover object-[50%_18%]"
              draggable={false}
            />
          </div>
          <span className="level-badge absolute -bottom-0.5 left-1/2 flex h-[18px] min-w-[34px] -translate-x-1/2 items-center justify-center rounded-full px-1.5 text-[9px] font-black text-[#ffe27a]">
            Lv.{xp.level}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1.5">
            <h2 className="min-w-0 truncate font-[family-name:var(--font-display)] text-[18px] font-bold text-[#3d2f1e]">
              {profile.displayName}
              <span className="ml-1 text-[12px] font-extrabold text-[#6ed058]">
                {labels.youSuffix}
              </span>
            </h2>
            <button
              type="button"
              aria-label={copy.editProfile}
              onClick={() => {
                playSfx("tap");
                onEdit();
              }}
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1d0] text-[13px] font-black text-[#8a5a18] ring-1 ring-[#e8c98a]/80"
            >
              ✎
            </button>
          </div>

          <p className="mt-1 text-[11px] font-bold leading-relaxed text-[#6b5340]">
            {labels.ageYears(profile.age)} · {localizedGrade(profile.grade, locale)}
            <br />
            {profile.school}
            <br />
            {copy.state} · {profile.state}
          </p>

          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ffe27a]/80 to-[#7ee08a]/55 px-2.5 py-0.5 text-[10px] font-extrabold text-[#3d2f1e] ring-1 ring-white/70">
            {copy.titlePrefix} · {localizedPlayerTitle(profile.titleId, locale)}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-extrabold text-[#8a5a18]">
          <span>
            Lv.{xp.level} · {xp.currentXP.toLocaleString()} / {xp.requiredXP.toLocaleString()} XP
          </span>
          <span>{xp.pct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#3c3425]/12 ring-1 ring-white/50">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#65c84a] via-[#7ed957] to-[#b8f070]"
            initial={{ width: 0 }}
            animate={{ width: `${xp.pct}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-1.5 text-[10px] font-bold text-[#8a7355]">
          {copy.xpToNext(xp.level + 1, xp.toNext)}
        </p>
      </div>
    </motion.section>
  );
}
