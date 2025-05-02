import { User } from './user.model';
import { Student } from './student.model';

export interface Parents {
  id?: number;
  user_id: number;
  admission_no?: string;

  user?: User;
  students?: Student[];
}
