"use client";

import type { OpponentStatus } from "../../lib/pvp/types";
import type { PvpCopy } from "../../lib/i18n/pvp";

type Props = {
  name: string;
  status: OpponentStatus;
  combo: number;
  lastDamage: number;
  copy: PvpCopy;
};

export function OpponentStatusMessage({ name, status, combo, lastDamage, copy }: Props) {
  let text = copy.thinking(name);
  if (status === "answered") text = copy.answered(name);
  else if (status === "attacking") text = copy.foeCounter(name);
  else if (status === "wrong") text = copy.foeWrong(name);
  else if (status === "correct") {
    text = combo >= 2 ? copy.foeCombo(name, combo) : lastDamage > 0 ? copy.foePower(name, lastDamage) : copy.foeCorrect(name);
  }

  return (
    <p className="pointer-events-none absolute bottom-0.5 left-1/2 z-20 max-w-[78%] -translate-x-1/2 truncate rounded-full bg-black/35 px-2 py-0.5 text-center text-[9px] font-extrabold text-white/95">
      {text}
    </p>
  );
}
