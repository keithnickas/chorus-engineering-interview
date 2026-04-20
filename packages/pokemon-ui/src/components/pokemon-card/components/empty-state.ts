import styled from "@emotion/styled";

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  border: 1px dashed var(--border);
  border-radius: 4px;
  opacity: 0.7;
`;

export const EmptyStateIcon = styled.span`
  font-size: 28px;
`;

export const EmptyStateText = styled.span`
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
  text-align: center;
`;
