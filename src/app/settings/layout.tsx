import type { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-full flex-1 flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/worlds/shared/home-bg.png?v=2"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[50%_40%]"
      />
      <div className="home-vignette pointer-events-none absolute inset-0 -z-10" />
      {children}
    </main>
  );
}
