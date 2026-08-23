"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { playSfx } from "../../lib/audio/sfx";
import { startResultTheme } from "../../lib/audio/resultTheme";
import { useAudioScene } from "../../lib/audio/useAudioScene";
import { getPvpCopy } from "../../lib/i18n/pvp";
import { useLocale } from "../../lib/i18n/useLocale";
import {
  clearPvpMatchResult,
  loadPvpMatchResult,
  shareText,
  speedLeadSeconds,
  type PvpMatchResult,
} from "../../lib/pvp/matchResult";
import { GameIcon } from "../home/GameIcon";
import { DefeatCharacter, VictoryCharacter } from "./ResultPanda";

export function PvpResultClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = getPvpCopy(locale);
  useAudioScene("battle");
  const [result, setResult] = useState<PvpMatchResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadPvpMatchResult();
    if (!stored) {
      router.replace("/challenge");
      return;
    }
    setResult(stored);
    setReady(true);
    playSfx(stored.result === "win" ? "win" : stored.result === "lose" ? "lose" : "wrong");
    return startResultTheme(stored.result === "win" ? "win" : stored.result === "lose" ? "lose" : "draw");
  }, [router]);

  const lead = result ? speedLeadSeconds(result) : 0;
  const speedLabel = useMemo(() => {
    if (!result) return "";
    if (lead > 0) return copy.speedLead(String(lead));
    if (lead < 0) return copy.speedLag(String(Math.abs(lead)));
    return copy.speedEven;
  }, [copy, lead, result]);

  const goHome = useCallback(() => {
    playSfx("tap");
    router.replace("/");
  }, [router]);

  const rematch = useCallback(() => {
    playSfx("challenge");
    clearPvpMatchResult();
    router.replace("/pvp");
  }, [router]);

  const share = useCallback(async () => {
    if (!result) return;
    playSfx("tap");
    const text = shareText(result, locale);
    const payload = { title: copy.shareTitle, text, url: window.location.origin };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(payload);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${payload.url}`);
    } catch {
      const area = document.createElement("textarea");
      area.value = `${text}\n${payload.url}`;
      area.setAttribute("readonly", "true");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, [copy.shareTitle, locale, result]);

  if (!ready || !result) {
    return <div className="flex min-h-[100dvh] items-center justify-center bg-[#7eb7e8]" />;
  }

  const win = result.result === "win";
  const title = win ? copy.resultWin : result.result === "draw" ? copy.resultDraw : copy.resultLose;
  const subtitle = win ? copy.resultWinSub : result.result === "draw" ? copy.resultDrawSub : copy.resultLoseSub;

  return (
    <div className={`pvp-result-page${win ? " is-win" : " is-lose"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/worlds/shared/pvp-arena.png?v=1" alt="" draggable={false} className="pvp-result-arena" />
      <div className="pvp-result-dim" />
      <div className="pvp-result-glow" aria-hidden />
      {win ? (
        <div className="pvp-result-confetti" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={`pvp-result-confetti-bit n${i}`} />
          ))}
        </div>
      ) : null}

      <div className="pvp-result-stage">
        <div className="pvp-result-banner">
          <span className="pvp-result-crown" aria-hidden>
            {win ? "👑" : result.result === "draw" ? "🤝" : "💔"}
          </span>
          <h1 className="pvp-result-title">{title}</h1>
          <p className="pvp-result-ribbon">{subtitle}</p>
        </div>

        <div className="pvp-result-panda">{win ? <VictoryCharacter /> : <DefeatCharacter />}</div>
      </div>

      <div className="pvp-result-bottom">
        <div className="pvp-result-stats">
          <div>
            <span>{copy.statAccuracy}</span>
            <strong>🎯 {result.player.accuracy}%</strong>
          </div>
          <div>
            <span>{copy.statSpeed}</span>
            <strong>⚡ {speedLabel}</strong>
          </div>
          <div>
            <span>{copy.statShield}</span>
            <strong>🛡 +{result.rewards.knowledgeShield}</strong>
          </div>
        </div>

        <div className="pvp-result-actions">
          <button type="button" className="pvp-result-btn pvp-result-btn-home" onClick={goHome}>
            <GameIcon name="home" size="utility" />
            <span>{copy.home}</span>
          </button>
          <button type="button" className="pvp-result-btn pvp-result-btn-rematch" onClick={rematch}>
            <GameIcon name="swords" size="utility" />
            <span>{copy.rematch}</span>
          </button>
          <button type="button" className="pvp-result-btn pvp-result-btn-share" onClick={() => void share()}>
            <GameIcon name="mail" size="utility" />
            <span>{copied ? copy.shareCopied : copy.share}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
