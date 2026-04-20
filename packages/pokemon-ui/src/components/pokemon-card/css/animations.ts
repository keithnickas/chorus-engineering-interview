import { css, keyframes } from '@emotion/react';

export const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const spriteFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

export const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.7); }
  70% { transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
`;

export const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0); }
  50% { box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.15); }
`;

export const emptyPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

export const spinnerSpin = keyframes`
  to { transform: rotate(360deg); }
`;
