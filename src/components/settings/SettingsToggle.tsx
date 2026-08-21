"use client";

type Props = {
  enabled: boolean;
  onChange: (next: boolean) => void;
  labelOn: string;
  labelOff: string;
  ariaLabel: string;
};

export function SettingsToggle({ enabled, onChange, labelOn, labelOff, ariaLabel }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={() => onChange(!enabled)}
      className={`relative flex h-8 w-[3.6rem] shrink-0 items-center rounded-full px-1 transition ${
        enabled
          ? "bg-[#65c84a] shadow-[0_2px_0_#2a9828]"
          : "bg-[#d9ceb0] shadow-[0_2px_0_#b8a878]"
      }`}
    >
      <span
        className={`absolute text-[8px] font-black tracking-wide text-white ${
          enabled ? "left-1.5" : "right-1.5"
        }`}
      >
        {enabled ? labelOn : labelOff}
      </span>
      <span
        className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-[1.55rem]" : "translate-x-0"
        }`}
      />
    </button>
  );
}
