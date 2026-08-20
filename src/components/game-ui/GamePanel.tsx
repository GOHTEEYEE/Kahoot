import type { ReactNode } from "react";

import { gameUiTokens } from "../../lib/game-ui-tokens";

type Props = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Shared container for game-like panels.
 * Visual gradients/shapes are still driven by existing CSS classes when needed,
 * but radii/shadows come from a single token source.
 */
export function GamePanel({ children, className = "", style }: Props) {
  return (
    <div
      className={className}
      style={{
        borderRadius: gameUiTokens.radii.lg,
        boxShadow: gameUiTokens.shadows.panelShadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

