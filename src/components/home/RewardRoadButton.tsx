"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GameIcon } from "./GameIcon";

type Props = {
  lockedCount?: number;
};

export function RewardRoadButton({ lockedCount = 0 }: Props) {
  return (
    <Link href="/rewards" className="block w-full">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-between rounded-[1.3rem] bg-gradient-to-r from-[#14352f] to-[#0f8f6f] px-4 py-3 text-white shadow-[0_12px_28px_rgba(20,53,47,0.2)]"
      >
        <div>
          <p className="text-[11px] font-extrabold tracking-wide text-white/70 uppercase">
            Trophy Road
          </p>
          <p className="font-[family-name:var(--font-display)] text-base font-bold">
            打开奖杯之路
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lockedCount > 0 ? (
            <span className="rounded-full bg-[#ffc938] px-2 py-0.5 text-[11px] font-extrabold text-[#14352f]">
              {lockedCount} new
            </span>
          ) : null}
          <GameIcon name="map" size="worldMap" />
        </div>
      </motion.div>
    </Link>
  );
}
