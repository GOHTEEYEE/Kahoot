/** Layout measured from design/target.png (1024×1536), scaled to 390px canvas width. */
export const homeLayoutTokens = {
  canvasWidth: 390,
  canvasHeight: 844,
  padX: 10,
  worldTitleWidth: 340,
  worldTitleMinHeight: 68,
  islandSize: 360,
  islandScale: 1.14,
  islandAreaMinHeight: 360,
  sideButtonSize: 48,
  sideButtonGap: 4,
  trophyPanelHeight: 70,
  ctaHeight: 56,
  navHeight: 54,
} as const;

export const gameUiTokens = {
  colors: {
    gameCream: "#FFF8E7",
    gameBrown: "#5A3A20",
    gameDark: "#302719",
    gameGold: "#F5B62B",
    gameYellow: "#FFD75A",
    gameGreen: "#65C84A",
    gamePurple: "#7044D9",
    gameSky: "#8DD8F4",
  },
  radii: {
    sm: "14px",
    md: "20px",
    lg: "28px",
    pill: "999px",
  },
  shadows: {
    gameShadow:
      "0 3px 0 rgba(60, 40, 15, 0.18), 0 6px 14px rgba(40, 25, 10, 0.14)",
    gameShadowPress:
      "0 1px 0 rgba(60, 40, 15, 0.22), 0 3px 8px rgba(40, 25, 10, 0.12)",
    panelShadow:
      "0 8px 20px rgba(48, 39, 25, 0.22), inset 0 2px 0 rgba(255, 236, 190, 0.88)",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
  },
  fontSizes: {
    navLabel: "9px",
    hudSmall: "10px",
    hudMeta: "8px",
    titleCompact: "14px",
  },
  buttonHeights: {
    homeCta: "var(--home-cta-height)",
    hudRound: "36px",
    sideWidgetIcon: "var(--quick-action-size)",
  },
  iconSizes: {
    nav: "h-9 w-9",
    utility: "h-5 w-5",
    sideHud: "h-8 w-8",
    worldMap: "h-11 w-11",
    challenge: "h-14 w-14",
    progress: "h-8 w-8",
    quickAction:
      "h-[clamp(2.35rem,9.5vw,3.1rem)] w-[clamp(2.35rem,9.5vw,3.1rem)]",
  },
  animation: {
    challengeHoverScale: 1.04,
    islandIdleFloatMs: 6500,
    homeButtonSpringMs: 240,
  },
} as const;

