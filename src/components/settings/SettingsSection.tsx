"use client";

import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  return (
    <section className="hud-plate mt-3 overflow-hidden rounded-[1.4rem] ring-1 ring-[#f0d9a0]/90">
      <h2 className="border-b border-[#e8c98a]/40 px-4 py-2.5 font-[family-name:var(--font-display)] text-[15px] font-bold text-[#3d2f1e]">
        {title}
      </h2>
      <div className="divide-y divide-[#e8c98a]/35">{children}</div>
    </section>
  );
}

type RowProps = {
  icon: string;
  label: string;
  onClick?: () => void;
  trailing?: ReactNode;
  danger?: boolean;
};

export function SettingsRow({ icon, label, onClick, trailing, danger }: RowProps) {
  const className = `flex min-h-[48px] w-full items-center gap-3 px-4 py-3 text-left transition active:scale-[0.99] ${
    danger ? "text-[#c4452f]" : "text-[#3d2f1e]"
  }`;

  const content = (
    <>
      <span className="text-[18px]" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-[14px] font-extrabold">{label}</span>
      {trailing ?? (
        onClick ? <span className="text-[16px] font-black text-[#b8a078]" aria-hidden>›</span> : null
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
