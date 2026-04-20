import styled from "@emotion/styled";
import { emptyPulse, popIn } from "../css/animations";
import { Button } from "../../button";
import { css } from "@emotion/react";

export const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const SlotWrapper = styled.div<{ $filled: boolean; $index: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  border: 1px solid ${({ $filled }) =>
    $filled ? 'var(--accent)' : 'var(--border)'};
  background: ${({ $filled }) =>
    $filled ? 'var(--card-bg)' : 'transparent'};
  transition: border-color 0.2s ease, background 0.2s ease;
  animation: ${({ $filled }) => $filled ? css`${popIn}` : 'none'} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: ${({ $index }) => $index * 60}ms;

  ${({ $filled }) => $filled && css`
    animation-name: ${popIn};
    &:hover {
      border-color: var(--accent-destructive);
    }
  `}

  ${({ $filled }) => !$filled && css`
    border-style: dashed;
  `}
`;

export const SlotNumber = styled.span`
  position: absolute;
  top: 5px;
  left: 7px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  opacity: 0.75;
`;

export const SlotSprite = styled.img`
  width: 52px;
  height: 52px;
  image-rendering: pixelated;
  filter: drop-shadow(0 2px 6px rgba(var(--accent-rgb), 0.4));
`;

export const SlotName = styled.span`
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-top: 2px;
`;

export const RemoveButton = styled(Button)`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--accent);
  font-size: var(--text-lg);
  line-height: 1;
  cursor: pointer;
  border-radius: 2px;
  opacity: 1;
  transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease;

  &:hover {
    color: var(--accent-destructive);
    background: rgba(var(--accent-destructive-rgb), 0.1);
  }
`;

export const EmptyIcon = styled.div`
  font-size: 18px;
  animation: ${emptyPulse} 2.5s ease-in-out infinite;
  animation-delay: ${() => Math.random() * 1000}ms;
`;
