import styled from "@emotion/styled";
import { spriteFloat } from "../css/animations";
 
export const SpriteWrapper = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;
 
export const Sprite = styled.img<{ $isOnTeam: boolean }>`
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  filter: ${({ $isOnTeam }) =>
    $isOnTeam
      ? 'drop-shadow(0 0 8px rgba(var(--accent-rgb), 0.7)) brightness(1.1)'
      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'};
  animation: ${spriteFloat} 3s ease-in-out infinite;
  transition: filter 0.3s ease;
`;
