import {
  GAME_ICON_FILES,
  GAME_ICON_SIZES,
  type GameIconId,
  type GameIconSize,
  gameIconSrc,
  isMajorGameIcon,
} from "../../lib/gameIcons";
import { IconPlaceholder } from "../icons/IconPlaceholder";

type Props = {
  name: GameIconId | string;
  size?: GameIconSize;
  className?: string;
};

function isGameIconId(name: string): name is GameIconId {
  return name in GAME_ICON_FILES;
}

/** 3D toy HUD icon from /public/icons with consistent game presentation. */
export function GameIcon({ name, size, className = "" }: Props) {
  const id = (isGameIconId(name) ? name : (name as GameIconId)) as GameIconId;
  const src = gameIconSrc(id);
  const sizeClass = size ? GAME_ICON_SIZES[size] : "";
  const tierClass = isMajorGameIcon(id) ? "game-icon game-icon--major" : "game-icon game-icon--utility";

  if (!src) {
    return (
      <IconPlaceholder
        id={id}
        className={`${tierClass} ${sizeClass} ${className}`.trim()}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={`${tierClass} pointer-events-none select-none object-contain ${sizeClass} ${className}`.trim()}
    />
  );
}
