import styled from "@emotion/styled";

export const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;
 
export const MainContent = styled.main`
  display: flex;
  gap: 0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;
 
export const PokedexSection = styled.section`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 20px 24px;
  overflow: hidden;
`;

export const TeamSection = styled.section`
  width: min(330px, 100%);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 20px 12px;
  border-left: 1px solid var(--border);
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

 
export const CenteredState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
`;
 

 
export const StateLabel = styled.span`
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
`;
 
