"use client";

const HOME_BG = "/worlds/shared/home-bg.png?v=2";

/** Full-viewport home sky — must sit on `main`, not inside the HUD column. */
export function HomeAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HOME_BG}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-[50%_42%]"
      />
    </div>
  );
}
