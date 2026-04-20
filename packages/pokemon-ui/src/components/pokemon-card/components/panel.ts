import styled from '@emotion/styled';
import { fadeIn } from '../css/animations';

export const PanelAside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: minmax(330px, 100%);
  flex-shrink: 0;
  animation: ${fadeIn} 0.4s ease both;
  @media (max-width: 360px) {
    width: 100%;
  }

`;

export const PanelSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-width: 0;
  animation: ${fadeIn} 0.4s ease both;
  height: 100%;
`;

const PanelHeaderBase = styled.div``;

export const PanelSectionHeader = styled(PanelHeaderBase)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const PanelHeader = styled(PanelHeaderBase)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PanelTitleBase = styled.h2``;

export const PanelTitle = styled(PanelTitleBase)`
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0;
`;

export const ProfileNameBase = styled.span``;

export const ProfileName = styled(ProfileNameBase)`
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
