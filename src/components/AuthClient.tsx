"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { gradeFromAge, MALAYSIA_STATES } from "../lib/account";
import { DEMO_PASSWORD, MOCK_ACCOUNTS } from "../lib/mockData";
import { signIn, signUp } from "../lib/storage";
import { getAuthCopy, localizeAuthError } from "../lib/i18n/auth";
import { localizedGrade } from "../lib/i18n/home";
import { useLocale } from "../lib/i18n/useLocale";

type Mode = "login" | "signup";

const inputClass =
  "w-full rounded-full border-2 border-[var(--brand)]/20 bg-white/90 px-4 py-3 font-bold text-[var(--ink)] outline-none focus:border-[var(--brand)]";

export function AuthClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = getAuthCopy(locale);
  const [mode, setMode] = useState<Mode>("signup");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("8");
  const [school, setSchool] = useState("");
  const [state, setState] = useState<string>(MALAYSIA_STATES[11]);
  const [contact, setContact] = useState("");

  const lockedGrade = useMemo(() => gradeFromAge(Number(age) || 8), [age]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const res = await signIn(username, password);
      if (!res.ok) {
        setError(localizeAuthError(res.error, locale));
        return;
      }
      router.replace("/");
      return;
    }

    const res = await signUp({
      username,
      password,
      displayName,
      age: Number(age),
      school,
      state,
      contact,
    });
    if (!res.ok) {
      setError(localizeAuthError(res.error, locale));
      return;
    }
    router.replace("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 py-8">
      <header className="mb-6 text-center">
        <p className="text-xs font-extrabold tracking-[0.28em] text-[var(--brand-deep)] uppercase">
          Student Account
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--ink)]">
          {mode === "signup" ? copy.createAccount : copy.loginAccount}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          {copy.mockHint}
        </p>
      </header>

      <div className="mb-4 rounded-[1.2rem] bg-white/80 p-3 shadow-sm">
        <p className="mb-2 text-xs font-extrabold text-[var(--ink-soft)]">
          {copy.mockLogin(DEMO_PASSWORD)}
        </p>
        <div className="flex flex-wrap gap-2">
          {MOCK_ACCOUNTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={async () => {
                setMode("login");
                setUsername(a.username);
                setPassword(DEMO_PASSWORD);
                setError("");
                const res = await signIn(a.username, DEMO_PASSWORD);
                if (!res.ok) {
                  setError(localizeAuthError(res.error, locale));
                  return;
                }
                router.replace("/");
              }}
              className="rounded-full bg-[var(--bg-top)] px-3 py-1.5 text-xs font-extrabold text-[var(--brand-deep)]"
            >
              {a.displayName} · {localizedGrade(a.grade, locale)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-full bg-white/70 p-1 shadow-sm">
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError("");
          }}
          className={`rounded-full py-2.5 text-sm font-extrabold ${
            mode === "signup" ? "bg-[var(--brand)] text-white" : "text-[var(--ink-soft)]"
          }`}
        >
          {copy.signup}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
          }}
          className={`rounded-full py-2.5 text-sm font-extrabold ${
            mode === "login" ? "bg-[var(--brand)] text-white" : "text-[var(--ink-soft)]"
          }`}
        >
          {copy.login}
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-[1.6rem] bg-white/75 p-5 shadow-[var(--shadow)]"
      >
        <Field label={copy.username}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
            placeholder={copy.usernamePh}
            autoComplete="username"
            required
          />
        </Field>
        <Field label={copy.password}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder={copy.passwordPh}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
        </Field>

        {mode === "signup" ? (
          <>
            <Field label={copy.name}>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
                placeholder={copy.namePh}
                required
              />
            </Field>
            <Field label={copy.ageLocksGrade(localizedGrade(lockedGrade, locale))}>
              <input
                type="number"
                min={6}
                max={14}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label={copy.school}>
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className={inputClass}
                placeholder="SJK(C) Example"
                required
              />
            </Field>
            <Field label={copy.state}>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={inputClass}
                required
              >
                {MALAYSIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={copy.contact}>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={inputClass}
                placeholder={copy.contactPh}
                required
              />
            </Field>
            <p className="rounded-2xl bg-[var(--bg-top)] px-3 py-2 text-xs font-bold text-[var(--brand-deep)]">
              {copy.ageLockNote(age || "—", localizedGrade(lockedGrade, locale))}
            </p>
          </>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-bold text-[var(--red)]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="pressable mt-2 rounded-full bg-[var(--brand)] px-6 py-3.5 text-lg font-extrabold text-white"
        >
          {mode === "signup" ? copy.createEnter : copy.loginBtn}
        </button>
      </form>

      <Link href="/" className="mt-5 text-center text-sm font-bold text-[var(--brand-deep)]">
        {copy.backHome}
      </Link>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="px-1 text-xs font-extrabold text-[var(--ink-soft)]">{label}</span>
      {children}
    </label>
  );
}
