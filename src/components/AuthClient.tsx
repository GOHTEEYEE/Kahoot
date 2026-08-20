"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { gradeFromAge, MALAYSIA_STATES } from "../lib/account";
import { DEMO_PASSWORD, MOCK_ACCOUNTS } from "../lib/mockData";
import { signIn, signUp } from "../lib/storage";

type Mode = "login" | "signup";

const inputClass =
  "w-full rounded-full border-2 border-[var(--brand)]/20 bg-white/90 px-4 py-3 font-bold text-[var(--ink)] outline-none focus:border-[var(--brand)]";

export function AuthClient() {
  const router = useRouter();
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
        setError(res.error);
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
      setError(res.error);
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
          {mode === "signup" ? "创建账号" : "登录账号"}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          目前为 <strong>Mock 演示模式</strong>：可用下方演示账号，或自己注册（仅存在本机）。
        </p>
      </header>

      <div className="mb-4 rounded-[1.2rem] bg-white/80 p-3 shadow-sm">
        <p className="mb-2 text-xs font-extrabold text-[var(--ink-soft)]">
          一键登录 Mock 账号（密码均为 {DEMO_PASSWORD}）
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
                  setError(res.error);
                  return;
                }
                router.replace("/");
              }}
              className="rounded-full bg-[var(--bg-top)] px-3 py-1.5 text-xs font-extrabold text-[var(--brand-deep)]"
            >
              {a.displayName} · {a.grade}年级
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
          注册 Sign up
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
          登录 Login
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-[1.6rem] bg-white/75 p-5 shadow-[var(--shadow)]"
      >
        <Field label="登录名 Username">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
            placeholder="例如：ali_2026"
            autoComplete="username"
            required
          />
        </Field>
        <Field label="密码 Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="至少 4 位"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
        </Field>

        {mode === "signup" ? (
          <>
            <Field label="姓名 Name">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
                placeholder="学生姓名"
                required
              />
            </Field>
            <Field label={`年龄 Age（将锁定为 ${lockedGrade} 年级）`}>
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
            <Field label="学校名字 School">
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className={inputClass}
                placeholder="例如：SJK(C) Example"
                required
              />
            </Field>
            <Field label="州属 State">
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
            <Field label="联系方式 Contact（家长电话/电邮）">
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={inputClass}
                placeholder="电话或 email"
                required
              />
            </Field>
            <p className="rounded-2xl bg-[var(--bg-top)] px-3 py-2 text-xs font-bold text-[var(--brand-deep)]">
              年龄 {age || "—"} 岁 → 课程锁定 <strong>{lockedGrade} 年级</strong>
              （注册后不可自行更改）
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
          {mode === "signup" ? "创建并进入" : "登录"}
        </button>
      </form>

      <Link href="/" className="mt-5 text-center text-sm font-bold text-[var(--brand-deep)]">
        返回首页
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
