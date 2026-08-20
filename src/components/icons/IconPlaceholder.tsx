import type { GameIconId } from "../../lib/gameIcons";
import { MISSING_ICON_ART } from "../../lib/gameIcons";

type Props = {
  id: GameIconId;
  className?: string;
};

/**
 * Temporary stand-in for a missing 3D PNG asset.
 * Uses CSS toy shapes — not emoji, not flat line icons.
 */
export function IconPlaceholder({ id, className = "" }: Props) {
  const meta = MISSING_ICON_ART[id];

  if (id === "gift") {
    return (
      <span
        className={`relative inline-flex items-center justify-center ${className}`}
        role="img"
        aria-label={meta?.label ?? id}
        title={`MISSING ASSET: ${meta?.label ?? id}`}
      >
        <span className="relative h-[78%] w-[78%]">
          <span className="absolute inset-x-[8%] bottom-0 top-[22%] rounded-[0.45rem] bg-gradient-to-b from-[#ff6b5a] to-[#d9362a] shadow-[inset_0_2px_0_rgba(255,255,255,0.45),0_3px_6px_rgba(80,20,10,0.28)]" />
          <span className="absolute left-1/2 top-[8%] h-[58%] w-[22%] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ffe27a] to-[#f6be32] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]" />
          <span className="absolute left-[18%] right-[18%] top-[34%] h-[18%] rounded-full bg-gradient-to-b from-[#ffe27a] to-[#f6be32] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]" />
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[0.65rem] bg-gradient-to-b from-[#fff7e2] to-[#ead7a8] ring-1 ring-[#c4a56a]/45 ${className}`}
      role="img"
      aria-label={meta?.label ?? id}
      title={`MISSING ASSET: ${meta?.label ?? id}`}
    >
      <span className="font-[family-name:var(--font-display)] text-[0.55em] font-bold uppercase text-[#6b5340]">
        {id.slice(0, 2)}
      </span>
    </span>
  );
}
