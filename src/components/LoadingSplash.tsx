"use client";

const SPLASH_ART = "/brand/panda-academia-loading.png";

type Props = {
  progress: number;
  tip: string;
};

export function LoadingSplash({ progress, tip }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-[#6ec4ef]">
      <div className="relative mx-auto h-full w-full max-w-[430px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SPLASH_ART}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
        />

        {/* Cover the baked-in 78% bar so the live progress is the one you see. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#12324a] via-[#12324a]/88 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))]">
          <div className="flex w-full items-center gap-2.5 rounded-[1.15rem] bg-[rgba(18,28,48,0.72)] px-3.5 py-2.5 shadow-[0_8px_24px_rgba(8,18,32,0.35)] ring-1 ring-white/15 backdrop-blur-[6px]">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffe566] text-lg shadow-[0_0_12px_rgba(255,220,80,0.55)]"
            >
              💡
            </span>
            <p className="min-w-0 text-left text-[13px] font-extrabold leading-snug text-white/95">
              TIP: {tip}
            </p>
          </div>

          <div className="h-3.5 w-full overflow-hidden rounded-full bg-[#17344c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)] ring-2 ring-[#7ad7ff]/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3ec6ff] via-[#7ae7ff] to-[#e8fbff] shadow-[0_0_16px_rgba(90,210,255,0.85)] transition-[width] duration-150 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="font-[family-name:var(--font-display)] text-[1.05rem] font-bold tracking-[0.18em] text-white drop-shadow-[0_2px_6px_rgba(10,30,50,0.55)]">
            LOADING... {pct}%
          </p>
        </div>
      </div>
    </div>
  );
}
