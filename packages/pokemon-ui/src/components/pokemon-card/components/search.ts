import styled from "@emotion/styled";

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 320px;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-lg);
  color: var(--text-secondary);
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 7px 12px 7px 30px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: var(--text-med);
  letter-spacing: 0.06em;
  color: var(--text-primary);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.5;
  }

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.12);
  }
`;

export const ResultCount = styled.span`
  font-family: var(--font-mono);
  font-size: var(--text-med);
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  white-space: nowrap;
  margin-left: auto;
`;

export const EmptySearch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 64px 16px;
  opacity: 0.7;
`;

export const EmptySearchIcon = styled.span`
  font-size: 32px;
`;

export const EmptySearchText = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
`;
