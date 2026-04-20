import styled from "@emotion/styled";

export const ErrorText = styled.span`
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent-destructive);
  letter-spacing: 0.06em;
  max-width: 320px;
  text-align: center;
  line-height: 1.6;
`;
 
export const ErrorDismiss = styled.button`
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 5px 14px;
  border: 1px solid var(--border);
  border-radius: 3px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
 
  &:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
`;

export const ErrorToast = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  background: var(--surface);
  border: 1px solid var(--accent-destructive);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--accent-destructive);
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
`;
