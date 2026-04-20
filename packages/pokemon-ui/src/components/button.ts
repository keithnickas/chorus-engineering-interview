import styled from "@emotion/styled";

export const Button = styled.button<{ $disabled?: boolean }>`
  margin-top: 4px;
  padding: 5px 14px;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 2px;
  border: 1px solid;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.15s ease;
  z-index: 3;
  `;
