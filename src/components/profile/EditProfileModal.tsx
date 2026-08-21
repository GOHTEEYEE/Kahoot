"use client";

import { useEffect, useState } from "react";
import { GameModal } from "../game-ui/GameModal";
import { MALAYSIA_STATES } from "../../lib/account";
import { GRADES, type Grade, gradeLabel } from "../../lib/curriculum";
import { AVATAR_OPTIONS, type ProfileSnapshot } from "../../lib/profile";
import { playSfx } from "../../lib/audio/sfx";

export type EditDraft = {
  displayName: string;
  age: number;
  grade: Grade;
  school: string;
  state: string;
  avatar: string;
};

type Props = {
  open: boolean;
  profile: ProfileSnapshot;
  onClose: () => void;
  onSave: (draft: EditDraft) => void;
};

function draftFrom(profile: ProfileSnapshot): EditDraft {
  return {
    displayName: profile.displayName,
    age: profile.age,
    grade: profile.grade,
    school: profile.school,
    state: profile.state,
    avatar: profile.avatar,
  };
}

export function EditProfileModal({ open, profile, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<EditDraft>(() => draftFrom(profile));
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(draftFrom(profile));
      setSavedFlash(false);
    }
  }, [open, profile]);

  return (
    <GameModal
      open={open}
      title="编辑资料"
      subtitle="更新你的学习英雄档案"
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={() => {
            playSfx("tap");
            onSave(draft);
            setSavedFlash(true);
            window.setTimeout(() => {
              setSavedFlash(false);
              onClose();
            }, 600);
          }}
          className="cta-green w-full rounded-[1.1rem] py-3 font-[family-name:var(--font-display)] text-lg font-bold text-white shadow-[0_4px_0_#2a9828]"
        >
          {savedFlash ? "已保存 ✓" : "保存"}
        </button>
      }
    >
      <label className="block text-[11px] font-extrabold text-[#8a5a18]">
        昵称
        <input
          value={draft.displayName}
          onChange={(e) => setDraft((d) => ({ ...d, displayName: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-[#e8c98a]/70 bg-white px-3 py-2 text-sm font-bold text-[#3d2f1e]"
          maxLength={24}
        />
      </label>

      <p className="mt-3 text-[11px] font-extrabold text-[#8a5a18]">头像</p>
      <div className="mt-1 grid grid-cols-4 gap-2">
        {AVATAR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            aria-label={opt.label}
            onClick={() => {
              playSfx("tap");
              setDraft((d) => ({ ...d, avatar: opt.src }));
            }}
            className={`overflow-hidden rounded-full ring-2 ${
              draft.avatar === opt.src ? "ring-[#65c84a]" : "ring-transparent"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={opt.src} alt="" className="aspect-square w-full object-cover object-[50%_20%]" />
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="block text-[11px] font-extrabold text-[#8a5a18]">
          年龄
          <input
            type="number"
            min={6}
            max={18}
            value={draft.age}
            onChange={(e) => setDraft((d) => ({ ...d, age: Number(e.target.value) || d.age }))}
            className="mt-1 w-full rounded-xl border border-[#e8c98a]/70 bg-white px-3 py-2 text-sm font-bold text-[#3d2f1e]"
          />
        </label>
        <label className="block text-[11px] font-extrabold text-[#8a5a18]">
          年级
          <select
            value={draft.grade}
            onChange={(e) => setDraft((d) => ({ ...d, grade: Number(e.target.value) as Grade }))}
            className="mt-1 w-full rounded-xl border border-[#e8c98a]/70 bg-white px-3 py-2 text-sm font-bold text-[#3d2f1e]"
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {gradeLabel(g)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 block text-[11px] font-extrabold text-[#8a5a18]">
        学校
        <input
          value={draft.school}
          onChange={(e) => setDraft((d) => ({ ...d, school: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-[#e8c98a]/70 bg-white px-3 py-2 text-sm font-bold text-[#3d2f1e]"
        />
      </label>

      <label className="mt-3 block text-[11px] font-extrabold text-[#8a5a18]">
        Negeri / 州属
        <select
          value={draft.state}
          onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-[#e8c98a]/70 bg-white px-3 py-2 text-sm font-bold text-[#3d2f1e]"
        >
          {(MALAYSIA_STATES as readonly string[]).includes(draft.state) ? null : (
            <option value={draft.state}>{draft.state}</option>
          )}
          {MALAYSIA_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </GameModal>
  );
}

type AvatarProps = {
  open: boolean;
  current: string;
  onClose: () => void;
  onPick: (src: string) => void;
};

export function AvatarPickerModal({ open, current, onClose, onPick }: AvatarProps) {
  return (
    <GameModal open={open} title="更换头像" subtitle="选择你的学习英雄形象" onClose={onClose}>
      <div className="grid grid-cols-3 gap-3">
        {AVATAR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              playSfx("tap");
              onPick(opt.src);
              onClose();
            }}
            className={`overflow-hidden rounded-[1.2rem] ring-2 ${
              current === opt.src ? "ring-[#65c84a]" : "ring-[#e8c98a]/50"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={opt.src} alt={opt.label} className="aspect-square w-full object-cover object-[50%_20%]" />
            <p className="bg-[#fff8ea] py-1 text-center text-[10px] font-extrabold text-[#3d2f1e]">
              {opt.label}
            </p>
          </button>
        ))}
      </div>
    </GameModal>
  );
}
