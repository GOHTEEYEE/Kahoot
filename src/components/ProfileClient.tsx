"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "./home/BottomNavigation";
import { ProfileHeader } from "./profile/ProfileHeader";
import { UserProfileCard } from "./profile/UserProfileCard";
import { PlayerStats } from "./profile/PlayerStats";
import { LearningHero } from "./profile/LearningHero";
import { LearningRecord } from "./profile/LearningRecord";
import { AchievementSection } from "./profile/AchievementSection";
import { AvatarPickerModal, EditProfileModal, type EditDraft } from "./profile/EditProfileModal";
import { ProfileDetailModals } from "./profile/ProfileDetailModals";
import type { AchievementView } from "../lib/achievements";
import type { DayActivity } from "../lib/learningLog";
import { buildProfileSnapshot, type SubjectProgressRow } from "../lib/profile";
import type { StudentAccount } from "../lib/account";
import { getCurrentAccount, saveSelectedSubject, updateStudentProfile } from "../lib/storage";
import { playSfx } from "../lib/audio/sfx";

type StatKey = "trophy" | "power" | "streak" | "challenges";

export function ProfileClient() {
  const router = useRouter();
  const [account, setAccount] = useState<StudentAccount | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [stat, setStat] = useState<StatKey | null>(null);
  const [day, setDay] = useState<DayActivity | null>(null);
  const [achievement, setAchievement] = useState<AchievementView | null>(null);
  const [subjectsOpen, setSubjectsOpen] = useState(false);

  const refresh = useCallback(() => {
    const current = getCurrentAccount();
    if (!current) {
      router.replace("/auth");
      return;
    }
    setAccount(current);
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const profile = useMemo(() => (account ? buildProfileSnapshot(account) : null), [account]);

  const persistAvatar = (src: string) => {
    if (!account) return;
    const next = updateStudentProfile(account, {
      displayName: account.displayName,
      age: account.age,
      grade: account.grade,
      school: account.school,
      state: account.state,
      avatar: src,
    });
    setAccount(next);
  };

  const onSaveEdit = (draft: EditDraft) => {
    if (!account) return;
    const next = updateStudentProfile(account, draft);
    setAccount(next);
  };

  const openSubjectArena = (row: SubjectProgressRow) => {
    playSfx("tap");
    saveSelectedSubject(row.id);
    router.push("/");
  };

  if (!account || !profile) {
    return (
      <div className="flex flex-1 items-center justify-center text-[#8a7355]">加载中…</div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-2 sm:max-w-lg">
      <ProfileHeader />
      <UserProfileCard
        profile={profile}
        onEdit={() => setEditOpen(true)}
        onChangeAvatar={() => setAvatarOpen(true)}
      />
      <PlayerStats profile={profile} onOpen={setStat} />
      <LearningHero
        profile={profile}
        onSubject={openSubjectArena}
        onSubjectDetails={() => setSubjectsOpen(true)}
      />
      <LearningRecord profile={profile} onDay={setDay} />
      <AchievementSection profile={profile} onOpen={setAchievement} />

      <EditProfileModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={onSaveEdit}
      />
      <AvatarPickerModal
        open={avatarOpen}
        current={profile.avatar}
        onClose={() => setAvatarOpen(false)}
        onPick={persistAvatar}
      />
      <ProfileDetailModals
        profile={profile}
        stat={stat}
        day={day}
        achievement={achievement}
        subjectsOpen={subjectsOpen}
        onCloseStat={() => setStat(null)}
        onCloseDay={() => setDay(null)}
        onCloseAchievement={() => setAchievement(null)}
        onCloseSubjects={() => setSubjectsOpen(false)}
      />

      <BottomNavigation />
    </div>
  );
}
