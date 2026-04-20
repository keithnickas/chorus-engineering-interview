import { css } from '@emotion/react';

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    /* Palette */
    --bg: #0d0f14;
    --surface: #111318;
    --card-bg: #161920;
    --border: #252830;

    /* Accent — Pokédex red */
    --accent: #e83a3a;
    --accent-rgb: 232, 58, 58;

    /* Accent — destructive/hover red (softer than primary accent) */
    --accent-destructive: #e05252;
    --accent-destructive-rgb: 224, 82, 82;

    /* Accent - Add Button Green */
    --accent-green: #4caf50;
    --accent-green-rgb: 76, 175, 80;

    /* Typography */
    --text-primary: #e8eaf0;
    --text-secondary: #9498a8;
    --text-green: #4caf50;
    --text-muted: #848a9c;
    --text-error: #e83a3a;
    --text-xsmall: 10px;
    --text-sm: 12px;
    --text-med: 16px;
    --text-lg: 18px;
    --text-xl: 20px;
    --text-2xl: 24px;
    --text-3xl: 28px;

    /* Fonts */
    --font-display: 'Rajdhani', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }

  body {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-mono);
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  /* Noise texture overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.6;
  }

  .hidden {
    opacity: 0;
    height: 0;
    width: 0;
  }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
