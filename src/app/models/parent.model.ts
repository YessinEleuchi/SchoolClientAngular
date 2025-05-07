import { User } from './user.model';
import { Student } from './student.model';

export interface Parent {
  id?: number;
  user_id: number;
  admission_no?: string;

  user?: User;
  students?: Student[];
}
