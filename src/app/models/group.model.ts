import { Level } from './level.model';
import { Student } from './student.model';

export interface Group {
  id: number;
  name: string;
  level_id: number;
  created_at: string;
  updated_at: string;

  level?: Level;
  students?: Student[];
}
