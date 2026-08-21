"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "../home/BottomNavigation";
import { GameModal } from "../game-ui/GameModal";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsRow, SettingsSection } from "./SettingsSection";
import { SettingsToggle } from "./SettingsToggle";
import { ChangePasswordModal } from "./ChangePasswordModal";
import type { AppLocale } from "../../lib/i18n/locale";
import { SETTINGS_I18N } from "../../lib/i18n/settings";
import { useLocale } from "../../lib/i18n/useLocale";
import type { StudentAccount } from "../../lib/account";
import { playSfx, setSfxMuted } from "../../lib/audio/sfx";
import { useSfxMuted } from "../../lib/audio/useSfxMuted";
import { setBackgroundMusicEnabled } from "../../lib/audio/bgm";
import { useBgmMuted } from "../../lib/audio/useBgmMuted";
import {
  getAccountEmail,
  getCurrentAccount,
  maskEmail,
  signOutAccount,
} from "../../lib/storage";
import { APP_NAME, APP_TAGLINE_ZH, APP_VERSION } from "../../lib/appVersion";

type ModalKind = "password" | "loginMethod" | "logout" | null;

export function SettingsClient() {
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const copy = SETTINGS_I18N[locale];
  const sfxMuted = useSfxMuted();
  const bgmMuted = useBgmMuted();
  const [account, setAccount] = useState<StudentAccount | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);

  useEffect(() => {
    const current = getCurrentAccount();
    if (!current) {
      router.replace("/auth");
      return;
    }
    setAccount(current);
  }, [router]);

  const maskedEmail = useMemo(() => {
    if (!account) return "";
    return maskEmail(getAccountEmail(account));
  }, [account]);

  const languages: { id: AppLocale; label: string }[] = [
    { id: "zh", label: copy.langZh },
    { id: "ms", label: copy.langMs },
    { id: "en", label: copy.langEn },
  ];

  if (!account) {
    return (
      <div className="flex flex-1 items-center justify-center text-[#8a7355]">{copy.loading}</div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-2 sm:max-w-lg">
      <SettingsHeader title={copy.title} backLabel={copy.back} />

      <SettingsSection title={copy.gameExperience}>
        <SettingsRow
          icon="🔊"
          label={copy.soundEffects}
          trailing={
            <SettingsToggle
              enabled={!sfxMuted}
              labelOn={copy.on}
              labelOff={copy.off}
              ariaLabel={copy.soundEffects}
              onChange={(enabled) => {
                if (enabled) {
                  setSfxMuted(false);
                  playSfx("hud");
                } else {
                  playSfx("mute");
                  setSfxMuted(true);
                }
              }}
            />
          }
        />
        <SettingsRow
          icon="🎵"
          label={copy.backgroundMusic}
          trailing={
            <SettingsToggle
              enabled={!bgmMuted}
              labelOn={copy.on}
              labelOff={copy.off}
              ariaLabel={copy.backgroundMusic}
              onChange={(enabled) => {
                playSfx("tap");
                setBackgroundMusicEnabled(enabled);
              }}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title={copy.language}>
        {languages.map((lang) => {
          const selected = locale === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => {
                playSfx("tap");
                setLocale(lang.id);
              }}
              className="flex min-h-[48px] w-full items-center gap-3 px-4 py-3 text-left transition active:scale-[0.99]"
              aria-pressed={selected}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selected ? "border-[#65c84a] bg-[#65c84a]" : "border-[#c4b48a] bg-transparent"
                }`}
                aria-hidden
              >
                {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </span>
              <span className="text-[14px] font-extrabold text-[#3d2f1e]">{lang.label}</span>
            </button>
          );
        })}
      </SettingsSection>

      <SettingsSection title={copy.account}>
        <SettingsRow
          icon="🔐"
          label={copy.changePassword}
          onClick={() => {
            playSfx("tap");
            setModal("password");
          }}
        />
        <SettingsRow
          icon="📱"
          label={copy.loginMethod}
          onClick={() => {
            playSfx("tap");
            setModal("loginMethod");
          }}
        />
        <SettingsRow
          icon="🚪"
          label={copy.logout}
          danger
          onClick={() => {
            playSfx("tap");
            setModal("logout");
          }}
        />
      </SettingsSection>

      <SettingsSection title={copy.help}>
        <SettingsRow
          icon="❓"
          label={copy.faq}
          onClick={() => {
            playSfx("tap");
            router.push("/settings/faq");
          }}
        />
        <SettingsRow
          icon="💬"
          label={copy.contact}
          onClick={() => {
            playSfx("tap");
            router.push("/settings/contact");
          }}
        />
        <SettingsRow
          icon="📖"
          label={copy.howToPlay}
          onClick={() => {
            playSfx("tap");
            router.push("/settings/how-to-play");
          }}
        />
      </SettingsSection>

      <SettingsSection title={copy.legal}>
        <SettingsRow
          icon="📄"
          label={copy.terms}
          onClick={() => {
            playSfx("tap");
            router.push("/settings/terms");
          }}
        />
        <SettingsRow
          icon="🔒"
          label={copy.privacy}
          onClick={() => {
            playSfx("tap");
            router.push("/settings/privacy");
          }}
        />
      </SettingsSection>

      <SettingsSection title={copy.about}>
        <SettingsRow
          icon="ℹ️"
          label={copy.aboutTitle}
          onClick={() => {
            playSfx("tap");
            router.push("/settings/about");
          }}
        />
      </SettingsSection>

      <div className="mt-4 mb-2 px-2 text-center">
        <p className="font-[family-name:var(--font-display)] text-[16px] font-bold text-[#3d2f1e]">
          {APP_NAME}
        </p>
        <p className="mt-1 whitespace-pre-line text-[11px] font-bold leading-relaxed text-[#8a7355]">
          {APP_TAGLINE_ZH}
        </p>
        <p className="mt-2 text-[10px] font-extrabold text-[#b8a078]">
          {copy.version} {APP_VERSION}
        </p>
        <p className="text-[10px] font-bold text-[#b8a078]">© 2026 {APP_NAME}</p>
      </div>

      <ChangePasswordModal
        open={modal === "password"}
        account={account}
        copy={copy}
        onClose={() => setModal(null)}
        onUpdated={setAccount}
      />

      <GameModal
        open={modal === "loginMethod"}
        title={copy.loginMethodTitle}
        onClose={() => setModal(null)}
      >
        <div className="space-y-3">
          <div className="rounded-xl bg-white/70 px-3 py-3 ring-1 ring-[#e8c98a]/45">
            <p className="text-[11px] font-extrabold text-[#8a5a18]">✉️ {copy.emailLabel}</p>
            <p className="mt-1 text-sm font-bold text-[#3d2f1e]">{maskedEmail}</p>
          </div>
          <div className="rounded-xl bg-white/70 px-3 py-3 ring-1 ring-[#e8c98a]/45">
            <p className="text-[11px] font-extrabold text-[#8a5a18]">🔐 {copy.passwordLabel}</p>
            <p className="mt-1 text-sm font-bold tracking-widest text-[#3d2f1e]">••••••••</p>
          </div>
        </div>
      </GameModal>

      <GameModal
        open={modal === "logout"}
        title={copy.logoutConfirmTitle}
        onClose={() => setModal(null)}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                playSfx("tap");
                setModal(null);
              }}
              className="rounded-[1.1rem] bg-[#efe4c8] py-3 text-sm font-extrabold text-[#5a3a18] ring-1 ring-[#e8c98a]/70"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx("tap");
                void (async () => {
                  await signOutAccount();
                  router.replace("/auth");
                })();
              }}
              className="rounded-[1.1rem] bg-gradient-to-b from-[#ff8a7a] to-[#d44532] py-3 text-sm font-extrabold text-white shadow-[0_4px_0_#9a2418]"
            >
              {copy.confirmLogout}
            </button>
          </div>
        }
      >
        <p className="text-sm font-bold text-[#6b5340]">{copy.logoutConfirmBody}</p>
      </GameModal>

      <BottomNavigation />
    </div>
  );
}

/** Shared shell wrapper for settings subpages */
export function SettingsSubpageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { locale } = useLocale();
  const copy = SETTINGS_I18N[locale];

  return (
    <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-2 sm:max-w-lg">
      <SettingsHeader title={title} backLabel={copy.back} />
      <div className="hud-plate flex-1 rounded-[1.4rem] p-4 ring-1 ring-[#f0d9a0]/90">{children}</div>
      <BottomNavigation />
    </div>
  );
}

export function SettingsComingSoon({ title }: { title: string }) {
  const { locale } = useLocale();
  const copy = SETTINGS_I18N[locale];
  return (
    <SettingsSubpageShell title={title}>
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#3d2f1e]">
          {title}
        </p>
        <p className="mt-3 text-sm font-extrabold text-[#8a5a18]">{copy.comingSoon}</p>
      </div>
    </SettingsSubpageShell>
  );
}
