import type { ChallengeSilhouette as SilhouetteKind } from "../../lib/challenge";

type Props = {
  kind: SilhouetteKind;
};

const FILL = "currentColor";

/** Low-opacity thematic decoration inside each mode card. */
export function ChallengeSilhouette({ kind }: Props) {
  return (
    <span className="challenge-silhouette pointer-events-none absolute right-14 top-1/2 -translate-y-1/2" aria-hidden>
      {kind === "castle" ? (
        <svg viewBox="0 0 80 72" className="h-[4.5rem] w-[4.5rem]" fill={FILL}>
          <path d="M8 62V38l8-6 4 4 4-8 4 8 4-4 8 6v24H8z" opacity="0.55" />
          <rect x="34" y="46" width="12" height="16" rx="1" opacity="0.45" />
          <path d="M22 30l6-10 6 6 6-12 6 12 6-6 6 10v8H22v-8z" opacity="0.35" />
        </svg>
      ) : null}
      {kind === "hourglass" ? (
        <svg viewBox="0 0 64 80" className="h-[4.75rem] w-[3.75rem]" fill={FILL}>
          <path
            d="M18 8h28l-10 14 10 14v12l-10 14 10 14H18l10-14-10-14V22l10-14z"
            opacity="0.5"
          />
          <path d="M26 36h12l-6 8 6 8H26l6-8-6-8z" opacity="0.35" />
        </svg>
      ) : null}
      {kind === "boss" ? (
        <svg viewBox="0 0 72 72" className="h-[4.5rem] w-[4.5rem]" fill={FILL}>
          <path
            d="M12 48c4-14 12-22 24-22s20 8 24 22c-6 6-14 10-24 10S18 54 12 48z"
            opacity="0.5"
          />
          <circle cx="26" cy="34" r="5" opacity="0.55" />
          <circle cx="46" cy="34" r="5" opacity="0.55" />
          <path d="M28 44c4 4 12 4 16 0" stroke={FILL} strokeWidth="3" fill="none" opacity="0.4" />
          <path d="M18 22l6-8M54 22l-6-8M36 12v-6" stroke={FILL} strokeWidth="3" opacity="0.35" />
        </svg>
      ) : null}
      {kind === "friends" ? (
        <svg viewBox="0 0 80 72" className="h-[4.25rem] w-[5rem]" fill={FILL}>
          <circle cx="28" cy="26" r="10" opacity="0.5" />
          <circle cx="52" cy="26" r="10" opacity="0.5" />
          <path d="M12 58c2-12 10-18 16-18s10 4 12 4 8-4 16-4 14 6 16 18H12z" opacity="0.42" />
        </svg>
      ) : null}
      {kind === "mountains" ? (
        <svg viewBox="0 0 88 64" className="h-[4rem] w-[5.5rem]" fill={FILL}>
          <path d="M0 56L28 20l16 18 12-14 32 32H0z" opacity="0.48" />
          <path d="M8 56h72" stroke={FILL} strokeWidth="2" opacity="0.25" />
          <path d="M52 8l4 8-8 2 6 6-10-4-4 10-4-10-10 4 6-6-8-2 4-8z" opacity="0.3" />
        </svg>
      ) : null}
    </span>
  );
}
