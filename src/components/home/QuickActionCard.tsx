"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GameIcon } from "./GameIcon";
import type { GameIconId } from "../../lib/gameIcons";

type BaseProps = {
  title: string;
  meta?: string;
  icon: GameIconId;
  badge?: boolean;
  sparkle?: boolean;
  reduced?: boolean;
  delay?: number;
  className?: string;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
};

type LinkProps = BaseProps & {
  href: string;
  onClick?: () => void;
};

export type QuickActionCardProps = ButtonProps | LinkProps;

function ActionBody({
  title,
  meta,
  icon,
  badge,
  sparkle,
}: {
  title: string;
  meta?: string;
  icon: GameIconId;
  badge?: boolean;
  sparkle?: boolean;
}) {
  return (
    <>
      <span className="quick-action-btn relative flex items-center justify-center">
        <GameIcon name={icon} size="quickAction" />
        {badge ? <span className="quick-action-btn__badge" aria-hidden /> : null}
        {sparkle ? <span className="quick-action-btn__sparkle chest-sparkle" aria-hidden /> : null}
      </span>
      <span className="quick-action-label max-w-[var(--quick-action-size)] truncate text-center">
        {title}
      </span>
      {meta ? <span className="quick-action-meta">{meta}</span> : null}
    </>
  );
}

function MotionWrap({
  children,
  title,
  reduced,
  delay,
  onClick,
}: {
  children: ReactNode;
  title: string;
  reduced?: boolean;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={title}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      animate={!reduced ? { y: [0, 0, -2, 0] } : undefined}
      transition={{
        duration: 0.7,
        repeat: Infinity,
        repeatDelay: 6 + (delay ?? 0),
        times: [0, 0.72, 0.86, 1],
        ease: "easeInOut",
        delay,
      }}
      className="quick-action-item"
    >
      {children}
    </motion.button>
  );
}

/** Compact vertical quick-action control beside the island. */
export function QuickActionCard(props: QuickActionCardProps) {
  const { title, meta, icon, badge, sparkle, reduced, delay = 0, className = "" } = props;

  const body = (
    <ActionBody title={title} meta={meta} icon={icon} badge={badge} sparkle={sparkle} />
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        onClick={props.onClick}
        className={`quick-action-item ${className}`.trim()}
        aria-label={title}
      >
        {body}
      </Link>
    );
  }

  return (
    <MotionWrap title={title} reduced={reduced} delay={delay} onClick={props.onClick}>
      {body}
    </MotionWrap>
  );
}
