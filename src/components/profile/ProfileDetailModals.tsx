"use client";

import { GameModal } from "../game-ui/GameModal";
import type { AchievementView } from "../../lib/achievements";
import type { DayActivity } from "../../lib/learningLog";
import type { ProfileSnapshot, SubjectProgressRow } from "../../lib/profile";
import { subjectTrophyHistory } from "../../lib/profile";
import { getWorldStage } from "../../lib/worlds";
import { localizedSubject } from "../../lib/i18n/home";
import { getSharedLabels, localizedWeekday, localizedWorldStageName } from "../../lib/i18n/labels";
import { getProfileCopy } from "../../lib/i18n/profile";
import { useLocale } from "../../lib/i18n/useLocale";

type StatKey = "trophy" | "power" | "streak" | "challenges" | null;

type Props = {
  profile: ProfileSnapshot;
  stat: StatKey;
  day: DayActivity | null;
  achievement: AchievementView | null;
  subjectsOpen: boolean;
  onCloseStat: () => void;
  onCloseDay: () => void;
  onCloseAchievement: () => void;
  onCloseSubjects: () => void;
};

export function ProfileDetailModals({
  profile,
  stat,
  day,
  achievement,
  subjectsOpen,
  onCloseStat,
  onCloseDay,
  onCloseAchievement,
  onCloseSubjects,
}: Props) {
  const { locale } = useLocale();
  const copy = getProfileCopy(locale);
  const labels = getSharedLabels(locale);
  const trophyRows = subjectTrophyHistory(profile.account, locale);

  return (
    <>
      <GameModal
        open={stat === "trophy"}
        title={copy.trophyModalTitle}
        subtitle={copy.total(profile.trophies)}
        onClose={onCloseStat}
      >
        <p className="mb-3 text-[12px] font-bold text-[#6b5340]">{copy.trophyHint}</p>
        <ul className="space-y-2">
          {trophyRows.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45"
            >
              <span className="text-sm font-extrabold text-[#3d2f1e]">{localizedSubject(r.id, locale)}</span>
              <span className="text-xs font-bold tabular-nums text-[#8a5a18]">
                {copy.cupsWins(r.trophies, r.wins)}
              </span>
            </li>
          ))}
        </ul>
      </GameModal>

      <GameModal
        open={stat === "power"}
        title={copy.powerTitle}
        subtitle={copy.total(profile.learningPower.total)}
        onClose={onCloseStat}
      >
        <p className="mb-3 text-[12px] font-bold text-[#6b5340]">{copy.powerHint}</p>
        <ul className="space-y-2">
          {profile.learningPower.bySubject.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45"
            >
              <span className="text-sm font-extrabold text-[#3d2f1e]">
                {copy.abilityOf(localizedSubject(r.id, locale))}
              </span>
              <span className="text-xs font-bold tabular-nums text-[#2f9e6e]">+{r.points}</span>
            </li>
          ))}
          <li className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45">
            <span className="text-sm font-extrabold text-[#3d2f1e]">{copy.challengeDone}</span>
            <span className="text-xs font-bold tabular-nums text-[#2f9e6e]">
              +{profile.learningPower.challengeBonus}
            </span>
          </li>
          <li className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45">
            <span className="text-sm font-extrabold text-[#3d2f1e]">{copy.achievement}</span>
            <span className="text-xs font-bold tabular-nums text-[#2f9e6e]">
              +{profile.learningPower.achievementBonus}
            </span>
          </li>
        </ul>
      </GameModal>

      <GameModal
        open={stat === "streak"}
        title={copy.streakTitle}
        subtitle={copy.currentDays(profile.streak.current)}
        onClose={onCloseStat}
      >
        <div className="space-y-3 text-sm font-bold text-[#3d2f1e]">
          <p>
            {copy.currentStreak}
            <span className="text-[#c45c26]"> {labels.days(profile.streak.current)}</span>
          </p>
          <p>
            {copy.longestStreak}
            <span className="text-[#8a5a18]"> {labels.days(profile.streak.longest)}</span>
          </p>
          <p className="text-[12px] text-[#6b5340]">{copy.recentDays}</p>
          <ul className="grid grid-cols-7 gap-1.5">
            {profile.weekDays.map((d) => (
              <li key={d.date} className="text-center">
                <p className="text-[9px] font-extrabold text-[#8a5a18]">{localizedWeekday(d.weekday, locale)}</p>
                <p
                  className={`mx-auto mt-1 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black ${
                    d.completed ? "bg-[#65c84a] text-white" : "bg-[#efe4c8] text-[#b8a078]"
                  }`}
                >
                  {d.completed ? "✓" : "·"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </GameModal>

      <GameModal
        open={stat === "challenges"}
        title={copy.challengeHistory}
        subtitle={copy.totalTimes(profile.completedChallenges)}
        onClose={onCloseStat}
      >
        <ul className="space-y-2">
          {profile.subjects.map((s) => (
            <li key={s.id} className="rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#3d2f1e]">{localizedSubject(s.id, locale)}</span>
                <span className="text-xs font-bold text-[#8a5a18]">{copy.times(s.games)}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-[#6b5340]">
                {copy.winsTrophiesMastery(s.wins, s.trophies, s.mastery)}
              </p>
            </li>
          ))}
        </ul>
      </GameModal>

      <GameModal
        open={!!day}
        title={day?.date ?? copy.dayDetail}
        subtitle={day?.completed ? copy.dayDone : copy.dayEmpty}
        onClose={onCloseDay}
      >
        {day ? (
          day.completed ? (
            <div className="space-y-2 text-sm font-bold text-[#3d2f1e]">
              <p>{copy.completedChallenges}</p>
              <ul className="space-y-1">
                {Object.entries(day.bySubject).map(([id, n]) => (
                  <li key={id} className="flex justify-between rounded-lg bg-white/70 px-3 py-1.5">
                    <span>{localizedSubject(id as SubjectProgressRow["id"], locale)}</span>
                    <span>× {n}</span>
                  </li>
                ))}
              </ul>
              <p>
                XP：<span className="text-[#2f9e6e]">+{day.xp}</span>
              </p>
              <p>
                Trophy：<span className="text-[#c45c26]">+{day.trophy}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm font-bold text-[#8a7355]">{copy.goLearn}</p>
          )
        ) : null}
      </GameModal>

      <GameModal
        open={!!achievement}
        title={achievement?.name ?? copy.achievementFallback}
        subtitle={achievement?.unlocked ? copy.completed : copy.locked}
        onClose={onCloseAchievement}
      >
        {achievement ? (
          <div className="space-y-2 text-sm font-bold text-[#3d2f1e]">
            <p className="text-[#6b5340]">{achievement.description}</p>
            <p>
              {copy.condition}：<span className="text-[#8a5a18]">{achievement.condition}</span>
            </p>
            <p>
              {copy.progress}：{achievement.progressLabel}（{achievement.progress}%）
            </p>
            <p>
              {copy.status}：{achievement.unlocked ? copy.completed : copy.inProgress}
              {achievement.unlockedAt ? ` · ${achievement.unlockedAt}` : ""}
            </p>
          </div>
        ) : null}
      </GameModal>

      <GameModal
        open={subjectsOpen}
        title={copy.subjectDetails}
        subtitle={copy.subjectDetailsSub}
        onClose={onCloseSubjects}
      >
        <ul className="space-y-2">
          {profile.subjects.map((s) => {
            const arena = localizedWorldStageName(getWorldStage(s.trophies).id, locale);
            return (
              <li key={s.id} className="rounded-xl bg-white/70 px-3 py-2.5 ring-1 ring-[#e8c98a]/45">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-display)] text-base font-bold text-[#3d2f1e]">
                    {localizedSubject(s.id, locale)}
                  </span>
                  <span className="text-xs font-extrabold text-[#8a5a18]">Lv.{s.level}</span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-[#6b5340]">
                  {copy.masteryTrophiesChallenges(s.mastery, s.trophies, s.games)}
                </p>
                <p className="mt-0.5 text-[11px] font-bold text-[#2f9e6e]">{copy.currentArena(arena)}</p>
                {s.toNextLevelTrophies != null && s.nextLevel != null ? (
                  <p className="mt-0.5 text-[11px] font-bold text-[#8a5a18]">
                    {copy.nextLevelTrophies(s.nextLevel, s.toNextLevelTrophies)}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[11px] font-bold text-[#8a7355]">{copy.maxWorld}</p>
                )}
              </li>
            );
          })}
        </ul>
      </GameModal>
    </>
  );
}
