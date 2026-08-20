type Props = {
  className?: string;
};

/** Dark circular play CTA with gold chevron — per card. */
export function ChallengeArrowButton({ className = "" }: Props) {
  return (
    <span
      className={`challenge-arrow-btn flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M9.5 7.5l5.5 4.5-5.5 4.5"
          stroke="#ffe27a"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
