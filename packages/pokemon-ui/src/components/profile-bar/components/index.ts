import styled from "@emotion/styled";
import { slideDown } from "../css/animations";

export const Bar = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  height: 70px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
`;
 
export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
`;
 
export const LogoBall = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  position: relative;
  box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.5);
 
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--accent);
    transform: translateY(-50%);
  }
 
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: var(--bg);
    border: 1.5px solid var(--accent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;
 
export const LogoText = styled.span`
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-primary);
`;
 
export const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--border);
  opacity: 0.5;
`;
 
export const ProfileLabel = styled.span`
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  white-space: nowrap;
`;
 
export const ProfileTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;
 
export const ProfileTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  font-family: var(--font-display);
  font-size: var(--text-med);
  font-weight: ${({ $active }) => $active ? '700' : '600'};
  letter-spacing: 0.06em;
  border-radius: 3px;
  border: 1px solid ${({ $active }) => $active ? 'var(--accent)' : 'transparent'};
  border-bottom: 2px solid ${({ $active }) => $active ? 'var(--accent)' : 'transparent'};
  background: ${({ $active }) => $active ? 'rgba(var(--accent-rgb), 0.12)' : 'transparent'};
  color: ${({ $active }) => $active ? 'var(--accent)' : 'var(--text-secondary)'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    color: var(--text-primary);
    background: var(--card-bg);
    border-color: var(--border);
    box-shadow: inset 0 -2px 0 var(--border);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`;
 
export const TabTeamSize = styled.span<{ $active: boolean }>`
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  padding: 1px 4px;
  border-radius: 2px;
  background: ${({ $active }) => $active ? 'rgba(var(--accent-rgb), 0.2)' : 'rgba(255,255,255,0.05)'};
  color: ${({ $active }) => $active ? 'var(--accent)' : 'var(--text-muted)'};
`;
 
export const DeleteTabBtn = styled.button`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  opacity: 0;
  transition: opacity 0.15s, color 0.15s;
  line-height: 1;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  ${ProfileTab}:hover & {
    opacity: 1;
  }

  &:hover {
    color: var(--accent-destructive);
    transform: scale(1.15);
  }

  &:focus-visible {
    opacity: 1;
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 2px;
  }
`;


 
export const AddProfileArea = styled.div`
  position: relative;
  margin-left: auto;
  flex-shrink: 0;
`;
 
export const AddButton = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-family: var(--font-mono);
  font-size: var(--text-med);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 3px;
  border: 1px solid ${({ $open }) => $open ? 'rgba(var(--accent-green-rgb), 0.6)' : 'var(--border)'};
  background: ${({ $open }) => $open ? 'rgba(var(--accent-green-rgb), 0.1)' : 'transparent'};
  color: ${({ $open }) => $open ? 'rgba(var(--accent-green-rgb), 0.8)' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--accent-green);
    color: var(--accent-green);
    background: rgba(var(--accent-green-rgb), 0.08);
  }
`;
 
export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  display: flex;
  gap: 6px;
  padding: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  animation: ${slideDown} 0.18s ease both;
  z-index: 100;
  min-width: 220px;
`;
 
export const NameInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: var(--text-med);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s;
 
  &::placeholder {
    color: var(--text-primary);
    opacity: 0.5;
  }
 
  &:focus {
    border-color: var(--accent-green);
  }
`;
 
export const ConfirmButton = styled.button`
  padding: 6px 12px;
  font-family: var(--font-mono);
  font-size: font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 3px;
  border: 1px solid var(--accent-green);
  background: rgba(var(--accent-green-rgb), 0.15);
  color: var(--accent-green);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
 
  &:hover {
    background: rgba(var(--accent-green-rgb), 0.25);
  }
 
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;