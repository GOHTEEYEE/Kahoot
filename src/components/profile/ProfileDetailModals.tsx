"use client";

import { GameModal } from "../game-ui/GameModal";
import type { AchievementView } from "../../lib/achievements";
import type { DayActivity } from "../../lib/learningLog";
import { subjectLabel } from "../../lib/curriculum";
import type { ProfileSnapshot, SubjectProgressRow } from "../../lib/profile";
import { subjectTrophyHistory } from "../../lib/profile";

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
  const trophyRows = subjectTrophyHistory(profile.account);

  return (
    <>
      <GameModal
        open={stat === "trophy"}
        title="奖杯"
        subtitle={`总计 ${profile.trophies}`}
        onClose={onCloseStat}
      >
        <p className="mb-3 text-[12px] font-bold text-[#6b5340]">
          奖杯来自各科目擂台对战与挑战奖励。
        </p>
        <ul className="space-y-2">
          {trophyRows.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45"
            >
              <span className="text-sm font-extrabold text-[#3d2f1e]">{r.name}</span>
              <span className="text-xs font-bold tabular-nums text-[#8a5a18]">
                {r.trophies} 杯 · {r.wins} 胜
              </span>
            </li>
          ))}
        </ul>
      </GameModal>

      <GameModal
        open={stat === "power"}
        title="学习战力"
        subtitle={`总计 ${profile.learningPower.total}`}
        onClose={onCloseStat}
      >
        <p className="mb-3 text-[12px] font-bold text-[#6b5340]">
          战力 = 各科能力分 + 挑战加成 + 成就加成
        </p>
        <ul className="space-y-2">
          {profile.learningPower.bySubject.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45"
            >
              <span className="text-sm font-extrabold text-[#3d2f1e]">{r.name}能力</span>
              <span className="text-xs font-bold tabular-nums text-[#2f9e6e]">+{r.points}</span>
            </li>
          ))}
          <li className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45">
            <span className="text-sm font-extrabold text-[#3d2f1e]">挑战完成</span>
            <span className="text-xs font-bold tabular-nums text-[#2f9e6e]">
              +{profile.learningPower.challengeBonus}
            </span>
          </li>
          <li className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45">
            <span className="text-sm font-extrabold text-[#3d2f1e]">成就</span>
            <span className="text-xs font-bold tabular-nums text-[#2f9e6e]">
              +{profile.learningPower.achievementBonus}
            </span>
          </li>
        </ul>
      </GameModal>

      <GameModal
        open={stat === "streak"}
        title="连续学习"
        subtitle={`当前 ${profile.streak.current} 天`}
        onClose={onCloseStat}
      >
        <div className="space-y-3 text-sm font-bold text-[#3d2f1e]">
          <p>
            当前连续：
            <span className="text-[#c45c26]"> {profile.streak.current} 天</span>
          </p>
          <p>
            最长连续：
            <span className="text-[#8a5a18]"> {profile.streak.longest} 天</span>
          </p>
          <p className="text-[12px] text-[#6b5340]">最近学习日：</p>
          <ul className="grid grid-cols-7 gap-1.5">
            {profile.weekDays.map((d) => (
              <li key={d.date} className="text-center">
                <p className="text-[9px] font-extrabold text-[#8a5a18]">{d.label}</p>
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
        title="挑战历史"
        subtitle={`累计 ${profile.completedChallenges} 次`}
        onClose={onCloseStat}
      >
        <ul className="space-y-2">
          {profile.subjects.map((s) => (
            <li
              key={s.id}
              className="rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#e8c98a]/45"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#3d2f1e]">{s.name}</span>
                <span className="text-xs font-bold text-[#8a5a18]">{s.games} 次</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-[#6b5340]">
                胜 {s.wins} · 奖杯 {s.trophies} · 掌握度 {s.mastery}%
              </p>
            </li>
          ))}
        </ul>
      </GameModal>

      <GameModal
        open={!!day}
        title={day?.date ?? "学习详情"}
        subtitle={day?.completed ? "已完成学习" : "这一天还没有学习记录"}
        onClose={onCloseDay}
      >
        {day ? (
          day.completed ? (
            <div className="space-y-2 text-sm font-bold text-[#3d2f1e]">
              <p>完成挑战：</p>
              <ul className="space-y-1">
                {Object.entries(day.bySubject).map(([id, n]) => (
                  <li key={id} className="flex justify-between rounded-lg bg-white/70 px-3 py-1.5">
                    <span>{subjectLabel(id as SubjectProgressRow["id"])}</span>
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
            <p className="text-sm font-bold text-[#8a7355]">去擂台或挑战页完成一次学习吧！</p>
          )
        ) : null}
      </GameModal>

      <GameModal
        open={!!achievement}
        title={achievement?.name ?? "成就"}
        subtitle={achievement?.unlocked ? "已完成" : "未解锁"}
        onClose={onCloseAchievement}
      >
        {achievement ? (
          <div className="space-y-2 text-sm font-bold text-[#3d2f1e]">
            <p className="text-[#6b5340]">{achievement.description}</p>
            <p>
              条件：<span className="text-[#8a5a18]">{achievement.condition}</span>
            </p>
            <p>
              进度：{achievement.progressLabel}（{achievement.progress}%）
            </p>
            <p>
              状态：{achievement.unlocked ? "已完成" : "进行中"}
              {achievement.unlockedAt ? ` · ${achievement.unlockedAt}` : ""}
            </p>
          </div>
        ) : null}
      </GameModal>

      <GameModal
        open={subjectsOpen}
        title="科目详情"
        subtitle="能力 · 关卡 · 解锁"
        onClose={onCloseSubjects}
      >
        <ul className="space-y-2">
          {profile.subjects.map((s) => (
            <li key={s.id} className="rounded-xl bg-white/70 px-3 py-2.5 ring-1 ring-[#e8c98a]/45">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-display)] text-base font-bold text-[#3d2f1e]">
                  {s.name}
                </span>
                <span className="text-xs font-extrabold text-[#8a5a18]">Lv.{s.level}</span>
              </div>
              <p className="mt-1 text-[11px] font-bold text-[#6b5340]">
                掌握度 {s.mastery}% · 奖杯 {s.trophies} · 挑战 {s.games}
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-[#2f9e6e]">当前 Arena：{s.arenaName}</p>
              {s.toNextLevelTrophies != null && s.nextLevel != null ? (
                <p className="mt-0.5 text-[11px] font-bold text-[#8a5a18]">
                  下一关 Lv.{s.nextLevel}：再获得 {s.toNextLevelTrophies} 奖杯
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] font-bold text-[#8a7355]">已达最高世界关卡</p>
              )}
            </li>
          ))}
        </ul>
      </GameModal>
    </>
  );
}
