import styled from "@emotion/styled";
import { spinnerSpin } from "../pokemon-card/css/animations";

export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  animation: ${spinnerSpin} 0.8s linear infinite;
`;