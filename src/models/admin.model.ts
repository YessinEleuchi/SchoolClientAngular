import { User } from './user.model';

export interface Admin {
  id?: number;
  user_id: number;
  admission_no?: string;

  // Relation
  user?: User;
}
