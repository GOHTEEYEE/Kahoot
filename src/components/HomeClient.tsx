"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HomeAtmosphere } from "./home/HomeAtmosphere";
import { HomeHeader } from "./home/HomeHeader";
import { WorldDiorama } from "./home/WorldDiorama";
import { ChallengeButton } from "./home/ChallengeButton";
import { ChangeWorldButton, WorldPickerModal } from "./home/WorldPickerModal";
import { SideActions } from "./home/SideActions";
import { WorldProgress } from "./home/WorldProgress";
import { BottomNavigation } from "./home/BottomNavigation";
import { GameToast } from "./home/GameToast";
import type { SubjectId } from "../lib/curriculum";
import type { StudentAccount } from "../lib/account";
import type { WorldStageId } from "../lib/worlds";
import {
  getCurrentAccount,
  getSelectedSubject,
  getSubjectStats,
  saveSelectedSubject,
} from "../lib/storage";
import { getMockEconomy, getSubjectWorld } from "../lib/worlds";
import { readWallet } from "../lib/rewards";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

export function HomeClient() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const [account, setAccount] = useState<StudentAccount | null>(null);
  const [subject, setSubject] = useState<SubjectId>("math");
  const [checking, setChecking] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [viewingStage, setViewingStage] = useState<WorldStageId | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let mounted = true;

    function init() {
      try {
        const current = getCurrentAccount();
        if (current) {
          if (mounted) {
            setAccount(current);
            setSubject(getSelectedSubject());
            setChecking(false);
          }
          return;
        }
        if (mounted) {
          setChecking(false);
          router.replace("/auth");
        }
      } catch (e) {
        console.error("Home init failed", e);
        if (mounted) {
          setChecking(false);
          router.replace("/auth");
        }
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [router]);

  const trophies = account ? getSubjectStats(account, subject).trophies : 0;
  const mascotName = getSubjectWorld(subject).mascotName;

  const economy = useMemo(() => {
    if (!account) return { xpLevel: 1, xpProgress: 0, coins: 0, gems: 0 };
    const mock = getMockEconomy(account);
    const wallet = readWallet(account);
    return {
      xpLevel: mock.xpLevel,
      xpProgress: mock.xpProgress,
      coins: wallet?.coins ?? mock.coins,
      gems: wallet?.gems ?? mock.gems,
    };
  }, [account]);

  function selectSubject(id: SubjectId) {
    setSubject(id);
    saveSelectedSubject(id);
    setViewingStage(null);
  }

  function startBattle() {
    if (!account) return;
    saveSelectedSubject(subject);
    router.push("/challenge");
  }

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1600);
  }

  if (checking || !account) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-10 text-center">
        <div className="home-sky pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#ffe9b0] to-[#f6be32] font-[family-name:var(--font-display)] text-2xl font-bold text-[#4a3414] shadow-[0_6px_16px_rgba(80,50,20,0.22)] ring-2 ring-white/70"
        >
          M
        </motion.div>
        <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#6b5340]">
          正在进入 MathArena...
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#3c3425]/10 ring-1 ring-white/40">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#58b94b] to-[#b8f070]"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "40%" }}
          />
        </div>
      </div>
    );
  }

  const enter = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className="game-canvas relative mx-auto flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden px-[var(--home-pad-x)] pt-[max(0.25rem,env(safe-area-inset-top))] pb-[calc(var(--home-nav-h)+var(--home-cta-nav-gap)+0.4rem+env(safe-area-inset-bottom))]"
      initial={reduced ? false : "hidden"}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
      }}
    >
      <HomeAtmosphere />

      <motion.div variants={enter} className="relative z-30 shrink-0">
        <HomeHeader
          name={account.displayName}
          grade={account.grade}
          xpLevel={economy.xpLevel}
          xpProgress={economy.xpProgress}
          coins={economy.coins}
          gems={economy.gems}
          avatarSrc={account.avatar || "/worlds/chinese/momo.png?v=live"}
          onNotify={() => flash("暂无新通知")}
          onMail={() => flash("暂无新邮件")}
        />
      </motion.div>

      <motion.div
        variants={reduced ? enter : { hidden: { opacity: 0 }, show: { opacity: 1 } }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="home-middle-zone relative z-10 flex min-h-0 flex-col"
      >
        <WorldDiorama
          subject={subject}
          trophies={trophies}
          viewingStage={viewingStage}
          onIslandClick={() => setPickerOpen(true)}
        >
          <SideActions
            onChest={() => flash("Daily Chest 已领取")}
            onMission={() => flash("完成 1 场 Challenge 吧！")}
            onEvent={() => flash("活动即将开始")}
            onSeason={() => flash("赛季奖励已更新")}
            onWorld={() => setPickerOpen(true)}
          />
        </WorldDiorama>
      </motion.div>

      <div className="home-bottom-stack">
        <motion.div variants={enter} className="relative z-20 shrink-0 px-0">
          <WorldProgress trophies={trophies} mascotName={mascotName} />
        </motion.div>

        <motion.div
          variants={enter}
          className="relative z-20 flex shrink-0 items-stretch gap-2"
          style={{ height: "var(--home-cta-height)" }}
        >
          <ChallengeButton onClick={startBattle} />
          <ChangeWorldButton onClick={() => setPickerOpen(true)} />
        </motion.div>
      </div>

      <WorldPickerModal
        open={pickerOpen}
        current={subject}
        viewingStage={viewingStage}
        account={account}
        onClose={() => setPickerOpen(false)}
        onSelect={selectSubject}
        onViewStage={(stageId) => {
          setViewingStage(stageId);
          setPickerOpen(false);
        }}
      />

      <GameToast message={toast} />

      <BottomNavigation />
    </motion.div>
  );
}
