"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const GlbIslandCanvas = dynamic(
  () => import("../world/GlbIslandCanvas").then((mod) => mod.GlbIslandCanvas),
  { ssr: false },
);

type Props = {
  hit?: boolean;
};

/** 3D robot hero shown during Boss Challenge. */
export function BossHero({ hit = false }: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className="relative mx-auto h-[9.6rem] w-full max-w-[16rem] sm:h-[10.4rem]"
      animate={
        hit && !reduced
          ? { x: [0, -10, 9, -6, 5, 0], rotate: [0, -5, 4, -2, 0], scale: [1, 1.06, 0.97, 1] }
          : { x: 0, rotate: 0, scale: 1 }
      }
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <GlbIslandCanvas reduced={reduced} />
    </motion.div>
  );
}
