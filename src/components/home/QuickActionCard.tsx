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
        {meta ? <span className="quick-action-meta">{meta}</span> : null}
      </span>
      <span className="quick-action-label max-w-[calc(var(--quick-action-size)+12px)] text-center leading-tight">
        {title}
      </span>
    </>
  );
}

function MotionWrap({
  children,
  title,
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
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
