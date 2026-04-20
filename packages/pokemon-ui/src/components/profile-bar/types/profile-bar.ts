import { UUID } from 'node:crypto';
import { Profile } from '../../../api';

export interface ProfileBarPropTypes {
  profiles: Profile[];
  activeProfile: Profile | null;
  onSelect: (profileId: UUID) => void;
  onAdd: (name: string) => Promise<void>;
  onDelete: (profileId: UUID) => Promise<void>;
}
