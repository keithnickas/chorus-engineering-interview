import styled from "@emotion/styled";
import { fadeSlideIn, scanline } from "../css/animations";

export const Card = styled.div<{ $index: number; $isOnTeam: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px 12px;
  background: var(--card-bg);
  border: 1px solid ${({ $isOnTeam }) =>
    $isOnTeam ? 'var(--accent)' : 'var(--border)'};
  border-radius: 4px;
  cursor: default;
  animation: ${fadeSlideIn} 0.35s ease both;
  animation-delay: ${({ $index }) => Math.min($index * 30, 400)}ms;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  flex: 0 0 max(220px, 7dvw);
  height: auto;
 
  /* CRT scanline overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(255, 255, 255, 0.015) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 1;
  }
 
  /* Moving scan beam on hover */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(var(--accent-rgb), 0.06),
      transparent
    );
    transform: translateY(-100%);
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.2s;
  }
 
  &:hover {
    border-color: var(--accent-green);
    box-shadow: 0 0 16px rgba(var(--accent-green-rgb), 0.15),
      inset 0 0 20px rgba(var(--accent-green-rgb), 0.04);
    transform: translateY(-2px);
 
    &::after {
      opacity: 1;
      animation: ${scanline} 1.4s linear infinite;
    }
  }
 
  ${({ $isOnTeam }) =>
    $isOnTeam && 
    `
    &:hover {
      box-shadow: 0 0 12px rgba(var(--accent-rgb), 0.2), inset 0 0 16px rgba(var(--accent-rgb), 0.05);
      border-color: rgba(var(--accent-rgb));
    }
  `}
`;
