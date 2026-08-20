import type { SubjectId } from "../../lib/curriculum";
import { subjectHeroSrc } from "../../lib/gameIcons";

type Props = {
  subject: SubjectId;
  className?: string;
};

/** Subject mascot from world hero PNG — never emoji. */
export function SubjectMascotIcon({ subject, className = "h-8 w-8 object-contain" }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={subjectHeroSrc(subject)}
      alt=""
      draggable={false}
      className={`pointer-events-none select-none drop-shadow-[0_2px_3px_rgba(40,25,10,0.22)] ${className}`}
    />
  );
}
