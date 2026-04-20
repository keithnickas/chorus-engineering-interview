import styled from "@emotion/styled";

export const SkipLink = styled.a`
  position: absolute;
  top: -100%;
  left: 0;
  padding: 8px 16px;
  background: var(--surface);
  color: var(--text-primary);
  border: 2px solid var(--accent);
  border-radius: 0 0 4px 0;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: 0.08em;
  text-decoration: none;
  z-index: 10000;

  &:focus {
    top: 0;
  }
`;
