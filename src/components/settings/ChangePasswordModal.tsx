"use client";

import { useState } from "react";
import { GameModal } from "../game-ui/GameModal";
import type { SettingsCopy } from "../../lib/i18n/settings";
import type { StudentAccount } from "../../lib/account";
import { changePassword } from "../../lib/storage";
import { playSfx } from "../../lib/audio/sfx";

type Props = {
  open: boolean;
  account: StudentAccount;
  copy: SettingsCopy;
  onClose: () => void;
  onUpdated: (account: StudentAccount) => void;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-[#e8c98a]/70 bg-white px-3 py-2.5 text-sm font-bold text-[#3d2f1e] outline-none focus:border-[#65c84a]";

export function ChangePasswordModal({ open, account, copy, onClose, onUpdated }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  function reset() {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError("");
    setSuccess(false);
    setBusy(false);
  }

  async function submit() {
    setError("");
    if (!current.trim() || !next.trim() || !confirm.trim()) {
      setError(copy.passwordEmpty);
      return;
    }
    if (next !== confirm) {
      setError(copy.passwordMismatch);
      return;
    }
    setBusy(true);
    const res = await changePassword(account, current, next);
    setBusy(false);
    if (!res.ok) {
      setError(
        res.error === "wrong_password"
          ? copy.passwordWrong
          : res.error === "invalid_password"
            ? copy.passwordInvalid
            : res.error === "empty_password"
              ? copy.passwordEmpty
              : res.error,
      );
      return;
    }
    playSfx("tap");
    setSuccess(true);
    onUpdated({ ...account, password: next.trim() });
    window.setTimeout(() => {
      reset();
      onClose();
    }, 900);
  }

  return (
    <GameModal
      open={open}
      title={copy.changePassword}
      onClose={() => {
        reset();
        onClose();
      }}
      footer={
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            playSfx("tap");
            void submit();
          }}
          className="cta-green w-full rounded-[1.1rem] py-3 font-[family-name:var(--font-display)] text-lg font-bold text-white shadow-[0_4px_0_#2a9828] disabled:opacity-60"
        >
          {success ? copy.passwordSuccess : copy.submitPassword}
        </button>
      }
    >
      <label className="block text-[11px] font-extrabold text-[#8a5a18]">
        {copy.currentPassword}
        <input
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="mt-3 block text-[11px] font-extrabold text-[#8a5a18]">
        {copy.newPassword}
        <input
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="mt-3 block text-[11px] font-extrabold text-[#8a5a18]">
        {copy.confirmPassword}
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
      </label>
      {error ? <p className="mt-3 text-[12px] font-bold text-[#c4452f]">{error}</p> : null}
      {success ? <p className="mt-3 text-[12px] font-bold text-[#2f9e6e]">{copy.passwordSuccess}</p> : null}
    </GameModal>
  );
}
