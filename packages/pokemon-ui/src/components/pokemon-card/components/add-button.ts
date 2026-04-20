import styled from "@emotion/styled";
import { Button } from "../../button";

export const AddButton = styled(Button)<{ $isOnTeam: boolean; $disabled: boolean }>`
  margin-top: 4px;
  padding: 5px 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 2px;
  border: 1px solid;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.15s ease;
  z-index: 3;
 
  ${({ $isOnTeam, $disabled }) => {
    if ($isOnTeam) {
      return `
        background: rgba(var(--accent-rgb), 0.15);
        border-color: var(--accent);
        color: var(--accent);
      `;
    }
    if ($disabled) {
      return `
        background: transparent;
        border-color: var(--border);
        color: var(--text-muted);
        opacity: 0.4;
      `;
    }
    return `
      background: transparent;
      border-color: var(--border);
      color: var(--text-green);
      &:hover {
        background: rgba(var(--accent-green-rgb), 0.1);
        border-color: var(--accent-green);
        color: var(--accent-green);
      }
      &:active {
        transform: scale(0.96);
      }
    `;
  }}
`;
