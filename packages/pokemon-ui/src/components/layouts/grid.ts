import styled from "@emotion/styled";

export const Grid = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  align-content: flex-start;
  /* grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); */
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
  padding-bottom: 8px;
  height: 100%;
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 2px;
  }
`;