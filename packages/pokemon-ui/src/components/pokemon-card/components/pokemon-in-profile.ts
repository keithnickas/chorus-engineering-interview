import styled from "@emotion/styled";

export const PokemonInProfile = styled.div<{ $filled: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $filled }) => $filled ? 'var(--accent)' : 'var(--border)'};
  transition: background 0.3s ease;
  box-shadow: ${({ $filled }) =>
    $filled ? '0 0 6px rgba(var(--accent-rgb), 0.6)' : 'none'};
`;
